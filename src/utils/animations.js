export function initAnimations() {
  const sections = document.querySelectorAll('.section');
  let lastScrollY = window.scrollY;
  const bubbles = createBubbles();
  let bubblesActive = false;
  
  function createBubbles() {
    const bubbleContainer = document.createElement('div');
    bubbleContainer.className = 'bubble-container';

    for (let i = 0; i < 35; i++) {
      const bubble = document.createElement('div');
      bubble.className = 'bubble';

      const size = Math.random() * 18 + 8;
      const leftPos = Math.random() * 100;
      const animationDuration = Math.random() * 3 + 4;
      const animationDelay = Math.random() * 3;
      const horizontalDrift = (Math.random() - 0.5) * 120;

      const animationNames = ['floatUp', 'floatUpAlt1', 'floatUpAlt2'];
      const randomAnimation = animationNames[Math.floor(Math.random() * animationNames.length)];

      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${leftPos}%`;
      bubble.style.animation = `simpleFloat ${animationDuration}s linear infinite`;
      bubble.style.animationDelay = `${animationDelay}s`;
      bubble.style.setProperty('--drift', `${horizontalDrift}px`);

      const opacity = Math.random() * 0.4 + 0.6;
      bubble.style.setProperty('--bubble-opacity', opacity);

      bubble.style.opacity = opacity;
      bubble.style.backgroundColor = `rgba(0, 255, 255, ${opacity})`;
      bubble.style.border = '3px solid rgba(255, 255, 255, 0.8)';
      bubble.style.zIndex = '9999';

      const timingFunctions = [
        'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'cubic-bezier(0.165, 0.84, 0.44, 1)',
        'cubic-bezier(0.19, 1, 0.22, 1)'
      ];
      bubble.style.animationTimingFunction = timingFunctions[Math.floor(Math.random() * timingFunctions.length)];

      bubbleContainer.appendChild(bubble);
    }

    document.body.appendChild(bubbleContainer);
    return bubbleContainer;
  }
  
  function handleScroll() {
    const viewportHeight = window.innerHeight;
    const currentScrollY = window.scrollY;

    const heroSection = document.getElementById('hero');
    const heroPastThreshold = heroSection.getBoundingClientRect().bottom < viewportHeight * 0.3;

    if (heroPastThreshold && !bubblesActive) {
      bubblesActive = true;
      bubbles.classList.add('active');
    } else if (!heroPastThreshold && bubblesActive) {
      bubblesActive = false;
      bubbles.classList.remove('active');
    }

    let activeSection = null;
    const triggerOffset = viewportHeight * 0.4;

    sections.forEach(section => {
      if (section.id === 'hero') return;

      const rect = section.getBoundingClientRect();
      if (rect.top <= triggerOffset) {
        activeSection = section;
      }
    });

    sections.forEach(section => {
      if (section.id === 'hero') return;

      if (section === activeSection) {
        section.classList.add('section-visible');
        section.classList.remove('section-hidden');
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
  
  sections.forEach(section => {
    if (section.id !== 'hero') {
      section.classList.add('section-hidden');
    }
  });

  handleScroll();

  window.addEventListener('scroll', handleScroll);

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

  revealOnScroll();

  window.addEventListener('scroll', revealOnScroll);

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

      window.removeEventListener('scroll', animateSkillBars);
    }
  }

  window.addEventListener('scroll', animateSkillBars);

  setTimeout(animateSkillBars, 500);
}