import { paginateBlocks, splitRichBlock } from './book-pagination.js';

// Wide tables read as labeled records on paper instead of a horizontal scroller.
function tableAsRecords(table) {
  const records = document.createElement('div');
  const labels = [...(table.querySelector('thead tr:last-child')?.children || [])];
  table.querySelectorAll('tbody > tr').forEach(row => {
    const record = document.createElement('div');
    record.className = 'paper-table-record';
    [...row.children].forEach((cell, index) => {
      const field = document.createElement('div');
      field.className = 'paper-table-field';
      const label = document.createElement('strong');
      label.textContent = labels[index]?.textContent || `Column ${index + 1}`;
      const value = document.createElement('div');
      value.append(...[...cell.childNodes].map(node => node.cloneNode(true)));
      field.append(label, value);
      record.append(field);
    });
    records.append(record);
  });
  return records;
}

function splitPaperBlock(html, fits) {
  const template = document.createElement('template');
  template.innerHTML = html;
  // An unusually tall table row still needs complete column labels and values.
  template.content.querySelectorAll('table').forEach(table => {
    if (table.querySelector('tbody > tr')) table.replaceWith(tableAsRecords(table));
  });
  return splitRichBlock(template.innerHTML, fits, document);
}

// Keep the existing rich text and links, but give every piece of media a sheet.
function collectSections(body) {
  const sections = [];
  let blocks = [];
  function flush() {
    const grouped = [];
    let headings = [];
    blocks.forEach(block => {
      if (/^<h[2-6][\s>]/i.test(block)) headings.push(block);
      else {
        grouped.push(headings.length ? `<div class="project-paper-group">${headings.join('')}${block}</div>` : block);
        headings = [];
      }
    });
    grouped.push(...headings);
    if (grouped.length) sections.push({ blocks: grouped });
    blocks = [];
  }
  function collectChildren(parent) {
    // The legacy write-up parser sometimes leaves bare text beside a link.
    // Preserve those text nodes as a paragraph, as well as normal block markup.
    let paragraph = document.createElement('p');
    function flushInline() {
      if (paragraph.textContent.trim()) blocks.push(paragraph.outerHTML);
      paragraph = document.createElement('p');
    }
    [...parent.childNodes].forEach(node => {
      if (node.nodeType === Node.TEXT_NODE || (node.nodeType === Node.ELEMENT_NODE && node.matches('a, strong, em, code, span, br') && !node.querySelector('img, video'))) {
        paragraph.append(node.cloneNode(true));
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        flushInline();
        collect(node);
      }
    });
    flushInline();
  }
  function heading(text) {
    const node = document.createElement('h3');
    node.textContent = text;
    blocks.push(node.outerHTML);
  }
  function collect(node) {
    if (node.matches('details')) {
      heading(node.querySelector(':scope > summary')?.textContent || 'Notes');
      [...node.children].filter(child => child.tagName !== 'SUMMARY').forEach(collect);
    } else if (node.matches('.solution-tabs, .markdown-tabs')) {
      const labels = [...node.querySelectorAll('.solution-tab-btn, .markdown-tab-btn')];
      const panels = [...node.querySelectorAll('.solution-tab-content, .markdown-tab-panel')];
      panels.forEach((panel, index) => {
        heading(labels[index]?.textContent || `Section ${index + 1}`);
        collectChildren(panel);
      });
    } else if (node.matches('table')) {
      // Repeat the column labels on continuation sheets; never cut across cells.
      const rows = [...node.querySelectorAll('tbody > tr')];
      if (!rows.length) blocks.push(node.outerHTML);
      rows.forEach(row => {
        const table = node.cloneNode(false);
        const header = node.querySelector('thead');
        if (header) table.append(header.cloneNode(true));
        const tbody = document.createElement('tbody');
        tbody.append(row.cloneNode(true));
        table.append(tbody);
        blocks.push(row.children.length > 4 ? tableAsRecords(table).outerHTML : table.outerHTML);
      });
    } else if (node.matches('.project-image-item, .project-video-item, figure, img, video') || (node.matches('a') && node.querySelector('img, video'))) {
      flush();
      const wrapper = document.createElement('div');
      wrapper.className = node.matches('video') || node.querySelector('video') ? 'project-video-item' : 'project-image-item';
      wrapper.append(node.cloneNode(true));
      sections.push({ media: node.matches('.project-image-item, .project-video-item') ? node.outerHTML : wrapper.outerHTML });
    } else if (node.matches('.modal-section, .writeup-content, .blog-modal-body, .markdown-dropdown-content, .project-modal-videos, .project-modal-images, .project-images-masonry') || (node.matches('p') && node.querySelector('img, video'))) {
      collectChildren(node);
    } else if (node.matches('ul, ol')) {
      // Start each list item intact; long items can continue on another sheet.
      [...node.children].forEach((item, index) => {
        const list = node.cloneNode(false);
        if (list.tagName === 'OL') list.start = (node.start || 1) + index;
        list.append(item.cloneNode(true));
        blocks.push(list.outerHTML);
      });
    } else if (node.matches('.project-modal-links')) {
      [...node.children].forEach(link => {
        const wrapper = node.cloneNode(false);
        wrapper.append(link.cloneNode(true));
        blocks.push(wrapper.outerHTML);
      });
    } else {
      blocks.push(node.outerHTML);
    }
  }
  collectChildren(body);
  flush();
  return sections;
}

export function mountProjectPaper(modal, { onClose, label = 'Project' }) {
  const body = modal.querySelector('.project-modal-body');
  const sections = collectSections(body);
  const abort = new AbortController();
  const options = { signal: abort.signal };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  body.innerHTML = `
    <div class="project-paper-viewport"></div>
    <nav class="project-paper-controls">
      <button type="button" data-paper-prev>← <span>Put back</span></button>
      <span class="project-paper-count" role="status" aria-live="polite" aria-atomic="true"></span>
      <button type="button" data-paper-next><span>Take sheet</span> →</button>
    </nav>`;
  const viewport = body.querySelector('.project-paper-viewport');
  const previous = body.querySelector('[data-paper-prev]');
  const next = body.querySelector('[data-paper-next]');
  const count = body.querySelector('.project-paper-count');
  const close = modal.querySelector('.project-modal-close');
  viewport.setAttribute('aria-label', `${label} paper stack`);
  body.querySelector('nav').setAttribute('aria-label', `${label} sheets`);
  previous.setAttribute('aria-label', `Put back previous ${label.toLowerCase()} sheet`);
  next.setAttribute('aria-label', `Take next ${label.toLowerCase()} sheet`);
  let pages = [];
  let selected = 0;
  let animations = [];
  let layoutFrame = 0;
  let layoutSize = '';
  let wheelTimer;
  let wheelDelta = 0;
  let wheelUsed = false;
  let touch = null;

  function stopTurn() {
    animations.forEach(animation => animation.cancel());
    animations = [];
    pages.forEach(page => { page.style.willChange = ''; page.style.zIndex = ''; });
  }

  function updateControls() {
    previous.disabled = selected === 0;
    next.disabled = selected === pages.length - 1;
    count.textContent = `Sheet ${selected + 1} of ${pages.length}`;
    viewport.dataset.remaining = String(Math.min(2, pages.length - selected - 1));
    if (document.activeElement === previous && previous.disabled && !next.disabled) next.focus();
    if (document.activeElement === next && next.disabled && !previous.disabled) previous.focus();
  }

  function turnTo(index) {
    if (animations.length || index < 0 || index >= pages.length || index === selected) return;
    const outgoing = pages[selected];
    const incoming = pages[index];
    const forward = index > selected;
    outgoing.querySelectorAll('video').forEach(video => video.pause());
    if (outgoing.contains(document.activeElement)) (forward ? next : previous).focus();
    selected = index;
    pages.forEach((page, i) => {
      page.hidden = i !== selected;
      page.inert = i !== selected;
      page.setAttribute('aria-hidden', String(i !== selected));
    });
    updateControls();
    if (reduced.matches) return;
    outgoing.hidden = false;
    // The same flat sheet leaves to the right, then returns along that path.
    // The sheet underneath stays still, like a real pile on a desk.
    const moving = forward ? outgoing : incoming;
    const underneath = forward ? incoming : outgoing;
    moving.style.zIndex = '3';
    moving.style.willChange = 'transform';
    underneath.style.zIndex = '1';
    const distance = window.innerWidth - viewport.getBoundingClientRect().left + 90;
    const frames = [
      { transform: 'translate3d(0, 0, 0) rotate(0deg)' },
      { offset: .2, transform: 'translate3d(24px, -12px, 0) rotate(1.5deg)' },
      { transform: `translate3d(${distance}px, -42px, 0) rotate(7deg)` },
    ];
    animations = [moving.animate(frames, {
      duration: 420, easing: 'cubic-bezier(.25,.65,.2,1)',
      direction: forward ? 'normal' : 'reverse', fill: 'both',
    })];
    const active = animations;
    Promise.allSettled(active.map(animation => animation.finished)).then(() => {
      if (animations !== active) return;
      outgoing.hidden = true;
      active.forEach(animation => animation.cancel());
      outgoing.style.zIndex = '';
      incoming.style.zIndex = '';
      moving.style.willChange = '';
      animations = [];
    });
  }

  function makePage(html, media = false) {
    const page = document.createElement('article');
    page.className = `project-paper-page${media ? ' project-paper-media' : ''}`;
    page.innerHTML = `<div class="project-paper-copy writeup-content">${html}</div>`;
    page.querySelectorAll('img').forEach(img => { img.loading = 'lazy'; img.decoding = 'async'; });
    return page;
  }

  function layout() {
    layoutFrame = 0;
    if (abort.signal.aborted || !modal.classList.contains('active')) return;
    const size = `${viewport.clientWidth}:${viewport.clientHeight}`;
    if (!viewport.clientWidth || viewport.clientHeight < 48) return;
    if (layoutSize === size) return;
    layoutSize = size;
    // Keep the current content in view when orientation or text size changes.
    const anchor = pages[selected];
    const sectionIndex = Number(anchor?.dataset.section || 0);
    const sectionPage = Number(anchor?.dataset.part || 0);
    const textAnchor = anchor?.textContent.trim().split(/\s+/).slice(0, 8).join(' ');
    if (anchor?.contains(document.activeElement)) close.focus({ preventScroll: true });
    pages.forEach(page => page.querySelectorAll('video').forEach(video => video.pause()));
    stopTurn();
    const measure = makePage('');
    measure.classList.add('project-paper-measure');
    measure.inert = true;
    measure.setAttribute('aria-hidden', 'true');
    viewport.replaceChildren(measure);
    const copy = measure.firstElementChild;
    const padding = getComputedStyle(measure);
    const pageHeight = measure.clientHeight - parseFloat(padding.paddingTop) - parseFloat(padding.paddingBottom);
    viewport.style.setProperty('--paper-page-height', `${pageHeight}px`);
    const fits = blocks => {
      copy.innerHTML = blocks.join('');
      return copy.scrollHeight <= pageHeight - 2 && copy.scrollWidth <= copy.clientWidth;
    };
    pages = sections.flatMap((section, i) => {
      const contents = section.media ? [[section.media]] : paginateBlocks(section.blocks, fits,
        splitPaperBlock);
      return contents.map((blocks, part) => {
        const page = makePage(blocks.join(''), Boolean(section.media));
        page.dataset.section = i;
        page.dataset.part = part;
        return page;
      });
    });
    measure.remove();
    viewport.append(...pages);
    const sectionPages = pages.filter(page => Number(page.dataset.section) === sectionIndex);
    const retained = (textAnchor && sectionPages.find(page => page.textContent.replace(/\s+/g, ' ').includes(textAnchor)))
      || sectionPages[Math.min(sectionPage, sectionPages.length - 1)];
    selected = Math.max(0, pages.indexOf(retained));
    pages.forEach((page, i) => {
      page.hidden = i !== selected;
      page.inert = i !== selected;
      page.setAttribute('aria-hidden', String(i !== selected));
      page.setAttribute('aria-label', `Sheet ${i + 1} of ${pages.length}`);
      page.querySelectorAll('video').forEach(video => {
        const failed = () => {
          const fallback = video.parentElement.querySelector('.project-video-fallback');
          if (fallback) fallback.hidden = false;
        };
        video.addEventListener('error', failed, options);
        video.querySelector('source')?.addEventListener('error', failed, options);
      });
    });
    updateControls();
  }

  function queueLayout() {
    if (!layoutFrame) layoutFrame = requestAnimationFrame(layout);
  }

  previous.addEventListener('click', () => turnTo(selected - 1), options);
  next.addEventListener('click', () => turnTo(selected + 1), options);
  modal.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      onClose();
      return;
    }
    if (event.key === 'Tab') {
      const focusable = [...modal.querySelectorAll('a[href], button, video[controls], input, select, textarea, [tabindex="0"]')]
        .filter(node => !node.disabled && !node.closest('[inert], [hidden]') && node.getClientRects().length);
      const first = focusable[0], last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      return;
    }
    if (event.altKey || event.ctrlKey || event.metaKey || event.target.closest('video, input, select, textarea, [contenteditable="true"]')) return;
    const target = { ArrowLeft: selected - 1, ArrowRight: selected + 1, PageUp: selected - 1, PageDown: selected + 1, Home: 0, End: pages.length - 1 }[event.key];
    if (target !== undefined) { event.preventDefault(); event.stopPropagation(); turnTo(target); }
  }, options);
  // A trackpad gesture turns one sheet; its momentum cannot skip more pages.
  modal.addEventListener('wheel', event => {
    if (event.ctrlKey || !event.cancelable) return;
    event.preventDefault();
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(() => { wheelUsed = false; wheelDelta = 0; }, 220);
    if (wheelUsed || animations.length || event.target.closest('video')) return;
    const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
    wheelDelta += delta * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? viewport.clientHeight : 1);
    if (Math.abs(wheelDelta) >= 45) {
      wheelUsed = true;
      turnTo(selected + Math.sign(wheelDelta));
    }
  }, { ...options, passive: false });
  viewport.addEventListener('pointerdown', event => {
    touch = event.pointerType === 'touch' && !event.target.closest('a, button, video')
      ? { x: event.clientX, y: event.clientY } : null;
  }, options);
  viewport.addEventListener('pointerup', event => {
    if (!touch) return;
    const dx = event.clientX - touch.x, dy = event.clientY - touch.y;
    touch = null;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.2) turnTo(selected + (dx < 0 ? 1 : -1));
  }, options);
  viewport.addEventListener('pointercancel', () => { touch = null; }, options);
  const observer = new ResizeObserver(queueLayout);
  observer.observe(viewport);
  const fontsChanged = () => { layoutSize = ''; queueLayout(); };
  // Already-loaded fonts don't require a second full article pagination.
  if (document.fonts?.status === 'loading') {
    document.fonts.ready.then(() => { if (!abort.signal.aborted) fontsChanged(); });
  }
  document.fonts?.addEventListener('loadingdone', fontsChanged, options);
  layout();
  close.focus({ preventScroll: true });
  return {
    destroy() {
      abort.abort();
      observer.disconnect();
      cancelAnimationFrame(layoutFrame);
      clearTimeout(wheelTimer);
      stopTurn();
      pages.forEach(page => page.querySelectorAll('video').forEach(video => video.pause()));
    },
  };
}
