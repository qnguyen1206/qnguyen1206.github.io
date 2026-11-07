import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { createBinderTimeline, getBinderFrame, getBinderTear } from './binder-scroll.js';
import { createPageFitter } from './page-fit.js';
import { createPageWindow } from './page-window.js';

// Execute the real controller with a small DOM fixture. Its CSS imports are
// browser-only; inject the same JS dependencies instead of requiring a bundler.
const controller = readFileSync(new URL('./publication.js', import.meta.url), 'utf8')
  .replace(/^import .*;\r?$/gm, '').replace(/^export /gm, '');

function fixture({ kind = 'book', compact = false, reduced = false, hidden = false } = {}) {
  const frames = new Map();
  const state = { scroll: 0, clones: 0, measures: 0 };
  let serial = 0;
  class Element {
    constructor() {
      this.children = [];
      this.dataset = {};
      this.attributes = new Map();
      this.handlers = new Map();
      this.style = { setProperty(name, value) { this[name] = value; } };
      this.hidden = false;
      this.classList = { add() {} };
    }
    addEventListener(type, handler, options = {}) {
      const handlers = this.handlers.get(type) || [];
      handlers.push({ handler, signal: options.signal });
      this.handlers.set(type, handlers);
    }
    emit(type) {
      this.handlers.get(type)?.forEach(({ handler, signal }) => {
        if (!signal?.aborted) handler({ type });
      });
    }
    append(node) { this.children.push(node); }
    replaceChildren() { this.children = []; }
    setAttribute(name, value) { this.attributes.set(name, value); }
    removeAttribute(name) { this.attributes.delete(name); }
    contains() { return false; }
    querySelector() { return null; }
    querySelectorAll(selector) { return selector === '[id]' ? this.children : []; }
    focus() {}
    getBoundingClientRect() { return { top: -state.scroll, left: 60 }; }
    cloneNode(deep) {
      assert.equal(deep, true);
      state.clones++;
      const copy = new Element();
      copy.textContent = this.textContent;
      copy.setAttribute('id', 'cloned-panel');
      const child = new Element();
      child.setAttribute('id', 'cloned-child');
      copy.append(child);
      return copy;
    }
  }
  function panel(text) {
    const node = new Element();
    const content = new Element();
    node.textContent = text;
    node.clientWidth = 550;
    node.clientHeight = 650;
    Object.defineProperty(content, 'scrollHeight', { get() { state.measures++; return 100; } });
    node.querySelector = selector => selector === '.publication-content' ? content : null;
    return node;
  }
  const spreads = Array.from({ length: 3 }, (_, index) => {
    const spread = new Element();
    spread.panels = [panel(`Left ${index}`), panel(`Right ${index}`)];
    spread.querySelector = selector => spread.panels[selector.endsWith('--right') ? 1 : 0];
    spread.querySelectorAll = selector => selector === '.publication-panel' ? spread.panels : [];
    return spread;
  });
  const section = new Element();
  section.hidden = hidden;
  const stage = new Element();
  stage.offsetHeight = 800;
  const surface = new Element();
  surface.clientWidth = 1100;
  surface.clientHeight = 650;
  const flip = kind === 'book' ? new Element() : null;
  const select = new Element();
  const controls = new Map([
    ['.publication-stage', stage], ['.publication-surface', surface],
    ['.publication-flip', flip], ['.publication-controls select', select],
    ['.publication-status', new Element()],
    ['[data-publication-prev]', new Element()], ['[data-publication-next]', new Element()]
  ]);
  section.querySelector = selector => controls.get(selector) || null;
  section.querySelectorAll = selector => selector === '.publication-spread' ? spreads : [];
  const window = new Element();
  window.innerWidth = compact ? 390 : 1440;
  const media = new Map();
  const context = {
    createBinderTimeline, getBinderFrame, getBinderTear, createPageFitter, createPageWindow,
    readingOffset: () => 0, readingScrollTop: () => state.scroll,
    readingScroller: () => window, scrollReadingTo: (_, { top }) => { state.scroll = top; window.emit('scroll'); },
    document: { activeElement: null, createElement: () => new Element() }, window,
    matchMedia(query) {
      const result = new Element();
      result.matches = query.includes('reduced') ? reduced : compact;
      media.set(query, result);
      return result;
    },
    AbortController,
    ResizeObserver: class { observe() {} disconnect() {} },
    requestAnimationFrame(callback) { const id = ++serial; frames.set(id, callback); return id; },
    cancelAnimationFrame(id) { frames.delete(id); }
  };
  runInNewContext(controller, context);
  const api = context.mountPublication(section, {
    title: 'Test publication', subtitle: 'Three complete chapters', kind,
    entries: spreads.map((_, index) => ({ label: `Chapter ${index}`, left: 'left', right: 'right', html: 'sheet' }))
  });
  function flush() {
    let count = 0;
    while (frames.size) {
      assert.ok(count++ < 10, 'No perpetual animation frame loop');
      const [id, callback] = frames.entries().next().value;
      frames.delete(id);
      callback();
    }
  }
  flush();
  const timeline = createBinderTimeline(3, 800);
  return {
    api, section, flip, spreads, state, frames, window, media, controls, flush,
    turn(progress, index = 0) {
      const entry = timeline[index];
      state.scroll = entry.turnStart + (entry.end - entry.turnStart) * progress;
      window.emit('scroll');
      flush();
    }
  };
}

test('a book turn has only two rich page clones and reuses them through the gesture', () => {
  const f = fixture();
  assert.equal(f.state.clones, 0);
  f.turn(.25);
  assert.equal(f.state.clones, 2);
  assert.equal(f.flip.children.length, 2);
  assert.equal(f.flip.children[0].children[0].textContent, 'Right 0');
  assert.equal(f.flip.children[1].children[0].textContent, 'Left 1');
  for (const face of f.flip.children) {
    const copy = face.children[0];
    assert.equal(copy.attributes.has('id'), false);
    assert.equal(copy.children[0].attributes.has('id'), false);
  }
  f.turn(.5);
  assert.equal(f.state.clones, 2);
  assert.equal(f.flip.style.transform, 'rotateY(-90deg)');
  assert.equal(f.controls.get('.publication-controls select').value, '1');
  assert.equal(f.spreads[0].inert, true);
  assert.equal(f.spreads[1].inert, false);
  f.turn(.1); // Reverse before settling without constructing another leaf.
  assert.equal(f.state.clones, 2);
  f.turn(0);
  assert.equal(f.flip.hidden, true);
  assert.equal(f.flip.children.length, 0);
  f.api.destroy();
});

test('finishing, hiding, or destroying a turn removes all transient leaf content', () => {
  const f = fixture();
  f.turn(.7);
  f.turn(1);
  assert.equal(f.flip.hidden, true);
  assert.equal(f.flip.children.length, 0);
  f.turn(.2, 1);
  f.section.hidden = true;
  f.section.emit('library:deactivate');
  assert.equal(f.flip.children.length, 0);
  assert.equal(f.frames.size, 0);
  f.window.emit('resize');
  f.window.emit('scroll');
  assert.equal(f.frames.size, 0, 'Hidden volumes schedule no layout or render work');
  f.section.hidden = false;
  f.section.emit('library:activate');
  f.flush();
  assert.equal(f.flip.children.length, 2, 'Reopening rebuilds the current leaf if needed');
  f.api.destroy();
  assert.equal(f.flip.children.length, 0);
  assert.equal(f.frames.size, 0);
});

test('reduced motion and compact readers never construct a desktop leaf', () => {
  for (const options of [{ reduced: true }, { compact: true }]) {
    const f = fixture(options);
    f.turn(.75);
    assert.equal(f.state.clones, 0);
    assert.equal(f.flip.hidden, true);
    assert.equal(f.spreads[1].inert, false);
    f.api.destroy();
  }
});

test('a hidden publication waits until activation to measure any pages', () => {
  const f = fixture({ hidden: true });
  assert.equal(f.state.measures, 0);
  assert.equal(f.frames.size, 0);
  f.window.emit('resize');
  assert.equal(f.frames.size, 0);
  f.section.hidden = false;
  f.section.emit('library:activate');
  f.flush();
  assert.equal(f.state.measures, 2, 'Only the visible spread is fitted');
  f.api.destroy();
});

test('binder sheets retain their slide and tear without any cloned page faces', () => {
  const f = fixture({ kind: 'binder' });
  f.turn(.5);
  assert.equal(f.state.clones, 0);
  assert.equal(f.spreads[0].dataset.tearing, 'true');
  assert.match(f.spreads[0].style.transform, /^translate3d\(.+\) rotate\(/);
  assert.equal(f.spreads[0].style.getPropertyValue?.('--tear-cut') || f.spreads[0].style['--tear-cut'], '10px');
  f.api.destroy();
});
