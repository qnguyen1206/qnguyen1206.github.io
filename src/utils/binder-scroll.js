const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

// Each complete sheet rests, then pulls free. There is no internal reading scroll.
export function createBinderTimeline(count, viewportHeight) {
  const pause = Math.max(120, viewportHeight * 0.4);
  const turnDistance = Math.max(240, viewportHeight * 0.85);
  let cursor = 0;
  return Array.from({ length: count }, (_, index) => {
    const entry = {
      start: cursor,
      turnStart: cursor + pause
    };
    entry.end = entry.turnStart + (index < count - 1 ? turnDistance : 0);
    cursor = entry.end;
    return entry;
  });
}

export function getBinderFrame(distance, timeline) {
  if (!timeline.length) return { index: 0, selected: 0, turn: 0 };
  const last = timeline.length - 1;
  const position = clamp(distance, 0, timeline[last].end);
  let index = timeline.findIndex(entry => position < entry.end);
  if (index === -1) index = last;
  const entry = timeline[index];
  const turn = index < last
    ? clamp((position - entry.turnStart) / (entry.end - entry.turnStart), 0, 1)
    : 0;
  return {
    index,
    selected: index + (turn >= 0.5 ? 1 : 0),
    turn
  };
}

export function getBinderTear(progress) {
  const t = clamp(progress, 0, 1);
  const pull = t * t * (3 - 2 * t);
  return {
    pull,
    lift: -6 * Math.sin(Math.PI * t),
    rotation: -1.5 * Math.sin(Math.PI * t),
    cut: 10 * clamp(t / 0.12, 0, 1)
  };
}
