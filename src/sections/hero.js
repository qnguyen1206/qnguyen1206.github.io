export function initHero() {
  const hero = document.getElementById('hero');

  hero.innerHTML = `
    <div class="parallax-bg"></div>
    <div class="container">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title animate-fadeInUp delay-200" style="padding-bottom: 0.2rem;">Quang Nguyen</h1>
          <div class="hero-description">
            <div class="role-carousel">
              <span id="role-text"></span>
              <span class="typing-cursor">|</span>
            </div>
          </div>
          <div class="hero-cta" style="margin-top: 1.5rem;">
            <button class="btn btn-primary" data-scroll-to="projects">View My Works</button>
            <button class="btn btn-secondary" data-scroll-to="contacts">Contact Me</button>
          </div>
        </div>
        <nav class="hero-nav">
          <div class="mobile-menu-toggle">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <ul class="hero-nav-links">
            <li><a href="#hero" class="hero-nav-link active">Home</a></li>
            <li><a href="#about" class="hero-nav-link">About</a></li>
            <li><a href="#projects" class="hero-nav-link">Projects</a></li>
            <li><a href="#blog" class="hero-nav-link">Writeups</a></li>
            <li><a href="#certificates" class="hero-nav-link">Certificates</a></li>
            <li><a href="#resume" class="hero-nav-link">Resume</a></li>
            <li><a href="#contacts" class="hero-nav-link">Contact</a></li>
          </ul>
        </nav>
      </div>
    </div>
    <div class="hero-footer">
      <div class="hero-copyright">
        <p>© ${new Date().getFullYear()} Quang Nguyen All rights reserved</p>
      </div>
      <div class="scroll-indicator">
        <img src="/images/Scroll down.gif" alt="Scroll Down" class="scroll-gif" />
      </div>
      <div class="bg-credit">
        Background image by 
        <a href="https://www.needpix.com/photo/1104067/full-moon-landscape-sea-lake-island-bank-trees-reflections-night">needpix.com</a>
      </div>
    </div>
    <div class="stars-container"></div>

    <style>
      #hero {
        min-height: 100vh;
        height: 100vh;
        display: flex;
        align-items: center;
        position: relative;
        padding-top: 100px;
        overflow: hidden;
        scroll-snap-align: start;
      }

      .hero-footer {
        position: absolute;
        bottom: 20px;
        left: 20px;
        right: 20px;
        z-index: 10;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--space-4);
      }

      .hero-copyright {
        color: rgba(255, 255, 255, 0.7);
        font-size: var(--font-size-xs);
        text-align: left;
      }

      .hero-copyright p {
        margin: 0;
      }

      .bg-credit {
        font-size: var(--font-size-xs);
        color: rgba(255, 255, 255, 0.7);
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        text-align: right;
      }

      .scroll-indicator {
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeInUp 1s ease-out 2s both;
      }

      .scroll-gif {
        width: 50px;
        height: auto;
        opacity: 1;
        transition: opacity 0.3s ease;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
      }

      .bg-credit a {
        color: rgba(255, 255, 255, 0.7);
        text-decoration: underline;
        transition: color var(--transition-normal) var(--easing-out);
      }

      .bg-credit a:hover {
        color: var(--color-primary-500);
      }

      .parallax-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url('/images/background_img.jpg');
        background-size: cover;
        background-position: center top;
        background-repeat: no-repeat;
        animation: fadeInBackground 1s ease-out;
        transform: translateY(0);
        z-index: -1;
        background-color: rgba(0, 0, 0, 0.7);
      }

      .hero-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--space-12);
      }

      .hero-text {
        max-width: 600px;
      }

      .hero-nav {
        display: flex;
        align-items: center;
        z-index: 10;
        position: fixed;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
      }

      .hero-nav-links {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
        text-align: right;
      }

      .hero-nav-link {
        font-family: 'Celestial Silence', sans-serif;
        color: rgba(255, 255, 255, 0.7);
        text-decoration: none;
        font-size: var(--font-size-lg);
        font-weight: 500;
        transition: all 0.3s ease;
        position: relative;
        padding: var(--space-2) var(--space-3);
        border-radius: var(--border-radius-md);
      }

      .hero-nav-link:hover {
        color: var(--color-primary-400);
        transform: translateX(-5px);
      }

      .hero-nav-link.active {
        color: var(--color-primary-400);
        font-weight: 600;
      }

      .hero-nav-link.active::before {
        content: '';
        position: absolute;
        left: -10px;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        height: 20px;
        background: linear-gradient(45deg, var(--color-primary-400), var(--color-primary-300));
        border-radius: 2px;
      }

      .mobile-menu-toggle {
        display: none;
        flex-direction: column;
        cursor: pointer;
        padding: var(--space-2);
        z-index: 1001;
      }

      .mobile-menu-toggle span {
        width: 25px;
        height: 3px;
        background-color: rgba(255, 255, 255, 0.8);
        margin: 3px 0;
        transition: 0.3s;
        border-radius: 2px;
      }

      .mobile-menu-toggle.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
      }

      .mobile-menu-toggle.active span:nth-child(2) {
        opacity: 0;
      }

      .mobile-menu-toggle.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
      }

      @media (max-width: 768px) {
        .hero-nav {
          position: fixed;
          top: 20px;
          right: 20px;
          transform: none;
        }

        .mobile-menu-toggle {
          display: flex;
        }
        
        .hero-nav-links {
          position: absolute;
          top: 100%;
          right: 0;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(10px);
          border-radius: var(--border-radius-lg);
          padding: var(--space-4);
          margin-top: var(--space-2);
          min-width: 150px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: all 0.3s ease;
          text-align: right;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .hero-nav-links.active {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        
        .hero-nav-link {
          font-size: var(--font-size-base);
          padding: var(--space-2) var(--space-3);
          display: block;
          width: 100%;
        }
        
        .hero-nav-link:hover {
          transform: translateX(-5px);
          background: rgba(255, 255, 255, 0.1);
        }
        
        .hero-nav-link.active::before {
          display: none;
        }
        
        .hero-nav-link.active {
          background: rgba(255, 255, 255, 0.15);
          border-radius: var(--border-radius-md);
        }
      }

      .hero-title {
        font-size: var(--font-size-6xl);
        background: linear-gradient(270deg, #0A84FF, #00FFFF, #0A84FF);
        background-size: 600% 600%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: gradientMove 5s ease infinite;
        margin-bottom: var(--space-4);
      }

      .role-carousel {
        font-size: var(--font-size-xl);
        font-weight: 600;
        color: var(--color-neutral-100);
        height: 32px;
        display: flex;
        align-items: center;
        font-family: 'Courier New', monospace;
      }

      #role-text {
        color: white;
        display: inline;
      }

      .typing-cursor {
        color: white;
        animation: blink 1s infinite;
        display: inline;
      }

      @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
      }

      @keyframes typewriter {
        from { width: 0; }
        to { width: 100%; }
      }

      .hero-cta {
        display: flex;
        gap: var(--space-4);
      }

      .btn-secondary {
        background-color: transparent;
        color: white;
        border: 2px solid white;
      }

      .btn-secondary:hover {
        background-color: rgba(255, 255, 255, 0.1);
        transform: translateY(-2px);
      }

      .stars-container {
        position: absolute;
        inset: 0;
        overflow: hidden;
        pointer-events: none;
        z-index: 1;
        mask-image: linear-gradient(to bottom,
          rgba(0, 0, 0, 1) 0%,
          rgba(0, 0, 0, 0) 30%,
          rgba(0, 0, 0, 1) 60%
        );
      }

      .star {
        position: absolute;
        width: 3px;
        height: 3px;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 50%;
        opacity: 0;
        animation: twinkle 3s infinite;
        box-shadow: 0 0 4px rgba(255, 255, 255, 0.9);
      }

      @keyframes twinkle {
        0% {
          opacity: 0;
          transform: scale(1);
        }
        50% {
          opacity: 1;
          transform: scale(1.5);
        }
        100% {
          opacity: 0;
          transform: scale(1);
        }
      }

      @keyframes gradientMove {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }

      @keyframes fadeInBackground {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateX(-50%) translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      }

      @media (max-width: 768px) {
        .hero-content {
          flex-direction: column;
          text-align: center;
          gap: var(--space-8);
        }

        .hero-title {
          font-size: var(--font-size-4xl);
        }

        .hero-cta {
          justify-content: center;
        }

        .hero-footer {
          flex-direction: column;
          align-items: center;
          gap: var(--space-2);
          bottom: 40px;
          left: 50%;
          right: auto;
          transform: translateX(-50%);
          width: 90%;
        }

        .hero-copyright {
          text-align: center;
        }

        .bg-credit {
          text-align: center;
          font-size: var(--font-size-2xs);
        }
      }

      @media (max-width: 480px) {
        .hero-footer {
          bottom: 50px;
          gap: var(--space-1);
        }

        .hero-copyright {
          font-size: var(--font-size-2xs);
        }

        .bg-credit {
          font-size: 10px;
          line-height: 1.3;
        }

        .scroll-gif {
          width: 40px;
        }
      }
    </style>
  `;

  const roles = [
    "Full Stack Developer",
    "Web Developer",
    "Game Developer",
    "App Developer",
    "UI/UX Designer",
  ];

  let roleIndex = 0;
  let isTyping = false;
  let typewriterTimeout = null;
  const roleText = document.getElementById("role-text");

  function clearTypewriterTimeout() {
    if (typewriterTimeout) {
      clearTimeout(typewriterTimeout);
      typewriterTimeout = null;
    }
  }

  function typeWriter(text, element, speed = 100) {
    if (isTyping) return;
    isTyping = true;
    element.textContent = '';
    let i = 0;

    function type() {
      if (i < text.length && isTyping) {
        element.textContent += text.charAt(i);
        i++;
        typewriterTimeout = setTimeout(type, speed + Math.random() * 30);
      } else {
        isTyping = false;
      }
    }

    type();
  }

  function eraseText(element, speed = 50) {
    if (isTyping) return;
    isTyping = true;
    const text = element.textContent;
    let i = text.length;

    function erase() {
      if (i > 0 && isTyping) {
        element.textContent = text.substring(0, i - 1);
        i--;
        typewriterTimeout = setTimeout(erase, speed);
      } else {
        isTyping = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typewriterTimeout = setTimeout(() => {
          if (!isTyping) {
            typeWriter(roles[roleIndex], roleText);
          }
        }, 200);
      }
    }

    erase();
  }

  const starsContainer = document.querySelector('.stars-container');
  const numStars = 50;

  function createStars() {
    for (let i = 0; i < numStars; i++) {
      const star = document.createElement('div');
      star.classList.add('star');

      let top = Math.random() * 100;
      while (top > 30 && top < 60) {
        top = Math.random() * 100;
      }

      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${top}%`;
      star.style.animationDelay = `${Math.random() * 1.5}s`;
      starsContainer.appendChild(star);
    }
  }

  createStars();


  setTimeout(() => {
    if (!isTyping) {
      typeWriter(roles[0], roleText);
    }
  }, 1000);

  let rotationInterval = setInterval(() => {
    if (!isTyping) {
      eraseText(roleText);
    }
  }, 5000);

  window.addEventListener('beforeunload', () => {
    clearInterval(rotationInterval);
    clearTypewriterTimeout();
    isTyping = false;
  });

  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxBg = document.querySelector('.parallax-bg');
    parallaxBg.style.transform = `translateY(${scrolled * 0.3}px)`;
  });

  window.addEventListener('load', () => {
    const parallaxBg = document.querySelector('.parallax-bg');
    parallaxBg.style.transform = 'translateY(0)';
  });

  initHeroNavigation();
}

function initHeroNavigation() {
  let isManualClick = false;
  let clickTimeout;

  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const heroNavLinks = document.querySelector('.hero-nav-links');

  if (mobileMenuToggle && heroNavLinks) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileMenuToggle.classList.toggle('active');
      heroNavLinks.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!mobileMenuToggle.contains(e.target) && !heroNavLinks.contains(e.target)) {
        mobileMenuToggle.classList.remove('active');
        heroNavLinks.classList.remove('active');
      }
    });
  }

  function updateActiveNavOnScroll() {
    if (isManualClick) return;

    const heroSection = document.getElementById('hero');
    const otherSections = document.querySelectorAll('.section');
    const allSections = heroSection ? [heroSection, ...otherSections] : [...otherSections];
    const navLinks = document.querySelectorAll('.hero-nav-link');

    let current = '';
    const scrollPosition = window.scrollY + 100;

    allSections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.clientHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        current = section.getAttribute('id');
      }
    });

    if (!current) {
      current = 'hero';
    }

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavOnScroll);

  // CTA buttons smooth scroll without URL change
  const ctaButtons = document.querySelectorAll('.hero-cta button[data-scroll-to]');
  ctaButtons.forEach(button => {
    button.addEventListener('click', function() {
      const targetId = this.getAttribute('data-scroll-to');
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  const navLinks = document.querySelectorAll('.hero-nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();

      isManualClick = true;

      if (clickTimeout) clearTimeout(clickTimeout);

      navLinks.forEach(l => l.classList.remove('active'));

      this.classList.add('active');

      if (mobileMenuToggle && heroNavLinks) {
        mobileMenuToggle.classList.remove('active');
        heroNavLinks.classList.remove('active');
      }

      const targetId = this.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }

      clickTimeout = setTimeout(() => {
        isManualClick = false;
      }, 1000);
    });
  });

  updateActiveNavOnScroll();
}