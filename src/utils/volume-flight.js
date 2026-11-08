import { applyVolumeCover } from './library-state.js';
import { escapeContent } from './content-model.js';

export const VOLUME_FLIGHT_DURATION = Object.freeze({ open: 2000, close: 1800 });

// A real spine and six rigid faces give the shelf book depth. Extract it before
// turning it: rotating a single flat cover just looks like horizontal scaling.
export function getFlightGeometry(shelf, reader, viewport) {
  const width = Math.max(1, reader.width / 2);
  const height = Math.max(1, reader.height);
  const visible = Boolean(shelf && shelf.width > 0 && shelf.height > 0 &&
    shelf.left < viewport.width && shelf.left + shelf.width > 0 &&
    shelf.top < viewport.height && shelf.top + shelf.height > 0);
  const shelfHeight = visible ? shelf.height : Math.min(180, height);
  const thickness = visible ? shelf.width : 40;
  const shelfWidth = Math.max(thickness, shelfHeight * .68);
  const x = visible ? shelf.left + thickness / 2 : (viewport.width - shelfWidth) / 2;
  const y = visible ? shelf.top : Math.max(12, reader.top);
  const direction = x < viewport.width / 2 ? 1 : -1;
  // While edge-on, the cover extends backwards into the shelf by its width.
  // Move that distance out of the slot before pivoting the rigid book.
  const extraction = shelfWidth + 14;
  return {
    width, height, shelfWidth, shelfHeight, thickness, visible,
    shelfPosition: `translate3d(${x}px, ${y}px, 0)`,
    shelf: 'translate3d(0, 0, 0) rotateZ(0deg) rotateY(90deg)',
    extracted: `translate3d(0, -10px, ${extraction}px) rotateZ(0deg) rotateY(90deg)`,
    withdrawn: `translate3d(${direction * 18}px, -18px, ${extraction}px) rotateZ(${-direction * 4}deg) rotateY(25deg)`,
    opened: `translate3d(${reader.left + width}px, ${reader.top}px, 0)`
  };
}

function inDirection(frames, opening) {
  return opening ? frames : [...frames].reverse().map(frame => ({ ...frame, offset: Number((1 - frame.offset).toFixed(4)) }));
}

export function getFlightFrames(geometry, opening) {
  return inDirection([
    { transform: geometry.shelf, offset: 0, easing: 'ease-in-out' },
    { transform: geometry.extracted, offset: .18, easing: 'ease-in-out' },
    // Let the pull-out settle before turning; return pauses before sliding in.
    { transform: geometry.extracted, offset: .24, easing: 'ease-in-out' },
    { transform: geometry.withdrawn, offset: .42, easing: 'ease-in-out' },
    { transform: geometry.withdrawn, offset: 1, easing: 'ease-in-out' }
  ], opening);
}

function solidBookMarkup(volume) {
  const title = escapeContent(volume.title);
  return `<div class="volume-flight volume-flight--shelf ${volume.type === 'Binder' ? 'volume-flight--binder' : ''}">
    <div class="volume-flight-solid">
      <div class="volume-flight-solid-front"><span>${title}</span></div>
      <div class="volume-flight-solid-back"></div>
      <div class="volume-flight-solid-spine"><span>${title}</span>${volume.type === 'Binder' ? '<i class="volume-flight-eyelet"></i>' : ''}</div>
      <div class="volume-flight-solid-foreedge"></div>
      <div class="volume-flight-solid-top"></div>
      <div class="volume-flight-solid-bottom"></div>
    </div>
  </div>`;
}

function coverMarkup(volume, position) {
  return `<div class="volume-flight volume-flight--${position} ${volume.type === 'Binder' ? 'volume-flight--binder' : ''}">
    <div class="volume-flight-paper"><i></i><i></i><i></i></div>
    <div class="volume-flight-lid">
      <div class="volume-flight-front"><span class="volume-flight-title">${escapeContent(volume.title)}</span><i class="volume-flight-eyelet"></i></div>
      <div class="volume-flight-inside"><i></i><i></i></div>
    </div>
    ${volume.type === 'Binder' ? '<div class="volume-flight-rings"><i></i><i></i><i></i></div>' : ''}
  </div>`;
}

export function createVolumeFlight() {
  let cancelCurrent = () => {};
  return {
    cancel() { cancelCurrent(); },
    async run({ volume, source, shelfRect, readerRect, reader, opening }) {
      cancelCurrent();
      const geometry = getFlightGeometry(shelfRect, readerRect, { width: innerWidth, height: innerHeight });
      const layer = document.createElement('div');
      layer.className = 'volume-flight-layer';
      layer.setAttribute('aria-hidden', 'true');
      layer.inert = true;
      layer.innerHTML = solidBookMarkup(volume) + coverMarkup(volume, 'reader');
      const shelfActor = layer.querySelector('.volume-flight--shelf');
      const solid = shelfActor.querySelector('.volume-flight-solid');
      const readingActor = layer.querySelector('.volume-flight--reader');
      const lid = readingActor.querySelector('.volume-flight-lid');
      applyVolumeCover(shelfActor, volume);
      applyVolumeCover(readingActor, volume);
      // Geometry is assigned once, not interpolated between unrelated sizes.
      shelfActor.style.width = `${geometry.shelfWidth}px`;
      shelfActor.style.height = `${geometry.shelfHeight}px`;
      shelfActor.style.transform = geometry.shelfPosition;
      shelfActor.style.setProperty('--book-depth', `${geometry.thickness}px`);
      solid.style.transform = opening ? geometry.shelf : geometry.withdrawn;
      shelfActor.style.opacity = opening && geometry.visible ? '1' : '0';
      readingActor.style.width = `${geometry.width}px`;
      readingActor.style.height = `${geometry.height}px`;
      readingActor.style.transform = geometry.opened;
      readingActor.style.opacity = '0';
      lid.style.transform = opening ? 'rotateY(0deg)' : 'rotateY(-180deg)';
      const oldOpacity = reader.style.opacity;
      const oldVisibility = source?.style.visibility;
      let cancelled = false;
      let cleaned = false;
      const animations = [];
      function cleanup() {
        if (cleaned) return;
        cleaned = true;
        animations.forEach(animation => animation.cancel());
        layer.remove();
        reader.style.opacity = oldOpacity;
        if (source) source.style.visibility = oldVisibility;
      }
      cancelCurrent = () => { cancelled = true; cleanup(); };
      async function animate(element, frames, duration) {
        if (cancelled) return;
        const animation = element.animate(frames, { duration, easing: 'linear', fill: 'forwards' });
        animations.push(animation);
        try { await animation.finished; } catch { /* Navigation/resize cancellation. */ }
      }
      document.body.append(layer);
      if (source) source.style.visibility = 'hidden';
      if (opening) reader.style.opacity = '0';
      try {
        const duration = opening ? VOLUME_FLIGHT_DURATION.open : VOLUME_FLIGHT_DURATION.close;
        const shelfOpacity = geometry.visible ? 1 : 0;
        await Promise.all([
          animate(solid, getFlightFrames(geometry, opening), duration),
          // Fade the camera wrapper, never the preserve-3d body or its faces.
          animate(shelfActor, inDirection([
            { opacity: shelfOpacity, offset: 0 }, { opacity: shelfOpacity, offset: .46, easing: 'ease-in-out' },
            { opacity: 0, offset: .6, easing: 'ease-in-out' }, { opacity: 0, offset: 1, easing: 'ease-in-out' }
          ], opening), duration),
          animate(readingActor, inDirection([
            { opacity: 0, offset: 0 }, { opacity: 0, offset: .46, easing: 'ease-in-out' },
            { opacity: 1, offset: .6, easing: 'ease-in-out' },
            { opacity: 1, offset: .86, easing: 'ease-in-out' }, { opacity: 0, offset: 1, easing: 'ease-in-out' }
          ], opening), duration),
          // Finish the handoff before opening, and rest flat before revealing text.
          animate(lid, inDirection([
            { transform: 'rotateY(0deg)', offset: 0, easing: 'ease-in-out' },
            { transform: 'rotateY(0deg)', offset: .6, easing: 'ease-in-out' },
            { transform: 'rotateY(-180deg)', offset: .86, easing: 'ease-in-out' },
            { transform: 'rotateY(-180deg)', offset: 1, easing: 'ease-in-out' }
          ], opening), duration),
          // Real pages only fade at rest; no text or controls are transformed.
          animate(reader, inDirection([
            { opacity: 0, offset: 0 }, { opacity: 0, offset: .86, easing: 'ease-in-out' }, { opacity: 1, offset: 1, easing: 'ease-in-out' }
          ], opening), duration),
          animate(layer, inDirection([
            { opacity: 1, offset: 0 }, { opacity: 1, offset: .86, easing: 'ease-in-out' }, { opacity: 0, offset: 1, easing: 'ease-in-out' }
          ], opening), duration)
        ]);
      } finally {
        cleanup();
      }
    }
  };
}
