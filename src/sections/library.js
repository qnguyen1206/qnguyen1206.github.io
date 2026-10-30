import { homeContent } from '../content/home.js';
import { createShelfRows, escapeContent as escapeText } from '../utils/content-model.js';
import '../styles/library.css';
import '../styles/volume-flight.css';
import { libraryVolumes, resolveLibraryVolume, applyVolumeCover } from '../utils/library-state.js';
import { bindReaderInteractions } from '../utils/reader-interactions.js';
import { initShelfSpines } from '../utils/shelf-spines.js';
import { createVolumeFlight } from '../utils/volume-flight.js';
import { afterFeedbackPaint, startPickupFeedback } from '../utils/interaction-feedback.js';

const spineColors = ['#243b36', '#9e6039', '#b28c57', '#513a2c', '#d0ba8d', '#26383c', '#793d28', '#b07b48', '#d2c4a3', '#625f43'];
function decorativeBooks(seed, count = 12) {
  const books = Array.from({ length: count }, (_, index) => {
    const n = seed * 17 + index * 7;
    return `<span class="library-decoration library-decoration--${n % 3}" aria-hidden="true" style="--spine:${spineColors[n % spineColors.length]};--book-height:${70 + n % 26}%;--book-width:${7 + n % 11}px"></span>`;
  });
  // Small parallel clusters lean into one shared gap, like the reference.
  const start = 2 + seed % 2;
  const size = 3 + seed % 2;
  const angle = seed % 3 === 0 ? -8 : 7 + seed % 4;
  return books.slice(0, start).join('') +
    `<span class="library-book-cluster" data-lean="${angle}" style="--cluster-size:${size}" aria-hidden="true">${books.slice(start, start + size).join('')}</span>` +
    books.slice(start + size).join('');
}
function volumeButton(volume) {
  return `<button type="button" class="library-volume library-volume--${volume.color} ${volume.type === 'Binder' ? 'library-volume--binder' : ''}" data-open-volume="${volume.id}" aria-label="Open ${escapeText(volume.title)} ${volume.type.toLowerCase()}">
    <span class="library-volume-title">${escapeText(volume.title)}</span>
    ${volume.type === 'Binder' ? '<span class="library-binder-hole" aria-hidden="true"></span>' : ''}
  </button>`;
}

export function initLibrary({ initVolume = () => {} } = {}) {
  const hero = document.getElementById('hero');
  const library = document.getElementById('library');
  const reader = document.getElementById('library-reader');
  const scroller = reader.querySelector('.library-reader-volumes');
  const sections = libraryVolumes.map(volume => document.getElementById(volume.id));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;
  root.classList.add('library-mode');
  const rows = createShelfRows(libraryVolumes);
  library.style.setProperty('--library-shelf-rows', rows.length);
  library.innerHTML = `<div class="library-stage">
    <div class="library-cabinet" aria-label="Portfolio bookshelf">
      <div class="library-cabinet-crown" aria-hidden="true"></div>
      ${rows.map((row, index) => `<div class="library-shelf-row ${row ? 'library-shelf-row--featured' : 'library-shelf-row--decorative'}">
        <div class="library-volumes">${Array.from({ length: 3 }, (_, bay) => `<div class="library-shelf-bay">
          ${decorativeBooks(index * 3 + bay, row ? 8 : 22)}
          ${row?.[bay] ? volumeButton(row[bay]) : ''}
          ${row ? decorativeBooks(index * 9 + bay + 4, 8) : ''}
        </div>`).join('')}</div>
        <div class="library-shelf-edge" aria-hidden="true"></div>
      </div>`).join('')}
      <div class="library-cabinet-foot" aria-hidden="true"></div>
    </div>
  </div>`;
  libraryVolumes.forEach((volume, index) => {
    applyVolumeCover(library.querySelector(`[data-open-volume="${volume.id}"]`), volume);
    applyVolumeCover(sections[index], volume);
  });
  initShelfSpines(library.querySelector('.library-cabinet'));
  const toolbar = reader.querySelector('.library-reader-toolbar');
  const chooser = toolbar.querySelector('select');
  chooser.innerHTML = libraryVolumes.map(volume => `<option value="${volume.id}">${volume.number} · ${escapeText(volume.title)}</option>`).join('');
  const back = toolbar.querySelector('[data-library-back]');
  let active = null;
  let shelfScroll = 0;
  let shelfFocus = null;
  let navigation = 0;
  let phase = '';
  let closing = null;
  let viewportVersion = 0;
  const flight = createVolumeFlight();
  let pickup = null;

  function beginNavigation() {
    const request = ++navigation;
    pickup?.cancel();
    pickup = null;
    flight.cancel();
    reader.style.opacity = '';
    reader.inert = false;
    reader.removeAttribute('aria-busy');
    root.classList.remove('library-transitioning');
    phase = '';
    return request;
  }
  function transitioning(value) {
    root.classList.toggle('library-transitioning', value);
    reader.inert = value;
    if (value) reader.setAttribute('aria-busy', 'true');
    else reader.removeAttribute('aria-busy');
  }
  function readingCover(id) {
    return document.getElementById(id).querySelector('.about-book, .publication-cover, .experience-binder');
  }
  function shelfButton(id) {
    return library.querySelector(`[data-open-volume="${id}"]`);
  }
  function canAnimate() {
    return !reduced.matches && typeof reader.animate === 'function' && !document.hidden;
  }

  function updateOffsets() {
    const height = toolbar.offsetHeight || 60;
    root.style.setProperty('--library-reader-offset', `${height}px`);
    sections.forEach(section => { section.dataset.readerOffset = String(height); });
  }
  function writeRoute(id) {
    const hash = `#${id}`;
    if (location.hash !== hash) history.pushState({ library: true }, '', hash);
  }
  function clearOverlays() {
    window.closeProjectModal?.();
    document.querySelector('.blog-modal.active')?.classList.remove('active');
    document.body.style.overflow = '';
    root.style.overflow = '';
  }
  async function openVolume(id, { route = true, source = null } = {}) {
    const volume = libraryVolumes.find(item => item.id === id);
    if (!volume || (active === id && phase !== 'closing')) return;
    const request = beginNavigation();
    phase = 'opening';
    shelfFocus = source || shelfButton(id);
    // Start a tiny compositor animation in the click task itself. Never wait
    // for reader construction, image loads, or page fitting to acknowledge it.
    pickup = startPickupFeedback(shelfFocus, !active && canAnimate());
    await afterFeedbackPaint();
    if (request !== navigation) return;
    // Build a volume once, on demand, instead of creating every hidden reader
    // and requesting all of its images while the user is still on Home.
    try { initVolume(volume); }
    catch (error) { beginNavigation(); console.error('Unable to open volume:', error); return; }
    if (!active) {
      // Stop any in-flight Home descent before locking the document.
      window.scrollTo({ top: window.scrollY, behavior: 'instant' });
      shelfScroll = window.scrollY;
    }
    clearOverlays();
    active = id;
    hero.inert = true;
    library.inert = true;
    root.classList.add('library-reading');
    reader.hidden = false;
    sections.forEach(section => { section.hidden = section.id !== id; section.inert = section.hidden; });
    chooser.value = id;
    toolbar.querySelector('.library-reader-kind').textContent = 'Scroll to read · Click outside to close';
    document.title = `${volume.title} — ${homeContent.name}’s Library`;
    updateOffsets();
    scroller.scrollTo({ top: 0, behavior: 'instant' });
    if (route) writeRoute(id);
    phase = 'opening';
    const animated = canAnimate();
    if (animated) { reader.style.opacity = '0'; transitioning(true); }
    // Activate only this reader, not the shelf, Home, and every hidden volume.
    document.getElementById(id).dispatchEvent(new Event('library:activate'));
    const measuredViewport = viewportVersion;
    // Let the existing page layout finish before measuring its actual cover.
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    if (request !== navigation) return;
    const cover = readingCover(id);
    const origin = shelfFocus.getBoundingClientRect();
    pickup?.cancel();
    pickup = null;
    try {
      if (animated && canAnimate() && cover && measuredViewport === viewportVersion) await flight.run({
        volume, source: shelfFocus, shelfRect: origin,
        readerRect: cover.getBoundingClientRect(), reader, opening: true
      });
    } catch (error) {
      console.warn('Opening animation skipped:', error);
    } finally {
      if (request === navigation) {
        phase = '';
        reader.style.opacity = '';
        transitioning(false);
      }
    }
    if (request !== navigation) return;
    const heading = document.getElementById(id).querySelector('h2');
    if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
    requestAnimationFrame(() => {
      if (request === navigation) scroller.dispatchEvent(new Event('scroll'));
    });
  }
  function closeVolume(options = {}) {
    if (!active) return Promise.resolve();
    if (phase === 'closing') return closing;
    closing = performClose(options);
    return closing;
  }
  async function performClose({ route = true, restore = true } = {}) {
    const id = active;
    const volume = libraryVolumes.find(item => item.id === id);
    const request = beginNavigation();
    phase = 'closing';
    clearOverlays();
    const cover = readingCover(id);
    const destination = shelfButton(id);
    if (restore) {
      // Position the destination under the opaque reader before flying back.
      const shelfTop = window.scrollY + library.getBoundingClientRect().top;
      window.scrollTo({ top: Math.max(shelfScroll, shelfTop), behavior: 'instant' });
      const rect = destination.getBoundingClientRect();
      if (rect.top < 0 || rect.bottom > innerHeight) {
        window.scrollTo({ top: window.scrollY + rect.top - Math.max(16, (innerHeight - rect.height) / 2), behavior: 'instant' });
      }
    }
    transitioning(true);
    try {
      if (restore && canAnimate() && cover) await flight.run({
        volume, source: destination, shelfRect: destination.getBoundingClientRect(),
        readerRect: cover.getBoundingClientRect(), reader, opening: false
      });
    } catch (error) {
      console.warn('Closing animation skipped:', error);
    } finally {
      if (request === navigation) {
        reader.style.opacity = '';
        transitioning(false);
      }
    }
    if (request !== navigation) return;
    phase = '';
    active = null;
    reader.hidden = true;
    sections.forEach(section => { section.hidden = true; section.inert = true; });
    hero.inert = false;
    library.inert = false;
    root.classList.remove('library-reading');
    document.title = homeContent.documentTitle;
    if (route) writeRoute('library');
    if (restore) {
      destination.focus({ preventScroll: true });
    }
    window.dispatchEvent(new Event('scroll'));
  }
  async function navigateScene(id, { route = true } = {}) {
    if (!active && phase === 'opening') beginNavigation();
    const wasReading = Boolean(active);
    if (active) {
      const pending = closeVolume({ route: false, restore: id === 'library' });
      const request = navigation;
      await pending;
      if (request !== navigation) return;
    }
    if (route) writeRoute(id);
    if (wasReading && id === 'library') return;
    document.getElementById(id).scrollIntoView({ behavior: reduced.matches ? 'instant' : 'smooth', block: 'start' });
  }
  library.addEventListener('click', event => {
    const button = event.target.closest('[data-open-volume]');
    if (button) openVolume(button.dataset.openVolume, { source: button });
  });
  back.addEventListener('click', () => closeVolume());
  chooser.addEventListener('change', () => openVolume(chooser.value));
  bindReaderInteractions(reader, scroller, {
    isOpen: () => active !== null && !phase,
    hasOverlay: () => Boolean(document.querySelector('.project-modal-overlay.active, .blog-modal.active, .blog-dropdown.open')),
    close: () => closeVolume()
  });
  // Each controller listens directly to the private runway. Do not broadcast
  // reader scrolls to the Home scene and every window scroll listener.
  document.addEventListener('keydown', event => {
    if (!active && phase === 'opening' && event.key === 'Escape') {
      event.preventDefault(); beginNavigation(); return;
    }
    if (!active || document.querySelector('.project-modal-overlay.active, .blog-modal.active, .blog-dropdown.open')) return;
    if (event.key === 'Escape') { event.preventDefault(); closeVolume(); }
    if (phase) {
      if (event.key === 'Tab') event.preventDefault();
      return;
    }
    if (event.key === 'Tab') {
      const focusable = [...reader.querySelectorAll('button, a[href], select, [tabindex="0"]')]
        .filter(element => !element.disabled && !element.closest('[inert], [hidden]') && element.getClientRects().length);
      const first = focusable[0], last = focusable.at(-1);
      if (event.shiftKey && (document.activeElement === first || !focusable.includes(document.activeElement))) {
        event.preventDefault(); last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first?.focus();
      }
    }
  }, true);
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"], [data-scroll-to]');
    if (!link) return;
    const hash = link.dataset.scrollTo ? `#${link.dataset.scrollTo}` : link.getAttribute('href');
    const volume = resolveLibraryVolume(hash);
    if (volume || hash === '#hero' || hash === '#library') {
      event.preventDefault();
      if (volume) openVolume(volume.id); else navigateScene(hash.slice(1));
    }
  });
  function followRoute() {
    // Browser history wins over a pending Return-to-shelf completion.
    if (phase === 'closing' || (!active && phase === 'opening')) beginNavigation();
    const volume = resolveLibraryVolume(location.hash);
    if (volume) openVolume(volume.id, { route: false });
    else if (active || location.hash === '#library' || location.hash === '#hero') {
      navigateScene(location.hash === '#library' ? 'library' : 'hero', { route: false });
    }
  }
  window.addEventListener('popstate', followRoute);
  window.addEventListener('hashchange', followRoute);
  window.addEventListener('resize', () => {
    viewportVersion++;
    if (active) updateOffsets();
    // A viewport change invalidates the flight destination. Settle immediately.
    flight.cancel();
  });
  reduced.addEventListener('change', () => { if (reduced.matches) flight.cancel(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) flight.cancel(); });
  history.scrollRestoration = 'manual';
  // Run after the sky scene has established its document height.
  requestAnimationFrame(followRoute);
}
