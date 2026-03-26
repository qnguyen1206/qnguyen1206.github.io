// Event Listeners and Handlers

import { state, elements } from './state.js';
import { applyFiltersAndRender, renderCollection, closeModal, saveCollectionWithVariants, populateSetsDropdown, showLoading } from './ui.js';
import { updateStats, renderValueHistoryChart, updateCharts } from './stats.js';
import { initDB, clearCache, loadCollectionFromDB, loadValueHistoryFromDB } from './db.js';
import { loadAllCards, loadSets } from './api.js';

// Setup all event listeners
export function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            switchView(btn.dataset.view);
        });
    });
    
    // Mobile filter toggle
    if (elements.mobileFilterToggle && elements.filtersSidebar) {
        elements.mobileFilterToggle.addEventListener('click', () => {
            elements.mobileFilterToggle.classList.toggle('active');
            elements.filtersSidebar.classList.toggle('mobile-open');
            const isExpanded = elements.filtersSidebar.classList.contains('mobile-open');
            const toggleIcon = elements.mobileFilterToggle.querySelector('.filter-toggle-arrow');
            if (toggleIcon) toggleIcon.textContent = isExpanded ? '▲' : '▼';
        });
    }
    
    // Filter changes
    if (elements.typeSelect) elements.typeSelect.addEventListener('change', handleFilterChange);
    if (elements.raritySelect) elements.raritySelect.addEventListener('change', handleFilterChange);
    if (elements.searchInput) elements.searchInput.addEventListener('input', debounce(handleFilterChange, 300));
    
    // Collection owned filter
    if (elements.ownedSelect) {
        elements.ownedSelect.addEventListener('change', () => {
            state.filters.owned = elements.ownedSelect.value;
            state.binderPage = 1; // Reset to first page
            renderCollection();
        });
    }
    
    // Clear filters
    if (elements.clearFilters) elements.clearFilters.addEventListener('click', clearFilters);
    
    // Clear cache / Refresh
    if (elements.refreshCache) elements.refreshCache.addEventListener('click', clearCacheAndReload);
    
    // Modal controls
    const modalClose = document.querySelector('.modal-close');
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (elements.modal) {
        elements.modal.addEventListener('click', (e) => {
            if (e.target === elements.modal) closeModal();
        });
    }
    
    // Save collection button in modal
    const saveBtn = document.getElementById('save-to-collection');
    if (saveBtn) saveBtn.addEventListener('click', saveCollectionWithVariants);
    
    // View mode buttons
    document.querySelectorAll('.view-toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.viewMode;
            setViewMode(mode);
        });
    });
    
    // Binder size select
    if (elements.binderSizeSelect) {
        elements.binderSizeSelect.addEventListener('change', (e) => {
            state.binderSize = parseInt(e.target.value);
            state.binderPage = 1;
            renderCollection();
        });
    }
    
    // Master Set toggle
    const masterSetToggle = document.getElementById('master-set-toggle');
    if (masterSetToggle) {
        masterSetToggle.addEventListener('change', (e) => {
            state.masterSetMode = e.target.checked;
            state.binderPage = 1; // Reset to first page
            renderCollection();
        });
    }
    
    // Binder pagination
    if (elements.binderPrev) {
        elements.binderPrev.addEventListener('click', () => {
            if (state.binderPage > 1) {
                state.binderPage--;
                renderCollection();
            }
        });
    }
    
    if (elements.binderNext) {
        elements.binderNext.addEventListener('click', () => {
            if (state.binderPage < state.binderTotalPages) {
                state.binderPage++;
                renderCollection();
            }
        });
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elements.modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// Set view mode
export function setViewMode(mode) {
    state.collectionViewMode = mode;
    state.binderPage = 1;
    
    // Reset master set mode when leaving binder view
    if (mode !== 'binder') {
        state.masterSetMode = false;
        const masterSetToggle = document.getElementById('master-set-toggle');
        if (masterSetToggle) masterSetToggle.checked = false;
    }
    
    // Update active button
    document.querySelectorAll('.view-toggle-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.viewMode === mode);
    });
    
    // Show/hide binder options
    const binderOptions = document.querySelector('.binder-options');
    if (binderOptions) {
        binderOptions.style.display = mode === 'binder' ? 'flex' : 'none';
    }
    
    renderCollection();
}

// Switch between views
export function switchView(view) {
    state.currentView = view;
    
    // Update navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });
    
    // Show/hide collection filter
    if (elements.collectionFilter) {
        elements.collectionFilter.style.display = (view === 'collection') ? 'block' : 'none';
    }
    
    // Update visible sections
    document.querySelectorAll('.view').forEach(section => {
        section.classList.toggle('active', section.id === `${view}-view`);
    });
    
    // Trigger section-specific render
    if (view === 'browse') {
        applyFiltersAndRender();
    } else if (view === 'collection') {
        renderCollection();
    } else if (view === 'profile') {
        updateStats();
        updateCharts();
        renderValueHistoryChart();
    }
}

// Handle filter changes
export function handleFilterChange() {
    state.filters.type = elements.typeSelect ? elements.typeSelect.value : '';
    state.filters.rarity = elements.raritySelect ? elements.raritySelect.value : '';
    state.filters.search = elements.searchInput ? elements.searchInput.value : '';
    state.currentPage = 1;
    state.binderPage = 1; // Also reset binder page
    
    if (state.currentView === 'browse') {
        applyFiltersAndRender();
    } else if (state.currentView === 'collection') {
        renderCollection();
    }
}

// Clear all filters
export function clearFilters() {
    if (elements.typeSelect) elements.typeSelect.value = '';
    if (elements.raritySelect) elements.raritySelect.value = '';
    if (elements.searchInput) elements.searchInput.value = '';
    if (elements.dropdownLabel) elements.dropdownLabel.textContent = 'All Sets';
    
    if (elements.ownedSelect) {
        elements.ownedSelect.value = 'owned';
    }
    
    state.filters = {
        set: '',
        type: '',
        rarity: '',
        search: '',
        owned: 'owned'
    };
    state.currentPage = 1;
    state.binderPage = 1;
    
    if (state.currentView === 'browse') {
        applyFiltersAndRender();
    } else if (state.currentView === 'collection') {
        renderCollection();
    }
}

// Clear cache and reload
export async function clearCacheAndReload() {
    if (confirm('This will clear the card cache and reload all data. Continue?')) {
        await clearCache();
        location.reload();
    }
}

// Debounce utility
export function debounce(func, wait) {
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

// Initialize the app
export async function init() {
    // Show loading state
    showLoading(elements.browseGrid);
    
    // Initialize IndexedDB first!
    await initDB();
    
    // Load collection from IndexedDB
    await loadCollectionFromDB();
    await loadValueHistoryFromDB();
    
    // Load sets for dropdown
    await loadSets();
    populateSetsDropdown();
    
    // Load all cards (from cache or API)
    await loadAllCards();
    
    // Initial render
    applyFiltersAndRender();
    updateStats();
}
