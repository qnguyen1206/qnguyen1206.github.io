// Paint feedback before mounting/measuring a reader. A microtask alone would
// keep that expensive work in the same frame and hide the response to the click.
export function afterFeedbackPaint() {
  if (document.hidden) return Promise.resolve();
  return new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve, 0)));
}

export function startPickupFeedback(source, motion = true) {
  let animation;
  if (source && motion && typeof source.animate === 'function') {
    animation = source.animate([
      { transform: 'translate3d(0, 0, 0)', opacity: .78 },
      { transform: 'translate3d(0, -10px, 0)', opacity: 1 }
    ], { duration: 220, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'forwards' });
    animation.finished.catch(() => {});
  }
  return { cancel() { animation?.cancel(); } };
}
