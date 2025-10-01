export function initAnimations() {
  const sections = document.querySelectorAll('.section');
  let lastScrollY = window.scrollY;
  const bubbles = createBubbles();
  let bubblesActive = false;
  
  function createBubbles() {
    const bubbleContainer = document.createElement('div');
    bubbleContainer.className = 'bubble-container';
    
    // Create 35 bubbles with highly randomized properties
    for (let i = 0; i < 35; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      
      // Randomize bubble properties with more variation
      const size = Math.random() * 25 + 6; // 6-31px (wider range)
      const leftPos = Math.random() * 110 - 5; // -5% to 105% (can start slightly off-screen)
      const animationDuration = Math.random() * 6 + 2.5; // 2.5-8.5 seconds (much more variation)
      const animationDelay = Math.random() * 4; // 0-4 seconds delay (longer stagger)
      const horizontalDrift = (Math.random() - 0.5) * 300; // -150px to +150px drift (more dramatic)
      
      // Add multiple animation variations
      const animationNames = ['floatUp', 'floatUpAlt1', 'floatUpAlt2'];
      const randomAnimation = animationNames[Math.floor(Math.random() * animationNames.length)];
      
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${leftPos}%`;
      bubble.style.animationName = randomAnimation;
      bubble.style.animationDuration = `${animationDuration}s`;
      bubble.style.animationDelay = `${animationDelay}s`;
      bubble.style.setProperty('--drift', `${horizontalDrift}px`);
      
      // More varied opacity and add wave offset for sine calculations
      const opacity = Math.random() * 0.35 + 0.08; // 0.08-0.43
      const waveOffset = Math.random() * 360; // Random wave phase
      bubble.style.setProperty('--bubble-opacity', opacity);
      bubble.style.setProperty('--wave-offset', `${waveOffset}deg`);
      
      // Random animation timing function for even more variety
      const timingFunctions = ['ease-out', 'ease-in-out', 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', 'cubic-bezier(0.55, 0.085, 0.68, 0.53)'];
      bubble.style.animationTimingFunction = timingFunctions[Math.floor(Math.random() * timingFunctions.length)];
      
      bubbleContainer.appendChild(bubble);
    }
    
    document.body.appendChild(bubbleContainer);
    return bubbleContainer;
  }
  
  function handleScroll() {
    const viewportHeight = window.innerHeight;
    const currentScrollY = window.scrollY;
    
    // Check if we've scrolled past the hero section
    const heroSection = document.getElementById('hero');
    const heroPastThreshold = heroSection.getBoundingClientRect().bottom < viewportHeight * 0.3;
    
    // Toggle bubble effect
    if (heroPastThreshold && !bubblesActive) {
      bubblesActive = true;
      bubbles.classList.add('active');
    } else if (!heroPastThreshold && bubblesActive) {
      bubblesActive = false;
      bubbles.classList.remove('active');
    }
    
    // Find which section should be active based on scroll position
    let activeSection = null;
    const triggerOffset = viewportHeight * 0.4; // Trigger point at 40% of viewport height
    
    sections.forEach(section => {
      if (section.id === 'hero') return; // Skip hero section from calculations
      
      const rect = section.getBoundingClientRect();
      // Section becomes active when its top enters the trigger zone
      if (rect.top <= triggerOffset) {
        activeSection = section;
      }
    });
    
    // Hide all sections except the active one and update navbar
    sections.forEach(section => {
      if (section.id === 'hero') return; // Let hero section behave normally
      
      if (section === activeSection) {
        section.classList.add('section-visible');
        section.classList.remove('section-hidden');
        // Update navbar active state
        const navLink = document.querySelector(`.nav-link[href="#${section.id}"]`);
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        if (navLink) navLink.classList.add('active');
      } else {
        section.classList.remove('section-visible');
        section.classList.add('section-hidden');
      }
    });
    
    lastScrollY = window.scrollY;
  }
  
  // Initialize sections as hidden except hero
  sections.forEach(section => {
    if (section.id !== 'hero') {
      section.classList.add('section-hidden');
    }
  });
  
  // Handle initial state
  handleScroll();
  
  // Add scroll listener
  window.addEventListener('scroll', handleScroll);

  // Original reveal elements functionality
  const revealElements = document.querySelectorAll('.reveal');
  
  function revealOnScroll() {
    for (let i = 0; i < revealElements.length; i++) {
      const windowHeight = window.innerHeight;
      const elementTop = revealElements[i].getBoundingClientRect().top;
      const elementVisible = 150;
      
      if (elementTop < windowHeight - elementVisible) {
        revealElements[i].classList.add('active');
      }
    }
  }
  
  // Run on load
  revealOnScroll();
  
  // Add scroll event listener
  window.addEventListener('scroll', revealOnScroll);
  
  // Initialize skill bars animation
  const skillBars = document.querySelectorAll('.skill-progress');
  
  function animateSkillBars() {
    if (skillBars.length === 0) return;
    
    const skillsSection = document.getElementById('skills');
    const skillsSectionTop = skillsSection.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    
    if (skillsSectionTop < windowHeight * 0.8) {
      skillBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        
        setTimeout(() => {
          bar.style.width = width;
        }, 100);
      });
      
      // Remove event listener after animation
      window.removeEventListener('scroll', animateSkillBars);
    }
  }
  
  window.addEventListener('scroll', animateSkillBars);
  
  // Run once on page load
  setTimeout(animateSkillBars, 500);
}