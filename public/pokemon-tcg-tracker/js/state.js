// Application State Management

// State object - central store for app data
export const state = {
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

// DOM Elements - cached for performance
export const elements = {
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

// Get total quantity for a card (across all variants)
// Placed here to avoid circular dependencies between collection.js and stats.js
export function getCardTotalQty(cardId) {
    const cardData = state.collection[cardId];
    if (!cardData) return 0;
    if (typeof cardData === 'number') return cardData; // Legacy support
    return Object.values(cardData).reduce((sum, qty) => sum + qty, 0);
}
