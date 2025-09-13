/**
 * Lazy loading utility for images
 * Only loads images when they're about to enter the viewport
 */

export function initLazyLoading() {
  // Check if Intersection Observer is supported
  if (!('IntersectionObserver' in window)) {
    // Fallback for older browsers - load all images immediately
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
    // Load image when it's 100px away from viewport
    rootMargin: '100px 0px',
    threshold: 0.01
  });

  // Observe all images with data-src attribute
  const lazyImages = document.querySelectorAll('img[data-src]');
  lazyImages.forEach(img => {
    imageObserver.observe(img);
  });
}

function loadImage(img) {
  // Add loading class for fade-in effect
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