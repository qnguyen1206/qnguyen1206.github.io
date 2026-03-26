/**
 * Build Card Data Script
 * 
 * Fetches all Pokemon TCG cards from the API and saves them as JSON files.
 * Run this script periodically to update the card database.
 * 
 * Usage: node scripts/build-card-data.cjs
 * 
 * Requires: Create a .env file with POKEMON_TCG_API_KEY=your_key
 */

const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && !key.startsWith('#')) {
            process.env[key.trim()] = valueParts.join('=').trim();
        }
    });
}

const API_BASE = 'https://api.pokemontcg.io/v2';
const API_KEY = process.env.POKEMON_TCG_API_KEY || '';

if (!API_KEY) {
    console.error('Error: POKEMON_TCG_API_KEY not found in .env file');
    console.error('Create a .env file with: POKEMON_TCG_API_KEY=your_key');
    console.error('Get a free key at: https://dev.pokemontcg.io/');
    process.exit(1);
}

const OUTPUT_DIR = path.join(__dirname, '..', 'data');

// Fields to keep for each card (reduces file size significantly)
const CARD_FIELDS = [
    'id', 'name', 'supertype', 'subtypes', 'hp', 'types', 'evolvesFrom',
    'rules', 'attacks', 'weaknesses', 'resistances', 'retreatCost',
    'convertedRetreatCost', 'set', 'number', 'artist', 'rarity',
    'nationalPokedexNumbers', 'legalities', 'images', 'tcgplayer', 'cardmarket'
];

// Fields to keep for set info embedded in cards
const SET_FIELDS = ['id', 'name', 'series', 'printedTotal', 'total', 'releaseDate', 'images'];

function stripCard(card) {
    const stripped = {};
    CARD_FIELDS.forEach(field => {
        if (card[field] !== undefined) {
            if (field === 'set') {
                // Only keep essential set fields
                stripped.set = {};
                SET_FIELDS.forEach(sf => {
                    if (card.set[sf] !== undefined) {
                        stripped.set[sf] = card.set[sf];
                    }
                });
            } else {
                stripped[field] = card[field];
            }
        }
    });
    return stripped;
}

async function fetchWithRetry(url, retries = 3) {
    const headers = {
        'Content-Type': 'application/json',
        'X-Api-Key': API_KEY
    };

    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, { headers });
            if (!response.ok) {
                if (response.status === 429 || response.status >= 500) {
                    throw new Error(`API returned ${response.status}`);
                }
                throw new Error(`API returned ${response.status}: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            if (i === retries - 1) throw error;
            console.log(`  Retry ${i + 1}/${retries}: ${error.message}`);
            await new Promise(r => setTimeout(r, 2000 * (i + 1)));
        }
    }
}

async function fetchAllCards() {
    console.log('Fetching card count...');
    const countData = await fetchWithRetry(`${API_BASE}/cards?page=1&pageSize=1`);
    const totalCards = countData.totalCount;
    const totalPages = Math.ceil(totalCards / 250);
    
    console.log(`Total cards: ${totalCards} (${totalPages} pages)`);
    
    let allCards = [];
    const CONCURRENT = 5;
    const DELAY = 300;
    
    for (let i = 1; i <= totalPages; i += CONCURRENT) {
        const batch = [];
        for (let j = i; j < i + CONCURRENT && j <= totalPages; j++) {
            batch.push(j);
        }
        
        console.log(`Fetching pages ${batch.join(', ')}...`);
        
        const promises = batch.map(page =>
            fetchWithRetry(`${API_BASE}/cards?page=${page}&pageSize=250&orderBy=set.releaseDate,number`)
                .then(data => data.data || [])
                .catch(err => {
                    console.error(`  Failed page ${page}: ${err.message}`);
                    return [];
                })
        );
        
        const results = await Promise.all(promises);
        results.forEach(cards => {
            allCards = allCards.concat(cards.map(stripCard));
        });
        
        console.log(`  Progress: ${allCards.length} cards`);
        
        if (i + CONCURRENT <= totalPages) {
            await new Promise(r => setTimeout(r, DELAY));
        }
    }
    
    return allCards;
}

async function fetchAllSets() {
    console.log('Fetching sets...');
    const data = await fetchWithRetry(`${API_BASE}/sets?orderBy=-releaseDate`);
    return data.data;
}

async function main() {
    console.log('=== Pokemon TCG Card Data Builder ===\n');
    
    // Create output directory
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    try {
        // Fetch sets
        const sets = await fetchAllSets();
        console.log(`Fetched ${sets.length} sets\n`);
        
        // Fetch cards
        const cards = await fetchAllCards();
        console.log(`\nFetched ${cards.length} cards total\n`);
        
        // Save sets
        const setsPath = path.join(OUTPUT_DIR, 'sets.json');
        fs.writeFileSync(setsPath, JSON.stringify(sets));
        const setsSize = (fs.statSync(setsPath).size / 1024 / 1024).toFixed(2);
        console.log(`Saved sets.json (${setsSize} MB)`);
        
        // Save cards
        const cardsPath = path.join(OUTPUT_DIR, 'cards.json');
        fs.writeFileSync(cardsPath, JSON.stringify(cards));
        const cardsSize = (fs.statSync(cardsPath).size / 1024 / 1024).toFixed(2);
        console.log(`Saved cards.json (${cardsSize} MB)`);
        
        // Save metadata
        const metadata = {
            generatedAt: new Date().toISOString(),
            totalCards: cards.length,
            totalSets: sets.length
        };
        fs.writeFileSync(path.join(OUTPUT_DIR, 'metadata.json'), JSON.stringify(metadata, null, 2));
        console.log('Saved metadata.json');
        
        console.log('\n=== Done! ===');
        console.log(`Cards: ${cards.length}`);
        console.log(`Sets: ${sets.length}`);
        console.log(`Total size: ${(parseFloat(cardsSize) + parseFloat(setsSize)).toFixed(2)} MB`);
        
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

main();
