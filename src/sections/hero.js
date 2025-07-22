export function initHero() {
  const hero = document.getElementById('hero');

  hero.innerHTML = `
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
            <a href="#resume" class="btn btn-secondary">View Resume</a>
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
            <b>Products Released</b>
          </div>
        </div>
      </div>
    </div>
    <div class="ripple-container"></div>

    <style>
      #hero {
        min-height: 100vh;
        display: flex;
        align-items: center;
        position: relative;
        padding-top: 100px;
        background: linear-gradient(90deg, #9D00FF, var(--color-neutral-950));
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
        transition: opacity 0.5s ease, transform 0.5s ease;
      }

      @keyframes fadeInOut {
        0% { opacity: 0; transform: translateY(10px); }
        10% { opacity: 1; transform: translateY(0); }
        40% { opacity: 1; }
        50% { opacity: 0; transform: translateY(-10px); }
        100% { opacity: 0; }
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
        background: linear-gradient(to right, #30D158, #FFFFFF);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .ripple-container {
        position: absolute;
        inset: 0;
        overflow: hidden;
        pointer-events: none;
        z-index: 0;
      }

      .ripple {
        position: absolute;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        transform: scale(0);
        animation: rippleEffect 2s ease-out forwards;
      }

      @keyframes rippleEffect {
        to {
          transform: scale(12);
          opacity: 0;
        }
      }

      @keyframes gradientMove {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
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
    "Software Developer",
    "Software Designer",
    "Game Developer",
    "Game Designer",
    "Web Developer",
    "Web Designer"
  ];

  let roleIndex = 0;
  const roleText = document.getElementById("role-text");

  function rotateRole() {
    roleText.style.opacity = 0;
    roleText.style.transform = "translateY(10px)";

    setTimeout(() => {
      roleText.textContent = roles[roleIndex];
      roleText.style.transform = "translateY(0)";
      roleText.style.opacity = 1;
      roleIndex = (roleIndex + 1) % roles.length;
    }, 300);
  }

  const rippleContainer = document.querySelector(".ripple-container");

  function createRipple() {
    const ripple = document.createElement("div");
    ripple.classList.add("ripple");

    const size = 10;
    const x = Math.random() * hero.clientWidth;
    const y = Math.random() * hero.clientHeight;

    ripple.style.left = `${x - size / 2}px`;
    ripple.style.top = `${y - size / 2}px`;

    rippleContainer.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 2000);
  }

  // Create a ripple every 500-1000ms randomly
  setInterval(() => {
    if (Math.random() < 0.7) createRipple();
  }, 600);


  setInterval(rotateRole, 3000);
}
