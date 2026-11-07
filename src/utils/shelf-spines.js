// A leaning cluster shares one wedge of space. Measure the actual silhouette,
// not the tallest book's angle on both ends of a flex container.
export function getSpinePlacement(height, degrees) {
  const angle = Math.max(-12, Math.min(12, Number(degrees) || 0));
  const clearance = Math.max(0, height) * Math.sin(Math.abs(angle) * Math.PI / 180);
  return { angle, left: angle < 0 ? clearance : 0, right: angle > 0 ? clearance : 0,
    origin: angle < 0 ? 'left bottom' : 'right bottom' };
}

export function getClusterPlacement(books, degrees, gap = 1) {
  const { angle, origin } = getSpinePlacement(0, degrees);
  const radians = angle * Math.PI / 180;
  const cosine = Math.cos(radians), sine = Math.sin(radians);
  let width = 0, minimum = 0, maximum = 0;
  books.forEach((book, index) => {
    if (index) width += gap;
    const pivot = angle < 0 ? 0 : book.width;
    for (const [x, y] of [[0, 0], [book.width, 0], [0, -book.height], [book.width, -book.height]]) {
      const projected = width + pivot + (x - pivot) * cosine - y * sine;
      minimum = Math.min(minimum, projected);
      maximum = Math.max(maximum, projected);
    }
    width += book.width;
  });
  return { angle, origin, width, left: Math.max(0, -minimum), right: Math.max(0, maximum - width) };
}

// Every decorative spine keeps its place at every breakpoint. Distribute the
// available width by book weight after accounting for real lean silhouettes.
// This pure calculation avoids measuring, changing flex widths, then measuring
// again, which used to reserve too much space and trigger extra layout work.
export function getShelfLayout(items, width, height, gap = 1) {
  function place(scale, lean = 1) {
    const placements = items.map(item => {
      if (item.books) {
        const books = item.books.map(book => ({ width: book.width * scale, height: book.height * height }));
        return { ...getClusterPlacement(books, item.angle * lean, gap), books };
      }
      return { width: item.fixed ?? item.width * scale, left: 0, right: 0 };
    });
    return { placements, width: placements.reduce((total, item) => total + item.width + item.left + item.right, Math.max(0, items.length - 1) * gap) };
  }
  // Extreme zoom can leave less space than a full lean needs. Ease the angle,
  // never remove a book or introduce horizontal overflow to make it fit.
  let lean = 1;
  if (place(0).width > width) {
    let low = 0, high = 1;
    for (let i = 0; i < 24; i++) {
      const middle = (low + high) / 2;
      if (place(0, middle).width <= width) low = middle; else high = middle;
    }
    lean = low;
  }
  let low = 0, high = Math.max(1, width);
  for (let i = 0; i < 24; i++) {
    const middle = (low + high) / 2;
    if (place(middle, lean).width <= width) low = middle; else high = middle;
  }
  return place(low, lean);
}

export function initShelfSpines(cabinet) {
  const describe = book => ({
    width: Number.parseFloat(book.style.getPropertyValue('--book-width')) || 12,
    height: (Number.parseFloat(book.style.getPropertyValue('--book-height')) || 80) / 100
  });
  const runs = [...cabinet.querySelectorAll('.library-spine-row')].map(element => ({
    element,
    children: [...element.children],
    size: ''
  }));
  let frame = 0;
  function layout() {
    frame = 0;
    // Finish all geometry reads before touching any layout styles.
    const measurements = runs.map(run => {
      const style = getComputedStyle(run.element);
      const width = run.element.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      const height = run.element.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
      const items = run.children.map(child => child.matches('.library-book-cluster')
        ? { books: [...child.children].map(describe), angle: Number(child.dataset.lean) }
        : child.matches('.library-volume') ? { fixed: child.offsetWidth } : describe(child));
      return { run, width, height, items, size: `${width}:${height}:${items.map(item => item.fixed || '').join(',')}` };
    });
    measurements.forEach(({ run, width, height, items, size }) => {
      if (size === run.size || width <= 0 || height <= 0) return;
      run.size = size;
      const { placements } = getShelfLayout(items, width, height);
      placements.forEach((pose, index) => {
        const child = run.children[index];
        // Navigation books retain their accessible CSS width and hit target.
        if (!child.matches('.library-volume')) child.style.flexBasis = `${pose.width}px`;
        if (!pose.books) return;
        child.style.marginLeft = `${pose.left}px`;
        child.style.marginRight = `${pose.right}px`;
        child.style.setProperty('--cluster-angle', `${pose.angle}deg`);
        child.style.setProperty('--cluster-origin', pose.origin);
        [...child.children].forEach((book, bookIndex) => { book.style.flexBasis = `${pose.books[bookIndex].width}px`; });
      });
    });
  }
  const observer = new ResizeObserver(() => {
    if (!frame) frame = requestAnimationFrame(layout);
  });
  runs.forEach(run => observer.observe(run.element));
  layout();
  return () => { observer.disconnect(); cancelAnimationFrame(frame); };
}
