import test from 'node:test';
import assert from 'node:assert/strict';
import { createPageFitter } from './page-fit.js';

function page(height = 100) {
  let reads = 0;
  const content = { style: {}, get scrollHeight() { reads++; return height; } };
  const panel = { clientWidth: 400, clientHeight: 326, querySelector: () => content };
  return { querySelectorAll: () => [panel], panel, content, reads: () => reads };
}

test('opening fits only the requested spread, not the other 49 sheets', () => {
  const pages = Array.from({ length: 50 }, () => page());
  const fitter = createPageFitter(pages);
  fitter.fit(0);
  assert.equal(pages[0].reads(), 1);
  assert.ok(pages.slice(1).every(p => p.reads() === 0));
  fitter.fit(0);
  assert.equal(pages[0].reads(), 1);
  fitter.fit(49); // Jumping directly to a distant page still fits it.
  assert.equal(pages[49].reads(), 1);
  assert.equal(pages[49].content.style.transform, 'scale(1)');
});

test('oversized content fits the paper and resize/font changes invalidate cached fits', () => {
  const p = page(900);
  const fitter = createPageFitter([p]);
  fitter.fit(0);
  const scale = Number(p.content.style.transform.slice(6, -1));
  assert.ok(scale * 900 <= 300);
  assert.ok(scale > .33);
  const reads = p.reads();
  fitter.clear();
  fitter.fit(0);
  assert.ok(p.reads() > reads);
});

test('hidden or zero-size pages can be retried when they become measurable', () => {
  const p = page();
  p.panel.clientWidth = 0;
  const fitter = createPageFitter([p]);
  fitter.fit(0);
  assert.equal(p.reads(), 0);
  p.panel.clientWidth = 400;
  fitter.fit(0);
  assert.equal(p.reads(), 1);
  fitter.fit(20); // Out-of-range turn neighbors are harmless.
});
