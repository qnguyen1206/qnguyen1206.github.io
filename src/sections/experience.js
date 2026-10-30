import '../styles/experience-binder.css';
import { createBinderTimeline, getBinderFrame, getBinderTear } from '../utils/binder-scroll.js';
import { readingOffset, readingScroller, readingScrollTop, scrollReadingTo } from '../utils/library-state.js';
import { createPageWindow } from '../utils/page-window.js';

import { experienceData } from '../content/experience.js';
import { getVolumeHeading } from '../utils/library-state.js';
import { homeContent } from '../content/home.js';
export { experienceData } from '../content/experience.js';

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

let cleanupExperience = () => {};

export function initExperience(data = experienceData) {
  data = data.filter(item => !item.hidden);
  cleanupExperience();
  const experience = document.getElementById('experience');
  if (!experience) return;
  experience.classList.add('experience-binder-section');
  experience.classList.remove('experience-binder-scroll');
  experience.style.removeProperty('--binder-travel');

  if (!data.length) {
    experience.innerHTML = `<div class="container"><h2 class="section-title">${escapeHtml(getVolumeHeading('experience').title)}</h2><p>No experiences added yet.</p></div>`;
    return;
  }

  const total = data.length;
  const number = index => String(index + 1).padStart(2, '0');
  const pageHTML = (item, index) => `
    <article class="experience-binder-page" id="experience-page-${index}" role="tabpanel"
      aria-labelledby="experience-tab-${index}" tabindex="0"
      aria-hidden="${index !== 0}" ${index ? 'inert' : ''} data-active="${index === 0}">
      <div class="experience-paper-holes" aria-hidden="true"><i></i><i></i><i></i></div>
      <div class="experience-page-content">
      <header class="experience-company-header">
        <div class="experience-company-mark" aria-hidden="true">
          ${item.logo ? `<img src="${escapeHtml(item.logo)}" alt="" decoding="async">` : escapeHtml(item.monogram || item.company.split(/\s+/).map(word => word[0]).slice(0, 2).join(''))}
        </div>
        <div class="experience-profile-fields">
          <div class="experience-profile-field">
            <span class="experience-field-label">Company name</span>
            <h3>${escapeHtml(item.company)}</h3>
          </div>
          <div class="experience-profile-field">
            <span class="experience-field-label">Position</span>
            <h4>${escapeHtml(item.title)}</h4>
          </div>
          <div class="experience-profile-field">
            <span class="experience-field-label">Date</span>
            <p>${escapeHtml(item.date)}</p>
          </div>
        </div>
      </header>
      <section class="experience-contributions" aria-labelledby="experience-contributions-${index}">
        <h5 id="experience-contributions-${index}">What I did</h5>
        <ul>${(item.bullets || []).map(bullet => `<li>${escapeHtml(bullet.trim())}</li>`).join('')}</ul>
      </section>
      <footer class="experience-sheet-footer"><span>${escapeHtml(homeContent.name)} / ${escapeHtml(getVolumeHeading('experience').title)}</span><span>${number(index)} / ${String(total).padStart(2, '0')}</span></footer>
      </div>
    </article>`;

  experience.innerHTML = `
    <div class="experience-binder-stage">
      <div class="experience-binder-heading">
        <h2 class="section-title">${escapeHtml(getVolumeHeading('experience').title)}</h2>
        <p>${escapeHtml(getVolumeHeading('experience').subtitle)}</p>
      </div>
      <div class="experience-binder" aria-label="Professional experience binder">
        <div class="experience-binder-topbar">
          <span class="experience-binder-owner">${escapeHtml(homeContent.name)} <span>/ Professional record</span></span>
          <div class="experience-binder-controls">
            <button type="button" data-binder-prev aria-label="Previous experience">←</button>
            <span class="experience-binder-counter">01 / ${String(total).padStart(2, '0')}</span>
            <button type="button" data-binder-next aria-label="Next experience">→</button>
          </div>
        </div>
        <div class="experience-binder-body">
          <aside class="experience-binder-index">
            <p class="experience-index-label">Contents <span>${String(total).padStart(2, '0')} records</span></p>
            <div class="experience-company-tabs" role="tablist" aria-label="Experience companies" aria-orientation="vertical">
              ${data.map((item, index) => `
                <button type="button" role="tab" id="experience-tab-${index}" aria-controls="experience-page-${index}"
                  aria-selected="${index === 0}" tabindex="${index ? '-1' : '0'}" data-binder-tab="${index}">
                  <span class="experience-tab-number">${number(index)}</span>
                  <span><span class="experience-tab-company">${escapeHtml(item.shortName || item.company)}</span><span class="experience-tab-role">${escapeHtml(item.title)}</span></span>
                </button>`).join('')}
            </div>
            <p class="experience-binder-index-note">A closer look at my work,<br>one role at a time.</p>
          </aside>
          <div class="experience-binder-spine" aria-hidden="true"><i></i><i></i><i></i></div>
          <div class="experience-binder-sheets">
            ${data.map(pageHTML).join('')}
            <div class="experience-binder-ring-fronts" aria-hidden="true"><i></i><i></i><i></i></div>
          </div>
        </div>
      </div>
      <p class="experience-binder-hint">Scroll to pull the paper out to the right, or choose a company.</p>
      <p class="experience-binder-status" role="status" aria-live="polite" aria-atomic="true"></p>
    </div>`;

  const stage = experience.querySelector('.experience-binder-stage');
  const tabs = [...experience.querySelectorAll('[data-binder-tab]')];
  const pages = [...experience.querySelectorAll('.experience-binder-page')];
  const contents = [...experience.querySelectorAll('.experience-page-content')];
  const sheets = experience.querySelector('.experience-binder-sheets');
  const tablist = experience.querySelector('[role="tablist"]');
  const previous = experience.querySelector('[data-binder-prev]');
  const next = experience.querySelector('[data-binder-next]');
  const counter = experience.querySelector('.experience-binder-counter');
  const status = experience.querySelector('.experience-binder-status');
  const hint = experience.querySelector('.experience-binder-hint');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const compact = window.matchMedia('(max-width: 760px), (max-height: 600px)');
  const controller = new AbortController();
  const options = { signal: controller.signal };
  let current = -1;
  let timeline = [];
  let scrollFrame = 0;
  let layoutFrame = 0;
  let exitDistance = 0;
  const pageWindow = createPageWindow();
  let lastRenderKey = '';
  let lastLayoutKey = '';
  let contentVersion = 0;

  function selectPage(index) {
    const selected = Math.max(0, Math.min(total - 1, index));
    if (selected === current) return;
    const firstRender = current === -1;
    // Do not leave keyboard focus inside a panel that is about to be hidden.
    if (current >= 0 && pages[current].contains(document.activeElement)) tabs[selected].focus({ preventScroll: true });
    current = selected;
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === selected));
      tab.tabIndex = i === selected ? 0 : -1;
    });
    pages.forEach((page, i) => {
      page.dataset.active = String(i === selected);
      page.setAttribute('aria-hidden', String(i !== selected));
      page.inert = i !== selected;
    });
    previous.disabled = selected === 0;
    next.disabled = selected === total - 1;
    counter.textContent = `${number(selected)} / ${String(total).padStart(2, '0')}`;
    if (!firstRender) status.textContent = `Experience ${selected + 1} of ${total}: ${data[selected].company}, ${data[selected].title}`;
    if (compact.matches) {
      const tab = tabs[selected];
      tablist.scrollTo({
        left: tab.offsetLeft - (tablist.clientWidth - tab.offsetWidth) / 2,
        behavior: motion.matches ? 'instant' : 'smooth'
      });
    }
  }

  function updateFromScroll() {
    scrollFrame = 0;
    if (experience.hidden || !timeline.length) return;
    const state = getBinderFrame(readingOffset(experience) - experience.getBoundingClientRect().top, timeline);
    const renderKey = [state.index, state.selected, state.turn, motion.matches].join(':');
    if (renderKey === lastRenderKey) return;
    lastRenderKey = renderKey;
    selectPage(state.selected);
    const tear = getBinderTear(state.turn);
    const visiblePages = motion.matches ? [state.selected] : [state.index, ...(state.turn > 0 ? [state.index + 1] : [])];
    pageWindow.update(visiblePages).forEach(index => {
      const page = pages[index];
      if (!page) return;
      const outgoing = index === state.index;
      const incoming = state.turn > 0 && index === state.index + 1;
      const visible = motion.matches ? index === state.selected : outgoing || incoming;
      page.dataset.visible = String(visible);
      page.style.zIndex = outgoing ? '2' : '1';
      page.style.transform = outgoing && !motion.matches
        ? `translate3d(${exitDistance * tear.pull}px, ${tear.lift}px, 0) rotate(${tear.rotation}deg)`
        : 'none';
      page.style.setProperty('--tear-cut', `${outgoing && !motion.matches ? tear.cut : 0}px`);
      page.dataset.tearing = String(outgoing && state.turn > 0 && !motion.matches);
    });
  }

  function queueScroll() {
    if (!experience.hidden && !scrollFrame) scrollFrame = requestAnimationFrame(updateFromScroll);
  }

  function goToPage(index, focusTab = false) {
    const selected = Math.max(0, Math.min(total - 1, index));
    if (timeline.length) {
      const top = readingScrollTop(experience) + experience.getBoundingClientRect().top - readingOffset(experience);
      scrollReadingTo(experience, {
        top: top + timeline[selected].start,
        behavior: focusTab || motion.matches ? 'instant' : 'smooth'
      });
    }
    if (focusTab) {
      updateFromScroll();
      tabs[selected].focus({ preventScroll: true });
    }
  }

  function updateLayout() {
    layoutFrame = 0;
    if (experience.hidden) return;
    const layoutKey = [sheets.clientWidth, sheets.clientHeight, stage.offsetHeight, window.innerWidth, compact.matches, contentVersion].join(':');
    if (layoutKey === lastLayoutKey) { queueScroll(); return; }
    lastLayoutKey = layoutKey;
    lastRenderKey = '';
    const rect = experience.getBoundingClientRect();
    const distance = readingOffset(experience) - rect.top;
    const previousState = timeline.length ? getBinderFrame(distance, timeline) : null;
    const previousEntry = previousState && timeline[previousState.index];
    const inside = previousEntry && distance > 0 && distance < timeline.at(-1).end;
    const fraction = previousEntry
      ? Math.max(0, Math.min(1, (distance - previousEntry.start) / (previousEntry.end - previousEntry.start)))
      : 0;
    experience.classList.add('experience-binder-scroll');
    // Fit the entire sheet, never translate or scroll its text separately.
    // Widening its layout before scaling keeps both dimensions inside the paper.
    contents.forEach((content, index) => {
      const width = pages[index].clientWidth;
      const height = pages[index].clientHeight;
      if (!width || !height) return;
      const measure = scale => {
        content.style.width = `${width / scale}px`;
        return content.scrollHeight * scale <= height - 2;
      };
      let scale = 1;
      if (!measure(1)) {
        let low = 0.05;
        let high = 1;
        for (let step = 0; step < 12; step++) {
          const middle = (low + high) / 2;
          if (measure(middle)) low = middle;
          else high = middle;
        }
        scale = low;
      }
      content.style.width = `${width / scale}px`;
      content.style.transform = `scale(${scale})`;
    });
    exitDistance = window.innerWidth - sheets.getBoundingClientRect().left + 48;
    timeline = createBinderTimeline(total, stage.offsetHeight);
    const travel = timeline.at(-1).end;
    experience.style.setProperty('--binder-travel', `${travel}px`);
    experience.style.setProperty('--binder-stage-height', `${stage.offsetHeight}px`);
    tablist.setAttribute('aria-orientation', compact.matches ? 'horizontal' : 'vertical');
    hint.textContent = 'Scroll to pull the paper out to the right, or choose a company.';
    // Keep the same place in the same role when rotating or resizing a screen.
    if (inside) {
      const entry = timeline[previousState.index];
      scrollReadingTo(experience, {
        top: readingScrollTop(experience) + rect.top - readingOffset(experience) + entry.start + fraction * (entry.end - entry.start),
        behavior: 'instant'
      });
    }
    queueScroll();
  }

  function queueLayout() {
    if (!layoutFrame) layoutFrame = requestAnimationFrame(updateLayout);
  }

  tabs.forEach((tab, index) => tab.addEventListener('click', () => goToPage(index), options));
  previous.addEventListener('click', () => goToPage(current - 1), options);
  next.addEventListener('click', () => goToPage(current + 1), options);
  tablist.addEventListener('keydown', event => {
    const index = tabs.indexOf(document.activeElement);
    if (index === -1) return;
    let target;
    if (event.key === 'Home') target = 0;
    else if (event.key === 'End') target = total - 1;
    else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') target = (index + 1) % total;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') target = (index - 1 + total) % total;
    else return;
    event.preventDefault();
    goToPage(target, true);
  }, options);
  readingScroller(experience).addEventListener('scroll', queueScroll, { ...options, passive: true });
  window.addEventListener('resize', queueLayout, options);
  experience.addEventListener('library:activate', queueLayout, options);
  motion.addEventListener('change', queueLayout, options);
  compact.addEventListener('change', queueLayout, options);
  const observer = new ResizeObserver(queueLayout);
  observer.observe(stage);
  observer.observe(sheets);
  // Fitting changes content width; observing it would create a resize loop.
  function contentLoaded() { contentVersion++; queueLayout(); }
  experience.querySelectorAll('img').forEach(img => img.addEventListener('load', contentLoaded, options));
  document.fonts?.ready.then(() => { if (!controller.signal.aborted) contentLoaded(); });
  document.fonts?.addEventListener('loadingdone', contentLoaded, options);
  selectPage(0);
  updateLayout();

  cleanupExperience = () => {
    controller.abort();
    observer.disconnect();
    cancelAnimationFrame(scrollFrame);
    cancelAnimationFrame(layoutFrame);
  };
}

export function addExperience(entry) {
  experienceData.push(entry);
  initExperience();
}
