// Rotation needs real layout space: transforms alone don't move neighboring books.
export function getSpinePlacement(height, degrees) {
  const angle = Math.max(-12, Math.min(12, Number(degrees) || 0));
  const clearance = angle ? Math.ceil(Math.max(0, height) * Math.sin(Math.abs(angle) * Math.PI / 180)) + 1 : 0;
  return {
    angle,
    left: angle < 0 ? clearance : 0,
    right: angle > 0 ? clearance : 0,
    // Rest on the lower corner, rather than rotating through the shelf surface.
    origin: angle < 0 ? 'left bottom' : 'right bottom'
  };
}

export function initShelfSpines(cabinet) {
  const groups = [...cabinet.querySelectorAll('.library-book-cluster[data-lean]')];
  let frame = 0;
  function layout() {
    frame = 0;
    const placements = groups.map(group => getSpinePlacement(
      Math.max(0, ...[...group.children].map(book => book.offsetHeight)), group.dataset.lean
    ));
    groups.forEach((group, index) => {
      const pose = placements[index];
      group.style.marginLeft = pose.left + 'px';
      group.style.marginRight = pose.right + 'px';
      group.style.setProperty('--cluster-angle', pose.angle + 'deg');
      group.style.setProperty('--cluster-origin', pose.origin);
    });
  }
  const observer = new ResizeObserver(() => {
    if (!frame) frame = requestAnimationFrame(layout);
  });
  cabinet.querySelectorAll('.library-shelf-bay').forEach(bay => observer.observe(bay));
  layout();
  return () => { observer.disconnect(); cancelAnimationFrame(frame); };
}
