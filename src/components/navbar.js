export function initNav() {
  const header = document.getElementById('header');
  
  // Add black background class immediately
  header.classList.add('scrolled');
  
  // Create navbar content
  header.innerHTML = `
    <div class="container">
      <nav class="nav">
        <a href="#hero" class="nav-logo">Portfolio</a>
        
        <div class="menu-toggle">
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        <ul class="nav-links">
          <li><a href="#hero" class="nav-link active">Home</a></li>
          <li><a href="#about" class="nav-link">About</a></li>
          <li><a href="#projects" class="nav-link">Projects</a></li>
          <li><a href="#resume" class="nav-link">Resume</a></li>
        </ul>
      </nav>
    </div>
  `;

  // Handle mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
  
  // Close mobile menu when clicking on a link
  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
  
  // Update active link on scroll
  updateActiveNavOnScroll();
  
  // Change header background on scroll
  changeHeaderOnScroll();
}

function updateActiveNavOnScroll() {
  let isManualClick = false;
  let clickTimeout;
  
  window.addEventListener('scroll', () => {
    // Don't update on scroll if manual click was just performed
    if (isManualClick) return;
    
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
  
  // Add click handler to update active state immediately on click
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Set manual click flag to prevent scroll handler from overriding
      isManualClick = true;
      
      // Clear any existing timeout
      if (clickTimeout) clearTimeout(clickTimeout);
      
      // Remove active class from all links
      navLinks.forEach(l => l.classList.remove('active'));
      
      // Add active class to clicked link
      this.classList.add('active');
      
      // Reset manual click flag after navigation completes
      clickTimeout = setTimeout(() => {
        isManualClick = false;
      }, 1000); // Wait 1 second before allowing scroll updates again
    });
  });
}

function changeHeaderOnScroll() {
  const header = document.getElementById('header');
  
  // Set header to black immediately and permanently
  header.classList.add('scrolled');
  
  // Remove the scroll event listener since we want it always black
  // window.addEventListener('scroll', () => {
  //   if (window.scrollY > 100) {
  //     header.classList.add('scrolled');
  //   } else {
  //     header.classList.remove('scrolled');
  //   }
  // });
}



