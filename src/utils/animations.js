export function initAnimations() {
  // Reveal elements on scroll
  const revealElements = document.querySelectorAll('.reveal');
  
  function revealOnScroll() {
    for (let i = 0; i < revealElements.length; i++) {
      const windowHeight = window.innerHeight;
      const elementTop = revealElements[i].getBoundingClientRect().top;
      const elementVisible = 150;
      
      if (elementTop < windowHeight - elementVisible) {
        revealElements[i].classList.add('active');
      }
    }
  }
  
  // Run on load
  revealOnScroll();
  
  // Add scroll event listener
  window.addEventListener('scroll', revealOnScroll);
  
  // Initialize skill bars animation
  const skillBars = document.querySelectorAll('.skill-progress');
  
  function animateSkillBars() {
    if (skillBars.length === 0) return;
    
    const skillsSection = document.getElementById('skills');
    const skillsSectionTop = skillsSection.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    
    if (skillsSectionTop < windowHeight * 0.8) {
      skillBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        
        setTimeout(() => {
          bar.style.width = width;
        }, 100);
      });
      
      // Remove event listener after animation
      window.removeEventListener('scroll', animateSkillBars);
    }
  }
  
  window.addEventListener('scroll', animateSkillBars);
  
  // Run once on page load
  setTimeout(animateSkillBars, 500);
}