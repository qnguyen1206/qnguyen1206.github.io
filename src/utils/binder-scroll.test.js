import test from 'node:test';
import assert from 'node:assert/strict';
import { createBinderTimeline, getBinderFrame, getBinderTear } from './binder-scroll.js';

test('complete sheets rest and then release, with no internal reading offset', () => {
  for (const height of [280, 390, 568, 667, 844, 1080]) {
    for (const count of [1, 4]) {
      const timeline = createBinderTimeline(count, height);
      timeline.forEach((entry, index) => {
        assert.equal(getBinderFrame(entry.start, timeline).selected, index);
        assert.equal(getBinderFrame(entry.turnStart, timeline).turn, 0);
        assert.ok(entry.end > entry.start);
        assert.equal('readOffset' in getBinderFrame(entry.start, timeline), false);
        if (index < count - 1) {
          const distance = entry.turnStart + (entry.end - entry.turnStart) * 0.75;
          const frame = getBinderFrame(distance, timeline);
          assert.ok(Math.abs(frame.turn - 0.75) < 1e-7);
          assert.equal(frame.selected, index + 1);
          // Scrolling backward restores exactly the same animation state.
          getBinderFrame(entry.end, timeline);
          assert.deepEqual(getBinderFrame(distance, timeline), frame);
        }
      });
      assert.equal(getBinderFrame(-100, timeline).selected, 0);
      assert.equal(getBinderFrame(timeline.at(-1).end + 100, timeline).selected, count - 1);
    }
  }
  assert.deepEqual(createBinderTimeline(0, 600), []);
  assert.equal(getBinderFrame(0, []).turn, 0);
});

test('paper moves only rightward, releases at the rings, and clears the binder', () => {
  let previous = 0;
  for (let step = 0; step <= 100; step++) {
    const state = getBinderTear(step / 100);
    assert.ok(state.pull >= previous);
    assert.ok(Object.values(state).every(Number.isFinite));
    assert.ok(state.cut >= 0 && state.cut <= 10);
    previous = state.pull;
  }
  assert.equal(getBinderTear(0).pull, 0);
  assert.equal(getBinderTear(1).pull, 1);
  assert.equal(getBinderTear(0.12).cut, 10);
  assert.equal(getBinderTear(-1).pull, 0);
  assert.equal(getBinderTear(2).pull, 1);
});
