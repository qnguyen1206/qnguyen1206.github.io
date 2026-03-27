// Configuration and Constants
// Pokemon TCG Tracker App

export const API_BASE = 'https://api.pokemontcg.io/v2';
export const CARDS_PER_PAGE = 20;
export const CACHE_DB_NAME = 'pokemon-tcg-db';
export const CACHE_DB_VERSION = 2;
export const CACHE_EXPIRY_DAYS = 7;
export const CATALOG_CACHE_VERSION = 'tcgtracking-v3';

// API Key (not needed since we use pre-built JSON)
export const API_KEY = import.meta.env.VITE_POKEMON_TCG_API_KEY || '';

// Firebase Configuration for Cloud Sync
// Values loaded from environment variables at build time
export const FIREBASE_CONFIG = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

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
export const VARIANT_ORDER = ['normal', 'holofoil', 'reverseHolofoil', '1stEditionHolofoil', '1stEditionNormal', 'unlimited', 'unlimitedHolofoil'];

export const VARIANT_MAP = {
    'normal': { name: 'Normal', color: '#6b7280' },
    'holofoil': { name: 'Holofoil', color: '#f59e0b' },
    'reverseHolofoil': { name: 'Reverse Holo', color: '#8b5cf6' },
    '1stEditionHolofoil': { name: '1st Ed. Holo', color: '#ef4444' },
    '1stEditionNormal': { name: '1st Edition', color: '#3b82f6' },
    'unlimited': { name: 'Unlimited', color: '#14b8a6' },
    'unlimitedHolofoil': { name: 'Unlimited Holo', color: '#10b981' }
};

function getVariantSortOrder(variantId) {
    const index = VARIANT_ORDER.indexOf(variantId);
    return index === -1 ? 10000 : index * 100;
}

function normalizeVariantToken(value) {
    return String(value || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();
}

function getVariantPatternId(variant) {
    const haystack = [
        variant?.printLabel,
        variant?.id,
        variant?.name
    ]
        .map(normalizeVariantToken)
        .filter(Boolean)
        .join(' ');

    if (haystack.includes('master ball')) {
        return 'master-ball';
    }

    if (haystack.includes('poke ball')) {
        return 'poke-ball';
    }

    if (haystack.includes('energy symbol')) {
        return 'energy-symbol';
    }

    return '';
}

function getVariantBaseId(variant) {
    return variant?.sourceVariant || variant?.id || 'normal';
}

function toTitleCaseWords(value) {
    return String(value || '')
        .split(/\s+/)
        .filter(Boolean)
        .map(word => word[0].toUpperCase() + word.slice(1))
        .join(' ');
}

function buildDynamicVariantName(printLabel, sourceVariant) {
    const sourceName = VARIANT_MAP[sourceVariant]?.name || '';
    if (printLabel && sourceName) {
        return `${sourceName} ${printLabel}`.trim();
    }

    return printLabel || sourceName || '';
}

function splitDynamicVariantId(variantId) {
    const rawVariantId = String(variantId || '');
    const lowercaseVariantId = rawVariantId.toLowerCase();
    const knownSuffixes = [
        ['1steditionholofoil', '1stEditionHolofoil'],
        ['1steditionnormal', '1stEditionNormal'],
        ['unlimitedholofoil', 'unlimitedHolofoil'],
        ['reverseholofoil', 'reverseHolofoil'],
        ['holofoil', 'holofoil'],
        ['unlimited', 'unlimited'],
        ['normal', 'normal'],
        ['1stedition', '1stEditionNormal']
    ];
    const matchedSuffix = knownSuffixes.find(([suffix]) => lowercaseVariantId.endsWith(suffix));
    const matchedBaseId = matchedSuffix?.[1];
    if (!matchedBaseId) {
        return null;
    }

    const suffixLength = matchedSuffix[0].length;
    const prefix = rawVariantId.slice(0, rawVariantId.length - suffixLength);
    if (!prefix) {
        return {
            sourceVariant: matchedBaseId,
            printLabel: ''
        };
    }

    const printLabel = prefix
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .replace(/\bPokeball\b/gi, 'Poke Ball')
        .replace(/\bMasterball\b/gi, 'Master Ball')
        .replace(/\bRev\b/gi, 'Rev')
        .trim();

    return {
        sourceVariant: matchedBaseId,
        printLabel: toTitleCaseWords(printLabel)
    };
}

function inferDynamicVariantDefinition(variantId, variant, price) {
    const parsed = splitDynamicVariantId(variantId);
    if (!parsed) {
        return null;
    }

    const variantName = buildDynamicVariantName(parsed.printLabel, parsed.sourceVariant);

    return {
        id: variantId,
        name: variantName || variantId,
        color: variant?.color || getSpecialPrintColor(parsed.printLabel),
        sourceVariant: parsed.sourceVariant,
        printLabel: parsed.printLabel,
        sortOrder: getVariantSortOrder(parsed.sourceVariant) + 10,
        url: variant?.tcgplayerUrl || variant?.url || '',
        price
    };
}

function getDynamicVariantEntries(card, priceMap) {
    const explicitDefinitions = Array.isArray(card?.tcgtracking?.variantDefinitions)
        ? card.tcgtracking.variantDefinitions
        : [];

    const explicitMap = new Map(explicitDefinitions.map(definition => [definition.id, definition]));
    const entries = [];

    explicitDefinitions.forEach(definition => {
        const price = priceMap[definition.id];
        if (!price) {
            return;
        }

        entries.push({
            id: definition.id,
            name: buildDynamicVariantName(
                definition.printLabel || definition.name || '',
                definition.sourceVariant || ''
            ) || definition.id,
            color: definition.color || '#94a3b8',
            price,
            url: definition.tcgplayerUrl || '',
            sourceVariant: definition.sourceVariant || '',
            printLabel: definition.printLabel || '',
            sortOrder: Number.isFinite(definition.sortOrder)
                ? definition.sortOrder
                : (getVariantSortOrder(definition.sourceVariant) + 50)
        });
    });

    Object.keys(priceMap).forEach(variantId => {
        if (VARIANT_MAP[variantId] || explicitMap.has(variantId)) {
            return;
        }

        const inferred = inferDynamicVariantDefinition(variantId, explicitMap.get(variantId), priceMap[variantId]);
        if (!inferred) {
            return;
        }

        if (!inferred.printLabel && priceMap[inferred.sourceVariant]) {
            return;
        }

        if (inferred) {
            entries.push(inferred);
        }
    });

    return entries;
}

function getVariantFill(baseId) {
    switch (baseId) {
    case 'holofoil':
        return 'linear-gradient(135deg, rgba(255,251,235,0.96) 0%, rgba(251,191,36,0.94) 48%, rgba(217,119,6,0.92) 100%)';
    case 'reverseHolofoil':
        return 'linear-gradient(135deg, rgba(224,231,255,0.98) 0%, rgba(168,85,247,0.9) 56%, rgba(59,130,246,0.84) 100%)';
    case '1stEditionHolofoil':
        return 'linear-gradient(135deg, rgba(254,242,242,0.98) 0%, rgba(239,68,68,0.92) 36%, rgba(251,191,36,0.9) 100%)';
    case '1stEditionNormal':
        return 'linear-gradient(135deg, rgba(219,234,254,0.96) 0%, rgba(96,165,250,0.88) 100%)';
    case 'unlimited':
        return 'linear-gradient(135deg, rgba(204,251,241,0.96) 0%, rgba(20,184,166,0.9) 100%)';
    case 'unlimitedHolofoil':
        return 'linear-gradient(135deg, rgba(236,253,245,0.98) 0%, rgba(16,185,129,0.92) 45%, rgba(251,191,36,0.78) 100%)';
    case 'normal':
    default:
        return 'linear-gradient(180deg, rgba(148,163,184,0.24) 0%, rgba(71,85,105,0.52) 100%)';
    }
}

function getVariantOverlay(baseId, patternId) {
    const overlays = [];

    switch (baseId) {
    case 'holofoil':
        overlays.push('linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.45) 45%, transparent 72%)');
        break;
    case 'reverseHolofoil':
        overlays.push('repeating-linear-gradient(45deg, rgba(255,255,255,0.32) 0 2px, transparent 2px 6px)');
        break;
    case '1stEditionHolofoil':
        overlays.push('repeating-linear-gradient(135deg, rgba(255,255,255,0.22) 0 2px, transparent 2px 6px)');
        overlays.push('linear-gradient(45deg, transparent 0 58%, rgba(255,255,255,0.24) 58% 68%, transparent 68% 100%)');
        break;
    case '1stEditionNormal':
        overlays.push('linear-gradient(45deg, transparent 0 58%, rgba(255,255,255,0.28) 58% 68%, transparent 68% 100%)');
        break;
    case 'unlimitedHolofoil':
        overlays.push('linear-gradient(90deg, rgba(255,255,255,0.24) 0%, transparent 38%, rgba(255,255,255,0.18) 76%, transparent 100%)');
        break;
    default:
        break;
    }

    switch (patternId) {
    case 'poke-ball':
        overlays.push('radial-gradient(circle at 28% 30%, rgba(255,255,255,0.96) 0 11%, rgba(239,68,68,0.96) 12% 24%, rgba(17,24,39,0.92) 25% 29%, transparent 30%)');
        overlays.push('radial-gradient(circle at 74% 72%, rgba(255,255,255,0.96) 0 11%, rgba(239,68,68,0.96) 12% 24%, rgba(17,24,39,0.92) 25% 29%, transparent 30%)');
        break;
    case 'master-ball':
        overlays.push('radial-gradient(circle at 28% 30%, rgba(255,255,255,0.96) 0 10%, rgba(76,29,149,0.96) 11% 22%, rgba(250,204,21,0.95) 23% 27%, transparent 28%)');
        overlays.push('radial-gradient(circle at 74% 72%, rgba(255,255,255,0.96) 0 10%, rgba(76,29,149,0.96) 11% 22%, rgba(250,204,21,0.95) 23% 27%, transparent 28%)');
        overlays.push('linear-gradient(45deg, transparent 0 43%, rgba(250,204,21,0.9) 43% 46%, transparent 46% 54%, rgba(250,204,21,0.9) 54% 57%, transparent 57% 100%)');
        overlays.push('linear-gradient(-45deg, transparent 0 43%, rgba(250,204,21,0.9) 43% 46%, transparent 46% 54%, rgba(250,204,21,0.9) 54% 57%, transparent 57% 100%)');
        break;
    case 'energy-symbol':
        overlays.push('linear-gradient(45deg, transparent 0 35%, rgba(255,255,255,0.3) 35% 65%, transparent 65% 100%)');
        overlays.push('linear-gradient(-45deg, transparent 0 35%, rgba(255,255,255,0.3) 35% 65%, transparent 65% 100%)');
        break;
    default:
        break;
    }

    return overlays.join(', ') || 'none';
}

function getVariantShell(baseId, patternId) {
    if (patternId === 'master-ball') {
        return 'linear-gradient(180deg, rgba(91,33,182,0.24) 0%, rgba(30,27,75,0.58) 100%)';
    }

    if (patternId === 'poke-ball') {
        return 'linear-gradient(180deg, rgba(239,68,68,0.24) 0%, rgba(69,10,10,0.52) 100%)';
    }

    switch (baseId) {
    case 'holofoil':
        return 'linear-gradient(180deg, rgba(245,158,11,0.22) 0%, rgba(120,53,15,0.48) 100%)';
    case 'reverseHolofoil':
        return 'linear-gradient(180deg, rgba(139,92,246,0.22) 0%, rgba(30,41,59,0.56) 100%)';
    case '1stEditionHolofoil':
        return 'linear-gradient(180deg, rgba(239,68,68,0.22) 0%, rgba(120,53,15,0.5) 100%)';
    case '1stEditionNormal':
        return 'linear-gradient(180deg, rgba(59,130,246,0.22) 0%, rgba(30,64,175,0.5) 100%)';
    case 'unlimited':
    case 'unlimitedHolofoil':
        return 'linear-gradient(180deg, rgba(20,184,166,0.22) 0%, rgba(15,118,110,0.5) 100%)';
    case 'normal':
    default:
        return 'linear-gradient(180deg, rgba(148,163,184,0.15) 0%, rgba(15,23,42,0.5) 100%)';
    }
}

function getVariantCheckColor(baseId, patternId) {
    if (patternId === 'master-ball' || patternId === 'energy-symbol') {
        return '#0f172a';
    }

    switch (baseId) {
    case 'holofoil':
    case 'unlimitedHolofoil':
        return '#111827';
    default:
        return '#ffffff';
    }
}

function buildVariantVisualStyle(variant) {
    const baseId = getVariantBaseId(variant);
    const patternId = getVariantPatternId(variant);

    return [
        `--variant-color: ${variant.color || '#94a3b8'}`,
        `--variant-shell: ${getVariantShell(baseId, patternId)}`,
        `--variant-fill: ${getVariantFill(baseId)}`,
        `--variant-overlay: ${getVariantOverlay(baseId, patternId)}`,
        `--variant-border: ${variant.color || '#94a3b8'}`,
        `--variant-check-color: ${getVariantCheckColor(baseId, patternId)}`
    ].join('; ');
}

// Get available variants for a card based on tcgplayer.prices
export function getCardVariants(card) {
    const variants = [];
    const priceMap = card?.tcgplayer?.prices || {};
    
    if (card.tcgplayer && card.tcgplayer.prices) {
        const priceKeys = Object.keys(card.tcgplayer.prices);
        // Sort by defined order
        VARIANT_ORDER.forEach((key, index) => {
            if (priceKeys.includes(key) && VARIANT_MAP[key]) {
                variants.push({
                    id: key,
                    name: VARIANT_MAP[key].name,
                    color: VARIANT_MAP[key].color,
                    price: card.tcgplayer.prices[key],
                    sourceVariant: key,
                    sortOrder: index * 100
                });
            }
        });
    }

    getDynamicVariantEntries(card, priceMap).forEach(definition => {
        variants.push({
            id: definition.id,
            name: definition.name || definition.id,
            color: definition.color || '#94a3b8',
            price: definition.price,
            url: definition.url || definition.tcgplayerUrl || '',
            sourceVariant: definition.sourceVariant || '',
            printLabel: definition.printLabel || '',
            sortOrder: Number.isFinite(definition.sortOrder)
                ? definition.sortOrder
                : (getVariantSortOrder(definition.sourceVariant) + 50)
        });
    });

    variants.sort((a, b) => {
        const sortA = Number.isFinite(a.sortOrder) ? a.sortOrder : 10000;
        const sortB = Number.isFinite(b.sortOrder) ? b.sortOrder : 10000;
        if (sortA !== sortB) {
            return sortA - sortB;
        }
        return a.name.localeCompare(b.name);
    });
    
    // If no TCGPlayer data, default to just 'normal'
    if (variants.length === 0) {
        variants.push({
            id: 'normal',
            name: 'Normal',
            color: '#6b7280',
            price: null,
            sourceVariant: 'normal',
            sortOrder: 0
        });
    }

    return variants.map(variant => ({
        ...variant,
        visualStyle: buildVariantVisualStyle(variant)
    }));
}

// Render variant legend
export function renderVariantLegend() {
    const legendHTML = VARIANT_ORDER.map(id => {
        const variant = VARIANT_MAP[id];
        return `
            <div class="legend-item">
                <span class="variant-check legend-check" style="${buildVariantVisualStyle({ id, color: variant.color, sourceVariant: id })}" aria-hidden="true">
                    <span class="variant-checkmark"></span>
                </span>
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

export function renderVariantLegendForCards(cards = []) {
    const legendMap = new Map();

    cards.forEach(card => {
        getCardVariants(card).forEach(variant => {
            if (!legendMap.has(variant.id)) {
                legendMap.set(variant.id, variant);
            }
        });
    });

    const legendVariants = legendMap.size > 0
        ? [...legendMap.values()].sort((a, b) => {
            const sortA = Number.isFinite(a.sortOrder) ? a.sortOrder : 10000;
            const sortB = Number.isFinite(b.sortOrder) ? b.sortOrder : 10000;
            if (sortA !== sortB) {
                return sortA - sortB;
            }
            return a.name.localeCompare(b.name);
        })
        : VARIANT_ORDER.map(id => ({
            id,
            ...VARIANT_MAP[id],
            sourceVariant: id,
            sortOrder: getVariantSortOrder(id)
        }));

    const legendHTML = legendVariants.map(variant => `
        <div class="legend-item">
            <span class="variant-check legend-check" style="${variant.visualStyle || buildVariantVisualStyle(variant)}" aria-hidden="true">
                <span class="variant-checkmark"></span>
            </span>
            <span class="legend-name">${variant.name}</span>
        </div>
    `).join('');

    return `
        <div class="variant-legend">
            <span class="legend-title">Variants:</span>
            ${legendHTML}
        </div>
    `;
}
