const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync, existsSync } = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const gameDirectory = path.resolve(__dirname, '..');
const context = vm.createContext({ window: {} });
for (const filename of ['regions.js', 'evidence.js', 'dialogue.js']) {
  vm.runInContext(readFileSync(path.join(gameDirectory, 'data', filename), 'utf8'), context, { filename });
}
const regions = context.window.MYTHICAL_HUNT_REGIONS;
const evidence = context.window.MYTHICAL_HUNT_EVIDENCE;
const scenes = context.window.MYTHICAL_HUNT_DIALOGUE;
const creatureArt = context.window.MYTHICAL_HUNT_CREATURE_ART;
const hasText = value => typeof value === 'string' && value.trim().length > 0;

function reachableFrom(start) {
  const visited = new Set();
  const pending = [start];
  while (pending.length) {
    const id = pending.pop();
    if (visited.has(id)) continue;
    visited.add(id);
    for (const choice of scenes[id]?.choices || []) if (choice.next) pending.push(choice.next);
  }
  return visited;
}

test('each scene exposes its editable setting, dialogue, and choices', () => {
  for (const id of ['briefing', 'gate_map', 'report']) assert.ok(scenes[id], `Missing ${id} scene.`);
  for (const [id, scene] of Object.entries(scenes)) {
    for (const key of ['chapter', 'location', 'objective']) {
      assert.ok(hasText(scene[key]), `${id}.${key} must contain readable text.`);
    }
    assert.ok(regions[scene.region], `${id} uses unknown region ${scene.region}.`);
    assert.ok(Array.isArray(scene.lines) && scene.lines.length, `${id} needs dialogue.`);
    for (const line of scene.lines) {
      assert.equal(line.length, 2, `${id} lines use [speaker, dialogue].`);
      assert.ok(line.every(hasText), `${id} has an empty speaker or dialogue line.`);
    }
    assert.ok(Array.isArray(scene.choices) && scene.choices.length, `${id} needs a way forward.`);
    for (const choice of scene.choices) {
      assert.ok(hasText(choice.label), `${id} has an unnamed choice.`);
      assert.ok(hasText(choice.detail), `${id}/${choice.label} needs a description.`);
      assert.notEqual(Boolean(choice.next), choice.action === 'complete',
        `${id}/${choice.label} must have exactly one destination or completion action.`);
      if (choice.next) assert.ok(scenes[choice.next], `${id} links to missing scene ${choice.next}.`);
      if (choice.action) assert.equal(choice.action, 'complete', `${id} uses an unsupported action.`);
    }
  }
});

test('all scenes and all six gates are reachable from the introduction', () => {
  const reachable = reachableFrom('briefing');
  for (const id of Object.keys(scenes)) assert.ok(reachable.has(id), `${id} is disconnected.`);
  for (const region of ['forest', 'dead', 'sea', 'sky', 'fire', 'swamp']) {
    assert.ok([...reachable].some(id => scenes[id]?.region === region), `${region} is not explorable.`);
  }
});

test('every branch can return to the map and revisit missed observations', () => {
  for (const id of Object.keys(scenes)) {
    assert.ok(reachableFrom(id).has('gate_map'), `${id} traps the player away from the map.`);
  }
  assert.ok(reachableFrom('gate_map').has('report'), 'Players must be able to submit a report.');
  assert.ok(scenes.report.choices.some(choice => choice.action === 'complete'),
    'The report must provide an explicit finish choice.');
});

test('evidence uses structured species and habit records with explicit draft status', () => {
  assert.ok(Object.keys(evidence).length, 'The field journal needs entries.');
  for (const [id, record] of Object.entries(evidence)) {
    assert.ok(hasText(record.species), `${id} must name its species.`);
    assert.ok(hasText(record.title), `${id} must have a title.`);
    assert.ok(['species', 'habit'].includes(record.kind), `${id} must describe a species or habit.`);
    assert.ok(['ready', 'draft'].includes(record.status), `${id} needs a ready/draft status.`);
    if (record.status === 'draft') {
      assert.equal(record.description, '', `${id}: leave unfinished lore blank.`);
      assert.ok(record.region === null || regions[record.region], `${id} has an invalid draft region.`);
    } else {
      assert.ok(hasText(record.description), `${id}: ready entries need descriptions.`);
      assert.ok(regions[record.region], `${id}: ready entries need known regions.`);
    }
  }
});

test('only ready evidence can be awarded, and every ready entry can be discovered', () => {
  const awarded = new Set();
  for (const [sceneId, scene] of Object.entries(scenes)) {
    for (const choice of scene.choices) {
      if (!choice.evidence) continue;
      const record = evidence[choice.evidence];
      assert.ok(record, `${sceneId} awards unknown evidence ${choice.evidence}.`);
      assert.equal(record.status, 'ready', `${sceneId} awards unfinished evidence ${choice.evidence}.`);
      assert.equal(record.region, scene.region === 'cave' ? 'forest' : scene.region,
        `${sceneId} awards evidence from another gate.`);
      awarded.add(choice.evidence);
    }
  }
  for (const [id, record] of Object.entries(evidence)) {
    if (record.status === 'ready') assert.ok(awarded.has(id), `${id} cannot be discovered.`);
    else assert.ok(!awarded.has(id), `${id} is a draft, not a collectible.`);
  }
});

test('GDD species remain in assigned gates and Kitsune stays unassigned', () => {
  const assignment = {
    Goblin: 'forest', Chupacabra: 'forest', Troll: 'forest', Golem: 'forest', Erlking: 'forest',
    Jiangshi: 'dead', Mermaid: 'sea', Leviathan: 'sea', Kitsune: null,
  };
  for (const [species, region] of Object.entries(assignment)) {
    const entries = Object.values(evidence).filter(record => record.species === species);
    assert.ok(entries.length, `${species} needs an entry or a clearly marked placeholder.`);
    for (const record of entries) assert.equal(record.region, region, `${species} has the wrong gate.`);
  }
});

test('region backgrounds point to existing assets and live scenes', () => {
  function assertAsset(relativePath) {
    if (!relativePath) return;
    const absolutePath = path.resolve(gameDirectory, relativePath);
    assert.ok(absolutePath.startsWith(`${gameDirectory}${path.sep}`), 'Art must stay inside the game.');
    assert.ok(existsSync(absolutePath), `Missing art asset: ${relativePath}`);
  }
  const forestImages = new Set([regions.forest.image, ...Object.values(regions.forest.sceneImages || {})]);
  for (const filename of ['forest.jpg', 'forest-1.jpg', 'forest-2.jpg']) {
    assert.ok(forestImages.has(`assets/${filename}`), `${filename} should still be used in the forest.`);
  }
  for (const [regionId, region] of Object.entries(regions)) {
    assertAsset(region.image);
    for (const [sceneId, relativePath] of Object.entries(region.sceneImages || {})) {
      assert.ok(scenes[sceneId], `${regionId} assigns art to deleted scene ${sceneId}.`);
      assert.equal(scenes[sceneId].region, regionId, `${sceneId} art is attached to the wrong region.`);
      assertAsset(relativePath);
    }
  }
});

test('the exploration story does not retain the old Curator conflict', () => {
  assert.doesNotMatch(JSON.stringify({ scenes, evidence }),
    /curator|clause 19|illegal guild|root covenant|reversible petrification/i);
});

test('creature art uses existing supplied images and live scene IDs', () => {
  for (const [sceneId, portrait] of Object.entries(creatureArt)) {
    assert.ok(scenes[sceneId], `Portrait assigned to missing scene ${sceneId}.`);
    assert.ok(hasText(portrait.alt), `${sceneId} needs descriptive alternative text.`);
    const file = path.resolve(gameDirectory, portrait.image);
    assert.ok(file.startsWith(`${gameDirectory}${path.sep}`));
    assert.ok(existsSync(file), `Missing creature image: ${portrait.image}`);
  }
  assert.equal(creatureArt.goblin_sighting.image, 'assets/goblin.jpg');
  assert.equal(creatureArt.goblin_queen.image, 'assets/goblin-1.jpg');
  assert.equal(creatureArt.chupa_gate.image, 'assets/chupa.jpg');
});

test('styles do not request removed forest layers or the removed cave image', () => {
  for (const filename of ['styles.css', 'data/content-layer.css']) {
    const css = readFileSync(path.join(gameDirectory, filename), 'utf8');
    assert.doesNotMatch(css, /forest-far\.png|forest-near\.png|assets\/cave\.png/);
    for (const [, asset] of css.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) {
      if (!asset.includes('assets/')) continue;
      assert.ok(existsSync(path.resolve(gameDirectory, path.dirname(filename), asset)), `Missing CSS asset: ${asset}`);
    }
  }
});
