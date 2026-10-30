import test from 'node:test';
import assert from 'node:assert/strict';
import { createPageWindow } from './page-window.js';
import { createBinderTimeline, getBinderFrame } from './binder-scroll.js';
import { getPageBend } from './book-turn.js';

test('only active pages and pages leaving the window need DOM updates', () => {
  const window = createPageWindow();
  assert.deepEqual([...window.update([0])], [0]);
  assert.deepEqual([...window.update([0, 1])], [0, 1]);
  assert.deepEqual([...window.update([0, 1])], [0, 1]);
  assert.deepEqual([...window.update([1])], [0, 1]);
  assert.deepEqual([...window.update([1])], [1]);
});

test('jumping chapters and reversing updates outgoing pages without touching unrelated ones', () => {
  const window = createPageWindow();
  window.update([0, 1]);
  assert.deepEqual([...window.update([20, 21])], [0, 1, 20, 21]);
  assert.deepEqual([...window.update([0, 1])], [20, 21, 0, 1]);
  window.reset();
  assert.deepEqual([...window.update([7])], [7]);
});

test('all pages remain reachable in both directions, even with 100 sheets', () => {
  const timeline = createBinderTimeline(100, 800);
  const window = createPageWindow();
  const seen = new Set();
  for (const index of [...timeline.keys(), ...[...timeline.keys()].reverse()]) {
    const state = getBinderFrame(timeline[index].start, timeline);
    assert.equal(state.selected, index);
    const dirty = window.update([state.index]);
    assert.ok(dirty.has(index));
    assert.ok(dirty.size <= 2);
    seen.add(state.selected);
  }
  assert.equal(seen.size, 100);
});

test('16-strip paper remains continuous, flat at rest, and finite in either direction', () => {
  const count = 16;
  for (const width of [150, 375, 700]) {
    for (const turn of [0, .01, .25, .5, .75, .99, 1, .75, .25, 0]) {
      const shape = getPageBend(turn, width, count);
      assert.equal(shape.strips.length, count);
      assert.ok(Math.abs(shape.rotation - (-180 * turn * turn * (3 - 2 * turn))) < 1e-9);
      shape.strips.forEach((strip, i) => {
        assert.ok(Object.values(strip).every(Number.isFinite));
        if (i) {
          const previous = shape.strips[i - 1];
          const angle = previous.angle * Math.PI / 180;
          assert.ok(Math.abs(strip.x - previous.x - width / count * Math.cos(angle)) < 1e-9);
          assert.ok(Math.abs(strip.z - previous.z + width / count * Math.sin(angle)) < 1e-9);
        }
      });
      if (turn === 0 || turn === 1) assert.ok(shape.strips.every(strip => Math.abs(strip.z) < 1e-9));
    }
  }
});
