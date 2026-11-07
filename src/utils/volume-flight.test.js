import test from 'node:test';
import assert from 'node:assert/strict';
import { createVolumeFlight, getFlightGeometry, getFlightFrames, VOLUME_FLIGHT_DURATION } from './volume-flight.js';

const shelfRect = { left: 100, top: 300, width: 50, height: 180 };
const readerRect = { left: 200, top: 100, width: 1000, height: 600 };
const viewport = { width: 1440, height: 900 };

test('shelf and reading cover have independent, fixed dimensions without zooming', () => {
  const geometry = getFlightGeometry(shelfRect, readerRect, viewport);
  assert.equal(geometry.width, 500);
  assert.equal(geometry.height, 600);
  assert.equal(geometry.shelfHeight, 180);
  assert.equal(geometry.shelfWidth, 180 * .68);
  assert.equal(geometry.visible, true);
  assert.match(geometry.shelf, /^translate3d\(100px, 300px, 0\) rotateY\(/);
  assert.match(geometry.withdrawn, /^translate3d\(118px, 280px, 0\) rotateY\(18deg\)/);
  assert.equal(geometry.opened, 'translate3d(700px, 100px, 0)');
  const angle = Number(geometry.shelf.match(/rotateY\(([^d]+)deg\)/)[1]);
  assert.ok(Math.abs(geometry.shelfWidth * Math.cos(angle * Math.PI / 180) - shelfRect.width) < .001);
  assert.doesNotMatch(geometry.shelf + geometry.withdrawn + geometry.opened, /scale/);
});

test('mobile and off-screen/direct-link origins produce finite, invisible shelf props', () => {
  for (const [width, height] of [[360, 640], [640, 360], [1920, 1080]]) {
    const rect = { left: 12, top: 70, width: width - 24, height: height - 110 };
    for (const source of [null, { ...shelfRect, top: 4000 }, { ...shelfRect, width: 0 }]) {
      const geometry = getFlightGeometry(source, rect, { width, height });
      assert.equal(geometry.visible, false);
      assert.ok(geometry.width > 0 && geometry.height > 0);
      assert.ok(!/NaN|Infinity/.test(geometry.shelf + geometry.withdrawn + geometry.opened));
      for (const opening of [true, false]) {
        assert.ok(getFlightFrames(geometry, opening).every(frame => frame.opacity === 0));
      }
    }
  }
});

test('pickup and return use a short shelf gesture, never a flight across the screen', () => {
  const geometry = getFlightGeometry(shelfRect, readerRect, viewport);
  for (const opening of [true, false]) {
    const frames = getFlightFrames(geometry, opening);
    assert.equal(frames.length, 4);
    assert.equal(frames[0].offset, 0);
    assert.equal(frames.at(-1).offset, 1);
    assert.equal(frames[0].transform, opening ? geometry.shelf : geometry.withdrawn);
    assert.equal(frames.at(-1).transform, opening ? geometry.withdrawn : geometry.shelf);
    frames.forEach((frame, index) => {
      assert.doesNotMatch(frame.transform, /scale/);
      assert.notEqual(frame.transform, geometry.opened);
      assert.ok(!('width' in frame) && !('height' in frame));
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
        calls.push({ name, element: this, frames, options, animation });
        if (automatic) resolve();
        return animation;
      }
    };
  }
  const document = {
    body: { append(layer) { layers.add(layer); } },
    createElement() {
      const layer = node('layer'), shelfActor = node('shelfActor'), readingActor = node('readingActor'), lid = node('lid');
      layer.querySelector = selector => selector === '.volume-flight--shelf' ? shelfActor : readingActor;
      readingActor.querySelector = () => lid;
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

test('opening uses fixed props, a hinge and untransformed reader text in under650ms', async () => {
  const f = fixture();
  try {
    const running = f.run();
    const layer = [...f.layers][0];
    const shelf = layer.querySelector('.volume-flight--shelf');
    const reading = layer.querySelector('.volume-flight--reader');
    assert.equal(shelf.style.width, `${180 * .68}px`);
    assert.equal(shelf.style.height, '180px');
    assert.equal(reading.style.width, '500px');
    assert.equal(reading.style.height, '600px');
    assert.equal(reading.style.transform, 'translate3d(700px, 100px, 0)');
    await running;
    assert.deepEqual(f.calls.map(call => call.name), ['shelfActor', 'readingActor', 'lid', 'reader', 'layer']);
    assert.equal(f.calls[2].frames.at(-1).transform, 'rotateY(-180deg)');
    assert.equal(f.calls[3].frames.at(-1).opacity, 1);
    assert.ok(f.calls[1].frames.every(frame => !('transform' in frame)));
    assert.ok(f.calls[3].frames.every(frame => !('transform' in frame)));
    assert.ok(f.calls.every(call => call.options.duration === VOLUME_FLIGHT_DURATION.open));
    assert.ok(VOLUME_FLIGHT_DURATION.open <= 650);
    assert.equal(f.layers.size, 0);
    assert.equal(f.source.style.visibility, '');
    assert.equal(f.reader.style.opacity, '');
    assert.ok(f.calls.every(call => call.frames.every(frame => {
      assert.doesNotMatch(frame.transform || '', /scale/);
      return Object.keys(frame).every(key => ['transform', 'opacity', 'offset', 'easing'].includes(key));
    })));
  } finally { f.restore(); }
});

test('return closes the reader cover then inserts the shelf book in under500ms', async () => {
  const f = fixture();
  try {
    const running = f.run(false, 'Binder');
    const layer = [...f.layers][0];
    assert.match(layer.innerHTML, /volume-flight--binder/);
    assert.match(layer.innerHTML, /volume-flight-rings/);
    assert.match(layer.innerHTML, /About &amp; More/);
    assert.equal(layer.querySelector('.volume-flight--shelf').style['--volume-cover'], '#3d5144');
    assert.equal(layer.querySelector('.volume-flight--reader').style['--volume-cover'], '#3d5144');
    await running;
    assert.equal(f.calls[2].frames.at(-1).transform, 'rotateY(0deg)');
    assert.equal(f.calls[0].frames.at(-1).transform, getFlightGeometry(shelfRect, readerRect, viewport).shelf);
    assert.equal(f.calls[0].frames.at(-1).opacity, 1);
    assert.ok(f.calls.every(call => call.options.duration === VOLUME_FLIGHT_DURATION.close));
    assert.ok(VOLUME_FLIGHT_DURATION.close <= 500);
    assert.equal(f.layers.size, 0);
  } finally { f.restore(); }
});

test('cancellation removes both props and restores previous styles without later phases', async () => {
  const f = fixture({ automatic: false });
  try {
    f.source.style.visibility = 'visible';
    f.reader.style.opacity = '.75';
    const running = f.run();
    assert.equal(f.source.style.visibility, 'hidden');
    assert.equal(f.layers.size, 1);
    f.flight.cancel();
    await running;
    assert.equal(f.calls.length, 5);
    assert.equal(f.layers.size, 0);
    assert.equal(f.source.style.visibility, 'visible');
    assert.equal(f.reader.style.opacity, '.75');
    f.reader.style.opacity = '.5';
    f.flight.cancel(); // Old cleanup must not overwrite a newer navigation.
    assert.equal(f.reader.style.opacity, '.5');
  } finally { f.restore(); }
});

test('starting another transition cancels the first without removing its replacement', async () => {
  const f = fixture({ automatic: false });
  try {
    const first = f.run();
    const previousLayer = [...f.layers][0];
    const second = f.run(false);
    await first;
    assert.equal(f.layers.size, 1);
    assert.ok(!f.layers.has(previousLayer));
    assert.equal(f.source.style.visibility, 'hidden');
    assert.equal(f.calls.length, 10);
    f.calls.slice(5).forEach(call => call.animation.finish());
    await second;
    assert.equal(f.layers.size, 0);
    assert.equal(f.source.style.visibility, '');
    assert.equal(f.reader.style.opacity, '');
  } finally { f.restore(); }
});

test('animation errors still clean up decorative elements and visibility', async () => {
  const f = fixture({ fail: true });
  try {
    await assert.rejects(f.run(), /Animation unavailable/);
    assert.equal(f.layers.size, 0);
    assert.equal(f.source.style.visibility, '');
    assert.equal(f.reader.style.opacity, '');
  } finally { f.restore(); }
});
