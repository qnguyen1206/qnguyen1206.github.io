// Database Operations (IndexedDB)
// Handles caching cards/sets and storing collection/value history

import { CACHE_DB_NAME, CACHE_DB_VERSION, CACHE_EXPIRY_DAYS, CATALOG_CACHE_VERSION } from './config.js';
import { state } from './state.js';

// IndexedDB instance
let db = null;

const COLLECTION_UPDATED_AT_KEY = 'collectionUpdatedAt';
const LAST_SERVER_UPDATE_KEY = 'lastServerUpdate';
const CARDS_CACHE_TIMESTAMP_KEY = 'cardsCacheTimestamp';
const SETS_CACHE_TIMESTAMP_KEY = 'setsCacheTimestamp';
const CARDS_CACHE_VERSION_KEY = 'cardsCatalogCacheVersion';
const SETS_CACHE_VERSION_KEY = 'setsCatalogCacheVersion';

function readLocalStorageNumber(key) {
    const value = Number(localStorage.getItem(key) || 0);
    return Number.isFinite(value) ? value : 0;
}

function hasCollectionEntries() {
    return Object.keys(state.collection).length > 0;
}

function loadCollectionMetadataFromLocalStorage() {
    state.collectionUpdatedAt = readLocalStorageNumber(COLLECTION_UPDATED_AT_KEY);
    state.lastServerUpdate = readLocalStorageNumber(LAST_SERVER_UPDATE_KEY);
    
    // Legacy collections did not persist timestamps; treat them as local data to protect them.
    if (!state.collectionUpdatedAt && hasCollectionEntries()) {
        state.collectionUpdatedAt = Date.now();
    }
}

// Get database instance (for other modules)
export function getDB() {
    return db;
}

// Initialize IndexedDB
export function initDB() {
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

function isFreshCacheTimestamp(timestamp) {
    if (!timestamp) return false;

    const now = Date.now();
    const expiryTime = CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    return (now - timestamp) < expiryTime;
}

// Check if cache is valid
export async function isCacheValid(cacheType = 'cards') {
    if (!db) return false;
    
    return new Promise((resolve) => {
        try {
            const transaction = db.transaction(['metadata'], 'readonly');
            const store = transaction.objectStore('metadata');
            const timestampKey = cacheType === 'sets' ? SETS_CACHE_TIMESTAMP_KEY : CARDS_CACHE_TIMESTAMP_KEY;
            const versionKey = cacheType === 'sets' ? SETS_CACHE_VERSION_KEY : CARDS_CACHE_VERSION_KEY;
            const timestampRequest = store.get(timestampKey);
            const versionRequest = store.get(versionKey);
            
            transaction.oncomplete = () => {
                const timestamp = timestampRequest.result?.value;
                const version = versionRequest.result?.value;

                if (!isFreshCacheTimestamp(timestamp) || version !== CATALOG_CACHE_VERSION) {
                    resolve(false);
                    return;
                }

                const now = Date.now();
                const daysAgo = Math.floor((now - timestamp) / (24 * 60 * 60 * 1000));
                console.log(`${cacheType} cache is valid (${daysAgo} days old)`);
                resolve(true);
            };
            
            transaction.onerror = () => resolve(false);
        } catch (e) {
            resolve(false);
        }
    });
}

// Get cached cards
export async function getCachedCards() {
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
export async function getCachedSets() {
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
export async function saveCardsToCache(cards) {
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
            metaStore.put({ key: CARDS_CACHE_TIMESTAMP_KEY, value: Date.now() });
            metaStore.put({ key: CARDS_CACHE_VERSION_KEY, value: CATALOG_CACHE_VERSION });
            
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
export async function saveSetsToCache(sets) {
    if (!db) return;
    
    return new Promise((resolve) => {
        try {
            const transaction = db.transaction(['sets', 'metadata'], 'readwrite');
            const store = transaction.objectStore('sets');
            const metaStore = transaction.objectStore('metadata');
            
            // Clear existing sets
            store.clear();
            
            // Add all sets
            sets.forEach(set => {
                store.put(set);
            });

            metaStore.put({ key: SETS_CACHE_TIMESTAMP_KEY, value: Date.now() });
            metaStore.put({ key: SETS_CACHE_VERSION_KEY, value: CATALOG_CACHE_VERSION });
            
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
export async function clearCache() {
    if (!db) return;
    
    return new Promise((resolve) => {
        try {
            const transaction = db.transaction(['cards', 'sets', 'metadata'], 'readwrite');
            transaction.objectStore('cards').clear();
            transaction.objectStore('sets').clear();
            transaction.objectStore('metadata').delete(CARDS_CACHE_TIMESTAMP_KEY);
            transaction.objectStore('metadata').delete(SETS_CACHE_TIMESTAMP_KEY);
            transaction.objectStore('metadata').delete(CARDS_CACHE_VERSION_KEY);
            transaction.objectStore('metadata').delete(SETS_CACHE_VERSION_KEY);
            
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
export async function loadCollectionFromDB() {
    if (!db) {
        // Fallback to localStorage if IndexedDB not available
        state.collection = JSON.parse(localStorage.getItem('pokemon-collection')) || {};
        loadCollectionMetadataFromLocalStorage();
        return;
    }
    
    return new Promise((resolve) => {
        try {
            const transaction = db.transaction(['collection', 'metadata'], 'readonly');
            const collectionStore = transaction.objectStore('collection');
            const metadataStore = transaction.objectStore('metadata');
            const request = collectionStore.getAll();
            const updatedAtRequest = metadataStore.get(COLLECTION_UPDATED_AT_KEY);
            const lastServerRequest = metadataStore.get(LAST_SERVER_UPDATE_KEY);
            
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
                        loadCollectionMetadataFromLocalStorage();
                        console.log('Migrating collection from localStorage to IndexedDB...');
                        saveCollectionToDB({ markLocalChange: false }).then(() => {
                            // Clear localStorage after successful migration
                            localStorage.removeItem('pokemon-collection');
                            localStorage.removeItem(COLLECTION_UPDATED_AT_KEY);
                            localStorage.removeItem(LAST_SERVER_UPDATE_KEY);
                            console.log('Collection migrated to IndexedDB');
                        });
                    }
                }
            };
            
            transaction.oncomplete = () => {
                if (updatedAtRequest.result) {
                    state.collectionUpdatedAt = Number(updatedAtRequest.result.value) || 0;
                } else if (hasCollectionEntries()) {
                    state.collectionUpdatedAt = Date.now();
                } else {
                    state.collectionUpdatedAt = 0;
                }
                
                state.lastServerUpdate = lastServerRequest.result
                    ? (Number(lastServerRequest.result.value) || 0)
                    : 0;
                
                resolve();
            };
            
            request.onerror = () => {
                state.collection = JSON.parse(localStorage.getItem('pokemon-collection')) || {};
                loadCollectionMetadataFromLocalStorage();
                resolve();
            };
            
            transaction.onerror = () => {
                state.collection = JSON.parse(localStorage.getItem('pokemon-collection')) || {};
                loadCollectionMetadataFromLocalStorage();
                resolve();
            };
        } catch (e) {
            state.collection = JSON.parse(localStorage.getItem('pokemon-collection')) || {};
            loadCollectionMetadataFromLocalStorage();
            resolve();
        }
    });
}

// Save collection to IndexedDB
export async function saveCollectionToDB(options = {}) {
    const { markLocalChange = true } = options;
    
    if (markLocalChange) {
        state.collectionUpdatedAt = Date.now();
    }
    
    if (!db) {
        // Fallback to localStorage
        localStorage.setItem('pokemon-collection', JSON.stringify(state.collection));
        localStorage.setItem(COLLECTION_UPDATED_AT_KEY, String(state.collectionUpdatedAt || 0));
        localStorage.setItem(LAST_SERVER_UPDATE_KEY, String(state.lastServerUpdate || 0));
        return;
    }
    
    return new Promise((resolve) => {
        try {
            const transaction = db.transaction(['collection', 'metadata'], 'readwrite');
            const store = transaction.objectStore('collection');
            const metadataStore = transaction.objectStore('metadata');
            
            // Clear existing collection
            store.clear();
            
            // Add all collection items
            Object.entries(state.collection).forEach(([cardId, variants]) => {
                store.put({ cardId, variants });
            });
            
            metadataStore.put({ key: COLLECTION_UPDATED_AT_KEY, value: state.collectionUpdatedAt || 0 });
            metadataStore.put({ key: LAST_SERVER_UPDATE_KEY, value: state.lastServerUpdate || 0 });
            
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => resolve();
        } catch (e) {
            // Fallback to localStorage
            localStorage.setItem('pokemon-collection', JSON.stringify(state.collection));
            localStorage.setItem(COLLECTION_UPDATED_AT_KEY, String(state.collectionUpdatedAt || 0));
            localStorage.setItem(LAST_SERVER_UPDATE_KEY, String(state.lastServerUpdate || 0));
            resolve();
        }
    });
}

// Load value history from IndexedDB (with localStorage migration)
export async function loadValueHistoryFromDB() {
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
export async function saveValueHistoryToDB() {
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
