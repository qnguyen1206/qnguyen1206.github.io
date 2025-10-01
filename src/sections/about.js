export function initAbout() {
  const about = document.getElementById('about');
  
  about.innerHTML = `
    <div class="container">
      <h2 class="section-title reveal">About Me</h2>
      
      <div class="about-content">
        <div class="about-text">
          <p class="reveal">Hello! I'm <span class="highlight">Quang Nguyen</span>. I'm currently a senior student at <span class="highlight">Georgia Institute of Technology</span>, where I'm pursuing a degree <span class="highlight">Bachelor of Science in Computational Media</span> concentrated in <span class="highlight">Artificial Intelligence</span> and <span class="highlight">Game Design</span>.</p>

          <p class="reveal">I have work on many teams and personal projects during my time at Georgia Tech ranging from <span class="highlight">game development</span> to <span class="highlight">app development</span>.</p>

          <p class="reveal">One of the most notable projects I have worked on is <span class="highlight">Kart: The Tech Filled Racing Game</span>, a game where cars and technology meet with each cars have their own unique abilities. We are planning to release it on <span class="highlight">Steam</span> so check it out when it release. 👍</p>

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
      }
      
      /* Highlight styles - bright blue/cyan with bold */
      .highlight {
        color: #00bfff;
        font-weight: bold;
      }
      
      @media (max-width: 768px) {
        .about-text {
          text-align: center;
        }
      }
    </style>
  `;
}