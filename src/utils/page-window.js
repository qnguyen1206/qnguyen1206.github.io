// Touch only pages entering, leaving, or remaining in the visible window.
// This also handles jumping several chapters or reversing direction immediately.
export function createPageWindow() {
  let previous = new Set();
  return {
    update(indices) {
      const current = new Set(indices);
      const dirty = new Set([...previous, ...current]);
      previous = current;
      return dirty;
    },
    reset() { previous.clear(); }
  };
}
