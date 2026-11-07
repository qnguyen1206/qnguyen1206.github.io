import '../styles/publication.css';
import '../styles/experience-binder.css';
import { createBinderTimeline, getBinderFrame, getBinderTear } from './binder-scroll.js';
import { readingOffset, readingScroller, readingScrollTop, scrollReadingTo } from './library-state.js';
import { createPageWindow } from './page-window.js';
import { createPageFitter } from './page-fit.js';

export const escapePublicationText = value => String(value ?? '').replace(/[&<>"']/g,
  character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);

const instances = new WeakMap();

// One scroll controller for the project book, contact book, and write-up binder.
// Entries contain trusted, locally rendered HTML; labels are always escaped.
export function mountPublication(section, { host = section, title, subtitle, kind = 'book', entries, toolbar }) {
  instances.get(section)?.destroy();
  const empty = '<h3>No pages yet</h3><p>There are no published entries in this selection.</p>';
  const items = entries.length ? entries : [{ label: 'No pages yet', left: '<h3>A chapter in progress</h3>', right: empty, html: empty }];
  const isBook = kind === 'book';
  section.classList.add('publication-section');
  section.dataset.publication = kind;
  host.innerHTML = `<div class="publication-stage">
    <header class="publication-heading"><h2 class="section-title">${escapePublicationText(title)}</h2><p>${escapePublicationText(subtitle)}</p></header>
    <div class="publication-toolbar"></div>
    <div class="publication-cover publication-cover--${kind}">
      ${!isBook ? '<div class="experience-binder-body publication-binder-body"><div class="experience-binder-spine" aria-hidden="true"><i></i><i></i><i></i></div>' : ''}
      <div class="publication-surface ${isBook ? '' : 'experience-binder-sheets'}" role="group" aria-label="${escapePublicationText(title)} ${kind}">
        ${items.map((entry, index) => `<article class="publication-spread" data-index="${index}" aria-label="${escapePublicationText(entry.label)}" ${index ? 'inert aria-hidden="true"' : ''}>
          ${!isBook ? '<div class="experience-paper-holes" aria-hidden="true"><i></i><i></i><i></i></div>' : ''}
          ${isBook ? ['left', 'right'].map((side, page) => `<div class="publication-panel publication-panel--${side}"><div class="publication-content">${entry[side] || ''}</div><span class="publication-folio" aria-hidden="true">${String(index * 2 + page + 1).padStart(2, '0')}</span></div>`).join('') : `<div class="publication-panel"><div class="publication-content">${entry.html}</div><span class="publication-folio" aria-hidden="true">${index + 1} / ${items.length}</span></div>`}
        </article>`).join('')}
        ${isBook ? '<div class="publication-flip" aria-hidden="true" inert hidden></div>' : '<div class="experience-binder-ring-fronts" aria-hidden="true"><i></i><i></i><i></i></div>'}
      </div>${!isBook ? '</div>' : ''}
    </div>
    <nav class="publication-controls" aria-label="${escapePublicationText(title)} pages">
      <button type="button" data-publication-prev aria-label="Previous page">&#8592;</button>
      <select aria-label="Choose a ${isBook ? 'chapter' : 'sheet'}">${items.map((entry, i) => `<option value="${i}">${String(i + 1).padStart(2, '0')} / ${items.length} — ${escapePublicationText(entry.label)}</option>`).join('')}</select>
      <button type="button" data-publication-next aria-label="Next page">&#8594;</button>
    </nav>
    <p class="publication-hint">${isBook ? 'Scroll to turn the pages' : 'Scroll to pull out a sheet'} · or choose a page above</p>
    <p class="publication-status" role="status" aria-live="polite" aria-atomic="true"></p>
  </div>`;
  if (toolbar) host.querySelector('.publication-toolbar').append(toolbar);
  const stage = host.querySelector('.publication-stage');
  const surface = host.querySelector('.publication-surface');
  const spreads = [...host.querySelectorAll('.publication-spread')];
  const previous = host.querySelector('[data-publication-prev]');
  const next = host.querySelector('[data-publication-next]');
  const select = host.querySelector('.publication-controls select');
  const status = host.querySelector('.publication-status');
  const flip = host.querySelector('.publication-flip');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-width: 650px)');
  const abort = new AbortController();
  const options = { signal: abort.signal };
  let timeline = [];
  let selected = -1;
  let frame = 0;
  let layoutFrame = 0;
  let flipIndex = -1;
  let exitDistance = 0;
  const pageWindow = createPageWindow();
  let lastRenderKey = '';
  let lastLayoutKey = '';
  let contentVersion = 0;
  const pageFitter = createPageFitter(spreads);

  function prepareFlip(index) {
    if (flipIndex === index) return;
    flipIndex = index;
    flip.replaceChildren();
    // One two-sided leaf, not 16 copies of each rich page. Only its parent
    // transform changes while scrolling; the fitted content remains intact.
    const sources = [spreads[index].querySelector('.publication-panel--right'), spreads[index + 1].querySelector('.publication-panel--left')];
    sources.forEach((source, side) => {
      const face = document.createElement('div');
      face.className = `publication-leaf-face${side ? ' publication-leaf-back' : ''}`;
      const copy = source.cloneNode(true);
      copy.removeAttribute('id');
      copy.querySelectorAll('[id]').forEach(node => node.removeAttribute('id'));
      face.append(copy);
      flip.append(face);
    });
  }

  function clearFlip() {
    if (!flip) return;
    flip.hidden = true;
    if (flipIndex < 0) return;
    flipIndex = -1;
    flip.replaceChildren();
    flip.style.transform = '';
  }

  function render() {
    frame = 0;
    if (section.hidden || !timeline.length) { clearFlip(); return; }
    const state = getBinderFrame(readingOffset(section) - section.getBoundingClientRect().top, timeline);
    const renderKey = [state.index, state.selected, state.turn, reduced.matches, compact.matches].join(':');
    if (renderKey === lastRenderKey) return;
    lastRenderKey = renderKey;
    const turning = state.turn > 0 && !reduced.matches;
    const desktopFlip = isBook && !compact.matches && turning;
    const tear = getBinderTear(state.turn);
    if (selected !== state.selected) {
      if (selected >= 0 && spreads[selected].contains(document.activeElement)) select.focus({ preventScroll: true });
      selected = state.selected;
      select.value = String(selected);
      previous.disabled = selected === 0;
      next.disabled = selected === items.length - 1;
      status.textContent = `Page ${selected + 1} of ${items.length}: ${items[selected].label}`;
    }
    const visible = reduced.matches ? [selected] : [state.index, ...(turning ? [state.index + 1] : [])];
    // Fit only pages being read, before making them visible or cloning a turn.
    // Opening a 50-article binder must not measure all its unseen sheets.
    visible.forEach(index => pageFitter.fit(index));
    pageWindow.update(visible).forEach(index => {
      const spread = spreads[index];
      if (!spread) return;
      const outgoing = index === state.index;
      const incoming = index === state.index + 1;
      spread.dataset.visible = String(reduced.matches ? index === selected : outgoing || (turning && incoming));
      spread.dataset.transition = desktopFlip ? (outgoing ? 'outgoing' : incoming ? 'incoming' : '') : '';
      spread.inert = index !== selected;
      spread.setAttribute('aria-hidden', String(index !== selected));
      spread.style.zIndex = outgoing ? '2' : '1';
      spread.style.transform = 'none';
      spread.style.opacity = '1';
      spread.dataset.tearing = String(!isBook && outgoing && turning);
      spread.style.setProperty('--tear-cut', `${tear.cut}px`);
      if (turning && outgoing && !desktopFlip) {
        spread.style.transform = isBook ? `rotateY(${-95 * tear.pull}deg)` : `translate3d(${exitDistance * tear.pull}px, ${tear.lift}px, 0) rotate(${tear.rotation}deg)`;
        if (isBook) spread.style.opacity = String(1 - tear.pull);
      }
    });
    if (flip) {
      if (desktopFlip) {
        prepareFlip(state.index);
        flip.hidden = false;
        flip.style.transform = `rotateY(${-180 * tear.pull}deg)`;
      } else clearFlip();
    }
  }
  function queueRender() { if (!section.hidden && !frame) frame = requestAnimationFrame(render); }
  function goTo(index, instant = false) {
    const entry = timeline[Math.max(0, Math.min(items.length - 1, index))];
    if (!entry) return;
    scrollReadingTo(section, { top: readingScrollTop(section) + section.getBoundingClientRect().top - readingOffset(section) + entry.start, behavior: instant || reduced.matches ? 'instant' : 'smooth' });
  }
  function layout() {
    layoutFrame = 0;
    if (section.hidden || !surface.clientWidth || !surface.clientHeight) return;
    const layoutKey = [surface.clientWidth, surface.clientHeight, stage.offsetHeight, window.innerWidth, contentVersion].join(':');
    if (layoutKey === lastLayoutKey) { queueRender(); return; }
    lastLayoutKey = layoutKey;
    lastRenderKey = '';
    const distance = readingOffset(section) - section.getBoundingClientRect().top;
    const inside = timeline.length && distance > 0 && distance < timeline.at(-1).end;
    const old = timeline.length ? getBinderFrame(distance, timeline) : null;
    const fraction = old ? (distance - timeline[old.index].start) / (timeline[old.index].end - timeline[old.index].start) : 0;
    timeline = createBinderTimeline(items.length, stage.offsetHeight);
    section.style.setProperty('--publication-height', `${stage.offsetHeight + timeline.at(-1).end}px`);
    pageFitter.clear();
    clearFlip();
    exitDistance = window.innerWidth - surface.getBoundingClientRect().left + 48;
    if (inside && old) {
      const entry = timeline[old.index];
      scrollReadingTo(section, { top: readingScrollTop(section) + section.getBoundingClientRect().top - readingOffset(section) + entry.start + fraction * (entry.end - entry.start), behavior: 'instant' });
    }
    queueRender();
  }
  function queueLayout() { if (!section.hidden && !layoutFrame) layoutFrame = requestAnimationFrame(layout); }
  function deactivate() {
    cancelAnimationFrame(frame);
    cancelAnimationFrame(layoutFrame);
    frame = layoutFrame = 0;
    lastRenderKey = '';
    clearFlip();
  }
  previous.addEventListener('click', () => goTo(selected - 1), options);
  next.addEventListener('click', () => goTo(selected + 1), options);
  select.addEventListener('change', () => goTo(Number(select.value)), options);
  readingScroller(section).addEventListener('scroll', queueRender, { ...options, passive: true });
  window.addEventListener('resize', queueLayout, options);
  section.addEventListener('library:activate', queueLayout, options);
  section.addEventListener('library:deactivate', deactivate, options);
  reduced.addEventListener('change', queueRender, options);
  compact.addEventListener('change', queueLayout, options);
  const observer = new ResizeObserver(queueLayout);
  observer.observe(stage);
  observer.observe(surface);
  function contentLoaded() { contentVersion++; queueLayout(); }
  host.querySelectorAll('img').forEach(img => img.addEventListener('load', contentLoaded, options));
  document.fonts?.ready.then(() => { if (!abort.signal.aborted) contentLoaded(); });
  document.fonts?.addEventListener('loadingdone', contentLoaded, options);
  layout();
  const api = { goTo, destroy() { abort.abort(); observer.disconnect(); deactivate(); } };
  instances.set(section, api);
  return api;
}
