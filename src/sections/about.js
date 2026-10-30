import '../styles/about-book.css';
import { getPageBend } from '../utils/book-turn.js';
import { paginateBlocks, splitRichBlock } from '../utils/book-pagination.js';
import { readingOffset, readingScroller, readingScrollTop, scrollReadingTo } from '../utils/library-state.js';

import { aboutPages } from '../content/about.js';
import { getVolumeHeading } from '../utils/library-state.js';
import { mountPublication, escapePublicationText as escapeText } from '../utils/publication.js';

const chapters = aboutPages.filter(page => !page.hidden);

function pageHTML(spread, index, side) {
  const chapter = chapters[spread.chapterIndex];
  const pictures = (index % 2 === 0) === (side === 'left');
  return `<section class="about-book-page about-book-page--${side}" data-spread="${index}" aria-label="${chapter.title}: ${pictures ? 'pictures' : 'description'}">
    <span class="about-book-kicker">${pictures ? 'Collected moments' : `Chapter ${String(spread.chapterIndex + 1).padStart(2, '0')}${spread.part ? ' · Continued' : ''}`}</span>
    ${pictures ? `<figure class="about-book-gallery ${chapter.images.length > 1 ? 'about-book-gallery--multiple' : ''}">
      <div class="about-book-photos">${chapter.images.map(([src, alt]) => `<img src="${src}" alt="${alt}" decoding="async">`).join('')}</div>
      <figcaption>${chapter.caption}</figcaption>
    </figure>` : `<div class="about-book-copy"><div class="about-book-copy-inner">${spread.part ? '' : `<h3>${chapter.title}</h3>`}${spread.text}</div></div>`}
    <span class="about-book-folio" aria-hidden="true">${String(index * 2 + (side === 'left' ? 1 : 2)).padStart(2, '0')}</span>
  </section>`;
}

export function initAbout() {
  const about = document.getElementById('about');
  if (!about) return;
  const heading = getVolumeHeading('about');
  if (!chapters.length) {
    mountPublication(about, { ...heading, entries: [] });
    return;
  }
  about.classList.add('about-book-section');
  about.innerHTML = `<div class="about-book-stage">
    <header class="about-book-heading"><h2 class="section-title">${escapeText(heading.title)}</h2><p>${escapeText(heading.subtitle)}</p></header>
    <div class="about-book-desktop">
      <div class="about-book" role="group" aria-label="About me, an interactive book"></div>
      <nav class="about-book-controls" aria-label="About book pages and chapters">
        <button type="button" class="about-book-prev" aria-label="Previous page">←</button>
        ${chapters.map((chapter, i) => `<button type="button" class="about-book-chapter" data-go-chapter="${i}" aria-label="Chapter ${i + 1}: ${chapter.title}">${String(i + 1).padStart(2, '0')}</button>`).join('')}
        <button type="button" class="about-book-next" aria-label="Next page">→</button>
      </nav>
      <p class="about-book-hint">Scroll to turn the page · or choose a chapter above</p>
      <p class="about-book-status" role="status" aria-live="polite"></p>
    </div>
  </div>`;

  const desktop = about.querySelector('.about-book-desktop');
  const stage = about.querySelector('.about-book-stage');
  const book = about.querySelector('.about-book');
  const chapterButtons = [...about.querySelectorAll('[data-go-chapter]')];
  const previous = about.querySelector('.about-book-prev');
  const next = about.querySelector('.about-book-next');
  const status = about.querySelector('.about-book-status');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const stripCount = 16;
  const clamp = value => Math.max(0, Math.min(1, value));
  let spreads = [];
  let leaves = [];
  let pages = [];
  let currentSpread = -1;
  let frame = 0;
  let layoutFrame = 0;
  let cachedLeaf = null;
  let layoutKey = '';
  let fontsVersion = 0;

  const paragraphLists = chapters.map(chapter => {
    const template = document.createElement('template');
    template.innerHTML = chapter.text;
    return [...template.content.children].map(node => node.outerHTML);
  });

  function buildFlexibleSurface(leaf) {
    const front = leaf.querySelector('.about-book-face--front .about-book-page');
    const back = leaf.querySelector('.about-book-face--back .about-book-page');
    const sheet = document.createElement('div');
    sheet.className = 'about-book-flex';
    sheet.setAttribute('aria-hidden', 'true');
    sheet.inert = true;
    const strips = Array.from({ length: stripCount }, (_, index) => {
      const strip = document.createElement('div');
      strip.className = 'about-book-strip';
      [front, back].forEach((page, side) => {
        const face = document.createElement('div');
        face.className = `about-book-strip-face about-book-strip-face--${side ? 'back' : 'front'}`;
        const copy = page.cloneNode(true);
        copy.removeAttribute('data-spread');
        face.style.setProperty('--slice-index', side ? stripCount - index - 1 : index);
        face.append(copy);
        strip.append(face);
      });
      sheet.append(strip);
      return strip;
    });
    leaf.append(sheet);
    return { sheet, strips };
  }

  function plainText(html) {
    const template = document.createElement('template');
    template.innerHTML = html;
    return template.content.textContent.replace(/\s+/g, ' ').trim();
  }

  function layout() {
    layoutFrame = 0;
    if (about.hidden) return;
    const bookStyle = getComputedStyle(book);
    const width = parseFloat(bookStyle.width) / 2;
    const height = parseFloat(bookStyle.height);
    if (!width || !height) return;
    const key = [width, height, stage.clientHeight, window.innerWidth, fontsVersion].join(':');
    if (key === layoutKey) { scheduleRender(); return; }
    const old = spreads[Math.max(0, currentSpread)];
    const hadBookFocus = book.contains(document.activeElement);
    const anchor = old ? plainText(old.text).slice(0, 36) : '';
    const newSpreads = [];
    const probe = document.createElement('div');
    probe.className = 'about-book-measure';
    probe.inert = true;
    probe.setAttribute('aria-hidden', 'true');
    probe.style.width = width + 'px';
    probe.style.height = height + 'px';
    desktop.append(probe);
    try {
      chapters.forEach((chapter, chapterIndex) => {
        probe.innerHTML = pageHTML({ chapterIndex, part: 0, text: '' }, 0, 'right');
        const copy = probe.querySelector('.about-book-copy');
        const inner = probe.querySelector('.about-book-copy-inner');
        const kicker = probe.querySelector('.about-book-kicker');
        function fits(blocks, part) {
          kicker.textContent = `Chapter ${String(chapterIndex + 1).padStart(2, '0')}${part ? ' · Continued' : ''}`;
          inner.innerHTML = (part ? '' : `<h3>${chapter.title}</h3>`) + blocks.join('');
          const style = getComputedStyle(copy);
          const available = copy.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
          return inner.scrollHeight <= available - 2 && inner.scrollWidth <= copy.clientWidth;
        }
        const chunks = paginateBlocks(paragraphLists[chapterIndex], fits,
          (html, fitsHead) => splitRichBlock(html, fitsHead, document));
        chunks.forEach((blocks, part) => newSpreads.push({ chapterIndex, part, text: blocks.join('') }));
      });
    } finally {
      probe.remove();
    }

    spreads = newSpreads;
    cachedLeaf = null;
    layoutKey = key;
    book.innerHTML = `<div class="about-book-base about-book-base--left">${pageHTML(spreads[0], 0, 'left')}</div>
      <div class="about-book-base about-book-base--right">${pageHTML(spreads.at(-1), spreads.length - 1, 'right')}</div>
      ${spreads.slice(0, -1).map((spread, i) => `<div class="about-book-leaf">
        <div class="about-book-face about-book-face--front">${pageHTML(spread, i, 'right')}</div>
        <div class="about-book-face about-book-face--back">${pageHTML(spreads[i + 1], i + 1, 'left')}</div>
      </div>`).join('')}`;
    pages = [...book.querySelectorAll('[data-spread]')];
    leaves = [...book.querySelectorAll('.about-book-leaf')].map(leaf => {
      leaf.style.setProperty('--page-width', width + 'px');
      leaf.style.setProperty('--strip-width', width / stripCount + 'px');
      return { leaf, width, flex: null };
    });
    // One scroll segment per spread; adding continuation pages adds page turns.
    const travel = Math.max(480, stage.clientHeight * 1.2) * Math.max(1, spreads.length - 1);
    about.style.setProperty('--about-book-height', stage.clientHeight + travel + 'px');
    let target = 0;
    if (old) {
      target = spreads.findIndex(spread => spread.chapterIndex === old.chapterIndex &&
        anchor && plainText(spread.text).includes(anchor));
      if (target < 0) {
        const candidates = spreads.map((spread, i) => ({ ...spread, i })).filter(spread => spread.chapterIndex === old.chapterIndex);
        target = candidates[Math.min(old.part, candidates.length - 1)].i;
      }
    }
    currentSpread = -1;
    goToPage(target, true);
    if (hadBookFocus) chapterButtons[spreads[target].chapterIndex].focus({ preventScroll: true });
    scheduleRender();
  }

  function queueLayout() {
    if (!layoutFrame) layoutFrame = requestAnimationFrame(layout);
  }

  function render() {
    frame = 0;
    if (about.hidden || !spreads.length) return;
    const rect = about.getBoundingClientRect();
    const travel = about.offsetHeight - stage.offsetHeight;
    const lastSpread = spreads.length - 1;
    const targetProgress = clamp((readingOffset(about) - rect.top) / Math.max(1, travel));
    // Follow the native scroll position directly, including direction reversals.
    const displayedProgress = targetProgress;
    const selected = Math.round(displayedProgress * lastSpread);
    leaves.forEach((item, i) => {
      const turn = reducedMotion.matches ? Number(selected > i) :
        clamp((displayedProgress * lastSpread - i - .2) / .6);
      if (item.lastTurn === turn) return;
      item.lastTurn = turn;
      const bending = turn > 0 && turn < 1;
      const shape = bending ? getPageBend(turn, item.width, stripCount) : { rotation: -180 * turn };
      item.leaf.classList.toggle('is-turning', bending);
      item.leaf.style.transform = `rotateY(${shape.rotation}deg)`;
      item.leaf.style.zIndex = turn === 1 ? i + 1 : leaves.length - i + 2;
      if (bending) {
        // Cache one sheet for immediate reverse scrolling, with bounded memory.
        if (cachedLeaf !== item) {
          if (cachedLeaf?.flex) { cachedLeaf.flex.sheet.remove(); cachedLeaf.flex = null; }
          cachedLeaf = item;
        }
        if (!item.flex) item.flex = buildFlexibleSurface(item.leaf);
        item.flex.strips.forEach((strip, index) => {
          const part = shape.strips[index];
          strip.style.transform = `translate3d(${part.x}px, 0, ${part.z}px) rotateY(${part.angle}deg)`;
        });
      }
      item.leaf.style.setProperty('--turn-shade', Math.sin(turn * Math.PI) * .12);
    });
    if (selected === currentSpread) return;
    if (currentSpread >= 0 && pages.some(page => Number(page.dataset.spread) === currentSpread && page.contains(document.activeElement))) {
      next.focus({ preventScroll: true });
    }
    currentSpread = selected;
    pages.forEach(page => {
      const hidden = Number(page.dataset.spread) !== selected;
      page.inert = hidden;
      page.setAttribute('aria-hidden', String(hidden));
    });
    const chapterIndex = spreads[selected].chapterIndex;
    chapterButtons.forEach((button, i) => button.setAttribute('aria-current', i === chapterIndex ? 'step' : 'false'));
    previous.disabled = selected === 0;
    next.disabled = selected === lastSpread;
    status.textContent = `Pages ${selected * 2 + 1}–${selected * 2 + 2} of ${spreads.length * 2}: ${chapters[chapterIndex].title}${spreads[selected].part ? ', continued' : ''}`;
  }

  function scheduleRender() { if (!about.hidden && !frame) frame = requestAnimationFrame(render); }
  function goToPage(index, instant = false) {
    if (!spreads.length) return;
    const target = Math.max(0, Math.min(spreads.length - 1, index));
    const top = readingScrollTop(about) + about.getBoundingClientRect().top - readingOffset(about);
    scrollReadingTo(about, {
      top: top + target / Math.max(1, spreads.length - 1) * (about.offsetHeight - stage.offsetHeight),
      behavior: instant || reducedMotion.matches ? 'instant' : 'smooth'
    });
  }

  chapterButtons.forEach(button => button.addEventListener('click', () =>
    goToPage(spreads.findIndex(spread => spread.chapterIndex === Number(button.dataset.goChapter)))));
  previous.addEventListener('click', () => goToPage(currentSpread - 1));
  next.addEventListener('click', () => goToPage(currentSpread + 1));
  reducedMotion.addEventListener('change', scheduleRender);
  readingScroller(about).addEventListener('scroll', scheduleRender, { passive: true });
  window.addEventListener('resize', queueLayout);
  about.addEventListener('library:activate', queueLayout);
  const observer = new ResizeObserver(queueLayout);
  observer.observe(book);
  observer.observe(stage);
  document.fonts?.ready.then(() => { fontsVersion++; queueLayout(); });
  document.fonts?.addEventListener('loadingdone', () => { fontsVersion++; queueLayout(); });
  queueLayout();
}
