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
          </div>
          <div class="about-image-right">
            <img src="images/about-gatech.jpg" alt="Georgia Tech" loading="lazy">
          </div>
        </div>

        <!-- Section 2: Image Left, Text Right -->
        <div class="about-section reveal">
          <div class="about-image-left">
            <img src="images/about-projects.jpg" alt="Projects" loading="lazy">
          </div>
          <div class="about-text-right">
            <p>I have worked on many teams and personal projects during my time at Georgia Tech ranging from <span class="highlight">game development</span> to <span class="highlight">app development</span>.</p>
          </div>
        </div>

        <!-- Section 3: Text Left, Image Right -->
        <div class="about-section reveal">
          <div class="about-text-left">
            <p>One of the most notable projects I have worked on is <span class="highlight">Kart: The Tech Filled Racing Game</span>, a game where cars and technology meet with each car having their own unique abilities. We have released the game on <span class="highlight"><a href="https://store.steampowered.com/app/2165230/Kart_The_Tech_Filled_Racing_Game/" target="_blank" rel="noopener noreferrer">Steam</a></span> so check it out if you are interested. 👍</p>
          </div>
          <div class="about-image-right">
            <img src="images/about-kart.jpg" alt="Kart Game" loading="lazy">
          </div>
        </div>

        <!-- Section 4: Image Left, Text Right -->
        <div class="about-section reveal">
          <div class="about-image-left">
            <img src="images/about-learning.jpg" alt="Learning" loading="lazy">
          </div>
          <div class="about-text-right">
            <p>Besides developing games and apps, I am also learning about <span class="highlight">graphic design</span>, <span class="highlight">UI/UX</span> and <span class="highlight">cybersecurity</span> to expand my knowledge and skillset.</p>
          </div>
        </div>

        <!-- Section 5: Text Left, Image Right -->
        <div class="about-section reveal">
          <div class="about-text-left">
            <p>I like to explore new places and enjoy world building during my free time. I also like to learn new skills and discover new hobbies.</p>
          </div>
          <div class="about-image-right">
            <img src="images/about-hobbies.jpg" alt="Hobbies" loading="lazy">
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
        flex: 2;
        padding-right: var(--space-4, 2rem);
        word-wrap: break-word;
        overflow-wrap: break-word;
      }
      
      .about-image-right {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
      }
      
      /* Image Left (1/3), Text Right (2/3) */
      .about-image-left {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
      }
      
      .about-text-right {
        flex: 2;
        padding-left: var(--space-4, 2rem);
        word-wrap: break-word;
        overflow-wrap: break-word;
      }
      
      .about-image-left img,
      .about-image-right img {
        width: 100%;
        height: auto;
        max-width: 100%;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 191, 255, 0.2);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
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