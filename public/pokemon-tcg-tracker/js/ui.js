// UI Rendering Functions

import { CARDS_PER_PAGE, getCardVariants, renderVariantLegend } from './config.js';
import { state, elements, getCardTotalQty } from './state.js';
import { setupVariantCheckboxes, syncCardUI } from './collection.js';
import { updateStats, updateCharts } from './stats.js';
import { saveCollectionToDB } from './db.js';

// Apply filters and render (all done client-side now)
export function applyFiltersAndRender() {
    let filtered = [...state.allCards];
    
    // Apply filters
    if (state.filters.set) {
        filtered = filtered.filter(c => c.set.id === state.filters.set);
    }
    if (state.filters.type) {
        filtered = filtered.filter(c => c.types && c.types.includes(state.filters.type));
    }
    if (state.filters.rarity) {
        filtered = filtered.filter(c => c.rarity === state.filters.rarity);
    }
    if (state.filters.search) {
        const search = state.filters.search.toLowerCase().trim();
        filtered = filtered.filter(c => {
            const nameMatch = c.name.toLowerCase().includes(search);
            // Card number without leading zeros (e.g., "81/172")
            const cardNumber = `${c.number}/${c.set.printedTotal || c.set.total}`;
            // Card number with leading zeros (e.g., "081/172")
            const paddedNumber = `${c.number.padStart(3, '0')}/${c.set.printedTotal || c.set.total}`;
            // Check if search contains a number pattern
            const numberMatch = cardNumber.includes(search) || paddedNumber.includes(search);
            // Also try removing leading zeros from search (user searches "081", we also check "81")
            const searchNoLeadingZeros = search.replace(/\b0+(\d+)/g, '$1');
            const numberMatchNormalized = cardNumber.includes(searchNoLeadingZeros);
            // Match "name number" format like "oddish 081/172" or "oddish 81/172"
            const fullMatch = `${c.name} ${cardNumber}`.toLowerCase().includes(search) ||
                              `${c.name} ${paddedNumber}`.toLowerCase().includes(search) ||
                              `${c.name} ${cardNumber}`.toLowerCase().includes(searchNoLeadingZeros);
            return nameMatch || numberMatch || numberMatchNormalized || fullMatch;
        });
    }
    
    // Sort by release date (newest first) then by number
    filtered.sort((a, b) => {
        const dateA = new Date(a.set.releaseDate || '1999-01-01');
        const dateB = new Date(b.set.releaseDate || '1999-01-01');
        if (dateB - dateA !== 0) return dateB - dateA;
        return parseInt(a.number) - parseInt(b.number);
    });
    
    state.totalCards = filtered.length;
    state.totalPages = Math.ceil(filtered.length / CARDS_PER_PAGE);
    
    // Get current page of cards
    const startIndex = (state.currentPage - 1) * CARDS_PER_PAGE;
    state.cards = filtered.slice(startIndex, startIndex + CARDS_PER_PAGE);
    
    renderCards();
    renderPagination();
    updateStats(); // Update stats after cards are loaded
}

// Render cards grid
export function renderCards() {
    if (state.cards.length === 0) {
        elements.browseGrid.innerHTML = '<p class="empty-state">No cards found. Try adjusting your filters.</p>';
        elements.browseCount.textContent = '0 cards';
        return;
    }
    
    elements.browseCount.textContent = `${state.totalCards.toLocaleString()} cards`;
    
    // Add variant legend if not already present
    let legendContainer = document.querySelector('.variant-legend-container');
    if (!legendContainer) {
        legendContainer = document.createElement('div');
        legendContainer.className = 'variant-legend-container';
        legendContainer.innerHTML = renderVariantLegend();
        elements.browseGrid.parentElement.insertBefore(legendContainer, elements.browseGrid);
    }
    
    elements.browseGrid.innerHTML = state.cards.map(card => createCardHTML(card)).join('');
    
    // Add click handlers for card (open modal)
    elements.browseGrid.querySelectorAll('.card-item').forEach(cardEl => {
        cardEl.addEventListener('click', () => openCardModal(cardEl.dataset.id));
    });
    
    // Add click handlers for variant checkboxes
    setupVariantCheckboxes(elements.browseGrid);
}

// Render collection
export function renderCollection() {
    const collectionIds = Object.keys(state.collection).filter(id => getCardTotalQty(id) > 0);
    
    // Start with all cards or just collection based on filter
    let displayCards = [];
    
    if (state.filters.owned === 'all') {
        // Show all cards (owned + not owned)
        displayCards = [...state.allCards];
    } else if (state.filters.owned === 'not-owned') {
        // Show only cards NOT in collection
        displayCards = state.allCards.filter(card => !collectionIds.includes(card.id));
    } else if (state.filters.owned === 'duplicates') {
        // Show only cards with qty > 1
        displayCards = state.allCards.filter(card => getCardTotalQty(card.id) > 1);
    } else {
        // 'owned' - Show only owned cards
        displayCards = state.allCards.filter(card => collectionIds.includes(card.id));
    }
    
    // Apply other filters
    if (state.filters.set) {
        displayCards = displayCards.filter(c => c.set.id === state.filters.set);
    }
    if (state.filters.type) {
        displayCards = displayCards.filter(c => c.types && c.types.includes(state.filters.type));
    }
    if (state.filters.rarity) {
        displayCards = displayCards.filter(c => c.rarity === state.filters.rarity);
    }
    if (state.filters.search) {
        const search = state.filters.search.toLowerCase().trim();
        displayCards = displayCards.filter(c => {
            const nameMatch = c.name.toLowerCase().includes(search);
            // Card number without leading zeros (e.g., "81/172")
            const cardNumber = `${c.number}/${c.set.printedTotal || c.set.total}`;
            // Card number with leading zeros (e.g., "081/172")
            const paddedNumber = `${c.number.padStart(3, '0')}/${c.set.printedTotal || c.set.total}`;
            // Check if search contains a number pattern
            const numberMatch = cardNumber.includes(search) || paddedNumber.includes(search);
            // Also try removing leading zeros from search (user searches "081", we also check "81")
            const searchNoLeadingZeros = search.replace(/\b0+(\d+)/g, '$1');
            const numberMatchNormalized = cardNumber.includes(searchNoLeadingZeros);
            // Match "name number" format like "oddish 081/172" or "oddish 81/172"
            const fullMatch = `${c.name} ${cardNumber}`.toLowerCase().includes(search) ||
                              `${c.name} ${paddedNumber}`.toLowerCase().includes(search) ||
                              `${c.name} ${cardNumber}`.toLowerCase().includes(searchNoLeadingZeros);
            return nameMatch || numberMatch || numberMatchNormalized || fullMatch;
        });
    }
    
    // Sort by release date (newest first) then by number
    displayCards.sort((a, b) => {
        const dateA = new Date(a.set.releaseDate || '1999-01-01');
        const dateB = new Date(b.set.releaseDate || '1999-01-01');
        if (dateB - dateA !== 0) return dateB - dateA;
        return parseInt(a.number) - parseInt(b.number);
    });
    
    // For Master Set mode in binder view, expand cards to show each variant as separate entry
    let displayItems = [];
    if (state.collectionViewMode === 'binder' && state.masterSetMode) {
        // Expand each card into its variants
        displayCards.forEach(card => {
            const variants = getCardVariants(card);
            variants.forEach(variant => {
                displayItems.push({
                    card: card,
                    variant: variant,
                    isMasterSetItem: true
                });
            });
        });
    } else {
        // Normal mode - one entry per card
        displayItems = displayCards.map(card => ({
            card: card,
            variant: null,
            isMasterSetItem: false
        }));
    }
    
    // Store filtered cards for binder pagination
    state.filteredCollectionCards = displayCards;
    
    // Count owned cards/variants in the display
    let ownedCount, totalCount;
    if (state.collectionViewMode === 'binder' && state.masterSetMode) {
        // Count owned variants
        ownedCount = displayItems.filter(item => {
            const cardData = state.collection[item.card.id] || {};
            const qty = typeof cardData === 'object' ? (cardData[item.variant.id] || 0) : 0;
            return qty > 0;
        }).length;
        totalCount = displayItems.length;
        elements.collectionCount.textContent = `${ownedCount}/${totalCount} variants`;
    } else {
        const ownedInDisplay = displayCards.filter(c => collectionIds.includes(c.id));
        const totalOwnedCount = ownedInDisplay.reduce((sum, card) => sum + getCardTotalQty(card.id), 0);
        
        if (state.filters.owned === 'all' || state.filters.owned === 'not-owned') {
            elements.collectionCount.textContent = `${displayCards.length} cards (${ownedInDisplay.length} owned)`;
        } else {
            elements.collectionCount.textContent = `${totalOwnedCount} cards (${ownedInDisplay.length} unique)`;
        }
    }
    
    if (displayItems.length === 0) {
        if (state.filters.owned === 'owned' && collectionIds.length === 0) {
            elements.collectionGrid.innerHTML = '<p class="empty-state">Your collection is empty. Browse cards and add them to your collection!</p>';
        } else {
            elements.collectionGrid.innerHTML = '<p class="empty-state">No cards match your filters.</p>';
        }
        elements.binderPagination.style.display = 'none';
        return;
    }
    
    // Handle different view modes
    let itemsToShow;
    let html;
    
    if (state.collectionViewMode === 'binder') {
        // Binder view with pagination
        state.binderTotalPages = Math.ceil(displayItems.length / state.binderSize);
        if (state.binderPage > state.binderTotalPages) state.binderPage = 1;
        
        const startIndex = (state.binderPage - 1) * state.binderSize;
        itemsToShow = displayItems.slice(startIndex, startIndex + state.binderSize);
        
        html = itemsToShow.map(item => {
            if (item.isMasterSetItem) {
                // Master set mode - show individual variant
                return createMasterSetCardHTML(item.card, item.variant);
            } else {
                // Normal mode
                const isOwned = collectionIds.includes(item.card.id);
                return createCardHTML(item.card, !isOwned);
            }
        }).join('');
        
        // Add empty slots if needed to complete the page
        const emptySlots = state.binderSize - itemsToShow.length;
        for (let i = 0; i < emptySlots; i++) {
            html += '<div class="card-item empty-slot"></div>';
        }
        
        // Show binder pagination
        elements.binderPagination.style.display = 'flex';
        elements.binderPageInfo.textContent = `Page ${state.binderPage} of ${state.binderTotalPages}`;
        elements.binderPrev.disabled = state.binderPage <= 1;
        elements.binderNext.disabled = state.binderPage >= state.binderTotalPages;
    } else {
        // Grid or List view
        elements.binderPagination.style.display = 'none';
        
        // Paginate for performance (show max 100 cards at a time)
        const MAX_DISPLAY = 100;
        const showingAll = displayItems.length <= MAX_DISPLAY;
        itemsToShow = showingAll ? displayItems : displayItems.slice(0, MAX_DISPLAY);
        
        html = itemsToShow.map(item => {
            const isOwned = collectionIds.includes(item.card.id);
            return createCardHTML(item.card, !isOwned);
        }).join('');
        
        if (!showingAll) {
            html += `<p class="load-more-hint">Showing ${MAX_DISPLAY} of ${displayItems.length} cards. Use filters to narrow results.</p>`;
        }
    }
    
    elements.collectionGrid.innerHTML = html;
    
    // Apply view mode class and binder size
    elements.collectionGrid.classList.remove('list-view', 'binder-view', 'binder-2x2', 'binder-3x3', 'binder-3x4', 'binder-4x4', 'binder-custom');
    if (state.collectionViewMode === 'list') {
        elements.collectionGrid.classList.add('list-view');
    } else if (state.collectionViewMode === 'binder') {
        elements.collectionGrid.classList.add('binder-view');
        // Add size-specific class
        if (state.binderSize === 4) elements.collectionGrid.classList.add('binder-2x2');
        else if (state.binderSize === 9) elements.collectionGrid.classList.add('binder-3x3');
        else if (state.binderSize === 12) elements.collectionGrid.classList.add('binder-3x4');
        else if (state.binderSize === 16) elements.collectionGrid.classList.add('binder-4x4');
        else elements.collectionGrid.classList.add('binder-custom');
        
        // Set custom grid columns for custom sizes
        if (![4, 9, 12, 16].includes(state.binderSize)) {
            const cols = Math.ceil(Math.sqrt(state.binderSize));
            elements.collectionGrid.style.setProperty('--binder-cols', cols);
        }
    }
    
    // Add click handlers for card (open modal)
    elements.collectionGrid.querySelectorAll('.card-item:not(.empty-slot)').forEach(cardEl => {
        cardEl.addEventListener('click', () => openCardModal(cardEl.dataset.id));
    });
    
    // Add click handlers for variant checkboxes
    setupVariantCheckboxes(elements.collectionGrid);
}

// Create card HTML
export function createCardHTML(card, grayed = false) {
    const totalQty = getCardTotalQty(card.id);
    const ownedBadge = totalQty > 0 ? `<span class="owned-badge">×${totalQty}</span>` : '';
    const cardData = state.collection[card.id] || {};
    const variants = getCardVariants(card);
    const grayedClass = grayed ? 'not-owned' : '';
    
    // Build variant checkboxes based on available variants for this card
    const variantChecks = variants.map(variant => {
        const qty = typeof cardData === 'object' ? (cardData[variant.id] || 0) : 
                    (variant.id === 'normal' && typeof cardData === 'number' ? cardData : 0);
        const isChecked = qty > 0;
        const priceInfo = variant.price ? ` - $${variant.price.market?.toFixed(2) || variant.price.mid?.toFixed(2) || '?'}` : '';
        return `
            <label class="variant-check ${isChecked ? 'checked' : ''}" title="${variant.name}${priceInfo}${qty > 1 ? ' (×' + qty + ')' : ''}" style="--variant-color: ${variant.color}">
                <input type="checkbox" ${isChecked ? 'checked' : ''} data-card="${card.id}" data-variant="${variant.id}">
                <span class="variant-checkmark"></span>
            </label>
        `;
    }).join('');
    
    return `
        <div class="card-item ${grayedClass}" data-id="${card.id}">
            ${ownedBadge}
            <img src="${card.images.small}" alt="${card.name}" loading="lazy">
            <div class="card-overlay">
                <div class="card-name">${card.name}</div>
                <div class="card-set">${card.set.name}</div>
            </div>
            <div class="card-variants" onclick="event.stopPropagation()">
                ${variantChecks}
            </div>
        </div>
    `;
}

// Create card HTML for Master Set mode (shows single variant per card slot)
export function createMasterSetCardHTML(card, variant) {
    const cardData = state.collection[card.id] || {};
    const qty = typeof cardData === 'object' ? (cardData[variant.id] || 0) : 0;
    const isOwned = qty > 0;
    const grayedClass = !isOwned ? 'not-owned' : '';
    const ownedBadge = qty > 0 ? `<span class="owned-badge">×${qty}</span>` : '';
    const priceInfo = variant.price ? `$${variant.price.market?.toFixed(2) || variant.price.mid?.toFixed(2) || '?'}` : '';
    
    return `
        <div class="card-item master-set-card ${grayedClass}" data-id="${card.id}" data-variant="${variant.id}">
            ${ownedBadge}
            <img src="${card.images.small}" alt="${card.name}" loading="lazy">
            <div class="card-overlay">
                <div class="card-name">${card.name}</div>
                <div class="card-set">${card.set.name}</div>
            </div>
            <div class="variant-badge" style="background-color: ${variant.color}">
                <span class="variant-name">${variant.name}</span>
                ${priceInfo ? `<span class="variant-price">${priceInfo}</span>` : ''}
            </div>
            <div class="card-variants" onclick="event.stopPropagation()">
                <label class="variant-check ${isOwned ? 'checked' : ''}" title="${variant.name}" style="--variant-color: ${variant.color}">
                    <input type="checkbox" ${isOwned ? 'checked' : ''} data-card="${card.id}" data-variant="${variant.id}">
                    <span class="variant-checkmark"></span>
                </label>
            </div>
        </div>
    `;
}

// Show loading state
export function showLoading(container) {
    container.innerHTML = `
        <div class="loading">
            <div class="pokeball-loader"></div>
            <p>Loading cards...</p>
        </div>
    `;
}

// Render pagination
export function renderPagination() {
    if (state.totalPages <= 1) {
        elements.pagination.innerHTML = '';
        return;
    }
    
    let html = '';
    
    // Previous button
    html += `<button class="page-btn" ${state.currentPage === 1 ? 'disabled' : ''} data-page="${state.currentPage - 1}">← Prev</button>`;
    
    // Page numbers
    const maxVisible = 5;
    let startPage = Math.max(1, state.currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(state.totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    if (startPage > 1) {
        html += `<button class="page-btn" data-page="1">1</button>`;
        if (startPage > 2) html += '<span style="color: var(--text-muted);">...</span>';
    }
    
    for (let i = startPage; i <= endPage; i++) {
        html += `<button class="page-btn ${i === state.currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    
    if (endPage < state.totalPages) {
        if (endPage < state.totalPages - 1) html += '<span style="color: var(--text-muted);">...</span>';
        html += `<button class="page-btn" data-page="${state.totalPages}">${state.totalPages}</button>`;
    }
    
    // Next button
    html += `<button class="page-btn" ${state.currentPage === state.totalPages ? 'disabled' : ''} data-page="${state.currentPage + 1}">Next →</button>`;
    
    elements.pagination.innerHTML = html;
    
    // Add click handlers
    elements.pagination.querySelectorAll('.page-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (!btn.disabled) {
                state.currentPage = parseInt(btn.dataset.page);
                applyFiltersAndRender();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });
}

// Open card modal
export async function openCardModal(cardId) {
    // Find card in cached cards
    let card = state.allCards.find(c => c.id === cardId);
    
    if (!card) {
        // Fallback: also check current filtered cards
        card = state.cards.find(c => c.id === cardId);
    }
    
    if (!card) {
        console.error('Card not found:', cardId);
        return;
    }
    
    state.selectedCard = card;
    
    // Populate modal
    document.getElementById('modal-card-image').src = card.images.large;
    document.getElementById('modal-card-name').textContent = card.name;
    document.getElementById('modal-card-set').textContent = card.set.name;
    document.getElementById('modal-card-number').textContent = `${card.number}/${card.set.printedTotal}`;
    document.getElementById('modal-card-rarity').textContent = card.rarity || 'Unknown';
    document.getElementById('modal-card-type').textContent = card.types ? card.types.join(', ') : 'N/A';
    document.getElementById('modal-card-artist').textContent = card.artist || 'Unknown';
    
    // Get available variants for this card
    const variants = getCardVariants(card);
    
    // Load current variant quantities from collection
    const cardData = state.collection[card.id] || {};
    state.modalVariants = {};
    variants.forEach(variant => {
        state.modalVariants[variant.id] = typeof cardData === 'object' ? (cardData[variant.id] || 0) : 0;
    });
    
    // Handle legacy data (single number instead of variants object)
    if (typeof cardData === 'number' && cardData > 0) {
        state.modalVariants['normal'] = cardData;
    }
    
    // Render variants grid
    renderVariantsGrid(variants);
    
    elements.modal.classList.add('active');
}

// Render variants grid in modal
export function renderVariantsGrid(variants) {
    const grid = document.getElementById('variants-grid');
    
    grid.innerHTML = variants.map(variant => {
        const priceInfo = variant.price ? `$${variant.price.market?.toFixed(2) || variant.price.mid?.toFixed(2) || '?'}` : '';
        return `
            <div class="variant-row" data-variant="${variant.id}">
                <div class="variant-info">
                    <span class="variant-color-dot" style="background-color: ${variant.color}"></span>
                    <span class="variant-name">${variant.name}</span>
                    ${priceInfo ? `<span class="variant-price">${priceInfo}</span>` : ''}
                </div>
                <div class="variant-qty-control">
                    <button class="variant-qty-btn" data-action="decrease" data-variant="${variant.id}">-</button>
                    <span class="variant-qty-value" id="qty-${variant.id}">${state.modalVariants[variant.id] || 0}</span>
                    <button class="variant-qty-btn" data-action="increase" data-variant="${variant.id}">+</button>
                </div>
            </div>
        `;
    }).join('');
    
    // Add event listeners for variant buttons
    grid.querySelectorAll('.variant-qty-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const variant = btn.dataset.variant;
            const action = btn.dataset.action;
            
            if (action === 'increase') {
                state.modalVariants[variant] = (state.modalVariants[variant] || 0) + 1;
            } else if (action === 'decrease' && state.modalVariants[variant] > 0) {
                state.modalVariants[variant]--;
            }
            
            document.getElementById(`qty-${variant}`).textContent = state.modalVariants[variant];
        });
    });
}

// Close modal
export function closeModal() {
    elements.modal.classList.remove('active');
    state.selectedCard = null;
    state.modalVariants = {};
}

// Save collection with variants (from modal)
export function saveCollectionWithVariants() {
    if (!state.selectedCard) return;
    
    const cardId = state.selectedCard.id;
    const totalQty = Object.values(state.modalVariants).reduce((sum, qty) => sum + qty, 0);
    
    if (totalQty <= 0) {
        delete state.collection[cardId];
    } else {
        state.collection[cardId] = { ...state.modalVariants };
    }
    
    saveCollectionToDB();
    updateStats();
    
    // Sync UI across both grids
    syncCardUI(cardId);
    
    closeModal();
}

// Populate nested series/sets dropdown
export function populateSetsDropdown() {
    // Group sets by series
    const seriesMap = new Map();
    
    state.sets.forEach(set => {
        const seriesName = set.series || 'Other';
        if (!seriesMap.has(seriesName)) {
            seriesMap.set(seriesName, []);
        }
        seriesMap.get(seriesName).push(set);
    });
    
    // Sort series by most recent release date (newest first)
    const sortedSeries = Array.from(seriesMap.entries()).sort((a, b) => {
        const aDate = Math.max(...a[1].map(s => new Date(s.releaseDate?.replace(/\//g, '-') || '1990-01-01').getTime()));
        const bDate = Math.max(...b[1].map(s => new Date(s.releaseDate?.replace(/\//g, '-') || '1990-01-01').getTime()));
        return bDate - aDate;
    });
    
    // Build the nested dropdown HTML (accordion style)
    let html = `<div class="dropdown-item" data-set=""><span>All Sets</span></div>`;
    
    sortedSeries.forEach(([seriesName, sets]) => {
        // Sort sets within series by release date (newest first)
        sets.sort((a, b) => {
            const aDate = new Date(a.releaseDate?.replace(/\//g, '-') || '1990-01-01');
            const bDate = new Date(b.releaseDate?.replace(/\//g, '-') || '1990-01-01');
            return bDate - aDate;
        });
        
        html += `
            <div class="series-accordion">
                <div class="series-header">
                    <span>${seriesName}</span>
                    <span class="series-count">${sets.length}</span>
                    <span class="accordion-arrow">▼</span>
                </div>
                <div class="series-sets">
                    ${sets.map(set => `
                        <div class="dropdown-item set-item" data-set="${set.id}">
                            <img class="set-icon" src="${set.images?.symbol || ''}" alt="" onerror="this.style.display='none'">
                            <span class="set-name">${set.name}</span>
                            <span class="set-year">${set.releaseDate?.split('/')[0] || ''}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });
    
    elements.dropdownMenu.innerHTML = html;
    
    // Setup dropdown event listeners
    setupNestedDropdown();
}

// Setup nested dropdown interactions
export function setupNestedDropdown() {
    // Toggle main dropdown
    elements.dropdownTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        elements.dropdownMenu.classList.toggle('open');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nested-dropdown')) {
            elements.dropdownMenu.classList.remove('open');
        }
    });
    
    // Toggle series accordion
    elements.dropdownMenu.querySelectorAll('.series-header').forEach(header => {
        header.addEventListener('click', (e) => {
            e.stopPropagation();
            const accordion = header.closest('.series-accordion');
            accordion.classList.toggle('expanded');
        });
    });
    
    // Handle set item clicks
    elements.dropdownMenu.querySelectorAll('.dropdown-item[data-set]').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const setId = item.dataset.set;
            
            // Update the label
            if (setId === '') {
                elements.dropdownLabel.textContent = 'All Sets';
            } else {
                const setName = item.querySelector('span').textContent;
                elements.dropdownLabel.textContent = setName;
            }
            
            // Update filter and close dropdown
            state.filters.set = setId;
            state.currentPage = 1;
            elements.dropdownMenu.classList.remove('open');
            
            if (state.currentView === 'browse') {
                applyFiltersAndRender();
            } else if (state.currentView === 'collection') {
                renderCollection();
            }
        });
    });
}
