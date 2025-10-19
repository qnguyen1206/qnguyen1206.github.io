export function initAbout() {
  const about = document.getElementById('about');
  
  about.innerHTML = `
    <div class="container">
      <h2 class="section-title reveal">About Me</h2>
      
      <div class="about-content">
        <div class="about-text">
          <p class="reveal">Hello! I'm <span class="highlight">Quang Nguyen</span>. I'm currently a senior student at <span class="highlight">Georgia Institute of Technology</span>, where I'm pursuing a degree <span class="highlight">Bachelor of Science in Computational Media</span> concentrated in <span class="highlight">Artificial Intelligence</span> and <span class="highlight">Game Design</span>.</p>

          <p class="reveal">I have work on many teams and personal projects during my time at Georgia Tech ranging from <span class="highlight">game development</span> to <span class="highlight">app development</span>.</p>

          <p class="reveal">One of the most notable projects I have worked on is <span class="highlight">Kart: The Tech Filled Racing Game</span>, a game where cars and technology meet with each cars have their own unique abilities. We have released the game on <span class="highlight"><a href="https://store.steampowered.com/app/2165230/Kart_The_Tech_Filled_Racing_Game/" target="_blank" rel="noopener noreferrer">Steam</a></span> so check it out if you are interested. 👍</p>

          <p class="reveal">Beside developing games and app, I am also learning about <span class="highlight">graphic design</span>, <span class="highlight">UI/UX</span> and <span class="highlight">cybersecurity</span> to expand my knowledge and skillset.</p>
          
          <p class="reveal">I like to explore new places and enjoy world building during my free time. I also like to learn new skills and discover new hobbies.</p>
        </div>
      </div>
    </div>
    
    <style>
      .about-content {
        max-width: 800px;
        margin: 0 auto;
      }
      
      .about-text p {
        margin-bottom: var(--space-4);
        font-size: var(--font-size-lg);
        font-family: 'Georgia', serif;
      }
      
      /* Highlight styles - bright blue/cyan with bold */
      .highlight {
        color: #00bfff;
        font-weight: bold;
      }
      
      .highlight a {
        color: #00bfff;
        text-decoration: underline;
        transition: color 0.3s ease;
      }
      
      .highlight a:hover {
        color: #00d4ff;
        text-decoration: underline;
      }
      
      @media (max-width: 768px) {
        .about-content {
          flex-direction: column;
          padding: var(--space-4);
          gap: var(--space-4);
        }
        
        .about-text {
          padding: 0;
          margin-bottom: var(--space-4);
        }
        
        .about-text p {
          font-size: var(--font-size-base);
          line-height: 1.6;
          margin-bottom: var(--space-3);
        }
        
        .about-image {
          width: 100%;
          max-width: 280px;
          margin: 0 auto;
        }
        
        .about-image img {
          width: 100%;
          height: auto;
          max-width: 280px;
        }
        
        .container {
          padding: var(--space-4) var(--space-2);
          margin: 0;
          max-width: 100%;
          overflow-x: hidden;
        }
        
        .section-title {
          font-size: var(--font-size-2xl);
          margin-bottom: var(--space-4);
        }
      }
      
      @media (max-width: 480px) {
        .about-content {
          padding: var(--space-2);
        }
        
        .about-text p {
          font-size: var(--font-size-sm);
        }
        
        .container {
          padding: var(--space-2) var(--space-1);
        }
      }
    </style>
  `;
}