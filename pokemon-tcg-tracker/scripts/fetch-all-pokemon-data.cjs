// Fetch all Pokémon sets, products, and pricing from TCGTracking API
// Run with: node fetch-all-pokemon-data.js

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://tcgtracking.com/tcgapi/v1/3'; // 3 = Pokemon
const OUT_DIR = path.join(__dirname, '../data/tcgtracking');

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.json();
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  // 1. Fetch all sets
  const setsData = await fetchJson(`${BASE_URL}/sets`);
  fs.writeFileSync(path.join(OUT_DIR, 'sets.json'), JSON.stringify(setsData, null, 2));
  console.log(`Fetched ${setsData.sets.length} sets.`);

  // 2. For each set, fetch products and pricing
  for (const set of setsData.sets) {
    const setId = set.id;
    const setSlug = set.abbr || set.name.replace(/\W+/g, '_');
    console.log(`Fetching set ${setId}: ${set.name}`);
    try {
      const [products, pricing] = await Promise.all([
        fetchJson(`${BASE_URL}/sets/${setId}`),
        fetchJson(`${BASE_URL}/sets/${setId}/pricing`)
      ]);
      fs.writeFileSync(path.join(OUT_DIR, `set_${setId}_${setSlug}_products.json`), JSON.stringify(products, null, 2));
      fs.writeFileSync(path.join(OUT_DIR, `set_${setId}_${setSlug}_pricing.json`), JSON.stringify(pricing, null, 2));
    } catch (err) {
      console.error(`Failed to fetch set ${setId}: ${err.message}`);
    }
  }

  console.log('Done!');
}

main();
