export function initAbout() {
  const about = document.getElementById('about');
  
  about.innerHTML = `
    <div class="container">
      <h2 class="section-title reveal">About Me</h2>
      
      <div class="about-content">
        <!-- Section 1: Text Left, Image Right -->
        <div class="about-section reveal">
          <div class="about-text-left">
            <p>Hello! I'm <span class="highlight">Quang Nguyen</span>. I'm currently a senior student at <span class="highlight">Georgia Institute of Technology</span>, where I'm pursuing a degree <span class="highlight">Bachelor of Science in Computational Media</span> concentrated in <span class="highlight">Artificial Intelligence</span> and <span class="highlight">Game Design</span>.</p>
            <br>
            <p>I have worked on many teams and personal projects during my time at Georgia Tech ranging from <span class="highlight">game development</span> to <span class="highlight">app development</span>.</p>
          </div>
          <div class="about-image-right">
            <img src="images/GT.png" alt="Georgia Tech" loading="lazy">
          </div>
        </div>

        <!-- Section 2: Image Left, Text Right -->
        <div class="about-section reveal">
          <div class="about-image-left">
            <img src="images/kart-tech-racing/kart_screenshot1.png" alt="Projects" loading="lazy">
            <img src="images/kart-tech-racing/kart_screenshot2.png" alt="Projects" loading="lazy">
            <img src="images/kart-tech-racing/kart_screenshot3.png" alt="Projects" loading="lazy">
          </div>
          <div class="about-text-right">
            <p>One of the most notable projects I have worked on is <span class="highlight">Kart: The Tech Filled Racing Game</span>, a game where cars and technology meet with each car having their own unique abilities. We have released the game on <span class="highlight"><a href="https://store.steampowered.com/app/2165230/Kart_The_Tech_Filled_Racing_Game/" target="_blank" rel="noopener noreferrer">Steam</a></span> so check it out if you are interested. 👍</p>
          </div>
        </div>

        <!-- Section 3: Text Left, Image Right -->
        <div class="about-section reveal">
          <div class="about-text-left">
            <p>Besides developing games and apps, I am also learning about <span class="highlight">graphic design</span>, <span class="highlight">UI/UX</span> and <span class="highlight">cybersecurity</span> to expand my knowledge and skillset.</p>
            <br>
            <p>I like to explore new places and enjoy world building during my free time. I also like to learn new skills and discover new hobbies.</p>
          </div>
          <div class="about-image-right">
            <img src="images/UI_1.png" alt="Learning" loading="lazy">
            <img src="images/UI_2.png" alt="Learning" loading="lazy">
          </div>
        </div>
      </div>
    </div>
    
    <style>
      .about-content {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: var(--space-8, 4rem);
        padding-bottom: var(--space-8, 4rem);
      }
      
      .about-section {
        display: flex;
        align-items: center;
        gap: var(--space-6, 3rem);
        min-height: 300px;
      }
      
      /* Text Left (2/3), Image Right (1/3) */
      .about-text-left {
        flex: 1.5;
        padding-right: var(--space-4, 2rem);
        word-wrap: break-word;
        overflow-wrap: break-word;
      }
      
      .about-image-right {
        flex: 1.5;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
        min-width: 500px;
      }
      
      /* Image Left (1/3), Text Right (2/3) */
      .about-image-left {
        flex: 1.5;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
        min-width: 500px;
      }
      
      .about-text-right {
        flex: 1.5;
        padding-left: var(--space-4, 2rem);
        word-wrap: break-word;
        overflow-wrap: break-word;
      }
      
      .about-image-left img,
      .about-image-right img {
        width: auto;
        height: auto;
        max-height: 700px;
        max-width: 700px;
        object-fit: contain;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 191, 255, 0.2);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      
      /* Layered paper effect for multiple images */
      .about-image-left:has(img + img),
      .about-image-right:has(img + img) {
        position: relative;
        min-height: 500px;
      }
      
      .about-image-left:has(img + img) img,
      .about-image-right:has(img + img) img {
        position: absolute;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        pointer-events: auto;
      }
      
      .about-image-left:has(img + img),
      .about-image-right:has(img + img) {
        pointer-events: none;
      }
      
      .about-image-left:has(img + img) img:hover ~ img,
      .about-image-right:has(img + img) img:hover ~ img {
        pointer-events: none;
      }
      
      .about-image-left:has(img + img) img:nth-child(1),
      .about-image-right:has(img + img) img:nth-child(1) {
        z-index: 1;
        transform: rotate(-5deg) translate(-30px, 20px);
        max-width: 85%;
      }
      
      .about-image-left:has(img + img) img:nth-child(2),
      .about-image-right:has(img + img) img:nth-child(2) {
        z-index: 2;
        transform: rotate(3deg) translate(25px, -10px);
        max-width: 80%;
      }
      
      .about-image-left:has(img + img) img:nth-child(3),
      .about-image-right:has(img + img) img:nth-child(3) {
        z-index: 3;
        transform: rotate(-2deg) translate(10px, 35px);
        max-width: 82%;
      }
      
      .about-image-left:has(img + img) img:hover,
      .about-image-right:has(img + img) img:hover {
        z-index: 10;
        transform: rotate(0deg) scale(1.08) !important;
        box-shadow: 0 12px 40px rgba(0, 191, 255, 0.4);
      }
      
      .about-image-left img:hover,
      .about-image-right img:hover {
        transform: scale(1.05);
        box-shadow: 0 8px 30px rgba(0, 191, 255, 0.3);
      }
      
      .about-text-left p,
      .about-text-right p {
        margin: 0;
        font-size: var(--font-size-lg, 1.125rem);
        line-height: 1.8;
        font-family: 'Georgia', serif;
        word-wrap: break-word;
        overflow-wrap: break-word;
        hyphens: auto;
      }

      .highlight {
        color: #00bfff;
        font-weight: bold;
      }
      
      .highlight a {
        color: #00bfff;
        text-decoration: underline;
        transition: color 0.3s ease;
        word-break: break-word;
      }
      
      .highlight a:hover {
        color: #00d4ff;
        text-decoration: underline;
      }
      
      /* Mobile Responsive */
      @media (max-width: 768px) {
        .about-section {
          flex-direction: column !important;
          gap: var(--space-4, 2rem);
          min-height: auto;
        }
        
        .about-text-left,
        .about-text-right {
          flex: 1;
          padding: 0;
          width: 100%;
        }
        
        .about-image-left,
        .about-image-right {
          flex: 1;
          width: 100%;
          max-width: 400px;
        }
        
        .about-text-left p,
        .about-text-right p {
          font-size: var(--font-size-base, 1rem);
          line-height: 1.6;
        }
        
        .about-content {
          gap: var(--space-6, 3rem);
        }
      }
      
      @media (max-width: 480px) {
        .about-content {
          gap: var(--space-4, 2rem);
        }
        
        .about-section {
          gap: var(--space-3, 1.5rem);
        }
        
        .about-text-left p,
        .about-text-right p {
          font-size: var(--font-size-sm, 0.875rem);
        }
        
        .about-image-left img,
        .about-image-right img {
          border-radius: 8px;
        }
      }
    </style>
  `;
}