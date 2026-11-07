import test from 'node:test';
import assert from 'node:assert/strict';
import { getSpinePlacement, getClusterPlacement, getShelfLayout } from './shelf-spines.js';

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

test('cluster clearance follows its real outer corners rather than its tallest book', () => {
  const books = [{ width: 18, height: 190 }, { width: 18, height: 150 }, { width: 18, height: 100 }];
  const pose = getClusterPlacement(books, 8);
  assert.ok(pose.right < getSpinePlacement(190, 8).right - 10);
  assert.equal(pose.left, 0);
  assert.equal(pose.width, 56);
  let offset = 0;
  for (const book of books) {
    const radians = pose.angle * Math.PI / 180;
    for (const [x, y] of [[0, 0], [book.width, 0], [0, -book.height], [book.width, -book.height]]) {
      const projected = offset + book.width + (x - book.width) * Math.cos(radians) - y * Math.sin(radians);
      assert.ok(projected >= -pose.left - 1e-8);
      assert.ok(projected <= pose.width + pose.right + 1e-8);
    }
    offset += book.width + 1;
  }
});

test('full book population fills both compact and wide bays with no oversized gaps', () => {
  const books = Array.from({ length: 8 }, (_, index) => ({ width: 7 + index, height: .7 + index * .03 }));
  const items = [...books.slice(0, 2), { books: books.slice(2, 5), angle: -6 }, ...books.slice(5),
    { fixed: 48 }, ...books.slice(0, 3), { books: books.slice(3, 7), angle: 7 }, books[7]];
  for (const width of [220, 280, 350, 440, 680]) {
    for (const height of [120, 170, 240]) {
      const result = getShelfLayout(items, width, height);
      assert.ok(result.width <= width + .001);
      assert.ok(width - result.width < .01, `the run should fill its ${width}px bay`);
      assert.equal(result.placements.length, items.length);
      assert.equal(result.placements.filter(item => item.books).flatMap(item => item.books).length, 7);
      assert.equal(result.placements[6].width, 48, 'navigation volume keeps its full hit target');
      for (const item of result.placements) {
        assert.ok(item.width > 0);
        assert.ok(item.left >= 0 && item.right >= 0);
        if (item.books) assert.ok(item.books.every(book => book.width >= 3));
      }
    }
  }
});

test('extremely narrow runs ease the lean without dropping books', () => {
  const items = [{ books: [{ width: 12, height: .9 }, { width: 12, height: .9 }], angle: 12 }, { fixed: 44 }];
  const result = getShelfLayout(items, 65, 400);
  assert.ok(result.width <= 65 + .001);
  assert.ok(result.placements[0].angle < 12);
  assert.equal(result.placements[0].books.length, 2);
  assert.equal(result.placements[1].width, 44);
});
