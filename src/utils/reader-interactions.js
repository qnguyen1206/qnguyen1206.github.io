const protectedClickTargets = [
  '.about-book', '.experience-binder', '.publication-cover',
  '.library-reader-toolbar', '.about-book-controls', '.publication-controls',
  '.publication-toolbar', '.project-modal-overlay', '.blog-modal',
  'a', 'button', 'select', 'input', 'textarea', '[contenteditable="true"]'
].join(', ');

export function readerWheelDelta(event, height) {
  const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? height : 1;
  return Number.isFinite(event.deltaY) ? event.deltaY * unit : 0;
}

export function bindReaderInteractions(reader, scroller, { isOpen, hasOverlay, close }) {
  // The toolbar is outside the scroll runway. Only it needs wheel forwarding.
  // Never attach a blocking wheel listener above the reading surface: let the
  // browser handle wheel momentum, touch, and nested text scrolling natively.
  const toolbar = reader.querySelector('.library-reader-toolbar');
  let press = null;
  const outside = target => reader.contains(target) && !target.closest(protectedClickTargets);
  function pointerDown(event) {
    press = isOpen() && !hasOverlay() && event.button === 0 && outside(event.target)
      ? { x: event.clientX, y: event.clientY, scroll: scroller.scrollTop }
      : null;
  }
  function pointerMove(event) {
    if (press && Math.hypot(event.clientX - press.x, event.clientY - press.y) > 8) press = null;
  }
  function pointerCancel() { press = null; }
  function click(event) {
    const start = press;
    press = null;
    // A drag, swipe, text selection, or click that began on the book isn't dismissal.
    if (!start || !isOpen() || hasOverlay() || !outside(event.target)) return;
    if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > 8 ||
        Math.abs(scroller.scrollTop - start.scroll) > 1) return;
    close();
  }
  function wheel(event) {
    if (!isOpen() || hasOverlay() || event.defaultPrevented || !event.cancelable || event.ctrlKey ||
        event.target.closest('select, input, textarea, [contenteditable="true"]')) return;
    const delta = readerWheelDelta(event, scroller.clientHeight);
    if (!delta || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    event.preventDefault();
    scroller.scrollTo({
      top: Math.max(0, Math.min(scroller.scrollHeight - scroller.clientHeight, scroller.scrollTop + delta)),
      behavior: 'instant'
    });
  }
  reader.addEventListener('pointerdown', pointerDown, true);
  reader.addEventListener('pointermove', pointerMove, true);
  reader.addEventListener('pointercancel', pointerCancel, true);
  reader.addEventListener('click', click, true);
  toolbar?.addEventListener('wheel', wheel, { passive: false });
  return () => {
    reader.removeEventListener('pointerdown', pointerDown, true);
    reader.removeEventListener('pointermove', pointerMove, true);
    reader.removeEventListener('pointercancel', pointerCancel, true);
    reader.removeEventListener('click', click, true);
    toolbar?.removeEventListener('wheel', wheel);
  };
}
