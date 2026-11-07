import test from 'node:test';
import assert from 'node:assert/strict';
import { paginateBlocks, splitRichBlock } from './book-pagination.js';

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

// Minimal DOM ranges for a plain text node: exercise the real splitter's UTF-16
// offsets without adding a browser dependency to the existing Node test suite.
function textDocument() {
  function element(tag, text = '') {
    return {
      textContent: text,
      get outerHTML() { return `<${tag}>${this.textContent}</${tag}>`; },
      cloneNode() { return element(tag); },
      append(fragment) { this.textContent += fragment.textContent; },
    };
  }
  return {
    createElement() {
      return {
        content: {},
        set innerHTML(html) {
          const [, tag, text] = html.match(/^<(\w+)>([\s\S]*)<\/\1>$/);
          this.content.firstElementChild = element(tag, text);
        },
      };
    },
    createTreeWalker(block) {
      let visited = false;
      return { currentNode: block, nextNode() { if (visited) return false; visited = true; return true; } };
    },
    createRange() {
      let block, start = 0, end;
      return {
        selectNodeContents(node) { block = node; end = node.textContent.length; },
        setStart(node, offset) { start = offset; },
        setEnd(node, offset) { end = offset; },
        cloneContents() { return { textContent: block.textContent.slice(start, end) }; },
      };
    },
  };
}

const textOf = html => html.replace(/^<\w+>|<\/\w+>$/g, '');

test('an oversized unbroken code token paginates without losing text or adding blank sheets', () => {
  const token = 'a'.repeat(1507);
  const document = textDocument();
  const pages = paginateBlocks([`<pre>${token}</pre>`], blocks =>
    blocks.map(textOf).join('').length <= 80,
  (html, fits) => splitRichBlock(html, fits, document));
  assert.equal(pages.flat().map(textOf).join(''), token);
  assert.equal(pages.length, Math.ceil(token.length / 80));
  assert.ok(pages.every(page => page.length && textOf(page[0]).length > 0 && textOf(page[0]).length <= 80));
});

test('character fallback never cuts surrogate pairs, combining accents or joined emoji', () => {
  const clusters = ['\u{1F469}\u200D\u{1F4BB}', 'e\u0301', '\u{1F680}', '\u{1F1FA}\u{1F1F8}'];
  const text = clusters.join('');
  let pending = `<p>${text}</p>`;
  const parts = [];
  for (const cluster of clusters) {
    const result = splitRichBlock(pending, html => textOf(html).length <= cluster.length, textDocument());
    assert.equal(textOf(result.head), cluster);
    parts.push(textOf(result.head));
    pending = result.tail;
  }
  assert.equal(parts.join(''), text);
  assert.equal(pending, '');
});

test('character fallback preserves trailing whitespace and reports a genuinely unfit character', () => {
  const result = splitRichBlock('<pre>abcdef \n</pre>', html => textOf(html).length <= 6, textDocument());
  assert.equal(textOf(result.head) + textOf(result.tail), 'abcdef \n');
  assert.equal(result.tail, '<pre> \n</pre>');
  assert.deepEqual(splitRichBlock('<p>\u{1F680}</p>', () => false, textDocument()),
    { head: '', tail: '<p>\u{1F680}</p>' });
});

test('fitting word and sentence boundaries still take precedence over character fallback', () => {
  assert.deepEqual(splitRichBlock('<p>alpha beta gamma</p>', html => textOf(html).length <= 8, textDocument()),
    { head: '<p>alpha </p>', tail: '<p>beta gamma</p>' });
  assert.deepEqual(splitRichBlock('<p>First. Next word longer</p>', html => textOf(html).length <= 12, textDocument()),
    { head: '<p>First. </p>', tail: '<p>Next word longer</p>' });
});
