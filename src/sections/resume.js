export function initResume() {
  const resumeSection = document.getElementById('resume');

  resumeSection.innerHTML = `
    <div class="container">
      <h2 class="section-title reveal active">My Resume</h2>
      <div class="resume-container reveal active">
        <div class="pdf-canvas-wrapper">
          <canvas id="pdf-canvas"></canvas>
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
      }

      .pdf-canvas-wrapper {
        width: 100%;
        max-width: 850px;
        background: white;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        overflow: hidden;
      }

      canvas#pdf-canvas {
        width: 100% !important;
        height: auto !important;
        display: block;
      }

      .resume-actions {
        margin-top: var(--space-4);
        display: flex;
        justify-content: center;
      }
    </style>
  `;

  const canvas = document.getElementById('pdf-canvas');
  const pdfUrl = 'Resume.pdf';

  // Dynamically load PDF.js
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
  script.onload = () => {
    const loadingTask = window.pdfjsLib.getDocument(pdfUrl);
    loadingTask.promise.then(pdf => {
      return pdf.getPage(1).then(page => {
        const containerWidth = canvas.parentElement.clientWidth;

        // Base scale for 100% width
        const unscaledViewport = page.getViewport({ scale: 1 });
        const scale = containerWidth / unscaledViewport.width;

        // Improve resolution based on device pixel ratio
        const devicePixelRatio = window.devicePixelRatio || 1;
        const finalScale = scale * devicePixelRatio;

        const viewport = page.getViewport({ scale: finalScale });

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        canvas.style.width = `${viewport.width / devicePixelRatio}px`;
        canvas.style.height = `${viewport.height / devicePixelRatio}px`;

        const context = canvas.getContext('2d');
        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };

        return page.render(renderContext).promise;
      })
    }).catch(err => {
      console.error('PDF loading error:', err);
      canvas.parentElement.innerHTML = `<p style="color:red;">Failed to load PDF.</p>`;
    });
  };

  script.onerror = () => {
    console.error('Failed to load PDF.js');
    canvas.parentElement.innerHTML = `<p style="color:red;">PDF.js failed to load.</p>`;
  };

  document.head.appendChild(script);
}
