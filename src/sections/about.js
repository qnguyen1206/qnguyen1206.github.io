export function initAbout() {
  const about = document.getElementById('about');
  
  about.innerHTML = `
    <div class="container">
      <h2 class="section-title reveal">About Me</h2>
      
      <div class="about-content">
        <div class="about-text">
          <p class="reveal">Hello! I'm a passionate frontend developer and designer with a love for creating beautiful, functional, and user-centered digital experiences.</p>
          
          <p class="reveal">With 5+ years of experience in the field, I've worked on a diverse range of projects, from small business websites to complex web applications. I'm constantly exploring new technologies and design trends to stay at the cutting edge of web development.</p>
          
          <p class="reveal">When I'm not coding, you can find me exploring nature trails, experimenting with photography, or attending local tech meetups. I believe in continuous learning and giving back to the community through mentorship and open-source contributions.</p>
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