export function initAnimations() {
  const sections = document.querySelectorAll('.section');
  let lastScrollY = window.scrollY;
  const bubbles = createBubbles();
  let bubblesActive = false;
  
  function createBubbles() {
    console.log('Creating bubbles...');
    const bubbleContainer = document.createElement('div');
    bubbleContainer.className = 'bubble-container';
    
    // Create 35 bubbles with highly randomized properties
    for (let i = 0; i < 35; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'bubble';
      
      // Randomize bubble properties for smooth variation
      const size = Math.random() * 18 + 8; // 8-26px
      const leftPos = Math.random() * 100; // 0-100%
      const animationDuration = Math.random() * 3 + 4; // 4-7 seconds (more consistent timing)
      const animationDelay = Math.random() * 3; // 0-3 seconds delay
      const horizontalDrift = (Math.random() - 0.5) * 120; // -60px to +60px drift (less dramatic for smoothness)
      
      // Add multiple animation variations
      const animationNames = ['floatUp', 'floatUpAlt1', 'floatUpAlt2'];
      const randomAnimation = animationNames[Math.floor(Math.random() * animationNames.length)];
      
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${leftPos}%`;
      // Use simple CSS animation instead of complex keyframes
      bubble.style.animation = `simpleFloat ${animationDuration}s linear infinite`;
      bubble.style.animationDelay = `${animationDelay}s`;
      bubble.style.setProperty('--drift', `${horizontalDrift}px`);
      
      // Make bubbles more visible with higher opacity
      const opacity = Math.random() * 0.4 + 0.6; // 0.6-1.0 (maximum visibility)
      bubble.style.setProperty('--bubble-opacity', opacity);
      
      // Force visibility for testing with bright colors
      bubble.style.opacity = opacity;
      bubble.style.backgroundColor = `rgba(0, 255, 255, ${opacity})`; // Bright cyan
      bubble.style.border = '3px solid rgba(255, 255, 255, 0.8)';
      bubble.style.zIndex = '9999';
      
      // Use ultra-smooth easing functions for natural bubble motion
      const timingFunctions = [
        'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // easeOutQuad
        'cubic-bezier(0.165, 0.84, 0.44, 1)',   // easeOutQuart  
        'cubic-bezier(0.19, 1, 0.22, 1)'        // easeOutExpo
      ];
      bubble.style.animationTimingFunction = timingFunctions[Math.floor(Math.random() * timingFunctions.length)];
      
      bubbleContainer.appendChild(bubble);
    }
    
    document.body.appendChild(bubbleContainer);
    console.log('Bubble container created with', bubbleContainer.children.length, 'bubbles');
    console.log('Container classes:', bubbleContainer.className);
    return bubbleContainer;
  }
  
  function handleScroll() {
    const viewportHeight = window.innerHeight;
    const currentScrollY = window.scrollY;
    
    // Check if we've scrolled past the hero section
    const heroSection = document.getElementById('hero');
    const heroPastThreshold = heroSection.getBoundingClientRect().bottom < viewportHeight * 0.3;
    
    // Toggle bubble effect based on hero section visibility
    if (heroPastThreshold && !bubblesActive) {
      bubblesActive = true;
      bubbles.classList.add('active');
    } else if (!heroPastThreshold && bubblesActive) {
      bubblesActive = false;
      bubbles.classList.remove('active');
    }    // Find which section should be active based on scroll position
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
  
  // Create oxygen tank element
  createOxygenTank();
}

function createOxygenTank() {
  const oxygenTank = document.createElement('div');
  oxygenTank.className = 'oxygen-tank';
  oxygenTank.innerHTML = `
    <div class="tank-body">
      <div class="tank-valve"></div>
      <div class="tank-gauge"></div>
      <div class="bubbles-trail">
        <div class="mini-bubble"></div>
        <div class="mini-bubble"></div>
        <div class="mini-bubble"></div>
      </div>
    </div>
  `;
  
  document.body.appendChild(oxygenTank);
  
  // Handle scroll to show/hide oxygen tank and update gauge
  function handleOxygenTankScroll() {
    const heroSection = document.getElementById('hero');
    const heroRect = heroSection.getBoundingClientRect();
    const heroPastThreshold = heroRect.bottom < window.innerHeight * 0.5;
    
    if (heroPastThreshold) {
      oxygenTank.classList.add('visible');
      
      // Calculate scroll progress after hero section
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const heroHeight = heroSection.offsetHeight;
      const scrolledPastHero = Math.max(0, window.scrollY - heroHeight);
      const remainingScrollDistance = documentHeight - heroHeight;
      
      // Calculate oxygen level (100% at start, decreasing as we scroll deeper)
      let oxygenLevel = 100;
      if (remainingScrollDistance > 0) {
        const scrollProgress = scrolledPastHero / remainingScrollDistance;
        oxygenLevel = Math.max(10, 100 - (scrollProgress * 90)); // Never goes below 10%
      }
      
      // Update CSS custom properties for the gauge height and color
      oxygenTank.style.setProperty('--oxygen-level', `${oxygenLevel}%`);
      
      // Change color based on oxygen level
      let gaugeColor = '#00FF88'; // Green (high oxygen)
      if (oxygenLevel < 30) {
        gaugeColor = '#FF4444'; // Red (low oxygen)
      } else if (oxygenLevel < 60) {
        gaugeColor = '#FFAA00'; // Orange (medium oxygen)
      }
      oxygenTank.style.setProperty('--gauge-color', gaugeColor);
    } else {
      oxygenTank.classList.remove('visible');
    }
  }
  
  window.addEventListener('scroll', handleOxygenTankScroll);
  handleOxygenTankScroll(); // Run once on page load
}