import test from 'node:test';
import assert from 'node:assert/strict';
import { createVolumeFlight, getFlightGeometry, getFlightFrames, VOLUME_FLIGHT_DURATION } from './volume-flight.js';

const shelfRect = { left: 100, top: 300, width: 50, height: 180 };
const readerRect = { left: 200, top: 100, width: 1000, height: 600 };
const viewport = { width: 1440, height: 900 };

test('the closed cover starts at the shelf spine and opens across the reader', () => {
  const geometry = getFlightGeometry(shelfRect, readerRect, viewport);
  assert.equal(geometry.width, 500);
  assert.equal(geometry.height, 600);
  assert.equal(geometry.visible, true);
  assert.match(geometry.shelf, /^translate3d\(100px, 300px, 0\) scale\(0.3\) rotateY\(/);
  assert.equal(geometry.opened, 'translate3d(700px, 100px, 0) scale(1) rotateY(0deg)');
  const angle = Number(geometry.shelf.match(/rotateY\(([^d]+)deg\)/)[1]);
  assert.ok(Math.abs(geometry.width * .3 * Math.cos(angle * Math.PI / 180) - shelfRect.width) < .001);
});

test('mobile and off-screen/direct-link origins produce finite flight coordinates', () => {
  for (const [width, height] of [[360, 640], [640, 360], [1920, 1080]]) {
    const rect = { left: 12, top: 70, width: width - 24, height: height - 110 };
    for (const source of [null, { ...shelfRect, top: 4000 }, { ...shelfRect, width: 0 }]) {
      const geometry = getFlightGeometry(source, rect, { width, height });
      assert.equal(geometry.visible, false);
      assert.ok(geometry.width > 0 && geometry.height > 0);
      assert.ok(!/NaN|Infinity/.test(geometry.shelf + geometry.opened + geometry.at(.5)));
    }
  }
});

test('flight uses a continuous sampled path, uniform scaling, and overlapping hinge timing', () => {
  const geometry = getFlightGeometry(shelfRect, readerRect, viewport);
  for (const opening of [true, false]) {
    const frames = getFlightFrames(geometry, opening);
    assert.equal(frames.length, 42);
    assert.equal(frames[0].offset, 0);
    assert.equal(frames.at(-1).offset, 1);
    assert.equal(frames[0].transform, opening ? geometry.shelf : geometry.opened);
    assert.equal(frames.at(-1).transform, opening ? geometry.opened : geometry.shelf);
    frames.forEach((frame, index) => {
      assert.match(frame.transform, /scale\([\d.]+\)/); // Never independent X/Y scales.
      if (index) assert.ok(frame.offset > frames[index - 1].offset);
    });
  }
});

// A small Web Animations/DOM double tests lifecycle, not rendered appearance.
function fixture({ automatic = true, fail = false } = {}) {
  const originals = Object.fromEntries(['document', 'innerWidth', 'innerHeight'].map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  const calls = [], layers = new Set();
  function node(name) {
    return {
      name, style: { opacity: '', visibility: '', setProperty(key, value) { this[key] = value; } },
      setAttribute() {},
      animate(frames, options) {
        if (fail) throw new Error('Animation unavailable');
        let resolve, reject;
        const finished = new Promise((yes, no) => { resolve = yes; reject = no; });
        const animation = { finished, cancel() { reject(new Error('cancelled')); }, finish: resolve };
        calls.push({ name, frames, options, animation });
        if (automatic) resolve();
        return animation;
      }
    };
  }
  const document = {
    body: { append(layer) { layers.add(layer); } },
    createElement() {
      const layer = node('layer'), actor = node('actor'), lid = node('lid'), label = node('label');
      layer.firstElementChild = actor;
      actor.querySelector = selector => selector === '.volume-flight-title' ? label : lid;
      layer.remove = () => layers.delete(layer);
      return layer;
    }
  };
  Object.assign(globalThis, { document, innerWidth: viewport.width, innerHeight: viewport.height });
  const source = node('source'), reader = node('reader');
  const flight = createVolumeFlight();
  return {
    flight, calls, layers, source, reader,
    run(opening = true, type = 'Book') {
      return flight.run({ volume: { title: 'About & More', type, color: 'sage' }, source, shelfRect, readerRect, reader, opening });
    },
    restore() {
      flight.cancel();
      for (const [key, descriptor] of Object.entries(originals)) {
        if (descriptor) Object.defineProperty(globalThis, key, descriptor);
        else delete globalThis[key];
      }
    }
  };
}

test('opening overlaps flight and unfolding, then reveals untransformed reader text', async () => {
  const f = fixture();
  try {
    await f.run();
    assert.deepEqual(f.calls.map(call => call.name), ['actor', 'lid', 'label', 'reader', 'layer']);
    assert.equal(f.calls[1].frames.at(-1).transform, 'rotateY(-180deg)');
    assert.equal(f.calls[3].frames.at(-1).opacity, 1);
    assert.ok(f.calls[3].frames.every(frame => !('transform' in frame)));
    assert.equal(new Set(f.calls.map(call => call.options.duration)).size, 1);
    assert.ok(f.calls.every(call => call.options.duration === VOLUME_FLIGHT_DURATION.open));
    assert.equal(VOLUME_FLIGHT_DURATION.open, 1600);
    assert.equal(f.layers.size, 0);
    assert.equal(f.source.style.visibility, '');
    assert.equal(f.reader.style.opacity, '');
    assert.ok(f.calls.every(call => call.frames.every(frame => Object.keys(frame).every(key => ['transform', 'opacity', 'offset', 'easing'].includes(key)))));
  } finally { f.restore(); }
});

test('binders retain their cover and rings, with one title that fades before shelving', async () => {
  const f = fixture();
  try {
    const running = f.run(false, 'Binder');
    const layer = [...f.layers][0];
    assert.match(layer.innerHTML, /volume-flight--binder/);
    assert.match(layer.innerHTML, /volume-flight-rings/);
    assert.match(layer.innerHTML, /About &amp; More/);
    assert.equal(layer.innerHTML.split('About &amp; More').length - 1, 1);
    assert.equal(layer.firstElementChild.style['--volume-cover'], '#3d5144');
    await running;
    assert.deepEqual(f.calls.map(call => call.name), ['actor', 'lid', 'label', 'reader', 'layer']);
    assert.equal(f.calls[1].frames.at(-1).transform, 'rotateY(0deg)');
    assert.equal(f.calls[0].frames.at(-1).transform, getFlightGeometry(shelfRect, readerRect, viewport).shelf);
    assert.equal(f.calls[2].frames.at(-1).opacity, 0);
    assert.ok(f.calls.every(call => call.options.duration === VOLUME_FLIGHT_DURATION.close));
    assert.equal(VOLUME_FLIGHT_DURATION.close, 1450);
    assert.equal(f.layers.size, 0);
  } finally { f.restore(); }
});

test('cancellation removes the overlay and restores the source without continuing phases', async () => {
  const f = fixture({ automatic: false });
  try {
    const running = f.run();
    assert.equal(f.source.style.visibility, 'hidden');
    assert.equal(f.layers.size, 1);
    f.flight.cancel();
    await running;
    assert.equal(f.calls.length, 5);
    assert.equal(f.layers.size, 0);
    assert.equal(f.source.style.visibility, '');
    f.reader.style.opacity = '.5';
    f.flight.cancel(); // Old cleanup must not overwrite a newer navigation.
    assert.equal(f.reader.style.opacity, '.5');
  } finally { f.restore(); }
});

test('animation errors still clean up decorative elements and visibility', async () => {
  const f = fixture({ fail: true });
  try {
    await assert.rejects(f.run(), /Animation unavailable/);
    assert.equal(f.layers.size, 0);
    assert.equal(f.source.style.visibility, '');
  } finally { f.restore(); }
});
