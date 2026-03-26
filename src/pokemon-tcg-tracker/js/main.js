// Main App Entry Point - Pokemon TCG Tracker

import { setupEventListeners, init } from './events.js';
import { setupSyncModal, openSyncModal } from './sync.js';

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    init();
    
    // Initialize sync functionality
    setupSyncModal();
    
    // Sync button in header
    document.getElementById('open-sync-modal')?.addEventListener('click', openSyncModal);
});
