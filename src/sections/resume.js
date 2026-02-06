export function initResume() {
  const resume = document.getElementById('resume');
  if (!resume) return;

  resume.innerHTML = `
    <div class="container">
      <h2 class="section-title">Resume</h2>
      <div class="resume-content">
        <div class="resume-actions">
          <a href="/Resume.pdf" download class="resume-btn download-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download Resume
          </a>
          
          <a href="/Resume.pdf" target="_blank" class="resume-btn view-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            View Online
          </a>
        </div>

        <div class="resume-preview">
          <div class="resume-card">
            <div class="resume-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <div class="resume-card-info">
              <h3>Quang Nguyen</h3>
              <p>Game Designer</p>
              <span class="resume-format">PDF Format</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <style>
      #resume {
        padding: var(--space-16) 0;
      }

      .resume-content {
        max-width: 700px;
        margin: 0 auto;
        text-align: center;
      }

      .resume-text {
        margin-bottom: var(--space-8);
      }

      .resume-text p {
        font-size: var(--font-size-lg);
        color: var(--color-gray-300);
        line-height: 1.7;
      }

      .resume-actions {
        display: flex;
        justify-content: center;
        gap: var(--space-4);
        margin-bottom: var(--space-10);
        flex-wrap: wrap;
      }

      .resume-btn {
        display: inline-flex;
        align-items: center;
        gap: var(--space-3);
        padding: var(--space-4) var(--space-6);
        border-radius: var(--radius-lg);
        font-size: var(--font-size-base);
        font-weight: 600;
        text-decoration: none;
        transition: all 0.3s ease;
        cursor: pointer;
      }

      .download-btn {
        background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(16, 185, 129, 0.2));
        border: 2px solid rgba(34, 197, 94, 0.5);
        color: #4ade80;
      }

      .download-btn:hover {
        background: linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(16, 185, 129, 0.3));
        border-color: #4ade80;
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(34, 197, 94, 0.25);
      }

      .view-btn {
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2));
        border: 2px solid rgba(139, 92, 246, 0.5);
        color: #a78bfa;
      }

      .view-btn:hover {
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(59, 130, 246, 0.3));
        border-color: #a78bfa;
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(139, 92, 246, 0.25);
      }

      .resume-preview {
        display: flex;
        justify-content: center;
      }

      .resume-card {
        display: flex;
        align-items: center;
        gap: var(--space-5);
        padding: var(--space-6);
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: var(--radius-xl);
        max-width: 400px;
      }

      .resume-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 80px;
        height: 80px;
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2));
        border-radius: var(--radius-lg);
        color: #a78bfa;
        flex-shrink: 0;
      }

      .resume-card-info {
        text-align: left;
      }

      .resume-card-info h3 {
        font-size: var(--font-size-xl);
        color: var(--color-white);
        margin: 0 0 var(--space-1) 0;
      }

      .resume-card-info p {
        font-size: var(--font-size-sm);
        color: var(--color-gray-400);
        margin: 0 0 var(--space-2) 0;
      }

      .resume-format {
        display: inline-block;
        padding: var(--space-1) var(--space-3);
        background: rgba(139, 92, 246, 0.15);
        border-radius: var(--radius-full);
        font-size: var(--font-size-xs);
        color: #c084fc;
        font-weight: 500;
      }

      @media (max-width: 768px) {
        .resume-actions {
          flex-direction: column;
          align-items: center;
        }

        .resume-btn {
          width: 100%;
          max-width: 280px;
          justify-content: center;
        }

        .resume-card {
          flex-direction: column;
          text-align: center;
        }

        .resume-card-info {
          text-align: center;
        }
      }
    </style>
  `;
}
