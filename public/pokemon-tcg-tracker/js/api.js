// API Operations and Data Loading

import { API_BASE } from './config.js';
import { state, elements } from './state.js';
import { 
    isCacheValid, 
    getCachedCards, 
    getCachedSets, 
    saveCardsToCache, 
    saveSetsToCache 
} from './db.js';

// Show loading progress
export function showLoadingProgress(current, total) {
    const percent = total > 0 ? Math.round((current / total) * 100) : 0;
    elements.browseGrid.innerHTML = `
        <div class="loading">
            <div class="pokeball-loader"></div>
            <p>Loading Data... ${percent}%</p>
            <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 0.5rem;">
                ${current > 0 ? `Batch ${current} of ${total}` : 'Starting...'}
            </p>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${percent}%"></div>
            </div>
        </div>
    `;
}

// Load all cards (from cache or API) - returns true if data was loaded
export async function loadAllCards() {
    // Check cache first
    if (await isCacheValid()) {
        const cachedCards = await getCachedCards();
        if (cachedCards && cachedCards.length > 0) {
            state.allCards = cachedCards;
            return true;
        }
    }
    
    // Fetch all cards from API
    await fetchAllCardsFromAPI();
    return true;
}

// Fetch all cards from API with progress (PARALLEL)
export async function fetchAllCardsFromAPI() {
    showLoadingProgress(0, 1);
    state.isLoading = true;
    
    try {
        // First, get total count
        const countResponse = await fetch(`${API_BASE}/cards?page=1&pageSize=1`);
        const countData = await countResponse.json();
        const totalCards = countData.totalCount;
        const totalPages = Math.ceil(totalCards / 250); // Max 250 per request
        
        state.loadProgress.total = totalPages;
        console.log(`Fetching ${totalCards} cards in ${totalPages} batches (parallel)...`);
        
        // Create array of page numbers to fetch
        const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
        
        // Fetch in parallel chunks of 10 requests at a time
        const CONCURRENT_REQUESTS = 10;
        let allCards = [];
        let completedBatches = 0;
        
        for (let i = 0; i < pageNumbers.length; i += CONCURRENT_REQUESTS) {
            const chunk = pageNumbers.slice(i, i + CONCURRENT_REQUESTS);
            
            // Fetch all pages in this chunk simultaneously
            const promises = chunk.map(page => 
                fetch(`${API_BASE}/cards?page=${page}&pageSize=250&orderBy=set.releaseDate,number`)
                    .then(res => res.json())
                    .then(data => {
                        completedBatches++;
                        state.loadProgress.current = completedBatches;
                        showLoadingProgress(completedBatches, totalPages);
                        return data.data || [];
                    })
            );
            
            const results = await Promise.all(promises);
            results.forEach(cards => {
                allCards = allCards.concat(cards);
            });
        }
        
        state.allCards = allCards;
        console.log(`Loaded ${allCards.length} cards total`);
        
        // Save to cache (IndexedDB)
        await saveCardsToCache(allCards);
        
    } catch (error) {
        console.error('Error loading cards:', error);
        elements.browseGrid.innerHTML = '<p class="empty-state">Error loading cards. Please refresh to try again.</p>';
    } finally {
        state.isLoading = false;
    }
}

// Load card sets
export async function loadSets() {
    // Check if sets are in cache (IndexedDB)
    const cachedSets = await getCachedSets();
    if (cachedSets && cachedSets.length > 0) {
        state.sets = cachedSets;
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/sets?orderBy=-releaseDate`);
        const data = await response.json();
        state.sets = data.data;
        
        // Save sets to cache
        await saveSetsToCache(state.sets);
    } catch (error) {
        console.error('Error loading sets:', error);
    }
}
