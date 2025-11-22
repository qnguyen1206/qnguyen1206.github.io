export function initProjects() {
  const projects = document.getElementById('projects');
  if (!projects) return;

  const projectsData = [
    // Visible projects (not hidden) - at the top
    {
      id: 'kart-tech-racing',
      title: 'Kart: The Tech Filled Racing Game',
      category: 'Game Development',
      image: 'images/KartIcon.png',
      description: 'A multiplayer racing game where cars and technology meet, designed using Godot and Steamworks.',
      tags: ['Godot', 'GDScript', 'Steamworks', 'GitLab'],
      status: 'beta',
      role: 'Lead Programmer, Gameplay Designer, UI/UX Designer',
      teamSize: '4 developers',
      duration: '5 years (2020 - 2025)',
      problem: 'We wanted to create a unique racing experience that combined vehicle customization with abilities, while ensuring smooth multiplayer gameplay across different platforms.',
      solution: '',
      technicalHighlights: [],
      challenges: [],
      results: {
        metrics: '',
        impact: '',
        learnings: ''
      },
      gitlabLink: '',
      externalLink: 'https://store.steampowered.com/app/2165230/Kart_The_Tech_Filled_Racing_Game/',
      images: []
    },

    {
      id: 'todo-app',
      title: 'TO DO App',
      category: 'App Development',
      image: 'images/clipboard.png',
      description: 'A gamified to-do list app with DeepSeek-R1 14B param local AI integrated for personal use.',
      tags: ['Python', 'DeepSeek', 'Tkinter'],
      status: 'release',
      role: '',
      teamSize: '',
      duration: '',
      problem: '',
      solution: '',
      technicalHighlights: [],
      challenges: [],
      results: {
        metrics: '',
        impact: '',
        learnings: ''
      },
      githubLink: 'https://github.com/Kairu1206/todoapp',
      externalLink: 'https://github.com/Kairu1206/todoapp',
      images: []
    },
    {
      id: 'rock-open-game',
      title: 'Rock Open Game',
      category: 'Game Development',
      image: 'images/webrockgameicon.png',
      description: 'A browser-based multiplayer game reimagining a high school project with modern web technologies.',
      tags: ['JavaScript', 'React', 'Firebase', 'WebGL', 'NodeJS'],
      status: 'release',
      role: '',
      teamSize: '',
      duration: '',
      problem: '',
      solution: '',
      technicalHighlights: [],
      challenges: [],
      results: {
        metrics: '',
        impact: '',
        learnings: ''
      },
      githubLink: 'https://github.com/qnguyen1206/RockOpenGameWeb',
      externalLink: 'https://rockopengameweb.web.app/',
      images: []
    },
    {
      id: 'infinity-mythical-hunt',
      title: 'Infinity: Mythical Hunt',
      category: 'Game Development',
      image: 'images/InQnityIcon.png',
      description: 'A co-op game where players immerse in the world of mythical creatures with real-world folklores and fantasies.',
      tags: ['Godot', 'GDScript', 'Steamworks', 'GitLab'],
      status: 'in development',
      role: '',
      teamSize: '',
      duration: '',
      problem: '',
      solution: '',
      technicalHighlights: [],
      challenges: [],
      results: {
        metrics: '',
        impact: '',
        learnings: ''
      },
      gitlabLink: 'https://gitlab.com/infinity-mythical-hunt',
      images: []
    },
    {
      id: 'wander-sync-app',
      title: 'WanderSync App',
      category: 'App Development',
      image: 'images/AndroidStudioIcon.png',
      description: 'A collaborative travel planning app built using Agile methodology.',
      tags: ['Java', 'Firebase', 'Android Studio'],
      status: 'complete',
      role: '',
      teamSize: '',
      duration: '',
      problem: '',
      solution: '',
      technicalHighlights: [],
      challenges: [],
      results: {
        metrics: '',
        impact: '',
        learnings: ''
      },
      githubLink: 'https://github.com/Kairu1206/CS2340D_Team26',
      images: []
    },
    {
      id: 'what-yours-is-mime',
      title: 'What Yours is Mime',
      category: 'Game Development',
      image: 'images/WYiMIcon.png',
      description: 'A 2.5D bullet-hell game where players battle through a kingdom\'s dungeon as a jester.',
      tags: ['Unity', 'C#'],
      status: 'complete',
      role: '',
      teamSize: '',
      duration: '',
      problem: '',
      solution: '',
      technicalHighlights: [],
      challenges: [],
      results: {
        metrics: '',
        impact: '',
        learnings: ''
      },
      externalLink: 'https://jhaboon.itch.io/wyim',
      images: []
    }
  ];

  // Set up the HTML structure without navigation
  projects.innerHTML = `
    <div class="container">
      <h2 class="section-title">My Projects</h2>

      <div class="projects-container">
        <div class="projects-wrapper" id="projectsWrapper">
          <div class="projects-grid" id="projectsGrid">
          </div>
        </div>
      </div>
    </div>
  `;

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

  const techIcons = {
    'Java': { src: 'icons/java_icon.png', width: 32, height: 32 },
    'Godot': { src: 'icons/godot_icon.png', width: 32, height: 32 },
    'Unity': { src: 'icons/unity_icon.png', width: 32, height: 32 },
    'Steamworks': { src: 'icons/steamworks_icon.png', width: 32, height: 32 },
    'GitLab': { src: 'icons/gitlab_icon.png', width: 32, height: 32 },
    'Python': { src: 'icons/python_icon.png', width: 32, height: 32 },
    'DeepSeek': { src: 'icons/deepseek_icon.png', width: 32, height: 32 },
    'HTML': { src: 'icons/html_icon.png', width: 32, height: 32 },
    'CSS': { src: 'icons/css_icon.png', width: 32, height: 32 },
    'JavaScript': { src: 'icons/javascript_icon.png', width: 32, height: 32 },
    'Firebase': { src: 'icons/firebase_icon.png', width: 32, height: 32 },
    'React': { src: 'icons/react_icon.png', width: 32, height: 32 },
    'NodeJS': { src: 'icons/nodejs_icon.png', width: 32, height: 32 },
    'Android Studio': { src: 'icons/android_studio_icon.png', width: 32, height: 32 },
    'GitHub': { src: 'icons/github_icon.png', width: 32, height: 32 },
    'C#': { src: 'icons/csharp_icon.png', width: 32, height: 32 },
    'PHP': { src: 'icons/php_icon.png', width: 32, height: 32 },
    'MySQL': { src: 'icons/mysql_icon.png', width: 32, height: 32 },
    'PHPMyAdmin': { src: 'icons/phpmyadmin_icon.png', width: 32, height: 32 },
    'Aframe': { src: 'icons/aframe_icon.png', width: 32, height: 32 },
    'C': { src: 'icons/c_icon.png', width: 32, height: 32 },
    'Raspberry Pi': { src: 'icons/raspberry_pi_icon.png', width: 32, height: 32 },
    'Flipper Zero': { src: 'icons/flipper_zero_icon.png', width: 32, height: 32 },
    'ChatGPT': { src: 'icons/chatgpt_icon.png', width: 32, height: 32 }
  };

  const statusTags = {
    'alpha': { color: '#e53935', label: 'Alpha' },
    'beta': { color: '#ffd600', label: 'Beta' },
    'release': { color: '#43a047', label: 'Release' },
    'in development': { color: '#8e24aa', label: 'In Dev' },
    'on hold': { color: '#ff6f00', label: 'On Hold' },
    'complete': { color: '#2196f3', label: 'Complete' }
  };

  projects.classList.add('section-visible');
  const visibleProjects = projectsData.filter(project => !project.hidden);

  const projectsGrid = projects.querySelector('.projects-grid');
  projectsGrid.innerHTML = visibleProjects.map((project) => `
    <article class="project-card" tabindex="0" data-category="${project.category}" data-project-id="${project.id}" aria-labelledby="proj-${project.id}-title">
      ${project.status ? `
        <div class="status-badge status-${project.status.toLowerCase()}">${statusTags[project.status].label}</div>
      ` : ''}

      <div class="thumb-wrap" aria-hidden="true">
        <img class="thumb" data-src="${project.image}" alt="${project.title} thumbnail" loading="lazy">
        <div class="scanline" aria-hidden="true"></div>
        <div class="pixel-shake" aria-hidden="true"></div>
      </div>

      <div class="card-content">
        <h3 id="proj-${project.id}-title" class="card-title">${project.title}</h3>
        <div class="card-subtitle">${project.category}</div>

        <div class="quick-stats" aria-label="Project details">
          ${project.tags && project.tags.length > 0 ? `<div class="stat">Tech: ${project.tags.slice(0, 2).join(' • ')}</div>` : ''}
          <div class="stat">Status: ${statusTags[project.status]?.label || 'N/A'}</div>
        </div>

        <p class="card-desc">${project.description}</p>

        <div class="cta-row">
          <div class="cta-buttons">
            ${project.githubLink || project.gitlabLink ? `
              <a href="${project.githubLink || project.gitlabLink}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" title="View source code">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  ${project.gitlabLink ? `
                    <path d="M22.548 12.276l-2.055-6.32a.763.763 0 0 0-1.453-.062l-1.72 5.17H6.68l-1.72-5.17a.763.763 0 0 0-1.452.062l-2.056 6.32a1.154 1.154 0 0 0 .408 1.27l9.616 7.212a.764.764 0 0 0 .91 0l9.615-7.213a1.154 1.154 0 0 0 .407-1.27z"/>
                  ` : `
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  `}
                </svg>
                ${project.gitlabLink ? 'GitLab' : 'GitHub'}
              </a>
            ` : ''}
            ${project.externalLink ? `
              <a href="${project.externalLink}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" title="Open live project">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                Open
              </a>
            ` : ''}
            <button class="btn btn-accent read-more-btn" data-project-id="${project.id}" aria-controls="proj-${project.id}-details" title="View full details">
              Details
            </button>
          </div>
        </div>
      </div>
    </article>
  `).join('');

  const modal = document.getElementById('projectModal');
  const modalBody = document.getElementById('modalBody');
  const closeModalBtn = document.getElementById('closeModal');

  function openModal(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    if (!project) return;

    const statusInfo = statusTags[project.status.toLowerCase()] || statusTags['in development'];
    const statusBadgeHTML = `
      <span class="project-status-badge" style="background-color: ${statusInfo.color};">
        ${statusInfo.label}
      </span>
    `;

    const techHTML = project.tags.map(tag => {
      const icon = techIcons[tag];
      return icon ? `
        <div class="project-tech-item">
          <img src="${icon.src}" width="${icon.width}" height="${icon.height}" alt="${tag}" title="${tag}">
          <span>${tag}</span>
        </div>
      ` : `<span class="project-tag">${tag}</span>`;
    }).join('');

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

    let imagesHTML = '';
    if (project.images && project.images.length > 0) {
      imagesHTML = `
        <div class="project-modal-images">
          <h3>Gallery</h3>
          <div class="project-images-grid">
            ${project.images.map((img, index) => `
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

    if (project.role || project.teamSize || project.duration) {
      caseStudyHTML += `
        <div class="modal-section">
          <h4>📋 Project Overview</h4>
          <div class="project-meta-grid">
            ${project.role ? `<div class="meta-item"><strong>Role:</strong> ${project.role}</div>` : ''}
            ${project.teamSize ? `<div class="meta-item"><strong>Team:</strong> ${project.teamSize}</div>` : ''}
            ${project.duration ? `<div class="meta-item"><strong>Duration:</strong> ${project.duration}</div>` : ''}
          </div>
        </div>
      `;
    }

    if (project.problem) {
      caseStudyHTML += `
        <div class="modal-section">
          <h4>🎯 Problem / Context</h4>
          <p>${project.problem}</p>
        </div>
      `;
    }

    if (project.solution) {
      caseStudyHTML += `
        <div class="modal-section">
          <h4>💡 Solution / Approach</h4>
          <p>${project.solution}</p>
        </div>
      `;
    }

    if (project.technicalHighlights && project.technicalHighlights.length > 0) {
      caseStudyHTML += `
        <div class="modal-section">
          <h4>⚙️ Technical Highlights</h4>
          <ul class="highlights-list">
            ${project.technicalHighlights.map(highlight => `<li>${highlight}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    if (project.challenges && project.challenges.length > 0) {
      caseStudyHTML += `
        <div class="modal-section">
          <h4>🚧 Challenges</h4>
          <ul class="challenges-list">
            ${project.challenges.map(challenge => `<li>${challenge}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    if (project.results) {
      caseStudyHTML += `
        <div class="modal-section">
          <h4>📊 Results & Impact</h4>
          ${project.results.metrics ? `<p><strong>Metrics:</strong> ${project.results.metrics}</p>` : ''}
          ${project.results.impact ? `<p><strong>Impact:</strong> ${project.results.impact}</p>` : ''}
          ${project.results.learnings ? `<p><strong>Key Learnings:</strong> ${project.results.learnings}</p>` : ''}
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
        <p class="modal-description">${project.description}</p>
      </div>

      ${caseStudyHTML}

      <div class="modal-section">
        <h4>🛠️ Technologies Used</h4>
        <div class="tech-icons">
          ${techHTML}
        </div>
      </div>

      <div class="modal-section">
        <h4>🔗 Links</h4>
        ${linksHTML}
      </div>

      ${imagesHTML}
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

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

  const readMoreButtons = document.querySelectorAll('.read-more-btn');
  readMoreButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const projectId = button.getAttribute('data-project-id');
      openModal(projectId);
    });
  });

  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    card.addEventListener('click', function(e) {
      if (e.target.closest('a')) return;
      if (e.target.closest('.read-more-btn')) return;

      const projectId = card.getAttribute('data-project-id');
      if (projectId) {
        openModal(projectId);
      }
    });

    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const projectId = card.getAttribute('data-project-id');
        if (projectId) {
          openModal(projectId);
        }
      }
    });
  });
}
