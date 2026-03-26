// Pokemon TCG Tracker App
// Uses the Pokemon TCG API: https://pokemontcg.io/

const API_BASE = 'https://api.pokemontcg.io/v2';
const CARDS_PER_PAGE = 20;
const CACHE_DB_NAME = 'pokemon-tcg-db';
const CACHE_DB_VERSION = 2;  // Incremented to add collection/valueHistory stores
const CACHE_EXPIRY_DAYS = 7;

// Card variants configuration - maps TCGPlayer price keys to display info
// Order matters for display
const VARIANT_ORDER = ['normal', 'holofoil', 'reverseHolofoil', '1stEditionHolofoil', '1stEditionNormal', 'unlimitedHolofoil'];
const VARIANT_MAP = {
    'normal': { name: 'Normal', color: '#6b7280' },
    'holofoil': { name: 'Holofoil', color: '#f59e0b' },
    'reverseHolofoil': { name: 'Reverse Holo', color: '#8b5cf6' },
    '1stEditionHolofoil': { name: '1st Ed. Holo', color: '#ef4444' },
    '1stEditionNormal': { name: '1st Edition', color: '#3b82f6' },
    'unlimitedHolofoil': { name: 'Unlimited Holo', color: '#10b981' }
};

// Get available variants for a card based on tcgplayer.prices
function getCardVariants(card) {
    const variants = [];
    
    if (card.tcgplayer && card.tcgplayer.prices) {
        const priceKeys = Object.keys(card.tcgplayer.prices);
        // Sort by defined order
        VARIANT_ORDER.forEach(key => {
            if (priceKeys.includes(key) && VARIANT_MAP[key]) {
                variants.push({
                    id: key,
                    name: VARIANT_MAP[key].name,
                    color: VARIANT_MAP[key].color,
                    price: card.tcgplayer.prices[key]
                });
            }
        });
    }
    
    // If no TCGPlayer data, default to just 'normal'
    if (variants.length === 0) {
        variants.push({
            id: 'normal',
            name: 'Normal',
            color: '#6b7280',
            price: null
        });
    }
    
    return variants;
}

// Render variant legend
function renderVariantLegend() {
    const legendHTML = VARIANT_ORDER.map(id => {
        const variant = VARIANT_MAP[id];
        return `
            <div class="legend-item">
                <span class="legend-color" style="background-color: ${variant.color}"></span>
                <span class="legend-name">${variant.name}</span>
            </div>
        `;
    }).join('');
    
    return `
        <div class="variant-legend">
            <span class="legend-title">Variants:</span>
            ${legendHTML}
        </div>
    `;
}

// State
let state = {
    allCards: [],  // All cards from cache
    cards: [],     // Filtered cards for current view
    sets: [],
    collection: {},  // Loaded from IndexedDB
    valueHistory: [], // Loaded from IndexedDB
    currentPage: 1,
    totalPages: 1,
    totalCards: 0,
    currentView: 'browse',
    filters: {
        set: '',
        type: '',
        rarity: '',
        search: '',
        owned: 'owned'
    },
    selectedCard: null,
    modalVariants: {}, // Temporary variant quantities in modal
    isLoading: false,
    loadProgress: { current: 0, total: 0 },
    collectionViewMode: 'grid', // 'grid', 'list', 'binder'
    binderSize: 9, // cards per page
    binderPage: 1,
    binderTotalPages: 1,
    filteredCollectionCards: [] // Store filtered cards for binder pagination
};

// DOM Elements
const elements = {
    browseGrid: document.getElementById('browse-grid'),
    collectionGrid: document.getElementById('collection-grid'),
    browseCount: document.getElementById('browse-count'),
    collectionCount: document.getElementById('collection-count'),
    pagination: document.getElementById('pagination'),
    dropdownTrigger: document.getElementById('dropdown-trigger'),
    dropdownMenu: document.getElementById('dropdown-menu'),
    dropdownLabel: document.getElementById('dropdown-label'),
    typeSelect: document.getElementById('type-select'),
    raritySelect: document.getElementById('rarity-select'),
    searchInput: document.getElementById('search-input'),
    clearFilters: document.getElementById('clear-filters'),
    refreshCache: document.getElementById('refresh-cache'),
    modal: document.getElementById('card-modal'),
    navBtns: document.querySelectorAll('.nav-btn'),
    views: document.querySelectorAll('.view'),
    collectionFilter: document.querySelector('.collection-filter'),
    ownedSelect: document.getElementById('owned-select'),
    viewToggleBtns: document.querySelectorAll('.view-toggle-btn'),
    binderOptions: document.querySelector('.binder-options'),
    binderSizeSelect: document.getElementById('binder-size'),
    binderCustomSize: document.getElementById('binder-custom-size'),
    binderPagination: document.getElementById('binder-pagination'),
    binderPrev: document.getElementById('binder-prev'),
    binderNext: document.getElementById('binder-next'),
    binderPageInfo: document.getElementById('binder-page-info'),
    mobileFilterToggle: document.getElementById('mobile-filter-toggle'),
    filtersSidebar: document.getElementById('filters-sidebar')
};

// IndexedDB instance
let db = null;
// Initialize
async function init() {
    await initDB();
    await loadCollectionFromDB();
    await loadValueHistoryFromDB();
    await loadSets();
    await loadAllCards();
    setupEventListeners();
    // updateStats is now called after cards are loaded in applyFiltersAndRender
}

// Initialize IndexedDB
function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(CACHE_DB_NAME, CACHE_DB_VERSION);
        
        request.onerror = () => {
            console.error('Failed to open IndexedDB');
            resolve(); // Continue without cache
        };
        
        request.onsuccess = (event) => {
            db = event.target.result;
            console.log('IndexedDB initialized');
            resolve();
        };
        
        request.onupgradeneeded = (event) => {
            const database = event.target.result;
            
            // Create object stores
            if (!database.objectStoreNames.contains('cards')) {
                database.createObjectStore('cards', { keyPath: 'id' });
            }
            if (!database.objectStoreNames.contains('sets')) {
                database.createObjectStore('sets', { keyPath: 'id' });
            }
            if (!database.objectStoreNames.contains('metadata')) {
                database.createObjectStore('metadata', { keyPath: 'key' });
            }
            if (!database.objectStoreNames.contains('collection')) {
                database.createObjectStore('collection', { keyPath: 'cardId' });
            }
            if (!database.objectStoreNames.contains('valueHistory')) {
                database.createObjectStore('valueHistory', { keyPath: 'date' });
            }
        };
    });
}

// Check if cache is valid
async function isCacheValid() {
    if (!db) return false;
    
    return new Promise((resolve) => {
        try {
            const transaction = db.transaction(['metadata'], 'readonly');
            const store = transaction.objectStore('metadata');
            const request = store.get('cacheTimestamp');
            
            request.onsuccess = () => {
                if (!request.result) {
                    resolve(false);
                    return;
                }
                
                const timestamp = request.result.value;
                const now = Date.now();
                const expiryTime = CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
                const isValid = (now - timestamp) < expiryTime;
                
                if (isValid) {
                    const daysAgo = Math.floor((now - timestamp) / (24 * 60 * 60 * 1000));
                    console.log(`Cache is valid (${daysAgo} days old)`);
                }
                
                resolve(isValid);
            };
            
            request.onerror = () => resolve(false);
        } catch (e) {
            resolve(false);
        }
    });
}

// Get cached cards
async function getCachedCards() {
    if (!db) return null;
    
    return new Promise((resolve) => {
        try {
            const transaction = db.transaction(['cards'], 'readonly');
            const store = transaction.objectStore('cards');
            const request = store.getAll();
            
            request.onsuccess = () => {
                const cards = request.result;
                if (cards && cards.length > 0) {
                    console.log(`Loaded ${cards.length} cards from cache`);
                    resolve(cards);
                } else {
                    resolve(null);
                }
            };
            
            request.onerror = () => resolve(null);
        } catch (e) {
            resolve(null);
        }
    });
}

// Get cached sets
async function getCachedSets() {
    if (!db) return null;
    
    return new Promise((resolve) => {
        try {
            const transaction = db.transaction(['sets'], 'readonly');
            const store = transaction.objectStore('sets');
            const request = store.getAll();
            
            request.onsuccess = () => {
                const sets = request.result;
                if (sets && sets.length > 0) {
                    resolve(sets);
                } else {
                    resolve(null);
                }
            };
            
            request.onerror = () => resolve(null);
        } catch (e) {
            resolve(null);
        }
    });
}

// Save cards to cache
async function saveCardsToCache(cards) {
    if (!db) return;
    
    return new Promise((resolve) => {
        try {
            const transaction = db.transaction(['cards', 'metadata'], 'readwrite');
            const cardStore = transaction.objectStore('cards');
            const metaStore = transaction.objectStore('metadata');
            
            // Clear existing cards
            cardStore.clear();
            
            // Add all cards
            cards.forEach(card => {
                cardStore.put(card);
            });
            
            // Update timestamp
            metaStore.put({ key: 'cacheTimestamp', value: Date.now() });
            
            transaction.oncomplete = () => {
                console.log(`Cached ${cards.length} cards to IndexedDB`);
                resolve();
            };
            
            transaction.onerror = () => {
                console.error('Failed to cache cards');
                resolve();
            };
        } catch (e) {
            console.error('Error saving to cache:', e);
            resolve();
        }
    });
}

// Save sets to cache
async function saveSetsToCache(sets) {
    if (!db) return;
    
    return new Promise((resolve) => {
        try {
            const transaction = db.transaction(['sets'], 'readwrite');
            const store = transaction.objectStore('sets');
            
            // Clear existing sets
            store.clear();
            
            // Add all sets
            sets.forEach(set => {
                store.put(set);
            });
            
            transaction.oncomplete = () => {
                console.log(`Cached ${sets.length} sets to IndexedDB`);
                resolve();
            };
            
            transaction.onerror = () => resolve();
        } catch (e) {
            resolve();
        }
    });
}

// Clear cache
async function clearCache() {
    if (!db) return;
    
    return new Promise((resolve) => {
        try {
            const transaction = db.transaction(['cards', 'sets', 'metadata'], 'readwrite');
            transaction.objectStore('cards').clear();
            transaction.objectStore('sets').clear();
            transaction.objectStore('metadata').clear();
            
            transaction.oncomplete = () => {
                console.log('Cache cleared');
                resolve();
            };
            
            transaction.onerror = () => resolve();
        } catch (e) {
            resolve();
        }
    });
}

// Load collection from IndexedDB (with localStorage migration)
async function loadCollectionFromDB() {
    if (!db) {
        // Fallback to localStorage if IndexedDB not available
        state.collection = JSON.parse(localStorage.getItem('pokemon-collection')) || {};
        return;
    }
    
    return new Promise((resolve) => {
        try {
            const transaction = db.transaction(['collection'], 'readonly');
            const store = transaction.objectStore('collection');
            const request = store.getAll();
            
            request.onsuccess = () => {
                const items = request.result;
                if (items && items.length > 0) {
                    // Convert array back to object
                    state.collection = {};
                    items.forEach(item => {
                        state.collection[item.cardId] = item.variants;
                    });
                    console.log(`Loaded ${items.length} collection items from IndexedDB`);
                } else {
                    // Try to migrate from localStorage
                    const localData = localStorage.getItem('pokemon-collection');
                    if (localData) {
                        state.collection = JSON.parse(localData);
                        console.log('Migrating collection from localStorage to IndexedDB...');
                        saveCollectionToDB().then(() => {
                            // Clear localStorage after successful migration
                            localStorage.removeItem('pokemon-collection');
                            console.log('Collection migrated to IndexedDB');
                        });
                    }
                }
                resolve();
            };
            
            request.onerror = () => {
                state.collection = JSON.parse(localStorage.getItem('pokemon-collection')) || {};
                resolve();
            };
        } catch (e) {
            state.collection = JSON.parse(localStorage.getItem('pokemon-collection')) || {};
            resolve();
        }
    });
}

// Save collection to IndexedDB
async function saveCollectionToDB() {
    if (!db) {
        // Fallback to localStorage
        localStorage.setItem('pokemon-collection', JSON.stringify(state.collection));
        return;
    }
    
    return new Promise((resolve) => {
        try {
            const transaction = db.transaction(['collection'], 'readwrite');
            const store = transaction.objectStore('collection');
            
            // Clear existing collection
            store.clear();
            
            // Add all collection items
            Object.entries(state.collection).forEach(([cardId, variants]) => {
                store.put({ cardId, variants });
            });
            
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => resolve();
        } catch (e) {
            // Fallback to localStorage
            localStorage.setItem('pokemon-collection', JSON.stringify(state.collection));
            resolve();
        }
    });
}

// Load value history from IndexedDB (with localStorage migration)
async function loadValueHistoryFromDB() {
    if (!db) {
        state.valueHistory = JSON.parse(localStorage.getItem('pokemon-value-history')) || [];
        return;
    }
    
    return new Promise((resolve) => {
        try {
            const transaction = db.transaction(['valueHistory'], 'readonly');
            const store = transaction.objectStore('valueHistory');
            const request = store.getAll();
            
            request.onsuccess = () => {
                const items = request.result;
                if (items && items.length > 0) {
                    // Sort by date
                    state.valueHistory = items.sort((a, b) => a.date.localeCompare(b.date));
                    console.log(`Loaded ${items.length} value history entries from IndexedDB`);
                } else {
                    // Try to migrate from localStorage
                    const localData = localStorage.getItem('pokemon-value-history');
                    if (localData) {
                        state.valueHistory = JSON.parse(localData);
                        console.log('Migrating value history from localStorage to IndexedDB...');
                        saveValueHistoryToDB().then(() => {
                            localStorage.removeItem('pokemon-value-history');
                            console.log('Value history migrated to IndexedDB');
                        });
                    }
                }
                resolve();
            };
            
            request.onerror = () => {
                state.valueHistory = JSON.parse(localStorage.getItem('pokemon-value-history')) || [];
                resolve();
            };
        } catch (e) {
            state.valueHistory = JSON.parse(localStorage.getItem('pokemon-value-history')) || [];
            resolve();
        }
    });
}

// Save value history to IndexedDB
async function saveValueHistoryToDB() {
    if (!db) {
        localStorage.setItem('pokemon-value-history', JSON.stringify(state.valueHistory));
        return;
    }
    
    return new Promise((resolve) => {
        try {
            const transaction = db.transaction(['valueHistory'], 'readwrite');
            const store = transaction.objectStore('valueHistory');
            
            // Clear and re-add all entries
            store.clear();
            
            state.valueHistory.forEach(entry => {
                store.put(entry);
            });
            
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => resolve();
        } catch (e) {
            localStorage.setItem('pokemon-value-history', JSON.stringify(state.valueHistory));
            resolve();
        }
    });
}

// Load all cards (from cache or API)
async function loadAllCards() {
    // Check cache first
    if (await isCacheValid()) {
        const cachedCards = await getCachedCards();
        if (cachedCards && cachedCards.length > 0) {
            state.allCards = cachedCards;
            applyFiltersAndRender();
            return;
        }
    }
    
    // Fetch all cards from API
    await fetchAllCardsFromAPI();
}

// Fetch all cards from API with progress (PARALLEL)
async function fetchAllCardsFromAPI() {
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
        
        applyFiltersAndRender();
        
    } catch (error) {
        console.error('Error loading cards:', error);
        elements.browseGrid.innerHTML = '<p class="empty-state">Error loading cards. Please refresh to try again.</p>';
    } finally {
        state.isLoading = false;
    }
}

// Show loading progress
function showLoadingProgress(current, total) {
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

// Apply filters and render (all done client-side now)
function applyFiltersAndRender() {
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
        const search = state.filters.search.toLowerCase();
        filtered = filtered.filter(c => c.name.toLowerCase().includes(search));
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

// Load card sets
async function loadSets() {
    // Check if sets are in cache (IndexedDB)
    const cachedSets = await getCachedSets();
    if (cachedSets && cachedSets.length > 0) {
        state.sets = cachedSets;
        populateSetsDropdown();
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/sets?orderBy=-releaseDate`);
        const data = await response.json();
        state.sets = data.data;
        populateSetsDropdown();
        
        // Save sets to cache
        await saveSetsToCache(state.sets);
    } catch (error) {
        console.error('Error loading sets:', error);
    }
}

// Populate nested series/sets dropdown
function populateSetsDropdown() {
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
function setupNestedDropdown() {
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

// Render cards grid
function renderCards() {
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

// Setup variant checkbox handlers for a container
function setupVariantCheckboxes(container) {
    container.querySelectorAll('.variant-check input').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const cardId = checkbox.dataset.card;
            const variantId = checkbox.dataset.variant;
            const isChecked = checkbox.checked;
            
            // Update collection
            let cardData = state.collection[cardId];
            
            // Handle legacy data or initialize with empty object
            if (!cardData || typeof cardData === 'number') {
                const legacyQty = typeof cardData === 'number' ? cardData : 0;
                cardData = {};
                if (legacyQty > 0) {
                    cardData['normal'] = legacyQty;
                }
            }
            
            // Toggle: if checking, set to 1; if unchecking, set to 0
            if (isChecked) {
                cardData[variantId] = 1;
            } else {
                delete cardData[variantId];
            }
            
            // Check if all variants are 0
            const totalQty = Object.values(cardData).reduce((sum, qty) => sum + qty, 0);
            
            if (totalQty <= 0) {
                delete state.collection[cardId];
            } else {
                state.collection[cardId] = cardData;
            }
            
            // Save collection to IndexedDB
            saveCollectionToDB();
            
            // Sync UI across both grids
            syncCardUI(cardId);
            
            updateStats();
        });
    });
}

// Sync card UI across browse and collection grids
function syncCardUI(cardId) {
    const totalQty = getCardTotalQty(cardId);
    const cardData = state.collection[cardId] || {};
    
    // Update all instances of this card in both grids
    document.querySelectorAll(`.card-item[data-id="${cardId}"]`).forEach(cardEl => {
        // Update owned/not-owned visual state (gray out)
        cardEl.classList.toggle('not-owned', totalQty <= 0);
        
        // Update badge
        let badge = cardEl.querySelector('.owned-badge');
        if (totalQty > 0) {
            if (badge) {
                badge.textContent = `×${totalQty}`;
            } else {
                cardEl.insertAdjacentHTML('afterbegin', `<span class="owned-badge">×${totalQty}</span>`);
            }
        } else if (badge) {
            badge.remove();
        }
        
        // Update all variant checkboxes
        cardEl.querySelectorAll('.variant-check input').forEach(cb => {
            const variantId = cb.dataset.variant;
            const qty = typeof cardData === 'object' ? (cardData[variantId] || 0) : 0;
            const isChecked = qty > 0;
            cb.checked = isChecked;
            cb.parentElement.classList.toggle('checked', isChecked);
        });
    });
}

// Render collection
function renderCollection() {
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
        const search = state.filters.search.toLowerCase();
        displayCards = displayCards.filter(c => c.name.toLowerCase().includes(search));
    }
    
    // Sort by release date (newest first) then by number
    displayCards.sort((a, b) => {
        const dateA = new Date(a.set.releaseDate || '1999-01-01');
        const dateB = new Date(b.set.releaseDate || '1999-01-01');
        if (dateB - dateA !== 0) return dateB - dateA;
        return parseInt(a.number) - parseInt(b.number);
    });
    
    // Store filtered cards for binder pagination
    state.filteredCollectionCards = displayCards;
    
    // Count owned cards in the display
    const ownedInDisplay = displayCards.filter(c => collectionIds.includes(c.id));
    const totalOwnedCount = ownedInDisplay.reduce((sum, card) => sum + getCardTotalQty(card.id), 0);
    
    if (state.filters.owned === 'all' || state.filters.owned === 'not-owned') {
        elements.collectionCount.textContent = `${displayCards.length} cards (${ownedInDisplay.length} owned)`;
    } else {
        elements.collectionCount.textContent = `${totalOwnedCount} cards (${ownedInDisplay.length} unique)`;
    }
    
    if (displayCards.length === 0) {
        if (state.filters.owned === 'owned' && collectionIds.length === 0) {
            elements.collectionGrid.innerHTML = '<p class="empty-state">Your collection is empty. Browse cards and add them to your collection!</p>';
        } else {
            elements.collectionGrid.innerHTML = '<p class="empty-state">No cards match your filters.</p>';
        }
        elements.binderPagination.style.display = 'none';
        return;
    }
    
    // Handle different view modes
    let cardsToShow;
    let html;
    
    if (state.collectionViewMode === 'binder') {
        // Binder view with pagination
        state.binderTotalPages = Math.ceil(displayCards.length / state.binderSize);
        if (state.binderPage > state.binderTotalPages) state.binderPage = 1;
        
        const startIndex = (state.binderPage - 1) * state.binderSize;
        cardsToShow = displayCards.slice(startIndex, startIndex + state.binderSize);
        
        html = cardsToShow.map(card => {
            const isOwned = collectionIds.includes(card.id);
            return createCardHTML(card, !isOwned);
        }).join('');
        
        // Add empty slots if needed to complete the page
        const emptySlots = state.binderSize - cardsToShow.length;
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
        const showingAll = displayCards.length <= MAX_DISPLAY;
        cardsToShow = showingAll ? displayCards : displayCards.slice(0, MAX_DISPLAY);
        
        html = cardsToShow.map(card => {
            const isOwned = collectionIds.includes(card.id);
            return createCardHTML(card, !isOwned);
        }).join('');
        
        if (!showingAll) {
            html += `<p class="load-more-hint">Showing ${MAX_DISPLAY} of ${displayCards.length} cards. Use filters to narrow results.</p>`;
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
function createCardHTML(card, grayed = false) {
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

// Show loading state
function showLoading(container) {
    container.innerHTML = `
        <div class="loading">
            <div class="pokeball-loader"></div>
            <p>Loading cards...</p>
        </div>
    `;
}

// Render pagination
function renderPagination() {
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
async function openCardModal(cardId) {
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
function renderVariantsGrid(variants) {
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
function closeModal() {
    elements.modal.classList.remove('active');
    state.selectedCard = null;
    state.modalVariants = {};
}

// Save collection with variants
function saveCollectionWithVariants() {
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

// Get total quantity for a card (across all variants)
function getCardTotalQty(cardId) {
    const cardData = state.collection[cardId];
    if (!cardData) return 0;
    if (typeof cardData === 'number') return cardData; // Legacy support
    return Object.values(cardData).reduce((sum, qty) => sum + qty, 0);
}

// Update stats
function updateStats() {
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
function updateCollectionValue(cardIds) {
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
        
        // Get price from tcgplayer or cardmarket
        const getVariantPrice = (variantId) => {
            // Try tcgplayer first
            if (card.tcgplayer && card.tcgplayer.prices && card.tcgplayer.prices[variantId]) {
                const p = card.tcgplayer.prices[variantId];
                return p.market || p.mid || 0;
            }
            // Fallback to cardmarket
            if (card.cardmarket && card.cardmarket.prices) {
                const cm = card.cardmarket.prices;
                if (variantId === 'normal') {
                    return cm.averageSellPrice || cm.trendPrice || 0;
                } else if (variantId === 'reverseHolofoil') {
                    return cm.reverseHoloSell || cm.reverseHoloTrend || 0;
                }
                // For other variants, use averageSellPrice as fallback
                return cm.averageSellPrice || cm.trendPrice || 0;
            }
            return 0;
        };
        
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

async function updateMostValuableCard(cardIds) {
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
                const price = variant.price.market || variant.price.mid || 0;
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

async function updateCharts(cardIds) {
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

function renderChart(containerId, data, type) {
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
function saveValueHistory(value) {
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
function renderValueHistoryChart() {
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
    
    // Chart dimensions
    const chartWidth = 100; // percentage
    const chartHeight = 200; // pixels
    const padding = 40;
    
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

// Setup event listeners
function setupEventListeners() {
    // Navigation
    elements.navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            switchView(view);
        });
    });
    
    // Mobile filter toggle
    elements.mobileFilterToggle.addEventListener('click', () => {
        elements.mobileFilterToggle.classList.toggle('active');
        elements.filtersSidebar.classList.toggle('mobile-open');
    });
    
    // Filters (nested dropdown is set up in setupNestedDropdown)
    elements.typeSelect.addEventListener('change', handleFilterChange);
    elements.raritySelect.addEventListener('change', handleFilterChange);
    elements.searchInput.addEventListener('input', debounce(handleFilterChange, 300));
    elements.clearFilters.addEventListener('click', clearFilters);
    elements.refreshCache.addEventListener('click', () => {
        if (confirm('This will re-download all card data. Continue?')) {
            clearCacheAndReload();
        }
    });
    
    // Owned filter (dropdown)
    elements.ownedSelect.addEventListener('change', () => {
        state.filters.owned = elements.ownedSelect.value;
        state.binderPage = 1; // Reset to first page
        renderCollection();
    });
    
    // View toggle buttons (grid/list/binder)
    elements.viewToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.viewMode;
            state.collectionViewMode = mode;
            state.binderPage = 1; // Reset to first page
            
            // Update active button
            elements.viewToggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show/hide binder options
            elements.binderOptions.style.display = mode === 'binder' ? 'flex' : 'none';
            
            // Re-render to adjust for view-specific changes
            renderCollection();
        });
    });
    
    // Binder size dropdown
    elements.binderSizeSelect.addEventListener('change', () => {
        const value = elements.binderSizeSelect.value;
        if (value === 'custom') {
            elements.binderCustomSize.style.display = 'block';
            state.binderSize = parseInt(elements.binderCustomSize.value) || 9;
        } else {
            elements.binderCustomSize.style.display = 'none';
            state.binderSize = parseInt(value);
        }
        state.binderPage = 1;
        renderCollection();
    });
    
    // Binder custom size input
    elements.binderCustomSize.addEventListener('change', () => {
        const value = parseInt(elements.binderCustomSize.value);
        if (value >= 1 && value <= 36) {
            state.binderSize = value;
            state.binderPage = 1;
            renderCollection();
        }
    });
    
    // Binder pagination
    elements.binderPrev.addEventListener('click', () => {
        if (state.binderPage > 1) {
            state.binderPage--;
            renderCollection();
        }
    });
    
    elements.binderNext.addEventListener('click', () => {
        if (state.binderPage < state.binderTotalPages) {
            state.binderPage++;
            renderCollection();
        }
    });
    
    // Modal
    document.querySelector('.modal-overlay').addEventListener('click', closeModal);
    document.querySelector('.modal-close').addEventListener('click', closeModal);
    
    // Save to collection button (variants)
    document.getElementById('save-to-collection').addEventListener('click', () => {
        saveCollectionWithVariants();
    });
    
    // Keyboard
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
        
        // Binder navigation with arrow keys
        if (state.currentView === 'collection' && state.collectionViewMode === 'binder') {
            if (e.key === 'ArrowLeft' && state.binderPage > 1) {
                state.binderPage--;
                renderCollection();
            } else if (e.key === 'ArrowRight' && state.binderPage < state.binderTotalPages) {
                state.binderPage++;
                renderCollection();
            }
        }
    });
}

// Switch view
function switchView(view) {
    state.currentView = view;
    
    elements.navBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });
    
    elements.views.forEach(v => {
        v.classList.toggle('active', v.id === `${view}-view`);
    });
    
    // Toggle full-width layout for stats view (hides sidebar)
    document.querySelector('.main').classList.toggle('full-width', view === 'profile');
    
    // Show/hide collection filter
    elements.collectionFilter.style.display = view === 'collection' ? 'block' : 'none';
    
    // Hide pagination in collection/stats view
    elements.pagination.style.display = view === 'browse' ? 'flex' : 'none';
    
    if (view === 'collection') {
        renderCollection();
    } else if (view === 'profile') {
        updateStats();
        const collectionIds = Object.keys(state.collection).filter(id => state.collection[id] > 0);
        if (collectionIds.length > 0) {
            updateCharts(collectionIds);
        }
    }
}

// Handle filter change
function handleFilterChange() {
    // state.filters.set is updated by nested dropdown
    state.filters.type = elements.typeSelect.value;
    state.filters.rarity = elements.raritySelect.value;
    state.filters.search = elements.searchInput.value;
    state.currentPage = 1;
    
    if (state.currentView === 'browse') {
        applyFiltersAndRender();
    } else if (state.currentView === 'collection') {
        renderCollection();
    }
}

// Clear filters
function clearFilters() {
    // Reset nested dropdown
    elements.dropdownLabel.textContent = 'All Sets';
    state.filters.set = '';
    
    elements.typeSelect.value = '';
    elements.raritySelect.value = '';
    elements.searchInput.value = '';
    state.filters = { set: '', type: '', rarity: '', search: '', owned: 'all' };
    state.currentPage = 1;
    
    // Reset owned filter radio
    document.querySelector('input[name="owned-filter"][value="all"]').checked = true;
    
    if (state.currentView === 'browse') {
        applyFiltersAndRender();
    } else if (state.currentView === 'collection') {
        renderCollection();
    }
}

// Clear cache and reload (for manual refresh)
async function clearCacheAndReload() {
    await clearCache();
    location.reload();
}

// Debounce helper
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Start the app
init();
