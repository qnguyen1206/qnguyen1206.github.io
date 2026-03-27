// Stats, Charts, and Value Calculations

import { state, getCardTotalQty } from './state.js';
import { getCardVariants, getPreferredPriceAmount } from './config.js';
import { saveValueHistoryToDB } from './db.js';

// Update stats
export function updateStats() {
    const collectionIds = Object.keys(state.collection).filter(id => getCardTotalQty(id) > 0);
    const totalCards = collectionIds.reduce((sum, id) => sum + getCardTotalQty(id), 0);
    const uniqueCards = collectionIds.length;
    
    document.getElementById('total-cards').textContent = totalCards;
    document.getElementById('unique-cards').textContent = uniqueCards;
    
    // Count unique sets
    const setsInCollection = new Set();
    collectionIds.forEach(id => {
        const setId = id.split('-')[0];
        setsInCollection.add(setId);
    });
    document.getElementById('sets-collected').textContent = setsInCollection.size;
    
    // Update most valuable card
    if (totalCards > 0) {
        updateMostValuableCard(collectionIds);
    } else {
        document.getElementById('most-valuable-card').textContent = '-';
    }
    
    // Update collection value
    updateCollectionValue(collectionIds);
    
    // Update charts if in stats view
    if (state.currentView === 'profile') {
        if (collectionIds.length > 0) {
            updateCharts(collectionIds);
        } else {
            // Clear charts when collection is empty
            renderChart('type-chart', {}, 'type');
            renderChart('rarity-chart', {}, 'rarity');
        }
    }
}

// Calculate and update collection value
export function updateCollectionValue(cardIds) {
    let totalValue = 0;
    
    cardIds.forEach(cardId => {
        // Try to find card in allCards (cached) or cards (current page)
        let card = state.allCards.find(c => c.id === cardId);
        if (!card) {
            card = state.cards.find(c => c.id === cardId);
        }
        
        if (!card) return;
        
        const cardData = state.collection[cardId];
        if (!cardData) return;
        
        const variantPriceMap = new Map(
            getCardVariants(card).map(variant => [variant.id, getPreferredPriceAmount(variant.price)])
        );
        const getVariantPrice = (variantId) => variantPriceMap.get(variantId) || 0;
        
        // Handle different collection data formats
        if (typeof cardData === 'number') {
            // Legacy format: just a number, assume 'normal' variant
            const price = getVariantPrice('normal');
            totalValue += price * cardData;
        } else if (typeof cardData === 'object') {
            // New format: variant -> qty
            Object.entries(cardData).forEach(([variantId, qty]) => {
                if (qty <= 0) return;
                const price = getVariantPrice(variantId);
                totalValue += price * qty;
            });
        }
    });
    
    document.getElementById('collection-value').textContent = `$${totalValue.toFixed(2)}`;
    
    // Save value to history (once per day max)
    saveValueHistory(totalValue);
    
    // Render value history chart if on profile view
    if (state.currentView === 'profile') {
        renderValueHistoryChart();
    }
}

// Update most valuable card
export async function updateMostValuableCard(cardIds) {
    // cardIds are the base card IDs (e.g., "sv4-1")
    const collectionCards = state.allCards.filter(card => cardIds.includes(card.id));
    
    let maxValue = 0;
    let mostValuableCard = null;
    let mostValuableVariant = null;
    
    collectionCards.forEach(card => {
        const cardData = state.collection[card.id];
        if (!cardData || typeof cardData !== 'object') return;
        
        const variants = getCardVariants(card);
        variants.forEach(variant => {
            const qty = cardData[variant.id] || 0;
            if (qty > 0 && variant.price) {
                const price = getPreferredPriceAmount(variant.price);
                if (price > maxValue) {
                    maxValue = price;
                    mostValuableCard = card;
                    mostValuableVariant = variant;
                }
            }
        });
    });
    
    const element = document.getElementById('most-valuable-card');
    if (mostValuableCard && maxValue > 0) {
        element.textContent = `$${maxValue.toFixed(2)}`;
        element.title = `${mostValuableCard.name} (${mostValuableVariant.name})`;
    } else {
        element.textContent = '-';
        element.title = '';
    }
}

// Update charts
export async function updateCharts(cardIds) {
    if (cardIds.length === 0) return;
    
    // Use cached cards instead of fetching
    const allCards = state.allCards.filter(card => cardIds.includes(card.id));
    
    // Count by type
    const typeCounts = {};
    const rarityCounts = {};
    
    allCards.forEach(card => {
        const qty = getCardTotalQty(card.id);
        
        if (card.types) {
            card.types.forEach(type => {
                typeCounts[type] = (typeCounts[type] || 0) + qty;
            });
        }
        
        if (card.rarity) {
            rarityCounts[card.rarity] = (rarityCounts[card.rarity] || 0) + qty;
        }
    });
    
    renderChart('type-chart', typeCounts, 'type');
    renderChart('rarity-chart', rarityCounts, 'rarity');
}

// Render a bar chart
export function renderChart(containerId, data, type) {
    const container = document.getElementById(containerId);
    const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
    const maxValue = Math.max(...entries.map(e => e[1]));
    
    if (entries.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted);">No data yet</p>';
        return;
    }
    
    const typeColors = {
        'Colorless': '#A8A878',
        'Darkness': '#705848',
        'Dragon': '#7038F8',
        'Fairy': '#EE99AC',
        'Fighting': '#C03028',
        'Fire': '#F08030',
        'Grass': '#78C850',
        'Lightning': '#F8D030',
        'Metal': '#B8B8D0',
        'Psychic': '#F85888',
        'Water': '#6890F0'
    };
    
    container.innerHTML = entries.slice(0, 10).map(([label, value]) => {
        const percentage = (value / maxValue) * 100;
        const color = type === 'type' ? (typeColors[label] || 'var(--primary)') : 'var(--primary)';
        
        return `
            <div class="bar-item">
                <span class="bar-label">${label}</span>
                <div class="bar-track">
                    <div class="bar-fill" style="width: ${percentage}%; background: ${color};">
                        ${value}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Save value to history (max once per day, updates today's entry if exists)
export function saveValueHistory(value) {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const history = state.valueHistory;
    
    // Check if we already have an entry for today
    const todayIndex = history.findIndex(entry => entry.date === today);
    
    if (todayIndex !== -1) {
        // Update today's value
        history[todayIndex].value = value;
    } else {
        // Add new entry for today
        history.push({ date: today, value: value });
    }
    
    // No limit - IndexedDB can store years of data
    state.valueHistory = history;
    saveValueHistoryToDB();
}

// Render value history line chart
export function renderValueHistoryChart() {
    const container = document.getElementById('value-history-chart');
    const history = state.valueHistory;
    
    if (history.length === 0) {
        container.innerHTML = '<p style="color: var(--text-muted);">No value history yet. Add cards to start tracking!</p>';
        return;
    }
    
    // Get last 30 days of data (or all if less)
    const recentHistory = history.slice(-30);
    const dataMax = Math.max(...recentHistory.map(h => h.value));
    const dataMin = Math.min(...recentHistory.map(h => h.value));
    
    // If all values are the same (including all zeros), show a flat line with appropriate scale
    const maxValue = dataMax === dataMin ? dataMax + 1 : dataMax;
    const minValue = dataMax === dataMin ? Math.max(0, dataMin - 1) : dataMin;
    const range = maxValue - minValue || 1;
    
    // Create SVG points for line
    const points = recentHistory.map((entry, index) => {
        const x = (index / Math.max(recentHistory.length - 1, 1)) * 100;
        const y = 100 - ((entry.value - minValue) / range) * 100;
        return { x, y, date: entry.date, value: entry.value };
    });
    
    // Create SVG path
    const linePath = points.map((p, i) => 
        `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
    ).join(' ');
    
    // Create area path (for gradient fill)
    const areaPath = linePath + ` L ${points[points.length - 1].x} 100 L 0 100 Z`;
    
    // Format date for display
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };
    
    // Calculate value change
    const firstValue = recentHistory[0].value;
    const lastValue = recentHistory[recentHistory.length - 1].value;
    const change = lastValue - firstValue;
    const changePercent = firstValue > 0 ? ((change / firstValue) * 100).toFixed(1) : 0;
    const changeClass = change >= 0 ? 'positive' : 'negative';
    const changeIcon = change >= 0 ? '↑' : '↓';
    
    container.innerHTML = `
        <div class="value-change ${changeClass}">
            <span>${changeIcon} $${Math.abs(change).toFixed(2)} (${Math.abs(changePercent)}%)</span>
            <span class="period">Last ${recentHistory.length} day${recentHistory.length > 1 ? 's' : ''}</span>
        </div>
        <div class="line-chart">
            <div class="chart-y-labels">
                <span>$${maxValue.toFixed(2)}</span>
                <span>$${minValue.toFixed(2)}</span>
            </div>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="valueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color: var(--primary); stop-opacity: 0.3"/>
                        <stop offset="100%" style="stop-color: var(--primary); stop-opacity: 0"/>
                    </linearGradient>
                </defs>
                <path class="chart-area" d="${areaPath}" fill="url(#valueGradient)"/>
                <path class="chart-line" d="${linePath}" fill="none" stroke="var(--primary)" stroke-width="2" vector-effect="non-scaling-stroke"/>
                ${points.map(p => `
                    <circle class="chart-point" cx="${p.x}" cy="${p.y}" r="3" fill="var(--primary)" vector-effect="non-scaling-stroke">
                        <title>${formatDate(p.date)}: $${p.value.toFixed(2)}</title>
                    </circle>
                `).join('')}
            </svg>
        </div>
        <div class="chart-labels">
            <span>${formatDate(recentHistory[0].date)}</span>
            <span>${formatDate(recentHistory[recentHistory.length - 1].date)}</span>
        </div>
    `;
}
