export function initResume() {
  const resumeSection = document.getElementById('resume');

  resumeSection.innerHTML = `
    <div class="container">
      <h2 class="section-title reveal active">My Resume</h2>
      <div class="resume-container reveal active">
        <div class="resume-content">
          <h3>Download My Resume</h3>
          <p>Click the button below to download my resume as a PDF file.</p>
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

      .resume-container {
        background-color: var(--color-bg);
        border-radius: var(--radius-md);
        padding: var(--space-4);
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .resume-content {
        margin-bottom: var(--space-4);
      }

      .resume-content h3 {
        color: var(--color-text);
        margin-bottom: var(--space-2);
        font-size: 1.5rem;
      }

      .resume-content p {
        color: var(--color-text-muted);
        font-size: 1.1rem;
        line-height: 1.6;
      }

      .resume-actions {
        display: flex;
        justify-content: center;
      }
    </style>
  `;
}
