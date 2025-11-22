export function initLazyLoading() {
  if (!('IntersectionObserver' in window)) {
    loadAllImages();
    return;
  }

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        loadImage(img);
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '100px 0px',
    threshold: 0.01
  });

  const lazyImages = document.querySelectorAll('img[data-src]');
  lazyImages.forEach(img => {
    imageObserver.observe(img);
  });
}

function loadImage(img) {
  img.classList.add('loading');

  const actualImg = new Image();
  actualImg.onload = () => {
    img.src = img.dataset.src;
    img.classList.remove('loading');
    img.classList.add('loaded');
    img.removeAttribute('data-src');
  };

  actualImg.onerror = () => {
    img.classList.add('error');
    console.warn('Failed to load image:', img.dataset.src);
  };

  actualImg.src = img.dataset.src;
}

function loadAllImages() {
  const lazyImages = document.querySelectorAll('img[data-src]');
  lazyImages.forEach(img => {
    img.src = img.dataset.src;
    img.removeAttribute('data-src');
  });
}