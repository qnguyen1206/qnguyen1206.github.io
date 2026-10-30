import test from 'node:test';
import assert from 'node:assert/strict';
import { bindReaderInteractions, readerWheelDelta } from './reader-interactions.js';

function fixture() {
  const handlers = new Map();
  const toolbarHandlers = new Map();
  function element(selector, parentElement = null) {
    return {
      selector, parentElement, scrollHeight: 0, clientHeight: 0, scrollTop: 0,
      closest(selectors) {
        const names = selectors.split(',').map(name => name.trim());
        for (let node = this; node; node = node.parentElement) {
          if (names.includes(node.selector)) return node;
        }
        return null;
      }
    };
  }
  const reader = element('#library-reader');
  reader.contains = target => {
    for (let node = target; node; node = node.parentElement) if (node === reader) return true;
    return false;
  };
  reader.addEventListener = (type, handler) => handlers.set(type, handler);
  reader.removeEventListener = type => handlers.delete(type);
  const toolbar = element('.library-reader-toolbar', reader);
  toolbar.addEventListener = (type, handler) => toolbarHandlers.set(type, handler);
  toolbar.removeEventListener = type => toolbarHandlers.delete(type);
  reader.querySelector = selector => selector === '.library-reader-toolbar' ? toolbar : null;
  const scroller = element('.library-reader-volumes', reader);
  Object.assign(scroller, {
    scrollHeight: 2600, clientHeight: 600,
    ownerDocument: { defaultView: { getComputedStyle: node => ({ overflowY: node.overflowY || 'visible' }) } },
    scrollTo({ top }) { this.scrollTop = top; }
  });
  const state = { open: true, overlay: false, closes: 0 };
  const cleanup = bindReaderInteractions(reader, scroller, {
    isOpen: () => state.open,
    hasOverlay: () => state.overlay,
    close: () => { state.closes++; }
  });
  function emit(type, target = scroller, extra = {}) {
    const event = {
      target, button: 0, clientX: 20, clientY: 30, deltaX: 0, deltaY: 100, deltaMode: 0,
      cancelable: true, defaultPrevented: false, ctrlKey: false,
      preventDefault() { this.defaultPrevented = true; }, ...extra
    };
    handlers.get(type)?.(event);
    if (target.closest('.library-reader-toolbar') === toolbar) toolbarHandlers.get(type)?.(event);
    return event;
  }
  return { reader, scroller, toolbar, state, emit, element, cleanup, handlers, toolbarHandlers };
}

test('a deliberate click on the background closes the reader', () => {
  const f = fixture();
  f.emit('pointerdown');
  f.emit('click');
  assert.equal(f.state.closes, 1);
});

test('book surfaces, controls, links, and overlays never dismiss the reader', () => {
  for (const selector of ['.about-book', '.experience-binder', '.publication-cover',
    '.library-reader-toolbar', '.publication-controls', '.about-book-controls',
    '.publication-toolbar', '.blog-modal', '.project-modal-overlay', 'a', 'button', 'select']) {
    const f = fixture();
    const target = f.element('span', f.element(selector, f.scroller));
    f.emit('pointerdown', target);
    f.emit('click', target);
    assert.equal(f.state.closes, 0, selector);
  }
  const f = fixture();
  f.state.overlay = true;
  f.emit('pointerdown');
  f.state.overlay = false; // An overlay closed during this same interaction.
  f.emit('click');
  assert.equal(f.state.closes, 0);
});

test('dragging out of a book, swiping, and scrolling do not count as outside clicks', () => {
  const f = fixture();
  f.emit('pointerdown', f.element('.about-book', f.scroller));
  f.emit('click');
  f.emit('pointerdown');
  f.emit('pointermove', f.scroller, { clientY: 60 });
  f.emit('click');
  f.emit('pointerdown');
  f.emit('pointercancel');
  f.emit('click');
  f.emit('pointerdown');
  f.scroller.scrollTop = 50;
  f.emit('click');
  assert.equal(f.state.closes, 0);
});

test('wheel units normalize mouse, trackpad, line, and page deltas', () => {
  assert.equal(readerWheelDelta({ deltaY: 2.5, deltaMode: 0 }, 600), 2.5);
  assert.equal(readerWheelDelta({ deltaY: -3, deltaMode: 1 }, 600), -48);
  assert.equal(readerWheelDelta({ deltaY: 1, deltaMode: 2 }, 600), 600);
  assert.equal(readerWheelDelta({ deltaY: NaN, deltaMode: 0 }, 600), 0);
});

test('book and binder wheel events stay native with no blocking listener above them', () => {
  for (const selector of ['.about-book', '.experience-binder', '.publication-cover']) {
    const f = fixture();
    const target = f.element(selector, f.scroller);
    assert.equal(f.handlers.has('wheel'), false);
    for (const deltaY of [100, -40, 10000, -10000]) {
      assert.equal(f.emit('wheel', target, { deltaY }).defaultPrevented, false);
    }
    assert.equal(f.scroller.scrollTop, 0);
    assert.equal(f.state.closes, 0);
  }
});

test('text scrolling and boundary scroll chaining are left to the browser', () => {
  const f = fixture();
  const text = f.element('.about-book-copy', f.scroller);
  Object.assign(text, { scrollHeight: 400, clientHeight: 200, scrollTop: 50, overflowY: 'auto' });
  assert.equal(f.emit('wheel', text).defaultPrevented, false);
  assert.equal(f.scroller.scrollTop, 0);
  text.scrollTop = 200;
  assert.equal(f.emit('wheel', text).defaultPrevented, false);
  assert.equal(f.scroller.scrollTop, 0);
});

test('only the toolbar forwards wheel input, clamping both ends of the reader', () => {
  const f = fixture();
  assert.equal(f.emit('wheel', f.toolbar).defaultPrevented, true);
  assert.equal(f.scroller.scrollTop, 100);
  f.emit('wheel', f.toolbar, { deltaY: -40 });
  assert.equal(f.scroller.scrollTop, 60);
  f.emit('wheel', f.toolbar, { deltaY: 10000 });
  assert.equal(f.scroller.scrollTop, 2000);
  f.emit('wheel', f.toolbar, { deltaY: -10000 });
  assert.equal(f.scroller.scrollTop, 0);
  assert.equal(f.state.closes, 0);
});

test('zoom, horizontal gestures, form controls, and modal scrolling remain native', () => {
  const f = fixture();
  for (const extra of [{ ctrlKey: true }, { deltaX: 200 }, { cancelable: false }]) {
    assert.equal(f.emit('wheel', f.toolbar, extra).defaultPrevented, false);
  }
  assert.equal(f.emit('wheel', f.element('select', f.toolbar)).defaultPrevented, false);
  f.state.overlay = true;
  assert.equal(f.emit('wheel', f.toolbar).defaultPrevented, false);
  f.state.overlay = false;
  f.state.open = false;
  assert.equal(f.emit('wheel', f.toolbar).defaultPrevented, false);
  assert.equal(f.scroller.scrollTop, 0);
  f.cleanup();
  assert.equal(f.handlers.size, 0);
  assert.equal(f.toolbarHandlers.size, 0);
});
