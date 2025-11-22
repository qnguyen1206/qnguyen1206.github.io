/**
 * Initialize parallax background effect
 */
export function initParallax() {
  // Create parallax container
  const parallaxContainer = document.createElement('div');
  parallaxContainer.className = 'parallax-container';
  
  // Create layers
  const layers = [
    { class: 'parallax-layer parallax-layer-base', speed: 0.5 },
    { class: 'parallax-layer parallax-layer-overlay', speed: 0 },
    { class: 'parallax-layer parallax-layer-particles', speed: 1.2 }
  ];
  
  const layerElements = layers.map(layer => {
    const div = document.createElement('div');
    div.className = layer.class;
    div.dataset.speed = layer.speed;
    return div;
  });
  
  layerElements.forEach(layer => parallaxContainer.appendChild(layer));
  
  // Add particles to particles layer
  const particlesLayer = layerElements[layerElements.length - 1];
  createParticles(particlesLayer, 10);
  
  // Insert parallax container at the beginning of body
  document.body.insertBefore(parallaxContainer, document.body.firstChild);
  
  // Parallax scroll effect
  let ticking = false;
  
  function updateParallax() {
    const scrolled = window.pageYOffset;
    
    layerElements.forEach(layer => {
      const speed = parseFloat(layer.dataset.speed);
      const yPos = -(scrolled * speed);
      layer.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });
    
    ticking = false;
  }
  
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }
  
  // Listen to scroll events
  window.addEventListener('scroll', requestTick, { passive: true });
  
  // Initial update
  updateParallax();
}

/**
 * Create floating particles
 */
function createParticles(container, count) {
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'parallax-particle';
    
    // Random size between 10px and 40px
    const size = Math.random() * 30 + 10;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Random horizontal position
    particle.style.left = `${Math.random() * 100}%`;
    
    // Random animation duration between 10s and 25s
    const duration = Math.random() * 15 + 10;
    particle.style.animationDuration = `${duration}s`;
    
    // Random delay to stagger animations
    const delay = Math.random() * 10;
    particle.style.animationDelay = `${delay}s`;
    
    container.appendChild(particle);
  }
}

/**
 * Cleanup parallax effect
 */
export function cleanupParallax() {
  const container = document.querySelector('.parallax-container');
  if (container) {
    container.remove();
  }
}

