import test from 'node:test';
import assert from 'node:assert/strict';
import { volumes } from '../content/library.js';
import { libraryVolumes, resolveLibraryVolume, readingOffset, readingScroller, readingScrollTop, scrollReadingTo, applyVolumeCover, libraryCoverPalette } from './library-state.js';

test('each portfolio section has exactly one accessible shelf destination', () => {
  assert.deepEqual(libraryVolumes.map(volume => volume.id), volumes.filter(volume => !volume.hidden).map(volume => volume.id));
  assert.equal(new Set(libraryVolumes.map(volume => volume.id)).size, libraryVolumes.length);
  libraryVolumes.forEach(volume => {
    assert.equal(resolveLibraryVolume(`#${volume.id}`), volume);
    assert.ok(volume.title && volume.number);
  });
});

test('home, shelf and unknown hashes do not open an unrelated volume', () => {
  for (const hash of ['', '#hero', '#library', '#not a valid id', '#<script>']) {
    assert.equal(resolveLibraryVolume(hash), null);
  }
});

test('every shelf spine and open cover receives the same color, edging and ink', () => {
  for (const volume of libraryVolumes) {
    const shelfValues = {}, readerValues = {};
    applyVolumeCover({ style: { setProperty: (key, value) => { shelfValues[key] = value; } } }, volume);
    applyVolumeCover({ style: { setProperty: (key, value) => { readerValues[key] = value; } } }, volume);
    assert.deepEqual(shelfValues, readerValues);
    assert.equal(shelfValues['--volume-cover'], libraryCoverPalette[volume.color].cover);
    assert.ok(Object.values(shelfValues).every(value => /^#[0-9a-f]{6}$/i.test(value)));
  }
});

test('reading offset leaves standalone sections unchanged and reserves the library toolbar', () => {
  assert.equal(readingOffset({ dataset: {} }), 0);
  assert.equal(readingOffset({ dataset: { readerOffset: '60' } }), 60);
});

test('page navigation scrolls the private reader without moving the document', () => {
  const previous = globalThis.window;
  const documentScrolls = [];
  const readerScrolls = [];
  globalThis.window = { scrollY: 1400, scrollTo: options => documentScrolls.push(options) };
  try {
    const scroller = { scrollTop: 350, scrollTo: options => readerScrolls.push(options) };
    const section = { closest: selector => {
      assert.equal(selector, '.library-reader-volumes');
      return scroller;
    } };
    assert.equal(readingScroller(section), scroller);
    assert.equal(readingScrollTop(section), 350);
    scrollReadingTo(section, { top: 900, behavior: 'smooth' });
    assert.deepEqual(readerScrolls, [{ top: 900, behavior: 'smooth' }]);
    assert.deepEqual(documentScrolls, []);
    assert.equal(window.scrollY, 1400);
    const standalone = { closest: () => null };
    assert.equal(readingScroller(standalone), window);
    assert.equal(readingScrollTop(standalone), 1400);
    scrollReadingTo(standalone, { top: 0, behavior: 'instant' });
    assert.deepEqual(documentScrolls, [{ top: 0, behavior: 'instant' }]);
  } finally {
    if (previous === undefined) delete globalThis.window;
    else globalThis.window = previous;
  }
});
