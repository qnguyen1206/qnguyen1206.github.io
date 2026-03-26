// Collection Management Functions

import { state, getCardTotalQty } from './state.js';
import { saveCollectionToDB } from './db.js';
import { updateStats } from './stats.js';

// Re-export getCardTotalQty for backward compatibility
export { getCardTotalQty };

// Sync card UI across browse and collection grids
export function syncCardUI(cardId) {
    const totalQty = getCardTotalQty(cardId);
    const cardData = state.collection[cardId] || {};
    
    // Update all instances of this card in both grids
    document.querySelectorAll(`.card-item[data-id="${cardId}"]`).forEach(cardEl => {
        // Check if this is a master set card (has a specific variant assigned)
        const isMasterSetCard = cardEl.classList.contains('master-set-card');
        const cardVariantId = cardEl.dataset.variant;
        
        if (isMasterSetCard && cardVariantId) {
            // Master set mode: check only the specific variant for this card
            const variantQty = typeof cardData === 'object' ? (cardData[cardVariantId] || 0) : 0;
            cardEl.classList.toggle('not-owned', variantQty <= 0);
            
            // Update badge for this specific variant
            let badge = cardEl.querySelector('.owned-badge');
            if (variantQty > 0) {
                if (badge) {
                    badge.textContent = `×${variantQty}`;
                } else {
                    cardEl.insertAdjacentHTML('afterbegin', `<span class="owned-badge">×${variantQty}</span>`);
                }
            } else if (badge) {
                badge.remove();
            }
        } else {
            // Normal mode: use total quantity across all variants
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

// Setup variant checkbox handlers for a container
export function setupVariantCheckboxes(container) {
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
