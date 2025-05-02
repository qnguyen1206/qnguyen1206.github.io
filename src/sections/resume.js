export function initResume() {
  const resumeSection = document.getElementById('resume');
  
  resumeSection.innerHTML = `
    <div class="container">
      <h2 class="section-title reveal active">My Resume</h2>
      <div class="resume-container reveal active">
        <div class="pdf-viewer">
          <embed src="Resume.pdf" type="application/pdf" width="100%" height="100%" title="Resume PDF"/>
        </div>
        <div class="resume-actions">
          <a href="Resume.pdf" download class="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-download" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
              <path d="M7 11l5 5l5 -5" />
              <path d="M12 4v12" />
            </svg>
            Download PDF
          </a>
        </div>
      </div>
    </div>
    
    <style>
      #resume {
        background-color: var(--color-bg);
        padding: var(--space-6) 0;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      
      .section-title {
        margin-bottom: var(--space-4);
      }
      
      .resume-container {
        background-color: var(--color-bg);
        border-radius: var(--radius-md);
        padding: var(--space-4);
        display: flex;
        flex-direction: column;
      }
      
      .pdf-viewer {
        width: 100%;
        height: 85vh; /* Set to 85% of viewport height */
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        overflow: hidden;
        background-color: white;
        margin-bottom: var(--space-2);
      }
      
      .pdf-viewer embed {
        border: none;
        width: 100%;
        height: 100%;
      }
      
      .resume-actions {
        display: flex;
        justify-content: center;
        margin-top: var(--space-2);
      }
      
      @media (max-width: 768px) {
        .pdf-viewer {
          height: 80vh;
        }
      }
      
      @media (max-width: 480px) {
        .pdf-viewer {
          height: 75vh;
        }
      }
    </style>
  `;
}



