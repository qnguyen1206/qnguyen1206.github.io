import { applyVolumeCover } from './library-state.js';
import { escapeContent } from './content-model.js';

export const VOLUME_FLIGHT_DURATION = Object.freeze({ open: 1600, close: 1450 });

// One small decorative cover animates; the real pages are never cloned.
export function getFlightGeometry(shelf, reader, viewport) {
  const width = Math.max(1, reader.width);
  const height = Math.max(1, reader.height);
  const closedWidth = width / 2;
  const x = reader.left + closedWidth;
  const y = reader.top;
  const visible = Boolean(shelf && shelf.width > 0 && shelf.height > 0 &&
    shelf.left < viewport.width && shelf.left + shelf.width > 0 &&
    shelf.top < viewport.height && shelf.top + shelf.height > 0);
  // A spine is the edge-on view of a cover, not a horizontally squashed cover.
  // Uniform scale keeps lettering and cover details in proportion throughout.
  const scale = visible ? Math.max(shelf.height / height, shelf.width / closedWidth) : .8;
  const origin = visible
    ? { x: shelf.left, y: shelf.top, scale,
      angle: Math.acos(Math.min(1, shelf.width / (closedWidth * scale))) * 180 / Math.PI }
    : { x: x + closedWidth * .15, y: y + height * .1, scale, angle: 20 };
  function at(progress) {
    const t = Math.max(0, Math.min(1, progress));
    const eased = t * t * (3 - 2 * t);
    const px = origin.x + (x - origin.x) * eased;
    const py = origin.y + (y - origin.y) * eased - 24 * Math.sin(Math.PI * eased);
    const size = origin.scale + (1 - origin.scale) * eased;
    return `translate3d(${px}px, ${py}px, 0) scale(${size}) rotateY(${origin.angle * (1 - eased)}deg)`;
  }
  return {
    width: closedWidth, height, visible,
    shelf: at(0), opened: at(1), at
  };
}

export function getFlightFrames(geometry, opening) {
  // Sample one continuous curve; the old three-keyframe path had a sharp corner.
  const frames = Array.from({ length: 41 }, (_, index) => {
    const t = index / 40;
    return { transform: geometry.at(opening ? t : 1 - t),
      offset: opening ? t * .7 : .3 + t * .7 };
  });
  if (opening) frames.push({ transform: geometry.opened, offset: 1 });
  else frames.unshift({ transform: geometry.opened, offset: 0 });
  return frames;
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
      const title = escapeContent(volume.title);
      layer.innerHTML = `<div class="volume-flight ${volume.type === 'Binder' ? 'volume-flight--binder' : ''}">
        <div class="volume-flight-paper"><i></i><i></i><i></i></div>
        <div class="volume-flight-lid">
          <div class="volume-flight-front"><span class="volume-flight-title">${title}</span><i class="volume-flight-eyelet"></i></div>
          <div class="volume-flight-inside"><i></i><i></i></div>
        </div>
        ${volume.type === 'Binder' ? '<div class="volume-flight-rings"><i></i><i></i><i></i></div>' : ''}
      </div>`;
      const actor = layer.firstElementChild;
      const lid = actor.querySelector('.volume-flight-lid');
      const label = actor.querySelector('.volume-flight-title');
      applyVolumeCover(actor, volume);
      actor.style.width = `${geometry.width}px`;
      actor.style.height = `${geometry.height}px`;
      actor.style.transform = opening ? geometry.shelf : geometry.opened;
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
      async function animate(element, frames, duration, easing = 'linear') {
        if (cancelled) return;
        const animation = element.animate(frames, { duration, easing, fill: 'forwards' });
        animations.push(animation);
        try { await animation.finished; } catch { /* Navigation/resize cancellation. */ }
      }
      document.body.append(layer);
      if (source) source.style.visibility = 'hidden';
      try {
        // All tracks start together: no stop between flight and unfolding.
        // Only the temporary shell transforms. Real text is revealed at rest.
        const duration = opening ? VOLUME_FLIGHT_DURATION.open : VOLUME_FLIGHT_DURATION.close;
        const hinge = 'cubic-bezier(.4,0,.2,1)';
        if (opening) {
          await Promise.all([
            animate(actor, getFlightFrames(geometry, true), duration),
            animate(lid, [
              { transform: 'rotateY(0deg)', offset: 0 },
              { transform: 'rotateY(0deg)', offset: .4, easing: hinge },
              { transform: 'rotateY(-180deg)', offset: .84 },
              { transform: 'rotateY(-180deg)', offset: 1 }
            ], duration),
            animate(label, [{ opacity: 0, offset: 0 }, { opacity: 0, offset: .35 },
              { opacity: 1, offset: .55 }, { opacity: 1, offset: 1 }], duration),
            animate(reader, [{ opacity: 0, offset: 0 }, { opacity: 0, offset: .82 }, { opacity: 1, offset: 1 }], duration),
            animate(layer, [{ opacity: geometry.visible ? 1 : 0, offset: 0 },
              { opacity: 1, offset: .12 }, { opacity: 1, offset: .82 }, { opacity: 0, offset: 1 }], duration)
          ]);
        } else {
          await Promise.all([
            animate(actor, getFlightFrames(geometry, false), duration),
            animate(lid, [
              { transform: 'rotateY(-180deg)', offset: 0 },
              { transform: 'rotateY(-180deg)', offset: .12, easing: hinge },
              { transform: 'rotateY(0deg)', offset: .58 },
              { transform: 'rotateY(0deg)', offset: 1 }
            ], duration),
            animate(label, [{ opacity: 1, offset: 0 }, { opacity: 1, offset: .5 },
              { opacity: 0, offset: .7 }, { opacity: 0, offset: 1 }], duration),
            animate(reader, [{ opacity: 1, offset: 0 }, { opacity: 0, offset: .18 }, { opacity: 0, offset: 1 }], duration),
            animate(layer, [{ opacity: 0, offset: 0 }, { opacity: 1, offset: .18 },
              { opacity: 1, offset: .88 }, { opacity: geometry.visible ? 1 : 0, offset: 1 }], duration)
          ]);
        }
      } finally {
        cleanup();
      }
    }
  };
}
