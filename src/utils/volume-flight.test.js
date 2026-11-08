import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createVolumeFlight, getFlightGeometry, getFlightFrames, VOLUME_FLIGHT_DURATION } from './volume-flight.js';

const shelfRect = { left: 100, top: 300, width: 50, height: 180 };
const readerRect = { left: 200, top: 100, width: 1000, height: 600 };
const viewport = { width: 1440, height: 900 };

test('the shelf prop has real spine thickness and independent fixed cover dimensions', () => {
  const geometry = getFlightGeometry(shelfRect, readerRect, viewport);
  assert.equal(geometry.width, 500);
  assert.equal(geometry.height, 600);
  assert.equal(geometry.shelfHeight, 180);
  assert.equal(geometry.shelfWidth, 180 * .68);
  assert.equal(geometry.thickness, shelfRect.width);
  assert.equal(geometry.visible, true);
  assert.equal(geometry.shelfPosition, 'translate3d(125px, 300px, 0)');
  assert.equal(geometry.shelf, 'translate3d(0, 0, 0) rotateZ(0deg) rotateY(90deg)');
  assert.equal(geometry.opened, 'translate3d(700px, 100px, 0)');
  // At 90 degrees the cover is edge-on: the visible width comes from the
  // distinct spine face, not from compressing the front cover to fit the slot.
  const yaw = Number(geometry.shelf.match(/rotateY\(([^d]+)deg\)/)[1]) * Math.PI / 180;
  const footprint = geometry.shelfWidth * Math.abs(Math.cos(yaw)) + geometry.thickness * Math.abs(Math.sin(yaw));
  assert.ok(Math.abs(footprint - shelfRect.width) < .001);
  assert.doesNotMatch(geometry.shelf + geometry.extracted + geometry.withdrawn + geometry.opened, /scale/);
});

test('mobile and off-screen/direct-link origins produce finite, invisible shelf props', () => {
  for (const [width, height] of [[360, 640], [640, 360], [1920, 1080]]) {
    const rect = { left: 12, top: 70, width: width - 24, height: height - 110 };
    for (const source of [null, { ...shelfRect, top: 4000 }, { ...shelfRect, width: 0 }]) {
      const geometry = getFlightGeometry(source, rect, { width, height });
      assert.equal(geometry.visible, false);
      assert.ok(geometry.width > 0 && geometry.height > 0);
      assert.ok(geometry.shelfWidth >= geometry.thickness && geometry.thickness > 0);
      assert.ok(!/NaN|Infinity/.test(geometry.shelfPosition + geometry.shelf + geometry.extracted + geometry.withdrawn + geometry.opened));
      for (const opening of [true, false]) {
        assert.ok(getFlightFrames(geometry, opening).every(frame => !('opacity' in frame)));
      }
    }
  }
});

test('pickup extracts the spine before pivoting and return reverses that rigid motion', () => {
  const geometry = getFlightGeometry(shelfRect, readerRect, viewport);
  assert.equal(geometry.extracted, `translate3d(0, -10px, ${geometry.shelfWidth + 14}px) rotateZ(0deg) rotateY(90deg)`);
  assert.equal(geometry.withdrawn, `translate3d(18px, -18px, ${geometry.shelfWidth + 14}px) rotateZ(-4deg) rotateY(25deg)`);
  const openingFrames = getFlightFrames(geometry, true);
  const closingFrames = getFlightFrames(geometry, false);
  assert.deepEqual(openingFrames.map(frame => frame.offset), [0, .18, .24, .42, 1]);
  assert.deepEqual(openingFrames.map(frame => frame.transform), [geometry.shelf, geometry.extracted, geometry.extracted, geometry.withdrawn, geometry.withdrawn]);
  assert.deepEqual(closingFrames.map(frame => frame.transform), openingFrames.map(frame => frame.transform).reverse());
  closingFrames.forEach((frame, index) => {
    assert.ok(Math.abs(frame.offset - (1 - openingFrames.at(-index - 1).offset)) < 1e-8);
  });
  for (const opening of [true, false]) {
    const frames = getFlightFrames(geometry, opening);
    assert.equal(frames.length, 5);
    assert.equal(frames[0].offset, 0);
    assert.equal(frames.at(-1).offset, 1);
    assert.equal(frames[0].transform, opening ? geometry.shelf : geometry.withdrawn);
    assert.equal(frames.at(-1).transform, opening ? geometry.withdrawn : geometry.shelf);
    frames.forEach((frame, index) => {
      assert.doesNotMatch(frame.transform, /scale/);
      assert.notEqual(frame.transform, geometry.opened);
      assert.ok(!('opacity' in frame), 'fade the wrapper without flattening the 3D body');
      assert.ok(!('width' in frame) && !('height' in frame));
      if (index) assert.ok(frame.offset > frames[index - 1].offset);
    });
  }
});

test('shelf books on either side lean toward the reader without changing their dimensions', () => {
  const left = getFlightGeometry(shelfRect, readerRect, viewport);
  const right = getFlightGeometry({ ...shelfRect, left: 1100 }, readerRect, viewport);
  assert.equal(right.shelfWidth, left.shelfWidth);
  assert.equal(right.shelfHeight, left.shelfHeight);
  assert.equal(right.thickness, left.thickness);
  assert.match(right.withdrawn, /^translate3d\(-18px, -18px, [^)]+\) rotateZ\(4deg\) rotateY\(25deg\)$/);
});

test('the shelf camera supplies perspective to a preserve-3d rigid body with six oriented faces', () => {
  const css = readFileSync(new URL('../styles/volume-flight.css', import.meta.url), 'utf8');
  const rules = Object.fromEntries([...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(([, selector, declarations]) => [selector.trim(), declarations]));
  assert.match(rules['.volume-flight--shelf'], /perspective:\s*\d+px/);
  assert.match(rules['.volume-flight--shelf'], /perspective-origin:\s*0 50%/);
  assert.match(rules['.volume-flight-solid'], /transform-style:\s*preserve-3d/);
  assert.match(rules['.volume-flight-solid'], /transform-origin:\s*0 50%/);
  assert.doesNotMatch(rules['.volume-flight-solid'], /(?:opacity|overflow|filter):/);
  assert.match(rules['.volume-flight-solid > div'], /backface-visibility:\s*hidden/);
  assert.match(rules['.volume-flight-solid-front'], /translateZ\(calc\(var\(--book-depth\) \/ 2\)\)/);
  assert.match(rules['.volume-flight-solid-back'], /rotateY\(180deg\)/);
  assert.match(rules['.volume-flight-solid-spine'], /rotateY\(-90deg\)/);
  assert.match(rules['.volume-flight-solid-foreedge'], /rotateY\(90deg\)/);
  assert.match(rules['.volume-flight-solid-top'], /rotateX\(90deg\)/);
  assert.match(rules['.volume-flight-solid-bottom'], /rotateX\(-90deg\)/);
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
      const layer = node('layer'), shelfActor = node('shelfActor'), solid = node('solid'), readingActor = node('readingActor'), lid = node('lid');
      layer.querySelector = selector => selector === '.volume-flight--shelf' ? shelfActor : readingActor;
      shelfActor.querySelector = () => solid;
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
    run(opening = true, type = 'Book', origin = shelfRect) {
      return flight.run({ volume: { title: 'About & More', type, color: 'sage' }, source, shelfRect: origin, readerRect, reader, opening });
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

test('opening uses a six-face solid, a separate hinge and untransformed reader text over two seconds', async () => {
  const f = fixture();
  try {
    const running = f.run();
    const layer = [...f.layers][0];
    const shelf = layer.querySelector('.volume-flight--shelf');
    const solid = shelf.querySelector('.volume-flight-solid');
    const reading = layer.querySelector('.volume-flight--reader');
    for (const face of ['front', 'back', 'spine', 'foreedge', 'top', 'bottom']) {
      assert.match(layer.innerHTML, new RegExp(`volume-flight-solid-${face}`));
    }
    assert.equal(shelf.style.width, `${180 * .68}px`);
    assert.equal(shelf.style.height, '180px');
    assert.equal(shelf.style['--book-depth'], '50px');
    assert.equal(reading.style.width, '500px');
    assert.equal(reading.style.height, '600px');
    assert.equal(reading.style.transform, 'translate3d(700px, 100px, 0)');
    assert.equal(shelf.style.transform, 'translate3d(125px, 300px, 0)');
    assert.equal(solid.style.transform, getFlightGeometry(shelfRect, readerRect, viewport).shelf);
    await running;
    assert.deepEqual(f.calls.map(call => call.name), ['solid', 'shelfActor', 'readingActor', 'lid', 'reader', 'layer']);
    assert.equal(f.calls[3].frames.at(-1).transform, 'rotateY(-180deg)');
    assert.equal(f.calls[4].frames.at(-1).opacity, 1);
    assert.ok(f.calls[1].frames.every(frame => !('transform' in frame)));
    assert.ok(f.calls[2].frames.every(frame => !('transform' in frame)));
    assert.ok(f.calls[4].frames.every(frame => !('transform' in frame)));
    const pivotEnd = f.calls[0].frames.find(frame => frame.transform === getFlightGeometry(shelfRect, readerRect, viewport).withdrawn).offset;
    const shelfLastOpaque = f.calls[1].frames.filter(frame => frame.opacity === 1).at(-1).offset;
    assert.ok(shelfLastOpaque >= pivotEnd, 'keep both solid faces visible through the pivot');
    assert.ok(f.calls.every(call => call.options.duration === VOLUME_FLIGHT_DURATION.open));
    assert.equal(VOLUME_FLIGHT_DURATION.open, 2000);
    assert.equal(f.layers.size, 0);
    assert.equal(f.source.style.visibility, '');
    assert.equal(f.reader.style.opacity, '');
    assert.ok(f.calls.every(call => call.frames.every(frame => {
      assert.doesNotMatch(frame.transform || '', /scale/);
      return Object.keys(frame).every(key => ['transform', 'opacity', 'offset', 'easing'].includes(key));
    })));
  } finally { f.restore(); }
});

test('direct links never show a phantom shelf book', async () => {
  const f = fixture();
  try {
    await f.run(true, 'Book', null);
    assert.ok(f.calls.find(call => call.name === 'shelfActor').frames.every(frame => frame.opacity === 0));
    assert.equal(f.layers.size, 0);
    assert.equal(f.reader.style.opacity, '');
  } finally { f.restore(); }
});

test('return closes the reader cover then inserts the shelf book over 1.8 seconds', async () => {
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
    assert.equal(f.calls[3].frames.at(-1).transform, 'rotateY(0deg)');
    assert.equal(f.calls[0].frames.at(-1).transform, getFlightGeometry(shelfRect, readerRect, viewport).shelf);
    assert.equal(f.calls[1].frames.at(-1).opacity, 1);
    assert.ok(f.calls.every(call => call.options.duration === VOLUME_FLIGHT_DURATION.close));
    assert.equal(VOLUME_FLIGHT_DURATION.close, 1800);
    assert.equal(f.layers.size, 0);
  } finally { f.restore(); }
});

for (const opening of [true, false]) {
  test(`${opening ? 'opening' : 'return'} gives every motion and handoff a readable duration in sequence`, async () => {
    const f = fixture();
    try {
      await f.run(opening);
      const tracks = Object.fromEntries(f.calls.map(call => [call.name, call]));
      const geometry = getFlightGeometry(shelfRect, readerRect, viewport);
      function phase(trackName, predicate) {
        const { frames, options } = tracks[trackName];
        const index = frames.findIndex((frame, index) => index > 0 && predicate(frames[index - 1], frame));
        assert.ok(index > 0, `${trackName} must contain the expected phase`);
        return { start: frames[index - 1].offset, end: frames[index].offset,
          milliseconds: (frames[index].offset - frames[index - 1].offset) * options.duration };
      }
      const between = (first, second) => (previous, next) =>
        (previous.transform === first && next.transform === second) ||
        (previous.transform === second && next.transform === first);
      const phases = {
        pull: phase('solid', between(geometry.shelf, geometry.extracted)),
        rest: phase('solid', between(geometry.extracted, geometry.extracted)),
        turn: phase('solid', between(geometry.extracted, geometry.withdrawn)),
        handoff: phase('shelfActor', (previous, next) => previous.opacity !== next.opacity),
        hinge: phase('lid', (previous, next) => previous.transform !== next.transform),
        pageFade: phase('reader', (previous, next) => previous.opacity !== next.opacity)
      };
      for (const [name, minimum] of Object.entries({ pull: 300, rest: 100, turn: 300, handoff: 250, hinge: 450, pageFade: 250 })) {
        assert.ok(phases[name].milliseconds + 1e-6 >= minimum,
          `${name} should last at least ${minimum}ms, received ${phases[name].milliseconds}ms`);
      }
      const sequence = opening
        ? ['pull', 'rest', 'turn', 'handoff', 'hinge', 'pageFade']
        : ['pageFade', 'hinge', 'handoff', 'turn', 'rest', 'pull'];
      sequence.slice(1).forEach((name, index) => {
        const previous = sequence[index];
        assert.ok(phases[previous].end <= phases[name].start + 1e-8,
          `${previous} should finish before ${name} begins`);
      });
      assert.equal(f.layers.size, 0);
    } finally { f.restore(); }
  });
}

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
    assert.equal(f.calls.length, 6);
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
    assert.equal(f.calls.length, 12);
    f.calls.slice(6).forEach(call => call.animation.finish());
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
