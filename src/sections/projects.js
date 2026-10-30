import { projectsData } from '../content/projects.js';
import { getVolumeHeading } from '../utils/library-state.js';
import { trackProjectView } from '../utils/analytics.js';
import { mountPublication, escapePublicationText as escapeText } from '../utils/publication.js';

export function initProjects() {
  const projects = document.getElementById('projects');
  if (!projects) return;




  const modalHTML = `
    <div class="project-modal-overlay" id="projectModal">
      <div class="project-modal-content">
        <button class="project-modal-close" id="closeModal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div class="project-modal-body" id="modalBody"></div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const statusTags = {
    'alpha': { color: '#e53935', label: 'Alpha' },
    'beta': { color: '#ffd600', label: 'Beta' },
    'mvp': { color: '#00bcd4', label: 'MVP' },
    'release': { color: '#43a047', label: 'Release' },
    'in development': { color: '#8e24aa', label: 'In Dev' },
    'on hold': { color: '#ff6f00', label: 'On Hold' },
    'complete': { color: '#2196f3', label: 'Complete' }
  };

  projects.classList.add('section-visible');
  const visibleProjects = projectsData.filter(project => !project.hidden);

  const modal = document.getElementById('projectModal');
  const modalBody = document.getElementById('modalBody');
  const closeModalBtn = document.getElementById('closeModal');

  function openModal(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    if (!project) return;

    const statusInfo = project.status ? statusTags[project.status.toLowerCase()] : null;
    const statusBadgeHTML = statusInfo ? `
      <span class="project-status-badge" style="background-color: ${statusInfo.color};">
        ${statusInfo.label}
      </span>
    ` : '';

    const techList = project.tags.join(', ');

    let linksHTML = '<div class="project-modal-links">';
    if (project.githubLink || project.gitlabLink) {
      linksHTML += `
        <a href="${project.githubLink || project.gitlabLink}" target="_blank" class="project-modal-link">
          ${project.gitlabLink ? `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.548 12.276l-2.055-6.32a.763.763 0 0 0-1.453-.062l-1.72 5.17H6.68l-1.72-5.17a.763.763 0 0 0-1.452.062l-2.056 6.32a1.154 1.154 0 0 0 .408 1.27l9.616 7.212a.764.764 0 0 0 .91 0l9.615-7.213a1.154 1.154 0 0 0 .407-1.27z"/>
            </svg>
            View on GitLab
          ` : `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            View on GitHub
          `}
        </a>
      `;
    }
    if (project.externalLink) {
      linksHTML += `
        <a href="${project.externalLink}" target="_blank" class="project-modal-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15,3 21,3 21,9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
          Open Project
        </a>
      `;
    }
    linksHTML += '</div>';

    const media = project.images || [];
    const videos = media.filter(item => item.type === 'video');
    const images = media.filter(item => item.type !== 'video');
    const videosHTML = videos.length ? `
      <div class="project-modal-videos">
        ${videos.map((video, index) => `
          <div class="project-video-item">
            <video controls playsinline preload="none"${video.poster ? ` poster="${video.poster}"` : ''}
              aria-label="${video.alt || project.title + ' - Video ' + (index + 1)}">
              <source src="${video.src}" type="${video.mimeType || 'video/mp4'}">
              Your browser does not support embedded video. <a href="${video.src}">Open video</a>.
            </video>
            <p class="project-video-fallback" hidden>Unable to play this video. <a href="${video.src}">Open video</a>.</p>
            ${video.caption ? `<p class="project-image-caption">${video.caption}</p>` : ''}
          </div>
        `).join('')}
      </div>
    ` : '';

    let imagesHTML = '';
    if (images.length > 0) {
      imagesHTML = `
        <div class="project-modal-images">
          <div class="project-images-masonry">
            ${images.map((img, index) => `
              <div class="project-image-item">
                <img src="${img.src}" alt="${img.alt || project.title + ' - Image ' + (index + 1)}" loading="lazy">
                ${img.caption ? `<p class="project-image-caption">${img.caption}</p>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    let caseStudyHTML = '';

    if (project.description || project.role || project.duration) {
      // Convert line breaks to paragraphs - handle both \n\n and \n
      const descriptionHTML = project.description 
        ? project.description.split(/\n+/).filter(para => para.trim()).map(para => `<p>${para.trim()}</p>`).join('')
        : '';
      
      caseStudyHTML += `
        <div class="modal-section">
          <h4>📋 Project Details</h4>
          ${descriptionHTML}
          <ul class="project-meta-list">
            ${project.role ? `<li><strong>Role:</strong> ${project.role}</li>` : ''}
            ${project.teamSize ? `<li><strong>Team Size:</strong> ${project.teamSize}</li>` : ''}
            ${project.duration ? `<li><strong>Duration:</strong> ${project.duration}</li>` : ''}
            ${project.tags && project.tags.length > 0 ? `<li><strong>Technologies:</strong> ${techList}</li>` : ''}
          </ul>
        </div>
      `;
    }

    // Writeup section - what I did for this project
    let writeupHTML = '';
    if (project.writeup) {
      // Parse writeup content with basic formatting
      const parseWriteup = (text) => {
        return text
          // Headers
          .replace(/^### (.+)$/gm, '<h5>$1</h5>')
          .replace(/^## (.+)$/gm, '<h4>$1</h4>')
          // Bold
          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          // Italic
          .replace(/\*(.+?)\*/g, '<em>$1</em>')
          // Inline code
          .replace(/`([^`]+)`/g, '<code>$1</code>')
          // Unordered lists
          .replace(/^- (.+)$/gm, '<li>$1</li>')
          .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
          // Numbered lists
          .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
          // Line breaks to paragraphs
          .split(/\n\n+/)
          .map(para => {
            para = para.trim();
            if (!para) return '';
            if (para.startsWith('<h') || para.startsWith('<ul') || para.startsWith('<ol')) return para;
            if (para.startsWith('<li>')) return `<ul>${para}</ul>`;
            return `<p>${para.replace(/\n/g, '<br>')}</p>`;
          })
          .join('');
      };

      writeupHTML = `
        <div class="modal-section writeup-section">
          <h4>📝 What I Did</h4>
          <div class="writeup-content">
            ${parseWriteup(project.writeup)}
          </div>
        </div>
      `;
    }

    modalBody.innerHTML = `
      <div class="modal-header">
        <h2 class="modal-title">${project.title}</h2>
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px; flex-wrap: wrap;">
          <span class="modal-category">${project.category}</span>
          ${statusBadgeHTML}
        </div>
      </div>

      ${videosHTML}

      ${caseStudyHTML}

      ${writeupHTML}

      ${linksHTML}

      ${imagesHTML}
    `;

    modalBody.querySelectorAll('video').forEach(video => {
      const showFallback = () => {
        video.parentElement.querySelector('.project-video-fallback').hidden = false;
      };
      video.addEventListener('error', showFallback);
      video.querySelector('source').addEventListener('error', showFallback);
      video.addEventListener('play', () => {
        modalBody.querySelectorAll('video').forEach(other => {
          if (other !== video) other.pause();
        });
      });
    });

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Track project view in Google Analytics
    trackProjectView(project.id, project.title);
  }

  function closeModal() {
    modalBody.querySelectorAll('video').forEach(video => video.pause());
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Expose closeModal on window so blog links can close project modal first
  window.closeProjectModal = closeModal;

  closeModalBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Each project is a spread; the existing detailed modal remains unchanged.
  mountPublication(projects, {
    ...getVolumeHeading('projects'),
    entries: visibleProjects.map(project => ({
      label: project.title,
      left: `<span class="publication-kicker">Selected work / ${escapeText(project.category || 'Gallery')}</span>
        ${project.image ? `<img class="publication-image" src="${escapeText(project.image)}" alt="${escapeText(project.title)}" decoding="async">` : '<div class="publication-monogram" aria-hidden="true">QN</div>'}
        <p class="publication-caption">${escapeText(project.title)}</p>`,
      right: `<span class="publication-kicker">${escapeText(statusTags[project.status?.toLowerCase()]?.label || 'Portfolio')}</span>
        <h3>${escapeText(project.title)}</h3>
        <p>${escapeText(project.description || '')}</p>
        <dl class="publication-meta">
          ${project.role ? `<div><dt>My role</dt><dd>${escapeText(project.role)}</dd></div>` : ''}
          ${project.duration ? `<div><dt>Timeline</dt><dd>${escapeText(project.duration)}</dd></div>` : ''}
        </dl>
        <div class="publication-tags">${(project.tags || []).map(tag => `<span>${escapeText(tag)}</span>`).join('')}</div>
        <div class="publication-actions">
          <button type="button" class="read-more-btn" data-project-id="${escapeText(project.id)}">Project details</button>
          ${project.githubLink || project.gitlabLink ? `<a href="${escapeText(project.githubLink || project.gitlabLink)}" target="_blank" rel="noopener noreferrer">Source code ↗</a>` : ''}
          ${project.externalLink ? `<a href="${escapeText(project.externalLink)}" target="_blank" rel="noopener noreferrer">Open project ↗</a>` : ''}
        </div>`
    }))
  });
  projects.addEventListener('click', event => {
    const button = event.target.closest('.read-more-btn');
    if (button) openModal(button.dataset.projectId);
  });
}
