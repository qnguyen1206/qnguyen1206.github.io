import test from 'node:test';
import assert from 'node:assert/strict';
import { getSpinePlacement } from './shelf-spines.js';

test('cluster leans reserve space on the correct side, upright books need none', () => {
  assert.deepEqual(getSpinePlacement(200, 0), { angle: 0, left: 0, right: 0, origin: 'right bottom' });
  assert.equal(getSpinePlacement(200, -3).origin, 'left bottom');
  assert.equal(getSpinePlacement(200, 3).origin, 'right bottom');
  assert.equal(getSpinePlacement(200, -3).right, 0);
  assert.equal(getSpinePlacement(200, 3).left, 0);
  assert.equal(getSpinePlacement(200, 80).angle, 12);
  assert.equal(getSpinePlacement(200, -80).angle, -12);
});

test('rotated corners remain within reserved space and never below the shelf', () => {
  for (const height of [40, 80, 140, 220, 400]) {
    for (const width of [3, 8, 20, 32]) {
      for (const angle of [-12, -8, -4, 0, 4, 7, 10, 12]) {
        const pose = getSpinePlacement(height, angle);
        const radians = pose.angle * Math.PI / 180;
        const originX = angle < 0 ? 0 : width;
        for (const [x, y] of [[0, 0], [width, 0], [0, -height], [width, -height]]) {
          const rotatedX = originX + (x - originX) * Math.cos(radians) - y * Math.sin(radians);
          const rotatedY = (x - originX) * Math.sin(radians) + y * Math.cos(radians);
          assert.ok(rotatedX >= -pose.left - 1e-8);
          assert.ok(rotatedX <= width + pose.right + 1e-8);
          assert.ok(rotatedY <= 1e-8, 'bottom corner must rest on, not penetrate, the shelf');
        }
      }
    }
  }
});

test('one-pixel cluster gaps keep parallel spines separated at every height', () => {
  for (const angle of [7, 8, 9, 10, 12]) {
    const radians = angle * Math.PI / 180;
    for (const width of [3, 7, 12, 20]) {
      // In a horizontal slice the rotated spine occupies width / cos(angle).
      // The extra projection is less than the real one-pixel flex gap.
      assert.ok(width / Math.cos(radians) - width < 1);
    }
  }
});

test('reserved space follows the spine height when the viewport changes', () => {
  assert.ok(getSpinePlacement(400, 3).right > getSpinePlacement(80, 3).right);
  assert.ok(getSpinePlacement(400, -3).left > getSpinePlacement(80, -3).left);
});
