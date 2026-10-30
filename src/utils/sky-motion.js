const clamp = value => Math.max(0, Math.min(1, value));
export const skyEase = value => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

export function getDescentFrame(progress) {
  const p = clamp(progress);
  return {
    progress: p,
    departure: skyEase(p / 0.7),
    arrival: skyEase((p - 0.3) / 0.7),
    mist: (0.3 + 0.7 * skyEase(p / 0.25)) * (1 - skyEase((p - 0.7) / 0.3)),
    rush: skyEase((p - 0.12) / 0.25) * (1 - skyEase((p - 0.65) / 0.3))
  };
}

// Fixed-size textures translate through the viewport; they never scale/reraster.
export function getCloudOffsets(progress, height) {
  const p = clamp(progress);
  return [(72 - p * 160) * height / 100, (110 - p * 255) * height / 100];
}
