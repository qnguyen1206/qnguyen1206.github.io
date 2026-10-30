// Prefer whole paragraphs. Only split a block if it cannot fit on a fresh page.
export function paginateBlocks(blocks, fits, splitBlock) {
  const pages = [];
  let current = [];
  for (const original of blocks) {
    let pending = original;
    while (pending) {
      if (fits([...current, pending], pages.length)) {
        current.push(pending);
        break;
      }
      if (current.length) {
        pages.push(current);
        current = [];
        continue;
      }
      const parts = splitBlock(pending, head => fits([head], pages.length));
      if (!parts?.head || parts.tail === pending) {
        // A large chapter heading may need its own opening page.
        if (pages.length === 0 && fits([], 0)) {
          pages.push([]);
          continue;
        }
        throw new Error('The book page is too small to hold a line of text.');
      }
      if (!parts.tail) {
        current.push(parts.head);
        break;
      }
      pages.push([parts.head]);
      pending = parts.tail;
    }
  }
  if (current.length || !pages.length) pages.push(current);
  return pages;
}

// DOM ranges preserve links, emphasis and all text when a paragraph must split.
export function splitRichBlock(html, fits, document) {
  const template = document.createElement('template');
  template.innerHTML = html;
  const block = template.content.firstElementChild;
  const walker = document.createTreeWalker(block, 4); // SHOW_TEXT
  const nodes = [];
  let total = 0;
  while (walker.nextNode()) {
    const node = walker.currentNode;
    nodes.push({ node, start: total, end: total + node.textContent.length });
    total += node.textContent.length;
  }
  const text = block.textContent;
  const boundaries = [...text.matchAll(/\S+\s*/gu)].map(match => match.index + match[0].length);
  function cut(offset) {
    const point = nodes.find(item => offset <= item.end) || nodes.at(-1);
    if (!point) return { head: '', tail: html };
    const headRange = document.createRange();
    headRange.selectNodeContents(block);
    headRange.setEnd(point.node, offset - point.start);
    const tailRange = document.createRange();
    tailRange.selectNodeContents(block);
    tailRange.setStart(point.node, offset - point.start);
    const head = block.cloneNode(false), tail = block.cloneNode(false);
    head.append(headRange.cloneContents());
    tail.append(tailRange.cloneContents());
    return { head: head.outerHTML, tail: tail.textContent.trim() ? tail.outerHTML : '' };
  }
  let low = 0, high = boundaries.length;
  while (low < high) {
    const middle = Math.ceil((low + high) / 2);
    if (fits(cut(boundaries[middle - 1]).head)) low = middle;
    else high = middle - 1;
  }
  if (!low) return { head: '', tail: html };
  // Prefer a sentence break when it doesn't leave most of the page empty.
  const best = boundaries[low - 1];
  const sentence = boundaries.slice(0, low).filter(offset =>
    offset >= best * .55 && /[.!?]["’”')\]]?\s*$/u.test(text.slice(0, offset))
  ).at(-1);
  return cut(sentence || best);
}
