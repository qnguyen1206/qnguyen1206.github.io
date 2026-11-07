import { applyVolumeCover } from './library-state.js';
import { escapeContent } from './content-model.js';

export const VOLUME_FLIGHT_DURATION = Object.freeze({ open: 560, close: 440 });

// The shelf book and reading cover are separate, fixed-size props. A short
// handoff connects them; neither the book nor the real reader ever zooms.
export function getFlightGeometry(shelf, reader, viewport) {
  const width = Math.max(1, reader.width / 2);
  const height = Math.max(1, reader.height);
  const visible = Boolean(shelf && shelf.width > 0 && shelf.height > 0 &&
    shelf.left < viewport.width && shelf.left + shelf.width > 0 &&
    shelf.top < viewport.height && shelf.top + shelf.height > 0);
  const shelfHeight = visible ? shelf.height : Math.min(180, height);
  const shelfWidth = Math.max(visible ? shelf.width : 40, shelfHeight * .68);
  const x = visible ? shelf.left : (viewport.width - shelfWidth) / 2;
  const y = visible ? shelf.top : Math.max(12, reader.top);
  const angle = Math.acos(Math.min(1, (visible ? shelf.width : 40) / shelfWidth)) * 180 / Math.PI;
  const direction = x < viewport.width / 2 ? 1 : -1;
  const pulledX = Math.max(8, Math.min(viewport.width - shelfWidth - 8, x + direction * 18));
  return {
    width, height, shelfWidth, shelfHeight, visible,
    shelf: `translate3d(${x}px, ${y}px, 0) rotateY(${angle}deg) rotateZ(0deg)`,
    withdrawn: `translate3d(${pulledX}px, ${Math.max(8, y - 20)}px, 0) rotateY(18deg) rotateZ(${-direction * 4}deg)`,
    opened: `translate3d(${reader.left + width}px, ${reader.top}px, 0)`
  };
}

export function getFlightFrames(geometry, opening) {
  const opacity = geometry.visible ? 1 : 0;
  return opening ? [
    { transform: geometry.shelf, opacity, offset: 0, easing: 'cubic-bezier(.2,.7,.2,1)' },
    { transform: geometry.withdrawn, opacity, offset: .34 },
    { transform: geometry.withdrawn, opacity: 0, offset: .48 },
    { transform: geometry.withdrawn, opacity: 0, offset: 1 }
  ] : [
    { transform: geometry.withdrawn, opacity: 0, offset: 0 },
    { transform: geometry.withdrawn, opacity: 0, offset: .52 },
    { transform: geometry.withdrawn, opacity, offset: .65, easing: 'cubic-bezier(.3,0,.3,1)' },
    { transform: geometry.shelf, opacity, offset: 1 }
  ];
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
      layer.innerHTML = coverMarkup(volume, 'shelf') + coverMarkup(volume, 'reader');
      const shelfActor = layer.querySelector('.volume-flight--shelf');
      const readingActor = layer.querySelector('.volume-flight--reader');
      const lid = readingActor.querySelector('.volume-flight-lid');
      applyVolumeCover(shelfActor, volume);
      applyVolumeCover(readingActor, volume);
      // Geometry is assigned once, not interpolated between unrelated sizes.
      shelfActor.style.width = `${geometry.shelfWidth}px`;
      shelfActor.style.height = `${geometry.shelfHeight}px`;
      shelfActor.style.transform = opening ? geometry.shelf : geometry.withdrawn;
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
        const hinge = 'cubic-bezier(.25,.65,.2,1)';
        await Promise.all([
          animate(shelfActor, getFlightFrames(geometry, opening), duration),
          animate(readingActor, opening ? [
            { opacity: 0, offset: 0 }, { opacity: 0, offset: .34 },
            { opacity: 1, offset: .48 }, { opacity: 1, offset: .82 }, { opacity: 0, offset: 1 }
          ] : [
            { opacity: 0, offset: 0 }, { opacity: 1, offset: .14 },
            { opacity: 1, offset: .5 }, { opacity: 0, offset: .65 }, { opacity: 0, offset: 1 }
          ], duration),
          animate(lid, opening ? [
            { transform: 'rotateY(0deg)', offset: 0 },
            { transform: 'rotateY(0deg)', offset: .44, easing: hinge },
            { transform: 'rotateY(-180deg)', offset: .94 },
            { transform: 'rotateY(-180deg)', offset: 1 }
          ] : [
            { transform: 'rotateY(-180deg)', offset: 0, easing: hinge },
            { transform: 'rotateY(0deg)', offset: .55 },
            { transform: 'rotateY(0deg)', offset: 1 }
          ], duration),
          // Real pages only fade at rest; no text or controls are transformed.
          animate(reader, opening ? [
            { opacity: 0, offset: 0 }, { opacity: 0, offset: .8 }, { opacity: 1, offset: 1 }
          ] : [
            { opacity: 1, offset: 0 }, { opacity: 0, offset: .16 }, { opacity: 0, offset: 1 }
          ], duration),
          animate(layer, opening ? [
            { opacity: 1, offset: 0 }, { opacity: 1, offset: .8 }, { opacity: 0, offset: 1 }
          ] : [
            { opacity: 0, offset: 0 }, { opacity: 1, offset: .14 }, { opacity: 1, offset: 1 }
          ], duration)
        ]);
      } finally {
        cleanup();
      }
    }
  };
}
