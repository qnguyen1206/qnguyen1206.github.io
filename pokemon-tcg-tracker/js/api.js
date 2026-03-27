// API Operations and Data Loading

import { API_BASE, CATALOG_CACHE_VERSION, getFetchOptions } from './config.js';
import { state, elements } from './state.js';
import { 
    isCacheValid, 
    getCachedCards, 
    getCachedSets, 
    saveCardsToCache, 
    saveSetsToCache 
} from './db.js';

// Path to pre-built data files (relative to index.html)
const DATA_PATH = './data';
const CARD_FILE_CANDIDATES = ['cards.tcgtracking.json', 'cards.json'];
const SET_FILE_CANDIDATES = ['sets.tcgtracking.json', 'sets.json'];

function buildCatalogUrl(fileName) {
    return `${DATA_PATH}/${fileName}?v=${encodeURIComponent(CATALOG_CACHE_VERSION)}`;
}

// Show loading progress
export function showLoadingProgress(current, total, message = '') {
    const percent = total > 0 ? Math.round((current / total) * 100) : 0;
    elements.browseGrid.innerHTML = `
        <div class="loading">
            <div class="pokeball-loader"></div>
            <p>Loading Data... ${percent}%</p>
            <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 0.5rem;">
                ${message || (current > 0 ? `${current} of ${total}` : 'Starting...')}
            </p>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${percent}%"></div>
            </div>
        </div>
    `;
}

// Load all cards - tries: 1) IndexedDB cache, 2) Pre-built JSON, 3) API
export async function loadAllCards() {
    // 1. Check IndexedDB cache first
    if (await isCacheValid('cards')) {
        const cachedCards = await getCachedCards();
        if (cachedCards && cachedCards.length > 0) {
            state.allCards = cachedCards;
            console.log(`Loaded ${cachedCards.length} cards from IndexedDB cache`);
            return true;
        }
    }
    
    // 2. Try loading from pre-built JSON file
    const loaded = await loadCardsFromJSON();
    if (loaded) {
        return true;
    }
    
    // 3. Fallback to API (slow)
    console.log('Falling back to API...');
    await fetchAllCardsFromAPI();
    return true;
}

// Load cards from pre-built JSON file
async function loadCardsFromJSON() {
    showLoadingProgress(0, 100, 'Loading card database...');
    
    for (const fileName of CARD_FILE_CANDIDATES) {
        try {
            const response = await fetch(buildCatalogUrl(fileName), { cache: 'no-store' });
            if (!response.ok) {
                continue;
            }

            showLoadingProgress(50, 100, 'Parsing card data...');
            const cards = await response.json();

            if (cards && cards.length > 0) {
                state.allCards = cards;
                console.log(`Loaded ${cards.length} cards from ${fileName}`);
                
                // Cache to IndexedDB for even faster subsequent loads
                showLoadingProgress(80, 100, 'Caching for offline use...');
                await saveCardsToCache(cards);
                
                showLoadingProgress(100, 100, 'Done!');
                return true;
            }
        } catch (error) {
            console.log(`Failed to load ${fileName}:`, error.message);
        }
    }

    console.log('Pre-built card catalog not found, will use API');
    return false;
}

// Load sets - tries: 1) IndexedDB cache, 2) Pre-built JSON, 3) API
export async function loadSets() {
    // 1. Check IndexedDB cache
    if (await isCacheValid('sets')) {
        const cachedSets = await getCachedSets();
        if (cachedSets && cachedSets.length > 0) {
            state.sets = cachedSets;
            console.log(`Loaded ${cachedSets.length} sets from cache`);
            return;
        }
    }
    
    // 2. Try loading from pre-built JSON
    for (const fileName of SET_FILE_CANDIDATES) {
        try {
            const response = await fetch(buildCatalogUrl(fileName), { cache: 'no-store' });
            if (response.ok) {
                const sets = await response.json();
                if (sets && sets.length > 0) {
                    state.sets = sets;
                    await saveSetsToCache(sets);
                    console.log(`Loaded ${sets.length} sets from ${fileName}`);
                    return;
                }
            }
        } catch (error) {
            console.log(`Failed to load ${fileName}:`, error.message);
        }
    }
    
    // 3. Fallback to API
    try {
        const response = await fetch(`${API_BASE}/sets?orderBy=-releaseDate`, getFetchOptions());
        if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
        }
        const data = await response.json();
        state.sets = data.data;
        await saveSetsToCache(state.sets);
        console.log(`Loaded ${state.sets.length} sets from API`);
    } catch (error) {
        console.error('Error loading sets:', error);
    }
}

// Fetch with retry logic (for API fallback)
async function fetchWithRetry(url, options, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                if (response.status === 429 || response.status >= 500) {
                    throw new Error(`API returned ${response.status}`);
                }
                throw new Error(`API returned ${response.status}: ${response.statusText}`);
            }
            return response;
        } catch (error) {
            if (i === retries - 1) throw error;
            console.warn(`Retry ${i + 1}/${retries} for ${url}: ${error.message}`);
            await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        }
    }
}

// Fetch all cards from API (fallback, slow)
export async function fetchAllCardsFromAPI() {
    showLoadingProgress(0, 1, 'Connecting to API...');
    state.isLoading = true;
    
    try {
        const countResponse = await fetchWithRetry(`${API_BASE}/cards?page=1&pageSize=1`, getFetchOptions());
        const countData = await countResponse.json();
        const totalCards = countData.totalCount;
        const totalPages = Math.ceil(totalCards / 250);
        
        console.log(`Fetching ${totalCards} cards in ${totalPages} batches from API...`);
        
        const CONCURRENT_REQUESTS = 3;
        const DELAY_BETWEEN_BATCHES = 500;
        let allCards = [];
        let completedBatches = 0;
        let failedPages = [];
        
        const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
        
        for (let i = 0; i < pageNumbers.length; i += CONCURRENT_REQUESTS) {
            const chunk = pageNumbers.slice(i, i + CONCURRENT_REQUESTS);
            
            const promises = chunk.map(async page => {
                try {
                    const response = await fetchWithRetry(
                        `${API_BASE}/cards?page=${page}&pageSize=250&orderBy=set.releaseDate,number`,
                        getFetchOptions(), 3, 2000
                    );
                    const data = await response.json();
                    return { success: true, page, cards: data.data || [] };
                } catch (error) {
                    return { success: false, page, cards: [] };
                }
            });
            
            const results = await Promise.all(promises);
            results.forEach(result => {
                completedBatches++;
                if (result.success) {
                    allCards = allCards.concat(result.cards);
                } else {
                    failedPages.push(result.page);
                }
                showLoadingProgress(completedBatches, totalPages, 
                    `Loading from API... ${allCards.length} cards`);
            });
            
            if (i + CONCURRENT_REQUESTS < pageNumbers.length) {
                await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
            }
        }
        
        if (allCards.length > 0) {
            state.allCards = allCards;
            await saveCardsToCache(allCards);
            console.log(`Loaded ${allCards.length} cards from API`);
        } else {
            throw new Error('No cards were loaded');
        }
        
    } catch (error) {
        console.error('Error loading cards:', error);
        elements.browseGrid.innerHTML = `
            <p class="empty-state">
                Error loading cards. Please try again.<br>
                <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; cursor: pointer;">
                    Retry
                </button>
            </p>`;
    } finally {
        state.isLoading = false;
    }
}
