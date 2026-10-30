// Connected strips approximate paper, with perfectly flat endpoints.
export function getPageBend(turn, width, count) {
  const eased = turn * turn * (3 - 2 * turn);
  const curl = Math.sin(Math.PI * eased) * 58;
  const stripWidth = width / count;
  let x = 0;
  let z = 0;
  const strips = Array.from({ length: count }, (_, index) => {
    const angle = curl * ((index + 0.5) / count - 0.5);
    const strip = { x, z, angle };
    const radians = angle * Math.PI / 180;
    x += stripWidth * Math.cos(radians);
    z -= stripWidth * Math.sin(radians);
    return strip;
  });
  return { rotation: -180 * eased, strips };
}
