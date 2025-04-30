export function initAbout() {
  const about = document.getElementById('about');
  
  about.innerHTML = `
    <div class="container">
      <h2 class="section-title reveal">About Me</h2>
      
      <div class="about-content">
        <div class="about-text">
          <p class="reveal">Hello! I'm Quang Nguyen. I'm currently a student at Georgia Institute of Technology, where I'm pursuing a degree Bachelor of Science in Computational Media (half CS and half LMC) concentrated in Game Desgin and Artifical Intelligence.</p>
          
          <p class="reveal">I'm both a Software Developer and a Game Developer.</p>
          
          <p class="reveal">I like to explore things and enjoy world building.</p>
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
      
      @media (max-width: 768px) {
        .about-text {
          text-align: center;
        }
      }
    </style>
  `;
}