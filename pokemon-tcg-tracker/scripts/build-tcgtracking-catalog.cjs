/**
 * Build a normalized app catalog from the local TCGTracking dump.
 *
 * This keeps the existing frontend schema stable while replacing the upstream
 * set/product/pricing source with TCGTracking data where available.
 *
 * Usage: node pokemon-tcg-tracker/scripts/build-tcgtracking-catalog.cjs
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const TCGTRACKING_DIR = path.join(DATA_DIR, 'tcgtracking');

const LEGACY_CARDS_PATH = path.join(DATA_DIR, 'cards.json');
const LEGACY_SETS_PATH = path.join(DATA_DIR, 'sets.json');
const TCGTRACKING_SETS_PATH = path.join(TCGTRACKING_DIR, 'sets.json');

const OUTPUT_CARDS_PATH = path.join(DATA_DIR, 'cards.tcgtracking.json');
const OUTPUT_SETS_PATH = path.join(DATA_DIR, 'sets.tcgtracking.json');
const OUTPUT_REPORT_PATH = path.join(DATA_DIR, 'tcgtracking-report.json');

const VARIANT_NAME_MAP = new Map([
    ['Normal', 'normal'],
    ['Holofoil', 'holofoil'],
    ['Reverse Holofoil', 'reverseHolofoil'],
    ['1st Edition', '1stEditionNormal'],
    ['1st Edition Holofoil', '1stEditionHolofoil'],
    ['Unlimited', 'unlimited'],
    ['Unlimited Holofoil', 'unlimitedHolofoil']
]);

const BASE_VARIANT_LABELS = {
    normal: 'Normal',
    holofoil: 'Holofoil',
    reverseHolofoil: 'Reverse Holo',
    '1stEditionHolofoil': '1st Ed. Holo',
    '1stEditionNormal': '1st Edition',
    unlimited: 'Unlimited',
    unlimitedHolofoil: 'Unlimited Holo'
};

const BASE_VARIANT_ORDER = ['normal', 'holofoil', 'reverseHolofoil', '1stEditionHolofoil', '1stEditionNormal', 'unlimited', 'unlimitedHolofoil'];

const SPECIAL_PRINT_COLOR_MAP = {
    'master ball pattern': '#7c3aed',
    'poke ball pattern': '#ef4444',
    'energy symbol pattern': '#f59e0b'
};

const SPECIAL_PRINT_COLOR_FALLBACKS = ['#7c3aed', '#ef4444', '#f59e0b', '#06b6d4', '#22c55e', '#fb7185'];

function readJson(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, data, pretty = false) {
    const content = pretty ? `${JSON.stringify(data, null, 2)}\n` : JSON.stringify(data);
    fs.writeFileSync(filePath, content);
}

function normalizeWhitespace(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
}

function normalizeText(value) {
    return normalizeWhitespace(value)
        .toLowerCase()
        .replace(/&/g, ' and ')
        .replace(/['\u2019]/g, '')
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();
}

function stripSetPrefix(value) {
    return normalizeWhitespace(value).replace(/^[A-Z0-9&/ .-]{2,12}:\s*/, '');
}

function stripBaseSetSuffix(value) {
    return normalizeWhitespace(value).replace(/\bBase Set\b/i, '').trim();
}

function getSetNameVariants(name) {
    const raw = normalizeWhitespace(name);
    const stripped = stripSetPrefix(raw);
    const withoutBase = stripBaseSetSuffix(stripped);
    const variants = new Set();

    [raw, stripped, withoutBase].forEach(value => {
        const normalized = normalizeText(value);
        if (normalized) {
            variants.add(normalized);
        }
    });

    return variants;
}

function formatAppDate(dateString) {
    return String(dateString || '').trim().slice(0, 10).replace(/-/g, '/');
}

function formatAppDateTime(dateString) {
    return String(dateString || '').trim().replace(/-/g, '/');
}

function normalizeLegacyDate(value) {
    return String(value || '').trim().slice(0, 10).replace(/\//g, '-');
}

function inferSeriesName(setName, abbreviation) {
    const value = `${setName || ''} ${abbreviation || ''}`.toLowerCase();

    if (value.includes('scarlet') || value.includes('violet') || value.includes('sv')) return 'Scarlet & Violet';
    if (value.includes('sword') || value.includes('shield') || value.includes('swsh')) return 'Sword & Shield';
    if (value.includes('sun') || value.includes('moon') || value.includes('sm')) return 'Sun & Moon';
    if (value.includes('mega evolution') || value.startsWith('me:') || value.includes(' me0')) return 'Mega Evolution';
    if (value.includes('black') || value.includes('white') || value.includes('bw')) return 'Black & White';
    if (value.includes('diamond') || value.includes('pearl') || value.includes('dp')) return 'Diamond & Pearl';
    if (value.includes('heartgold') || value.includes('soulsilver') || value.includes('hgss')) return 'HeartGold & SoulSilver';
    if (value.includes('platinum')) return 'Platinum';
    if (value.includes('xy')) return 'XY';
    if (value.includes('ex ')) return 'EX';
    if (value.includes('neo')) return 'Neo';
    if (value.includes('e-card') || value.includes('ecard')) return 'e-Card';
    if (value.includes('base')) return 'Base';
    if (value.includes('pop')) return 'POP';
    if (value.includes('promo')) return 'Promos';
    return 'Other';
}

function sanitizeNumberForId(value) {
    const normalized = normalizeWhitespace(value);
    return normalized.replace(/\//g, '_').replace(/[^A-Za-z0-9_-]/g, '');
}

function getCollectorKeys(value) {
    const raw = normalizeWhitespace(value);
    if (!raw) return [];

    const beforeSlash = raw.split('/')[0].trim();
    const compact = beforeSlash.replace(/\s+/g, '').toUpperCase();
    const noLeadingZeros = compact.replace(/^0+(?=\d)/, '');

    return [...new Set([compact, noLeadingZeros].filter(Boolean))];
}

function normalizeCardNumber(value, fallback = '') {
    const raw = normalizeWhitespace(value || fallback);
    if (!raw) return '';

    const beforeSlash = raw.split('/')[0].trim();
    if (/^\d+$/.test(beforeSlash)) {
        return String(Number(beforeSlash));
    }

    return beforeSlash;
}

function stripProductVariantSuffix(value) {
    return normalizeWhitespace(value).replace(/\s*\([^)]*\)\s*$/, '').trim();
}

function isAlternateVariantProduct(product) {
    return /\s*\([^)]*\)\s*$/.test(normalizeWhitespace(product?.name));
}

function normalizeCardName(value) {
    return normalizeText(value).replace(/\bpokemon\b/g, 'pokemon');
}

function toCamelCase(value) {
    return normalizeText(value)
        .split(' ')
        .filter(Boolean)
        .map((part, index) => index === 0 ? part : `${part[0].toUpperCase()}${part.slice(1)}`)
        .join('');
}

function getBaseVariantSortOrder(variantId) {
    const index = BASE_VARIANT_ORDER.indexOf(variantId);
    return index === -1 ? 10000 : index * 100;
}

function extractPrintVariantLabel(productName) {
    const match = /\(([^)]+)\)\s*$/.exec(normalizeWhitespace(productName));
    return match ? normalizeWhitespace(match[1]) : '';
}

function getSpecialPrintColor(label) {
    const normalizedLabel = normalizeText(label);
    if (SPECIAL_PRINT_COLOR_MAP[normalizedLabel]) {
        return SPECIAL_PRINT_COLOR_MAP[normalizedLabel];
    }

    let hash = 0;
    for (const character of normalizedLabel) {
        hash = ((hash << 5) - hash) + character.charCodeAt(0);
        hash |= 0;
    }

    const index = Math.abs(hash) % SPECIAL_PRINT_COLOR_FALLBACKS.length;
    return SPECIAL_PRINT_COLOR_FALLBACKS[index];
}

function clonePlainObject(value) {
    return value && typeof value === 'object' ? JSON.parse(JSON.stringify(value)) : undefined;
}

function compactSetForCard(set) {
    return {
        id: set.id,
        name: set.name,
        series: set.series,
        printedTotal: set.printedTotal,
        total: set.total,
        releaseDate: set.releaseDate,
        images: clonePlainObject(set.images) || {}
    };
}

function buildFileIndex() {
    const files = fs.readdirSync(TCGTRACKING_DIR);
    const index = new Map();

    files.forEach(fileName => {
        const match = /^set_(\d+)_.+_(products|pricing)\.json$/i.exec(fileName);
        if (!match) return;

        const setId = Number(match[1]);
        const type = match[2];
        const existing = index.get(setId) || {};
        existing[type] = path.join(TCGTRACKING_DIR, fileName);
        index.set(setId, existing);
    });

    return index;
}

function scoreSetMatch(legacySet, tcgSet, codeIsUnique) {
    let score = 0;
    const legacyCode = String(legacySet.ptcgoCode || '').toUpperCase();
    const tcgCode = String(tcgSet.abbreviation || '').toUpperCase();

    if (legacyCode && tcgCode && legacyCode === tcgCode) {
        score += codeIsUnique ? 140 : 55;
    }

    const legacyDate = normalizeLegacyDate(legacySet.releaseDate);
    const tcgDate = String(tcgSet.published_on || '').slice(0, 10);
    if (legacyDate && tcgDate) {
        if (legacyDate === tcgDate) {
            score += 60;
        } else if (legacyDate.slice(0, 7) === tcgDate.slice(0, 7)) {
            score += 10;
        }
    }

    const legacyNames = getSetNameVariants(legacySet.name);
    const tcgNames = getSetNameVariants(tcgSet.name);
    const exactNameMatch = [...legacyNames].some(name => tcgNames.has(name));
    if (exactNameMatch) {
        score += 80;
    } else {
        const partialNameMatch = [...legacyNames].some(name =>
            [...tcgNames].some(candidate => name.includes(candidate) || candidate.includes(name))
        );
        if (partialNameMatch) {
            score += 30;
        }
    }

    const legacySeries = normalizeText(legacySet.series);
    const tcgName = normalizeText(stripSetPrefix(tcgSet.name));
    if (legacySeries && tcgName && tcgName.includes(legacySeries)) {
        score += 15;
    }

    return score;
}

function getLegacySetCandidates(tcgSet, legacySets, legacySetsByCode) {
    const tcgCode = String(tcgSet.abbreviation || '').toUpperCase();
    const codeMatches = tcgCode ? (legacySetsByCode.get(tcgCode) || []) : [];
    const codeIsUnique = codeMatches.length === 1;

    return legacySets
        .map(legacySet => ({
            legacySet,
            score: scoreSetMatch(legacySet, tcgSet, codeIsUnique)
        }))
        .sort((a, b) => b.score - a.score);
}

function selectLegacySetMatch(candidates, usedLegacySetIds) {
    const availableCandidates = candidates.filter(candidate => !usedLegacySetIds.has(candidate.legacySet.id));
    const best = availableCandidates[0];
    const runnerUp = availableCandidates[1];

    if (!best || best.score < 70) {
        return null;
    }

    if (runnerUp && best.score < 140 && (best.score - runnerUp.score) < 15) {
        return null;
    }

    return best.legacySet;
}

function buildLegacyCardIndexes(cards) {
    const bySetAndNumber = new Map();
    const bySetAndName = new Map();

    cards.forEach(card => {
        const setId = card?.set?.id;
        if (!setId) return;

        getCollectorKeys(card.number).forEach(key => {
            bySetAndNumber.set(`${setId}::${key}`, card);
        });

        const nameKey = normalizeCardName(card.name);
        if (!nameKey) return;

        const mapKey = `${setId}::${nameKey}`;
        const existing = bySetAndName.get(mapKey) || [];
        existing.push(card);
        bySetAndName.set(mapKey, existing);
    });

    return { bySetAndNumber, bySetAndName };
}

function findLegacyCardMatch(product, setId, indexes) {
    const numberKeys = getCollectorKeys(product.number);
    for (const key of numberKeys) {
        const match = indexes.bySetAndNumber.get(`${setId}::${key}`);
        if (match) {
            return match;
        }
    }

    const nameKey = normalizeCardName(product.name || product.clean_name);
    if (!nameKey) {
        return null;
    }

    const matches = indexes.bySetAndName.get(`${setId}::${nameKey}`) || [];
    return matches.length === 1 ? matches[0] : null;
}

function toFiniteNumber(...values) {
    for (const value of values) {
        const number = Number(value);
        if (Number.isFinite(number)) {
            return number;
        }
    }
    return undefined;
}

function normalizeVariantPrice(priceData) {
    const market = toFiniteNumber(priceData?.market);
    const low = toFiniteNumber(priceData?.low);
    const mid = toFiniteNumber(priceData?.mid);
    const high = toFiniteNumber(priceData?.high);
    const directLow = toFiniteNumber(priceData?.directLow);

    const normalized = {};
    if (low !== undefined) normalized.low = low;
    if (mid !== undefined) normalized.mid = mid;
    if (high !== undefined) normalized.high = high;
    if (market !== undefined) normalized.market = market;
    if (directLow !== undefined) normalized.directLow = directLow;

    return Object.keys(normalized).length > 0 ? normalized : null;
}

function normalizeTcgplayerData(product, pricingEntry, pricingUpdatedAt) {
    const normalizedPrices = {};
    const tcgPrices = pricingEntry?.tcg || {};

    Object.entries(tcgPrices).forEach(([sourceVariant, priceData]) => {
        const variantId = VARIANT_NAME_MAP.get(sourceVariant);
        if (!variantId) return;

        const normalized = normalizeVariantPrice(priceData);
        if (normalized) {
            normalizedPrices[variantId] = normalized;
        }
    });

    if (!Object.keys(normalizedPrices).length && !product?.tcgplayer_url) {
        return undefined;
    }

    return {
        url: product?.tcgplayer_url || undefined,
        updatedAt: pricingUpdatedAt ? formatAppDate(pricingUpdatedAt) : undefined,
        prices: normalizedPrices
    };
}

function buildSpecialPrintVariantEntries(product, pricingEntry, pricingUpdatedAt) {
    const printLabel = extractPrintVariantLabel(product.name || product.clean_name);
    if (!printLabel) {
        return [];
    }

    const tcgPrices = pricingEntry?.tcg || {};
    const sourceEntries = Object.entries(tcgPrices)
        .map(([sourceVariant, priceData]) => {
            const sourceVariantId = VARIANT_NAME_MAP.get(sourceVariant);
            if (!sourceVariantId) {
                return null;
            }

            const variantId = `${toCamelCase(printLabel)}${sourceVariantId[0].toUpperCase()}${sourceVariantId.slice(1)}`;
            const price = normalizeVariantPrice(priceData);
            if (!price) {
                return null;
            }

            return {
                id: variantId,
                sourceVariantId,
                price
            };
        })
        .filter(Boolean);

    if (sourceEntries.length === 0) {
        return [];
    }

    const useSourceVariantInName = sourceEntries.length > 1;

    return sourceEntries.map((entry, index) => ({
        id: entry.id,
        name: useSourceVariantInName
            ? `${printLabel} ${BASE_VARIANT_LABELS[entry.sourceVariantId] || entry.sourceVariantId}`
            : printLabel,
        color: getSpecialPrintColor(printLabel),
        sourceVariant: entry.sourceVariantId,
        sortOrder: getBaseVariantSortOrder(entry.sourceVariantId) + 10 + index,
        productId: product.id,
        tcgplayerUrl: product.tcgplayer_url || null,
        imageUrl: product.image_url || null,
        printLabel,
        updatedAt: formatAppDate(pricingUpdatedAt),
        price: entry.price
    }));
}

function buildAlternateProduct(product, pricingEntry, pricingUpdatedAt) {
    return pruneUndefinedDeep({
        productId: product.id,
        name: product.name,
        cleanName: product.clean_name || null,
        imageUrl: product.image_url || null,
        imageCount: product.image_count || 0,
        tcgplayer: normalizeTcgplayerData(product, pricingEntry, pricingUpdatedAt)
    });
}

function mergeAlternateProduct(existingCard, product, pricingEntry, pricingUpdatedAt) {
    const specialPrintVariants = buildSpecialPrintVariantEntries(
        product,
        pricingEntry,
        pricingUpdatedAt
    );

    if (specialPrintVariants.length > 0) {
        if (!existingCard.tcgplayer) {
            existingCard.tcgplayer = {
                url: undefined,
                updatedAt: formatAppDate(pricingUpdatedAt),
                prices: {}
            };
        }

        if (!existingCard.tcgplayer.prices) {
            existingCard.tcgplayer.prices = {};
        }

        const variantDefinitions = existingCard.tcgtracking.variantDefinitions || [];
        specialPrintVariants.forEach(variant => {
            if (!variantDefinitions.some(entry => entry.id === variant.id)) {
                variantDefinitions.push(pruneUndefinedDeep({
                    id: variant.id,
                    name: variant.name,
                    color: variant.color,
                    sourceVariant: variant.sourceVariant,
                    sortOrder: variant.sortOrder,
                    productId: variant.productId,
                    tcgplayerUrl: variant.tcgplayerUrl,
                    imageUrl: variant.imageUrl,
                    printLabel: variant.printLabel,
                    updatedAt: variant.updatedAt
                }));
            }

            existingCard.tcgplayer.prices[variant.id] = variant.price;
        });

        existingCard.tcgtracking.variantDefinitions = variantDefinitions.sort((a, b) => {
            const sortA = Number.isFinite(a.sortOrder) ? a.sortOrder : 10000;
            const sortB = Number.isFinite(b.sortOrder) ? b.sortOrder : 10000;
            if (sortA !== sortB) {
                return sortA - sortB;
            }
            return String(a.name || '').localeCompare(String(b.name || ''));
        });

        if (pricingUpdatedAt) {
            existingCard.tcgplayer.updatedAt = formatAppDate(pricingUpdatedAt);
        }
        return;
    }

    const alternate = buildAlternateProduct(product, pricingEntry, pricingUpdatedAt);
    const alternateProducts = existingCard.tcgtracking.alternateProducts || [];
    if (!alternateProducts.some(entry => entry.productId === alternate.productId)) {
        alternateProducts.push(alternate);
    }
    existingCard.tcgtracking.alternateProducts = alternateProducts;
}

function createSyntheticCardId(setId, cardNumber, productId, usedIds) {
    const numberSlug = sanitizeNumberForId(normalizeCardNumber(cardNumber));
    let candidate = numberSlug ? `${setId}-${numberSlug}` : `${setId}-p${productId}`;

    if (!usedIds.has(candidate)) {
        return candidate;
    }

    candidate = `${setId}-p${productId}`;
    if (!usedIds.has(candidate)) {
        return candidate;
    }

    let suffix = 2;
    while (usedIds.has(`${candidate}-${suffix}`)) {
        suffix += 1;
    }
    return `${candidate}-${suffix}`;
}

function buildNormalizedCard({
    cardId,
    set,
    tcgSet,
    product,
    pricingEntry,
    pricingUpdatedAt,
    legacyCard
}) {
    const legacy = clonePlainObject(legacyCard) || {};
    const images = clonePlainObject(legacy.images) || {};
    if (!images.small && product.image_url) images.small = product.image_url;
    if (!images.large && product.image_url) images.large = product.image_url;

    return {
        ...legacy,
        id: cardId,
        name: legacy.name || product.name,
        rarity: product.rarity || legacy.rarity,
        number: legacy.number || normalizeCardNumber(product.number),
        set: compactSetForCard(set),
        images,
        cardmarket: undefined,
        tcgplayer: normalizeTcgplayerData(product, pricingEntry, pricingUpdatedAt),
        tcgtracking: {
            productId: product.id,
            setId: tcgSet.id,
            setName: tcgSet.name,
            setAbbreviation: tcgSet.abbreviation,
            imageUrl: product.image_url || null,
            imageCount: product.image_count || 0,
            cleanName: product.clean_name || null,
            pricingSource: 'tcgtracking',
            pricingUpdatedAt: pricingUpdatedAt || null,
            matchedLegacyCardId: legacyCard?.id || null
        }
    };
}

function buildProductGroupKey(setId, product, legacyCard) {
    if (legacyCard?.id) {
        return `legacy::${legacyCard.id}`;
    }

    const cardNumber = normalizeCardNumber(product.number);
    const baseName = normalizeCardName(stripProductVariantSuffix(product.name || product.clean_name));
    return `product::${setId}::${cardNumber}::${baseName}`;
}

function pruneUndefinedDeep(value) {
    if (Array.isArray(value)) {
        return value.map(pruneUndefinedDeep);
    }

    if (!value || typeof value !== 'object') {
        return value;
    }

    const output = {};
    Object.entries(value).forEach(([key, entry]) => {
        if (entry === undefined) return;
        output[key] = pruneUndefinedDeep(entry);
    });
    return output;
}

function main() {
    console.log('=== TCGTracking Catalog Builder ===\n');

    const legacyCards = readJson(LEGACY_CARDS_PATH);
    const legacySets = readJson(LEGACY_SETS_PATH);
    const tcgtrackingSetsData = readJson(TCGTRACKING_SETS_PATH);
    const tcgtrackingSets = tcgtrackingSetsData.sets || [];
    const filesBySetId = buildFileIndex();

    const legacySetsByCode = new Map();
    legacySets.forEach(set => {
        const code = String(set.ptcgoCode || '').toUpperCase();
        if (!code) return;
        const existing = legacySetsByCode.get(code) || [];
        existing.push(set);
        legacySetsByCode.set(code, existing);
    });

    const legacyCardIndexes = buildLegacyCardIndexes(legacyCards);
    const normalizedSets = [];
    const normalizedSetMap = new Map();
    const normalizedCards = [];
    const normalizedCardsByGroupKey = new Map();
    const matchedLegacyCardIds = new Set();
    const matchedLegacySetIds = new Set();
    const usedCardIds = new Set(legacyCards.map(card => card.id));

    const report = {
        generatedAt: new Date().toISOString(),
        totals: {
            legacyCards: legacyCards.length,
            legacySets: legacySets.length,
            tcgtrackingSets: tcgtrackingSets.length
        },
        matches: {
            matchedSets: 0,
            unmatchedTcgtrackingSets: 0,
            matchedCards: 0,
            tcgtrackingOnlyCards: 0,
            legacyOnlyCards: 0
        },
        missingFiles: [],
        unmatchedSets: [],
        lowCoverageSets: []
    };

    const tcgtrackingSetWork = tcgtrackingSets
        .map(tcgSet => ({
            tcgSet,
            candidates: getLegacySetCandidates(tcgSet, legacySets, legacySetsByCode)
        }))
        .sort((a, b) => {
            const scoreDiff = (b.candidates[0]?.score || 0) - (a.candidates[0]?.score || 0);
            if (scoreDiff !== 0) {
                return scoreDiff;
            }

            const gapA = (a.candidates[0]?.score || 0) - (a.candidates[1]?.score || 0);
            const gapB = (b.candidates[0]?.score || 0) - (b.candidates[1]?.score || 0);
            return gapB - gapA;
        });

    const usedLegacySetIds = new Set();

    tcgtrackingSetWork.forEach(({ tcgSet, candidates }) => {
        const fileRecord = filesBySetId.get(Number(tcgSet.id));
        if (!fileRecord?.products) {
            report.missingFiles.push({
                setId: tcgSet.id,
                name: tcgSet.name,
                missing: 'products'
            });
            return;
        }

        const productsData = readJson(fileRecord.products);
        const pricingData = fileRecord.pricing ? readJson(fileRecord.pricing) : { prices: {}, updated: null };
        const allProducts = productsData.products || [];
        const cardProducts = allProducts
            .filter(product => normalizeWhitespace(product.number))
            .sort((a, b) => {
                const alternateDiff = Number(isAlternateVariantProduct(a)) - Number(isAlternateVariantProduct(b));
                if (alternateDiff !== 0) {
                    return alternateDiff;
                }

                return String(a.name || '').localeCompare(String(b.name || ''));
            });

        const matchedLegacySet = selectLegacySetMatch(candidates, usedLegacySetIds);
        const normalizedSetId = matchedLegacySet?.id || `tt_${tcgSet.id}`;
        const cardEntryCount = new Set(
            cardProducts.map(product => buildProductGroupKey(normalizedSetId, product, null))
        ).size;

        if (matchedLegacySet) {
            usedLegacySetIds.add(matchedLegacySet.id);
            matchedLegacySetIds.add(matchedLegacySet.id);
            report.matches.matchedSets += 1;
        } else {
            report.matches.unmatchedTcgtrackingSets += 1;
            report.unmatchedSets.push({
                setId: tcgSet.id,
                abbreviation: tcgSet.abbreviation,
                name: tcgSet.name,
                publishedOn: tcgSet.published_on,
                cardEntries: cardEntryCount,
                rawProducts: cardProducts.length
            });
        }

        const normalizedSet = pruneUndefinedDeep({
            ...(clonePlainObject(matchedLegacySet) || {}),
            id: normalizedSetId,
            name: matchedLegacySet?.name || stripSetPrefix(tcgSet.name),
            series: matchedLegacySet?.series || inferSeriesName(tcgSet.name, tcgSet.abbreviation),
            printedTotal: matchedLegacySet?.printedTotal ?? cardEntryCount,
            total: matchedLegacySet?.total ?? cardEntryCount,
            legalities: clonePlainObject(matchedLegacySet?.legalities) || {},
            ptcgoCode: matchedLegacySet?.ptcgoCode || tcgSet.abbreviation || undefined,
            releaseDate: matchedLegacySet?.releaseDate || formatAppDate(tcgSet.published_on),
            updatedAt: matchedLegacySet?.updatedAt || formatAppDateTime(tcgSet.modified_on),
            images: clonePlainObject(matchedLegacySet?.images) || {},
            tcgtracking: {
                setId: tcgSet.id,
                name: tcgSet.name,
                abbreviation: tcgSet.abbreviation,
                isSupplemental: tcgSet.is_supplemental,
                publishedOn: tcgSet.published_on,
                modifiedOn: tcgSet.modified_on,
                productCount: tcgSet.product_count,
                skuCount: tcgSet.sku_count,
                productsModified: tcgSet.products_modified,
                pricingModified: tcgSet.pricing_modified,
                skusModified: tcgSet.skus_modified
            }
        });

        normalizedSets.push(normalizedSet);
        normalizedSetMap.set(normalizedSet.id, normalizedSet);

        let matchedCardsInSet = 0;
        cardProducts.forEach(product => {
            const legacyCard = matchedLegacySet
                ? findLegacyCardMatch(product, matchedLegacySet.id, legacyCardIndexes)
                : null;
            const groupKey = buildProductGroupKey(normalizedSet.id, product, legacyCard);
            const existingCard = normalizedCardsByGroupKey.get(groupKey);

            if (existingCard) {
                mergeAlternateProduct(
                    existingCard,
                    product,
                    pricingData.prices?.[String(product.id)],
                    pricingData.updated
                );
                return;
            }

            if (legacyCard) {
                matchedLegacyCardIds.add(legacyCard.id);
                matchedCardsInSet += 1;
                report.matches.matchedCards += 1;
            } else {
                report.matches.tcgtrackingOnlyCards += 1;
            }

            const cardId = legacyCard?.id || createSyntheticCardId(
                normalizedSet.id,
                product.number,
                product.id,
                usedCardIds
            );
            usedCardIds.add(cardId);

            const normalizedCard = buildNormalizedCard({
                cardId,
                set: normalizedSet,
                tcgSet,
                product,
                pricingEntry: pricingData.prices?.[String(product.id)],
                pricingUpdatedAt: pricingData.updated,
                legacyCard
            });

            const finalizedCard = pruneUndefinedDeep(normalizedCard);
            normalizedCardsByGroupKey.set(groupKey, finalizedCard);
            normalizedCards.push(finalizedCard);
        });

        if (matchedLegacySet && cardProducts.length > 0) {
            const coverage = cardEntryCount > 0 ? (matchedCardsInSet / cardEntryCount) : 0;
            if (coverage < 0.9) {
                report.lowCoverageSets.push({
                    tcgtrackingSetId: tcgSet.id,
                    normalizedSetId,
                    name: normalizedSet.name,
                    matchedCards: matchedCardsInSet,
                    tcgtrackingCards: cardEntryCount,
                    rawProducts: cardProducts.length,
                    coverage: Number((coverage * 100).toFixed(1))
                });
            }
        }
    });

    legacyCards.forEach(card => {
        if (matchedLegacyCardIds.has(card.id)) {
            return;
        }

        report.matches.legacyOnlyCards += 1;
        usedCardIds.add(card.id);

        const set = normalizedSetMap.get(card.set.id) || card.set;
        normalizedCards.push(pruneUndefinedDeep({
            ...clonePlainObject(card),
            set: compactSetForCard(set),
            cardmarket: undefined,
            tcgplayer: undefined
        }));
    });

    legacySets.forEach(set => {
        if (normalizedSetMap.has(set.id)) {
            return;
        }

        normalizedSets.push(clonePlainObject(set));
        normalizedSetMap.set(set.id, set);
    });

    normalizedSets.sort((a, b) => {
        const dateA = new Date(String(a.releaseDate || '').replace(/\//g, '-') || '1990-01-01');
        const dateB = new Date(String(b.releaseDate || '').replace(/\//g, '-') || '1990-01-01');
        return dateB - dateA;
    });

    normalizedCards.sort((a, b) => {
        const dateA = new Date(String(a.set?.releaseDate || '').replace(/\//g, '-') || '1990-01-01');
        const dateB = new Date(String(b.set?.releaseDate || '').replace(/\//g, '-') || '1990-01-01');
        if (dateB - dateA !== 0) {
            return dateB - dateA;
        }

        const numberA = parseInt(String(a.number || '').replace(/\D+/g, ''), 10);
        const numberB = parseInt(String(b.number || '').replace(/\D+/g, ''), 10);
        if (Number.isFinite(numberA) && Number.isFinite(numberB) && numberA !== numberB) {
            return numberA - numberB;
        }

        return String(a.id).localeCompare(String(b.id));
    });

    report.totals.outputCards = normalizedCards.length;
    report.totals.outputSets = normalizedSets.length;

    writeJson(OUTPUT_CARDS_PATH, normalizedCards);
    writeJson(OUTPUT_SETS_PATH, normalizedSets);
    writeJson(OUTPUT_REPORT_PATH, report, true);

    console.log(`Wrote ${normalizedCards.length} cards -> ${path.relative(ROOT_DIR, OUTPUT_CARDS_PATH)}`);
    console.log(`Wrote ${normalizedSets.length} sets -> ${path.relative(ROOT_DIR, OUTPUT_SETS_PATH)}`);
    console.log(`Wrote report -> ${path.relative(ROOT_DIR, OUTPUT_REPORT_PATH)}`);
    console.log('\nSummary:');
    console.log(`  Matched legacy sets: ${report.matches.matchedSets}`);
    console.log(`  TCGTracking-only sets: ${report.matches.unmatchedTcgtrackingSets}`);
    console.log(`  Matched legacy cards: ${report.matches.matchedCards}`);
    console.log(`  TCGTracking-only cards: ${report.matches.tcgtrackingOnlyCards}`);
    console.log(`  Legacy-only cards: ${report.matches.legacyOnlyCards}`);
}

main();
