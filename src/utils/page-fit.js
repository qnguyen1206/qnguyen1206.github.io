// Cache per-spread fitting; unseen sheets never need synchronous layout reads.
export function createPageFitter(spreads) {
  const fitted = new Set();
  return {
    clear() { fitted.clear(); },
    fit(index) {
      if (fitted.has(index) || !spreads[index]) return;
      let measurable = true;
      spreads[index].querySelectorAll('.publication-panel').forEach(panel => {
        const content = panel.querySelector('.publication-content');
        const width = panel.clientWidth;
        const height = panel.clientHeight - 26;
        if (!width || height <= 0) { measurable = false; return; }
        const fits = scale => { content.style.width = `${width / scale}px`; return content.scrollHeight * scale <= height; };
        let scale = 1;
        if (!fits(1)) {
          let low = .05, high = 1;
          for (let i = 0; i < 12; i++) {
            const mid = (low + high) / 2;
            if (fits(mid)) low = mid; else high = mid;
          }
          scale = low;
        }
        content.style.width = `${width / scale}px`;
        content.style.transform = `scale(${scale})`;
      });
      if (measurable) fitted.add(index);
    }
  };
}
