export function initHero() {
  const hero = document.getElementById('hero');

  hero.innerHTML = `
    <div class="parallax-bg"></div>
    <div class="container">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title animate-fadeInUp delay-200" style="padding-bottom: 0.2rem;">Quang Nguyen</h1>
          <div class="hero-description animate-fadeInUp delay-300">
            <div class="role-carousel">
              <span id="role-text">Software Developer</span>
            </div>
          </div>
          <div class="hero-cta animate-fadeInUp delay-500" style="margin-top: 1.5rem;">
            <a href="#projects" class="btn btn-primary">View My Work</a>
            <a href="#contacts" class="btn btn-secondary">Contact Me</a>
          </div>
        </div>
        <div class="hero-stats animate-fadeInUp delay-400">
          <div class="stat">
            <h2>3</h2>
            <b>Years Experience</b>
          </div>
          <div class="stat">
            <h2>10</h2>
            <b>Projects Completed</b>
          </div>
          <div class="stat">
            <h2>2</h2>
            <b>Projects Released</b>
          </div>
        </div>
      </div>
    </div>
    <div class="hero-copyright">
      <p>© ${new Date().getFullYear()} Quang Nguyen All rights reserved</p>
    </div>
    <div class="stars-container"></div>
    <div class="bg-credit">Background image by <a href="https://www.needpix.com/photo/1104067/full-moon-landscape-sea-lake-island-bank-trees-reflections-night">needpix.com</a></div>

    <style>
      #hero {
        min-height: 100vh;
        display: flex;
        align-items: center;
        position: relative;
        padding-top: 100px;
        overflow: hidden;
      }

      .hero-copyright {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10;
        color: rgba(255, 255, 255, 0.7);
        font-size: var(--font-size-sm);
        text-align: center;
      }

      .hero-copyright p {
        margin: 0;
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
        height: 32px; /* or adjust as needed */
        position: relative;
        overflow: hidden;
      }

      #role-text {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        text-align: left;
        opacity: 0;
        transition: opacity 0.8s ease, transform 0.8s ease;
      }

      @keyframes fadeInOut {
        0% { opacity: 0; transform: translateX(-20px); }
        15% { opacity: 1; transform: translateX(0); }
        85% { opacity: 1; }
        100% { opacity: 0; transform: translateX(20px); }
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

      .hero-stats {
        display: flex;
        flex-direction: column;
        gap: var(--space-6);
        color: white;
        min-width: 200px;
      }

      .hero-stats .stat h2 {
        font-size: var(--font-size-4xl);
        margin: 0;
        background: linear-gradient(to right, #00ff40ff, #FFFFFF);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
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
        width: 2px;
        height: 2px;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 50%;
        opacity: 0;
        animation: twinkle 3s infinite;
        box-shadow: 0 0 2px rgba(255, 255, 255, 0.8);
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

        .hero-stats {
          flex-direction: row;
          justify-content: center;
          gap: var(--space-8);
        }

        .hero-stats .stat {
          text-align: center;
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
  const roleText = document.getElementById("role-text");

  function rotateRole() {
    roleText.style.opacity = 0;
    roleText.style.transform = "translateX(-20px)";

    setTimeout(() => {
      roleText.textContent = roles[roleIndex];
      roleText.style.transform = "translateX(0)";
      roleText.style.opacity = 1;
      roleIndex = (roleIndex + 1) % roles.length;
    }, 300);
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
      star.style.animationDelay = `${Math.random() * 3}s`;
      starsContainer.appendChild(star);
    }
  }

  createStars();


  setInterval(rotateRole, 4000);

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
