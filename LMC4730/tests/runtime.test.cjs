const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const gameDirectory = path.resolve(__dirname, '..');
const journalKey = 'mh-field-journal-v1';
const expeditionKey = 'mh-field-expedition-v1';

// These doubles exercise engine state and events, not browser layout or focus.
// Real browser checks remain necessary for responsive presentation and controls.
class Element {
  constructor(tagName = 'div', id = '') {
    this.tagName = tagName;
    this.id = id;
    this.dataset = {};
    this.style = {};
    this.children = [];
    this.events = new Map();
    this.classes = new Set();
    this.textContent = '';
    this.hidden = false;
    this.open = false;
    this.classList = {
      add: (...names) => names.forEach(name => this.classes.add(name)),
      remove: (...names) => names.forEach(name => this.classes.delete(name)),
      contains: name => this.classes.has(name),
      toggle: (name, enabled = !this.classes.has(name)) => {
        if (enabled) this.classes.add(name);
        else this.classes.delete(name);
        return enabled;
      },
    };
  }

  set className(value) { this.classes = new Set(value.split(/\s+/).filter(Boolean)); }
  get className() { return [...this.classes].join(' '); }
  append(...nodes) { nodes.forEach(node => { node.parent = this; this.children.push(node); }); }
  replaceChildren(...nodes) { this.children = []; this.append(...nodes); }
  addEventListener(name, handler) {
    if (!this.events.has(name)) this.events.set(name, []);
    this.events.get(name).push(handler);
  }
  click() { (this.events.get('click') || []).forEach(handler => handler({ target: this })); }
  showModal() { this.open = true; }
  close() { this.open = false; }
  closest(selector) {
    const tags = selector.split(',').map(value => value.trim());
    if (tags.includes(this.tagName)) return this;
    return this.parent?.closest(selector) || null;
  }
}

function boot({ saved = new Map(), blocked = false, editContent } = {}) {
  const storage = new Map(saved);
  const elements = new Map();
  const html = readFileSync(path.join(gameDirectory, 'index.html'), 'utf8');
  for (const match of html.matchAll(/<(\w+)\b([^>]*)>/g)) {
    const [, tag, attributes] = match;
    const id = attributes.match(/\bid="([^"]+)"/)?.[1];
    if (!id) continue;
    const element = new Element(tag, id);
    element.className = attributes.match(/\bclass="([^"]+)"/)?.[1] || '';
    element.hidden = /\bhidden\b/.test(attributes);
    elements.set(id, element);
  }
  const controls = [];
  for (const [name, value] of [['open', 'archive'], ['open', 'credits'], ['travel', ''], ['report', ''], ['close', 'menu'], ['close', 'archive'], ['close', 'credits']]) {
    const control = new Element('button');
    control.dataset[name] = value;
    controls.push(control);
  }
  const document = {
    querySelector(selector) {
      if (selector.startsWith('#')) return elements.get(selector.slice(1)) || null;
      if (selector === 'dialog[open]') return [...elements.values()].find(node => node.tagName === 'dialog' && node.open) || null;
      throw new Error(`Unimplemented selector: ${selector}`);
    },
    querySelectorAll(selector) {
      if (selector === '.screen') return [...elements.values()].filter(node => node.classList.contains('screen'));
      const dataName = selector.match(/^\[data-(.+)\]$/)?.[1];
      if (dataName) return controls.filter(node => Object.hasOwn(node.dataset, dataName));
      throw new Error(`Unimplemented selector: ${selector}`);
    },
    createElement: tag => new Element(tag),
    addEventListener() {},
  };
  const context = vm.createContext({
    window: {}, document,
    localStorage: {
      getItem(key) { if (blocked) throw new Error('Storage is unavailable'); return storage.get(key) ?? null; },
      setItem(key, value) { if (blocked) throw new Error('Storage is unavailable'); storage.set(key, String(value)); },
    },
    setTimeout: () => 1,
    clearTimeout() {},
  });
  for (const filename of ['regions.js', 'evidence.js', 'dialogue.js']) {
    vm.runInContext(readFileSync(path.join(gameDirectory, 'data', filename), 'utf8'), context, { filename });
  }
  editContent?.(context.window);
  vm.runInContext(readFileSync(path.join(gameDirectory, 'game.js'), 'utf8'), context, { filename: 'game.js' });
  const get = id => elements.get(id);
  const read = key => JSON.parse(storage.get(key) || '{}');
  const scenes = context.window.MYTHICAL_HUNT_DIALOGUE;
  function revealChoices() {
    for (let count = 0; count < 30 && !get('dialogue').classList.contains('hidden'); count++) get('dialogue').click();
    assert.ok(get('dialogue').classList.contains('hidden'), 'Dialogue should reach a choice panel.');
    return get('choices').children;
  }
  function choose(key, value) {
    const button = revealChoices().find(node => node.dataset[key] === value);
    assert.ok(button, `No choice ${key}=${value}.`);
    button.click();
    return button;
  }
  function navigate(destination) {
    const start = read(expeditionKey).scene;
    const pending = [[start, []]];
    const visited = new Set();
    while (pending.length) {
      const [sceneId, route] = pending.shift();
      if (sceneId === destination) {
        for (const next of route) choose('next', next);
        return;
      }
      if (visited.has(sceneId)) continue;
      visited.add(sceneId);
      for (const choice of scenes[sceneId].choices) {
        if (choice.next) pending.push([choice.next, [...route, choice.next]]);
      }
    }
    assert.fail(`No route from ${start} to ${destination}.`);
  }
  return { storage, get, read, revealChoices, choose, navigate, controls, scenes, evidence: context.window.MYTHICAL_HUNT_EVIDENCE };
}

test('recording and revisiting observations deduplicates both journal and expedition', () => {
  const game = boot();
  game.get('new-game').click();
  game.navigate('goblin_sighting');
  game.choose('evidence', 'goblin_species');
  game.navigate('goblin_sighting');
  game.choose('evidence', 'goblin_species');
  assert.deepEqual(game.read(journalKey).found, ['goblin_species']);
  assert.deepEqual(game.read(expeditionKey).evidence, ['goblin_species']);
  assert.match(game.get('toast').textContent, /OBSERVATION REVIEWED/);
  game.navigate('goblin_cap');
  game.choose('evidence', 'goblin_red_hat');
  assert.deepEqual(game.read(journalKey).found, ['goblin_species', 'goblin_red_hat']);
});

test('a draft cannot be collected even if an author accidentally links it to a choice', () => {
  const game = boot({ editContent(window) {
    window.MYTHICAL_HUNT_DIALOGUE.goblin_sighting.choices[0].evidence = 'chupa_species';
  } });
  game.get('new-game').click();
  game.navigate('goblin_sighting');
  game.choose('evidence', 'chupa_species');
  assert.deepEqual(game.read(journalKey).found, []);
  assert.deepEqual(game.read(expeditionKey).evidence, []);
  assert.match(game.get('toast').textContent, /PENDING/);
});

test('filing a report completes once and replay keeps the journal', () => {
  const game = boot();
  game.get('new-game').click();
  game.navigate('goblin_sighting');
  game.choose('evidence', 'goblin_species');
  game.navigate('report');
  const finish = game.choose('next', 'complete');
  finish.click();
  assert.equal(game.read(journalKey).expeditions, 1);
  assert.equal(game.read(expeditionKey).completed, true);
  assert.ok(game.get('ending').classList.contains('active'));
  game.get('replay').click();
  assert.equal(game.read(expeditionKey).scene, 'briefing');
  assert.deepEqual(game.read(expeditionKey).evidence, []);
  assert.deepEqual(game.read(journalKey).found, ['goblin_species']);
  assert.equal(game.read(journalKey).expeditions, 1);
});

test('reload resumes the choice panel without losing observations', () => {
  const first = boot();
  first.get('new-game').click();
  first.navigate('goblin_sighting');
  first.choose('evidence', 'goblin_species');
  first.revealChoices();
  const second = boot({ saved: first.storage });
  assert.equal(second.get('continue').classList.contains('hidden'), false);
  second.get('continue').click();
  assert.ok(second.get('dialogue').classList.contains('hidden'));
  assert.ok(second.get('choices').children.length);
  assert.deepEqual(second.read(journalKey).found, ['goblin_species']);
  second.choose('next', 'goblin_group');
  assert.equal(second.read(expeditionKey).scene, 'goblin_group');
});

test('old-story saves remain untouched and cannot pollute the field journal', () => {
  const oldJournal = JSON.stringify({ found: ['curator', 'stone'], runs: 3 });
  const oldExpedition = JSON.stringify({ scene: 'throne_hostile', evidence: ['true_name'] });
  const game = boot({ saved: new Map([['mh-meta', oldJournal], ['mh-vn', oldExpedition]]) });
  assert.ok(game.get('continue').classList.contains('hidden'));
  game.get('new-game').click();
  assert.deepEqual(game.read(journalKey).found, []);
  assert.equal(game.storage.get('mh-meta'), oldJournal);
  assert.equal(game.storage.get('mh-vn'), oldExpedition);
});

test('malformed saves and prototype names safely fall back to a new expedition', () => {
  for (const scene of ['constructor', 'toString', '__proto__', 'deleted_scene', null]) {
    const game = boot({ saved: new Map([
      [journalKey, '{not json'],
      [expeditionKey, JSON.stringify({ scene, line: 0 })],
    ]) });
    assert.ok(game.get('continue').classList.contains('hidden'), `Invalid saved scene ${scene} was accepted.`);
    game.get('new-game').click();
    assert.equal(game.read(expeditionKey).scene, 'briefing');
  }
});

test('resume sanitizes duplicate, removed, and draft evidence plus invalid regions', () => {
  const game = boot({ saved: new Map([
    [journalKey, JSON.stringify({ found: ['goblin_species', 'goblin_species', 'chupa_species', 'removed'], expeditions: -4 })],
    [expeditionKey, JSON.stringify({ scene: 'forest', line: 999, evidence: ['goblin_red_hat', 'goblin_red_hat', 'chupa_habit'], visited: ['forest', 'forest', 'constructor', 'base'] })],
  ]) });
  game.get('continue').click();
  assert.ok(game.get('dialogue').classList.contains('hidden'));
  game.choose('next', 'goblin_group');
  assert.deepEqual(game.read(journalKey).found, ['goblin_species', 'goblin_red_hat']);
  assert.deepEqual(game.read(expeditionKey).evidence, ['goblin_red_hat']);
  assert.deepEqual(game.read(expeditionKey).visited, ['forest']);
  assert.equal(game.read(journalKey).expeditions, 0);
});

test('blocked storage shows a warning but exploration continues', () => {
  const game = boot({ blocked: true });
  assert.equal(game.get('save-notice').hidden, false);
  game.get('new-game').click();
  game.choose('next', 'preparation');
  game.choose('next', 'gate_map');
  assert.equal(game.get('location').textContent, game.scenes.gate_map.location);
  assert.ok(game.get('story').classList.contains('active'));
});

test('journal shows draft entries as pending without adding them to completion totals', () => {
  const game = boot();
  game.controls.find(node => node.dataset.open === 'archive').click();
  assert.equal(game.get('archive').open, true);
  const readyCount = Object.values(game.evidence).filter(record => record.status === 'ready').length;
  assert.equal(game.get('title-progress').textContent, `0 / ${readyCount}`);
  const entries = game.get('archive-grid').children.flatMap(group => group.children);
  for (const [id, record] of Object.entries(game.evidence)) {
    const card = entries.find(node => node.dataset.evidence === id);
    assert.ok(card, `Journal omits ${id}.`);
    if (record.status === 'draft') {
      assert.ok(card.classList.contains('pending'));
      assert.match(card.children[1].textContent, /NOTES PENDING/);
    }
  }
});
