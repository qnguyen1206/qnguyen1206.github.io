export function initFooter() {
  const footer = document.getElementById('footer');
  
  footer.innerHTML = `
    <div class="container">
      <div class="footer-content">
        <div>
          <p>© ${new Date().getFullYear()} All rights reserved</p>
        </div>
        
        <div class="tech-container">
          <p>Made with the help of</p>
          <p class="tech-icons">
            <img src="icons/bolt_icon.png" class="tech-icon" alt="Bolt"></img>
            <img src="icons/copilot_icon.png" class="tech-icon" alt="GitHub Copilot"></img>
            <img src="icons/vite_icon.png" class="tech-icon" alt="Vite"></img>
            <img src="icons/augment_icon.png" class="tech-icon" alt="Augment"></img>
          </p>
        </div>

        <div class="social-links">
          <a href="https://github.com/qnguyen1206" class="social-link" aria-label="GitHub">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
          </a>
          <a href="https://gitlab.com/qnguyen1206" class="social-link" aria-label="GitLab">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.548 12.276l-2.055-6.32a.763.763 0 0 0-1.453-.062l-1.72 5.17H6.68l-1.72-5.17a.763.763 0 0 0-1.452.062l-2.056 6.32a1.154 1.154 0 0 0 .408 1.27l9.616 7.212a.764.764 0 0 0 .91 0l9.615-7.213a1.154 1.154 0 0 0 .407-1.27z"/>
            </svg>
          </a>
          <a href="www.linkedin.com/in/quang-nguyen-584005251" class="social-link" aria-label="LinkedIn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>
        </div>
      </div>
    </div>
  `;
}