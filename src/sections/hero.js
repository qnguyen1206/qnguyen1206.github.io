export function initHero() {
  const hero = document.getElementById('hero');
  
  hero.innerHTML = `
    <div class="container">
      <div class="hero-content">
        <div class="hero-text">
          <p class="hero-subtitle animate-fadeInUp">Hello, I'm</p>
          <h1 class="hero-title animate-fadeInUp delay-200">John Doe</h1>
          <div class="hero-description animate-fadeInUp delay-300">
            <div class="typewriter">
              <span id="typewriter-text"></span>
            </div>
          </div>
          <div class="hero-cta animate-fadeInUp delay-500">
            <a href="#projects" class="btn btn-primary">View My Work</a>
            <a href="#" class="btn btn-secondary">Download CV</a>
          </div>
        </div>
      </div>
    </div>
    
    <style>
      #hero {
        min-height: 100vh;
        display: flex;
        align-items: center;
        position: relative;
        padding-top: 100px;
        background: linear-gradient(135deg, var(--color-primary-900), var(--color-neutral-900));
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
      
      .hero-subtitle {
        font-size: var(--font-size-xl);
        color: var(--color-primary-400);
        margin-bottom: var(--space-2);
      }
      
      .hero-title {
        font-size: var(--font-size-6xl);
        background: linear-gradient(to right, var(--color-primary-300), var(--color-accent-300));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: var(--space-4);
      }
      
      .hero-description {
        font-size: var(--font-size-xl);
        margin-bottom: var(--space-8);
        color: var(--color-neutral-100);
      }
      
      .typewriter {
        position: relative;
        height: 30px;
      }
      
      #typewriter-text {
        display: inline-block;
        overflow: hidden;
        border-right: 3px solid var(--color-primary-500);
        white-space: nowrap;
        animation: blinkCursor 0.8s step-end infinite;
      }
      
      .hero-cta {
        display: flex;
        gap: var(--space-4);
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
      }
    </style>
  `;
  
  // Typewriter effect
  const texts = ["Frontend Developer", "UI/UX Designer", "Creative Thinker"];
  let count = 0;
  let index = 0;
  let currentText = "";
  let letter = "";
  
  function type() {
    if (count === texts.length) {
      count = 0;
    }
    currentText = texts[count];
    letter = currentText.slice(0, ++index);
    
    document.getElementById("typewriter-text").textContent = letter;
    
    if (letter.length === currentText.length) {
      setTimeout(() => {
        index = 0;
        count++;
      }, 2000);
    }
    
    setTimeout(type, 100);
  }
  
  setTimeout(type, 1000);
}