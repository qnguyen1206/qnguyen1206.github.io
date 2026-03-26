// Configuration and Constants
// Pokemon TCG Tracker App

export const API_BASE = 'https://api.pokemontcg.io/v2';
export const CARDS_PER_PAGE = 20;
export const CACHE_DB_NAME = 'pokemon-tcg-db';
export const CACHE_DB_VERSION = 2;
export const CACHE_EXPIRY_DAYS = 7;

// API Key (optional - only needed if falling back to API instead of pre-built JSON)
// Get one free at https://dev.pokemontcg.io/
// Without key: 1000 requests/day, With key: 20,000 requests/day
export const API_KEY = '';

// Fetch options for API calls
export function getFetchOptions() {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    };
    
    // Add API key if provided
    if (API_KEY) {
        options.headers['X-Api-Key'] = API_KEY;
    }
    
    return options;
}

// Card variants configuration - maps TCGPlayer price keys to display info
// Order matters for display
export const VARIANT_ORDER = ['normal', 'holofoil', 'reverseHolofoil', '1stEditionHolofoil', '1stEditionNormal', 'unlimitedHolofoil'];

export const VARIANT_MAP = {
    'normal': { name: 'Normal', color: '#6b7280' },
    'holofoil': { name: 'Holofoil', color: '#f59e0b' },
    'reverseHolofoil': { name: 'Reverse Holo', color: '#8b5cf6' },
    '1stEditionHolofoil': { name: '1st Ed. Holo', color: '#ef4444' },
    '1stEditionNormal': { name: '1st Edition', color: '#3b82f6' },
    'unlimitedHolofoil': { name: 'Unlimited Holo', color: '#10b981' }
};

// Get available variants for a card based on tcgplayer.prices
export function getCardVariants(card) {
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
export function renderVariantLegend() {
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
