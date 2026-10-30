import test from 'node:test';
import assert from 'node:assert/strict';
import { paginateBlocks } from './book-pagination.js';

function splitWords(block, fits) {
  const words = block.split(' ');
  for (let count = words.length; count > 0; count--) {
    const head = words.slice(0, count).join(' ');
    if (fits(head)) return { head, tail: words.slice(count).join(' ') };
  }
  return { head: '', tail: block };
}

test('paragraphs that fit together remain on one page', () => {
  const blocks = ['first paragraph', 'second paragraph'];
  const pages = paginateBlocks(blocks, candidates => candidates.join(' ').length <= 40, () => assert.fail('No split needed'));
  assert.deepEqual(pages, [blocks]);
});

test('move the entire next paragraph onto a fresh page, without splitting it', () => {
  const blocks = ['first paragraph', 'second paragraph'];
  const pages = paginateBlocks(blocks, candidates => candidates.join(' ').length <= 25, () => assert.fail('Keep paragraphs whole'));
  assert.deepEqual(pages, [['first paragraph'], ['second paragraph']]);
});

test('oversized paragraphs continue across pages without missing or duplicated words', () => {
  const paragraph = 'one two three four five six seven eight nine ten eleven twelve';
  const pages = paginateBlocks([paragraph], candidates => candidates.join(' ').length <= 18, splitWords);
  assert.ok(pages.length > 1);
  assert.equal(pages.flat().join(' '), paragraph);
  assert.ok(pages.every(page => page.join(' ').length <= 18));
});

test('complete sections keep their markup unchanged when moved to the next page', () => {
  const blocks = ['<section><h3>Title</h3><p>Whole section</p></section>', '<p><a href="/work">My work</a> and <strong>design</strong>.</p>'];
  const pages = paginateBlocks(blocks, candidates => candidates.length <= 1, () => assert.fail('Do not rewrite fitting HTML'));
  assert.deepEqual(pages.flat(), blocks);
});

test('chapter heading space is accounted for separately from continuation pages', () => {
  const pages = paginateBlocks(['one two three four five six'], (candidates, part) =>
    candidates.join(' ').length <= (part === 0 ? 8 : 20), splitWords);
  assert.deepEqual(pages, [['one two'], ['three four five six']]);
});

test('a tall heading can occupy its own first page, never looping on an unfit block', () => {
  const pages = paginateBlocks(['paragraph'], (candidates, part) =>
    part === 0 ? candidates.length === 0 : true, splitWords);
  assert.deepEqual(pages, [[], ['paragraph']]);
  assert.throws(() => paginateBlocks(['paragraph'], () => false, splitWords), /too small/);
});

test('reflow creates more pages on narrow screens and preserves all original content', () => {
  const blocks = ['first paragraph has several words', 'second paragraph also has several words', 'last paragraph'];
  const paginate = capacity => paginateBlocks(blocks, candidates => candidates.join(' ').length <= capacity, splitWords);
  const small = paginate(20), large = paginate(100);
  assert.ok(small.length > large.length);
  assert.equal(small.flat().join(' '), blocks.join(' '));
  assert.equal(large.flat().join(' '), blocks.join(' '));
});
