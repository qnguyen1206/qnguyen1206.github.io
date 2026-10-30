import test from 'node:test';
import assert from 'node:assert/strict';
import { getDescentFrame, getCloudOffsets } from './sky-motion.js';

test('Home starts readable and the library finishes fully available', () => {
  const start = getDescentFrame(0), end = getDescentFrame(1);
  assert.equal(start.departure, 0);
  assert.equal(start.arrival, 0);
  assert.equal(end.departure, 1);
  assert.equal(end.arrival, 1);
  assert.equal(end.mist, 0);
  assert.equal(end.rush, 0);
});

test('descent clamps overscroll and retraces exactly when scrolling back up', () => {
  assert.deepEqual(getDescentFrame(-1), getDescentFrame(0));
  assert.deepEqual(getDescentFrame(2), getDescentFrame(1));
  const forward = Array.from({ length: 101 }, (_, i) => getDescentFrame(i / 100));
  for (let i = 100; i >= 0; i--) {
    assert.deepEqual(getDescentFrame(i / 100), forward[i]);
    assert.ok(Object.values(forward[i]).every(value => Number.isFinite(value) && value >= 0 && value <= 1));
    if (i > 0) {
      assert.ok(forward[i].departure >= forward[i - 1].departure);
      assert.ok(forward[i].arrival >= forward[i - 1].arrival);
    }
  }
});

test('only two cloud layers translate upward and clear the screen at the end', () => {
  for (const height of [320, 640, 1080, 2160]) {
    let previous = getCloudOffsets(0, height);
    for (let i = 1; i <= 100; i++) {
      const offsets = getCloudOffsets(i / 100, height);
      assert.equal(offsets.length, 2);
      offsets.forEach((offset, index) => {
        assert.ok(Number.isFinite(offset));
        assert.ok(offset < previous[index]);
      });
      previous = offsets;
    }
    assert.ok(previous.every(offset => offset + height * .32 < 0));
  }
});
