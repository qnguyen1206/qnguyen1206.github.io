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
            <a href="#projects" class="btn btn-primary">View My Work</a>
            <a href="#contacts" class="btn btn-secondary">Contact Me</a>
          </div>
        </div>
      </div>
    </div>
    <div class="hero-copyright">
      <p>© ${new Date().getFullYear()} Quang Nguyen All rights reserved</p>
    </div>
    <div class="scroll-indicator">
      <img src="/images/Scroll down.gif" alt="Scroll Down" class="scroll-gif" />
    </div>
    <div class="stars-container"></div>
    <div class="bg-credit">
      Background image by 
      <a href="https://www.needpix.com/photo/1104067/full-moon-landscape-sea-lake-island-bank-trees-reflections-night">needpix.com</a>,
      <a href="https://www.pexels.com/photo/underwater-shot-of-the-sea-17598831/">Francesco Ungaro</a>
    </div>

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

      .hero-copyright {
        position: absolute;
        bottom: 20px;
        left: 20px;
        z-index: 10;
        color: rgba(255, 255, 255, 0.7);
        font-size: var(--font-size-xs);
        text-align: left;
      }

      .scroll-indicator {
        position: absolute;
        bottom: 60px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10;
        animation: fadeInUp 1s ease-out 2s both;
      }

      .scroll-gif {
        width: 50px;
        height: auto;
        opacity: 1;
        transition: opacity 0.3s ease;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
      }

      .bg-credit {
        position: absolute;
        bottom: 16px;
        right: 16px;
        font-size: var(--font-size-xs);
        color: rgba(255, 255, 255, 0.7);
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        z-index: 2;
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
        height: 120%; /* Extra 20% height for parallax movement */
        background-image: url('/images/background_img.jpg');
        background-size: cover;
        background-position: center;
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

        .hero-copyright {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          width: 90%;
        }

        .bg-credit {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          width: 90%;
          font-size: var(--font-size-2xs);
        }

        .scroll-indicator {
          bottom: 80px;
        }
      }

      @media (max-width: 480px) {
        .hero-copyright {
          bottom: 50px;
          font-size: var(--font-size-2xs);
        }

        .bg-credit {
          bottom: 25px;
          font-size: 10px;
          line-height: 1.3;
        }

        .scroll-indicator {
          bottom: 90px;
        }

        .scroll-gif {
          width: 40px;
        }
      }
    </style>
  `;

  // Role switching logic
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
    if (isTyping) return; // Prevent overlapping animations
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
    if (isTyping) return; // Prevent overlapping animations
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
        // After erasing, type the next role
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

  // Stars animation setup
  const starsContainer = document.querySelector('.stars-container');
  const numStars = 50; // Number of stars to create

  function createStars() {
    for (let i = 0; i < numStars; i++) {
      const star = document.createElement('div');
      star.classList.add('star');
      
      // Avoid placing stars in the middle section of the screen
      let top = Math.random() * 100;
      while (top > 30 && top < 60) { // Avoid middle section where moon is
        top = Math.random() * 100;
      }
      
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${top}%`;
      star.style.animationDelay = `${Math.random() * 1.5}s`;
      starsContainer.appendChild(star);
    }
  }

  createStars();


  // Start with first role
  setTimeout(() => {
    if (!isTyping) {
      typeWriter(roles[0], roleText);
    }
  }, 1000);
  
  // Rotate roles with proper timing
  let rotationInterval = setInterval(() => {
    if (!isTyping) {
      eraseText(roleText);
    }
  }, 5000); // Cycle every 5 seconds for better timing
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    clearInterval(rotationInterval);
    clearTypewriterTimeout();
    isTyping = false;
  });

  // Parallax scroll effect
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxBg = document.querySelector('.parallax-bg');
    parallaxBg.style.transform = `translateY(${scrolled * 0.3}px)`; // Reduced from 0.5 to 0.3 for smoother effect
  });

  // Reset transform on page load
  window.addEventListener('load', () => {
    const parallaxBg = document.querySelector('.parallax-bg');
    parallaxBg.style.transform = 'translateY(0)';  // Reset any transform
  });
}
