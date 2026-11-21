import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { compileStory } from '../scripts/story.js';
import * as stateTools from '../scripts/state.js';

// Event/DOM doubles exercise the real controller, not layout or browser focus.
// Browser and screen-reader checks are still required before submission.
const root = new URL('../', import.meta.url);
const episodes = await Promise.all(['home', 'school', 'identity'].map(name => readFile(new URL(`data/${name}.json`, root), 'utf8').then(JSON.parse)));
const story = compileStory(episodes);
const html = await readFile(new URL('index.html', root), 'utf8');
const controller = (await readFile(new URL('scripts/game.js', root), 'utf8')).replace(/^import .*;\r?\n/gm, '').replaceAll('import.meta.url', JSON.stringify(new URL('scripts/game.js', root).href));

class Element {
  constructor(tagName = 'div') {
    this.tagName = tagName.toUpperCase(); this.events = {}; this.children = [];
    this.dataset = {}; this.hidden = false; this.disabled = false; this.open = false;
    this.textContent = ''; this.firstChild = { textContent: '' };
  }
  append(...nodes) { nodes.forEach(node => { node.parent = this; this.children.push(node); }); }
  replaceChildren(...nodes) { this.children = []; this.append(...nodes); }
  addEventListener(name, callback) { this.events[name] = callback; }
  click() { if (!this.disabled) this.events.click?.({ target: this }); }
  focus() { this.focused = true; }
  setAttribute(name, value) { this[name] = value; }
  showModal() { this.open = true; }
  close() { this.open = false; }
  remove() {}
  closest() { return this.parent; }
}

async function boot({ saved = new Map(), blocked = false, failLoad = false } = {}) {
  const elements = new Map();
  for (const match of html.matchAll(/<(\w+)\b([^>]*)>/g)) {
    const id = match[2].match(/\bid="([^"]+)"/)?.[1];
    if (!id) continue;
    const el = new Element(match[1]);
    el.hidden = /\bhidden\b/.test(match[2]);
    el.disabled = /\bdisabled\b/.test(match[2]);
    elements.set(id, el);
  }
  const dialogs = [...elements.values()].filter(el => el.tagName === 'DIALOG');
  const document = {
    baseURI: 'https://example.test/LMC3206/', body: new Element('body'),
    getElementById: id => { assert.ok(elements.has(id), `Unknown DOM id ${id}`); return elements.get(id); },
    createElement: tag => new Element(tag),
    querySelectorAll: selector => selector === 'dialog' ? dialogs : [],
    querySelector: selector => selector === 'dialog[open]' ? dialogs.find(el => el.open) : null,
    addEventListener(name, callback) { this[name] = callback; }
  };
  const storage = new Map(saved);
  const context = vm.createContext({
    ...stateTools, document, URL, Blob, setTimeout: callback => callback(),
    window: { scrollTo() {} },
    loadStory: async () => { if (failLoad) throw new Error('Could not load home.json (HTTP 404).'); return story; },
    localStorage: {
      getItem(key) { if (blocked) throw new Error('Blocked'); return storage.get(key) ?? null; },
      setItem(key, value) { if (blocked) throw new Error('Blocked'); storage.set(key, value); }
    }
  });
  await vm.runInContext(`(async () => { ${controller}\n })()`, context);
  const el = id => elements.get(id);
  return { el, storage, document, dialogs };
}

test('real controller completes all episodes, renders journal, and handles replay confirmation', async () => {
  const { el } = await boot();
  assert.equal(el('begin-button').disabled, false);
  el('begin-button').click();
  let decisions = 0;
  for (let steps = 0; steps < 200 && el('end-screen').hidden; steps++) {
    const choices = el('choices').children;
    if (choices.length) { choices[decisions++ % 3].click(); }
    else el('next-button').click();
  }
  assert.equal(decisions, 9);
  assert.equal(el('end-screen').hidden, false);
  assert.equal(el('end-journal').children.length, 9);
  el('journal-button').click();
  assert.equal(el('journal-dialog').open, true);
  assert.equal(el('journal-entries').children.length, 9);
  assert.ok(el('transcript-entries').children.length > 50);
  el('journal-dialog').close();
  el('replay-button').click();
  assert.equal(el('restart-dialog').open, true);
  el('confirm-restart').click();
  assert.equal(el('restart-dialog').open, false);
  assert.equal(el('journal-count').textContent, '00');
  assert.equal(el('play-screen').hidden, false);
});

test('translations, context notes, title and resume work through their controls', async () => {
  const first = await boot();
  const { el } = first;
  el('begin-button').click();
  el('next-button').click();
  el('next-button').click();
  assert.equal(el('dialogue-text').lang, 'vi');
  assert.equal(el('translation-wrap').hidden, false);
  el('translations').events.change({ target: { checked: false } });
  assert.equal(el('translation-wrap').hidden, true);
  el('reveal-translation').click();
  assert.equal(el('translation-wrap').hidden, false);
  el('home-button').click();
  assert.equal(el('title-screen').hidden, false);
  assert.equal(el('resume-button').hidden, false);
  el('resume-button').click();
  assert.equal(el('dialogue-text').lang, 'vi');
  const reloaded = await boot({ saved: first.storage });
  assert.equal(reloaded.el('resume-button').hidden, false);
  assert.equal(reloaded.el('translations').checked, false);
  reloaded.el('resume-button').click();
  assert.equal(reloaded.el('dialogue-text').textContent, el('dialogue-text').textContent);
  while (!el('choices').children.length) el('next-button').click();
  el('context-button').click();
  assert.equal(el('context-dialog').open, true);
  assert.match(el('context-text').textContent, /Cơm/);
});

test('arrow keys do not skip choices or progress behind an open dialog', async () => {
  const { el, document } = await boot();
  el('begin-button').click();
  const key = value => document.keydown({ key: value, target: new Element(), preventDefault() {} });
  while (!el('choices').children.length) key('ArrowRight');
  const prompt = el('dialogue-text').textContent;
  key('ArrowRight');
  assert.equal(el('dialogue-text').textContent, prompt);
  el('choices').children[0].click();
  el('about-button').click();
  const text = el('dialogue-text').textContent;
  key('ArrowRight');
  assert.equal(el('dialogue-text').textContent, text);
  el('about-dialog').close();
  key('ArrowLeft');
  assert.equal(el('dialogue-text').textContent, prompt);
  assert.equal(el('journal-count').textContent, '00');
});

test('blocked storage keeps the story playable and reports temporary progress', async () => {
  const { el } = await boot({ blocked: true });
  el('begin-button').click();
  assert.equal(el('play-screen').hidden, false);
  assert.match(el('save-status').textContent, /Saving unavailable/);
  el('next-button').click();
  assert.equal(el('back-button').disabled, false);
});

test('invalid saves and data-load failures are visible without crashing', async () => {
  const invalid = await boot({ saved: new Map([[stateTools.SAVE_KEY, '{bad']]) });
  assert.equal(invalid.el('load-error').hidden, false);
  assert.equal(invalid.el('resume-button').hidden, true);
  invalid.el('begin-button').click();
  assert.equal(invalid.el('play-screen').hidden, false);
  const missing = await boot({ failLoad: true });
  assert.equal(missing.el('begin-button').disabled, true);
  assert.equal(missing.el('load-error').hidden, false);
  assert.match(missing.el('load-error').textContent, /404/);
});
