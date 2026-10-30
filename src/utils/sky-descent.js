import '../styles/sky-descent.css';
import { getDescentFrame, getCloudOffsets, skyEase as ease } from './sky-motion.js';
export { getDescentFrame } from './sky-motion.js';

export function initSkyDescent() {
  const hero = document.getElementById('hero');
  const library = document.getElementById('library');
  const title = hero.querySelector('.hero-text');
  const footer = hero.querySelector('.hero-footer');
  const stars = hero.querySelector('.stars-container');
  const nav = hero.querySelector('.hero-nav');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;

  // Fixed navigation must not inherit the scene's transforms or clipping.
  hero.append(nav);
  const stage = document.createElement('div');
  stage.className = 'hero-sky-stage';
  const backdrop = document.createElement('div');
  backdrop.className = 'hero-sky-backdrop';
  backdrop.setAttribute('aria-hidden', 'true');
  stage.append(backdrop, hero.querySelector(':scope > .container'), footer, stars);
  hero.prepend(stage);

  const atmosphere = document.createElement('div');
  atmosphere.className = 'sky-descent-atmosphere';
  atmosphere.setAttribute('aria-hidden', 'true');
  atmosphere.inert = true;
  atmosphere.innerHTML = `
    <div class="sky-cloud-bank sky-cloud-bank--far"></div>
    <div class="sky-cloud-bank sky-cloud-bank--near"></div>
    <div class="sky-descent-streaks">${Array.from({ length: 12 }, (_, i) =>
      `<span style="--x: ${(i * 37 + 5) % 100}%; --y: ${(i * 23) % 100}%; --length: ${35 + (i % 5) * 19}px"></span>`
    ).join('')}</div>`;
  document.body.append(atmosphere);
  const banks = [...atmosphere.querySelectorAll('.sky-cloud-bank')];
  const streaks = atmosphere.querySelector('.sky-descent-streaks');

  let frame = 0;
  let lastProgress = -1;
  let lastHeight = 0;
  let needsMeasure = true;
  let geometry = { top: 0, height: 1, distance: 1 };
  let lastActive = null;

  function measure() {
    // Read layout only when its dimensions change, not on every scroll frame.
    const height = stage.offsetHeight;
    geometry = {
      top: window.scrollY + hero.getBoundingClientRect().top,
      height,
      distance: Math.max(1, hero.offsetHeight - height)
    };
    needsMeasure = false;
  }

  function render() {
    frame = 0;
    if (reducedMotion.matches) return;
    if (root.classList.contains('library-reading')) {
      atmosphere.hidden = true;
      root.classList.remove('sky-descent-active');
      lastActive = null;
      return;
    }
    if (needsMeasure) measure();
    const { height, distance, top } = geometry;
    const position = window.scrollY - top;
    const state = getDescentFrame(position / distance);
    const active = position >= 0 && state.progress < 1;
    if (active !== lastActive) {
      root.classList.toggle('sky-descent-active', active);
      atmosphere.hidden = !active;
      lastActive = active;
    }
    if (lastProgress === state.progress && lastHeight === height) return;
    lastProgress = state.progress;
    lastHeight = height;

    const { progress, departure, arrival, mist, rush } = state;
    // Keep the stars visible in the descent, but stop their independent
    // twinkling and the heading's repainting gradient while scrolling.
    hero.classList.toggle('hero-effects-paused', progress > .01);
    title.style.transform = `translate3d(0, ${-departure * height * 0.38}px, 0)`;
    title.style.opacity = String(1 - departure);
    // Invisible CTAs should not intercept keyboard or pointer input.
    if (title.inert !== (departure > .98)) title.inert = departure > .98;
    footer.style.opacity = String(1 - ease(progress / 0.3));
    stars.style.opacity = String(1 - ease(progress / 0.8));
    const cloudOffsets = getCloudOffsets(progress, height);
    banks.forEach((bank, i) => {
      bank.style.transform = `translate3d(0, ${cloudOffsets[i]}px, 0)`;
      bank.style.opacity = String(mist * (i ? .55 : .32));
    });
    streaks.style.opacity = String(rush * 0.28);
    streaks.style.transform = `translate3d(0, ${-progress * height * 0.8}px, 0)`;
    // The detailed shelf scrolls into view normally. Do not alpha-blend its
    // hundreds of decorative spines against another full-screen scene.
    if (library.inert !== (arrival < .95)) library.inert = arrival < .95;
  }

  function schedule() {
    if (!frame && !reducedMotion.matches) frame = requestAnimationFrame(render);
  }

  function resize() {
    needsMeasure = true;
    lastProgress = -1;
    schedule();
  }

  function updateMode() {
    const enabled = !reducedMotion.matches;
    root.classList.toggle('sky-descent-enabled', enabled);
    root.classList.remove('sky-descent-active');
    atmosphere.hidden = true;
    lastProgress = -1;
    lastActive = null;
    needsMeasure = true;
    if (!enabled) {
      cancelAnimationFrame(frame);
      frame = 0;
      [title, stars].forEach(element => element.style.removeProperty('transform'));
      [title, footer, stars].forEach(element => element.style.removeProperty('opacity'));
      title.inert = false;
      hero.classList.remove('hero-effects-paused');
      library.inert = root.classList.contains('library-reading');
    } else {
      render();
    }
  }

  reducedMotion.addEventListener('change', updateMode);
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', resize);
  window.addEventListener('pageshow', resize);
  const observer = new ResizeObserver(resize);
  observer.observe(hero);
  observer.observe(stage);
  updateMode();
}
