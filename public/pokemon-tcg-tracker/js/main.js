// Main App Entry Point - Pokemon TCG Tracker

import { setupEventListeners, init } from './events.js';

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    init();
});
