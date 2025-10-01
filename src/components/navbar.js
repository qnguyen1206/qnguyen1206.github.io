export function initNav() {
  const header = document.getElementById('header');
  
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
          <li><a href="#skills" class="nav-link">Skills</a></li>
          <li><a href="#projects" class="nav-link">Projects</a></li>
          <li><a href="#certificates" class="nav-link">Certificates</a></li>
          <li><a href="#contacts" class="nav-link">Contacts</a></li>
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
    
    // Include both hero section and other sections
    const heroSection = document.getElementById('hero');
    const otherSections = document.querySelectorAll('.section');
    const allSections = heroSection ? [heroSection, ...otherSections] : [...otherSections];
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    const scrollPosition = window.scrollY + 100; // Add offset for better detection
    
    // Find the section that is currently in view
    allSections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.clientHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        current = section.getAttribute('id');
      }
    });
    
    // If no section is found (e.g., at very top), default to hero section
    if (!current) {
      current = 'hero';
    }
    
    // Update the URL hash without triggering a scroll
    if (current && window.location.hash !== `#${current}`) {
      history.replaceState(null, null, `#${current}`);
    }
    
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
  
  // Function to update header based on scroll position
  function updateHeader() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  
  // Set initial state
  updateHeader();
  
  // Add scroll event listener for smooth transitions
  window.addEventListener('scroll', updateHeader);
}



