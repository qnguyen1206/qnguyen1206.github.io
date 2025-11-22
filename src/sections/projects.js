export function initProjects() {
  const projects = document.getElementById('projects');

  // Project data
  // To add images to a project, include an 'images' array with objects containing:
  // - src: path to the image file
  // - alt: alternative text for accessibility (optional)
  // - caption: text to display below the image (optional)
  // Example:
  // images: [
  //   { src: 'images/project-screenshot1.png', alt: 'Description', caption: 'Caption text' },
  //   { src: 'images/project-screenshot2.png', alt: 'Description', caption: 'Caption text' }
  // ]
  const projectsData = [
    // RELEASE STATUS
    {
      id: 'todo-app',
      title: 'TO DO App',
      category: 'App Development',
      image: 'images/clipboard.png',
      description: 'A simple gamified to-do list app with DeepSeek-R1 14B param local AI integrated for personal use.',
      tags: ['Python', 'DeepSeek'],
      status: 'release',
      githubLink: 'https://github.com/Kairu1206/todoapp',
      externalLink: 'https://github.com/Kairu1206/todoapp',
      images: [
        // Example images - replace with your actual image paths
        // { src: 'images/todo-app-screenshot1.png', alt: 'TO DO App Main Interface', caption: 'Main task management interface' },
        // { src: 'images/todo-app-screenshot2.png', alt: 'TO DO App AI Integration', caption: 'AI-powered task suggestions' },
        // { src: 'images/todo-app-screenshot3.png', alt: 'TO DO App Gamification', caption: 'Gamified experience with rewards' }
        { src: 'images/todo-app-screenshot1.png', alt: 'Screenshot1', caption: '' },
        { src: 'images/todo-app-screenshot2.png', alt: 'Screenshot2', caption: '' },
        { src: 'images/todo-app-screenshot3.png', alt: 'Screenshot3', caption: '' },
        { src: 'images/todo-app-screenshot4.png', alt: 'Screenshot4', caption: '' },
        { src: 'images/todo-app-screenshot5.png', alt: 'Screenshot5', caption: '' },
      ]
    },
    {
      id: 'rock-open-game',
      title: 'Rock Open Game',
      category: 'Game Development',
      image: 'images/webrockgameicon.png',
      description: 'A personal project to bring a high school project to a web game.',
      tags: ['HTML', 'CSS', 'JavaScript', 'React', 'NodeJS', 'Firebase'],
      status: 'release',
      githubLink: 'https://github.com/qnguyen1206/RockOpenGameWeb',
      externalLink: 'https://rockopengameweb.web.app/'
    },
    // BETA STATUS
    {
      id: 'kart-tech-racing',
      title: 'Kart: The Tech Filled Racing Game',
      category: 'Game Development',
      image: 'images/KartIcon.png',
      description: 'A multiplayer racing game where cars and technology meet, designed using Godot and Steamworks.',
      tags: ['Godot', 'Steamworks', 'GitLab'],
      status: 'beta',
      gitlabLink: '',
      externalLink: 'https://store.steampowered.com/app/2165230/Kart_The_Tech_Filled_Racing_Game/'
    },
    // COMPLETE STATUS
    {
      id: 'gamify-saving-app',
      title: 'Gamify Saving App',
      category: 'App Development',
      image: 'images/inqnity_banking_image.png',
      description: 'A gamified saving app to make saving easier and more fun.',
      tags: ['HTML', 'CSS', 'JavaScript', 'React', 'NodeJS', 'Firebase'],
      status: 'complete'
    },
    {
      id: 'wander-sync-app',
      title: 'WanderSync App',
      category: 'App Development',
      image: 'images/AndroidStudioIcon.png',
      description: 'A course project using Java and Firebase to learn about Agile and Sprint methodology.',
      tags: ['Java', 'Firebase', 'Android Studio', 'GitHub'],
      status: 'complete',
      githubLink: 'https://github.com/Kairu1206/CS2340D_Team26'
    },
    {
      id: 'tower-offense-game',
      title: 'Tower Offense Game',
      category: 'Game Development',
      image: 'images/Castle.png',
      description: 'A course project using Unity and C# to create a 2D tower offense game.',
      tags: ['Unity', 'C#', 'GitHub'],
      status: 'complete',
      externalLink: 'https://kairu1206.itch.io/tower-offense-game'
    },
    {
      id: 'stella-in-space',
      title: 'Stella In Space',
      category: 'Game Development',
      image: 'images/stellaInSpaceIcon.png',
      description: 'A course project using Unity and C# to create a 2D platformer game.',
      tags: ['Unity', 'C#', 'GitHub'],
      status: 'complete',
      externalLink: 'https://kairu1206.itch.io/stella-in-space'
    },
    {
      id: 'what-yours-is-mime',
      title: 'What Yours is Mime',
      category: 'Game Development',
      image: 'images/WYiMIcon.png',
      description: 'A 2.5D bullet-hell game where players battle through a kingdom\'s dungeon as a jester.',
      tags: ['Unity', 'C#', 'GitHub'],
      status: 'complete',
      externalLink: 'https://jhaboon.itch.io/wyim'
    },
    {
      id: 'gastropoda',
      title: 'Gastropoda',
      category: 'Game Development',
      image: 'images/GastropodaIcon.png',
      description: 'A 2D platformer game where players escape from a mutant snail that broke out from the lab.',
      tags: ['Unity', 'C#', 'GitHub'],
      status: 'complete',
      externalLink: 'https://jhaboon.itch.io/gastropoda-v115'
    },
    {
      id: 'customer-service-app',
      title: 'Customer Service App',
      category: 'App Development',
      image: 'images/ndaAppIcon.png',
      description: 'A customer service app providing connection between customers, employees, and company services.',
      tags: ['C#', 'PHP', 'MySQL', 'PHPMyAdmin'],
      status: 'complete'
    },
    {
      id: 'chatbot-project',
      title: 'ChatBot Project',
      category: 'Web Development',
      image: 'images/ChatGPTIcon.png',
      description: 'A course project using ChatGPT APIs to create a chatbot with personality.',
      tags: ['HTML', 'CSS', 'JavaScript', 'ChatGPT'],
      status: 'complete',
      githubLink: 'https://github.com/Kairu1206/chatbot'
    },
    {
      id: 'aframe-project',
      title: 'Aframe Project',
      category: 'Web Development',
      image: 'images/AframeIcon.png',
      description: 'A course project using Aframe to display 3D objects on a website.',
      tags: ['HTML', 'CSS', 'Aframe'],
      status: 'complete',
      githubLink: 'https://github.com/Kairu1206/aframe-remix'
    },
    {
      id: 'gba-game-project',
      title: 'GBA Game Project',
      category: 'Game Development',
      image: 'images/GameBoyIcon.png',
      description: 'A course project creating a simple game for GameBoy Advance.',
      tags: ['C'],
      status: 'complete',
      githubLink: 'https://github.com/Kairu1206/CS2110'
    },
    // IN DEVELOPMENT STATUS
    {
      id: 'infinity-mythical-hunt',
      title: 'Infinity: Mythical Hunt',
      category: 'Game Development',
      image: 'images/InQnityIcon.png',
      description: 'A co-op game where players immerse in the world of mythical creatures with real-world folklores and fantasies.',
      tags: ['Godot', 'Steamworks', 'GitLab'],
      status: 'in development',
      gitlabLink: 'https://gitlab.com/infinity-mythical-hunt'
    },
    // ON HOLD STATUS
    {
      id: 'pwnagotchi-implementation',
      title: 'Pwnagotchi Implementation',
      category: 'Cybersecurity',
      image: 'images/pwnagotchiIcon.png',
      description: 'A custom implementation of Pwnagotchi for WiFi security research and analysis.',
      tags: ['Python', 'Raspberry Pi'],
      status: 'on hold'
    },
    {
      id: 'rf-security-analysis-tool',
      title: 'Radio Frequency Emulator',
      category: 'Cybersecurity',
      image: 'images/flipperzeroIcon.png',
      description: 'A research project exploring radio frequency security and emulator using Flipper Zero.',
      tags: ['Python', 'Flipper Zero'],
      status: 'on hold'
    },
    {
      id: 'web-security-vulnerabilities',
      title: 'Common Web Security Vulnerabilities',
      category: 'Cybersecurity',
      image: 'images/webIcon.png',
      description: 'A study of common web security vulnerabilities and prevention techniques.',
      tags: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
      status: 'on hold'
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

  // Create modal outside of the projects section to avoid parallax issues
  const modalHTML = `
    <div class="project-modal-overlay" id="projectModal">
      <div class="project-modal-content">
        <button class="project-modal-close" id="closeModal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div class="project-modal-body" id="modalBody">
          <!-- Content will be dynamically inserted here -->
        </div>
      </div>
    </div>
  `;

  // Append modal directly to body to avoid transform issues
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Add a mapping of technologies to their icon information
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
    'alpha': { color: '#e53935', label: 'Alpha' },               // Red
    'beta': { color: '#ffd600', label: 'Beta' },                 // Yellow
    'release': { color: '#43a047', label: 'Release' },           // Green
    'in development': { color: '#8e24aa', label: 'In Dev' },     // Purple
    'on hold': { color: '#999999', label: 'On Hold' },           // Black
    'complete': { color: '#2196f3', label: 'Complete' }          // Blue
  };
  
  // Generate HTML
  if (!projects) {
    return;
  }

  // Add section visibility class
  projects.classList.add('section-visible');
  
  // Generate the project cards and append to the grid
  const projectsGrid = projects.querySelector('.projects-grid');
  projectsGrid.innerHTML = projectsData.map((project) => `
          <div class="project-card" data-category="${project.category}">
            <div class="project-card-inner">
              <!-- Front Side -->
              <div class="project-card-front">
                <div class="project-image">
                  <img data-src="${project.image}" alt="${project.title}" loading="lazy">
                  ${project.status ? `
                    <div class="status-overlay" style="background-color:${statusTags[project.status].color};">
                      ${statusTags[project.status].label}
                    </div>
                  ` : ''}
                </div>
                <div class="project-info">
                  <h3>${project.title}</h3>
                  <p class="project-category">${project.category}</p>
                  <p class="project-description">${project.description}</p>
                </div>
              </div>
              <!-- Back Side -->
              <div class="project-card-back">
                <h3 class="project-back-title">${project.title}</h3>
                <div class="project-links-back">
                  <button class="project-link-btn ${project.githubLink || project.gitlabLink ? 'enabled' : 'disabled'}"
                          ${project.githubLink || project.gitlabLink ? `onclick="window.open('${project.githubLink || project.gitlabLink}', '_blank')"` : ''}>
                    ${project.gitlabLink ? `
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.548 12.276l-2.055-6.32a.763.763 0 0 0-1.453-.062l-1.72 5.17H6.68l-1.72-5.17a.763.763 0 0 0-1.452.062l-2.056 6.32a1.154 1.154 0 0 0 .408 1.27l9.616 7.212a.764.764 0 0 0 .91 0l9.615-7.213a1.154 1.154 0 0 0 .407-1.27z"/>
                      </svg>
                      GitLab
                    ` : `
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      GitHub
                    `}
                  </button>
                  <button class="project-link-btn ${project.externalLink ? 'enabled' : 'disabled'}"
                          ${project.externalLink ? `onclick="window.open('${project.externalLink}', '_blank')"` : ''}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15,3 21,3 21,9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                    Open
                  </button>
                  <button class="read-more-btn" data-project-id="${project.id}">
                    Read More
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="9,18 15,12 9,6"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        `).join('');

  // Modal functionality
  const modal = document.getElementById('projectModal');
  const modalBody = document.getElementById('modalBody');
  const closeModalBtn = document.getElementById('closeModal');

  if (!modal || !modalBody || !closeModalBtn) {
    return;
  }

  function openModal(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    if (!project) {
      return;
    }

    // Generate status badge HTML
    const statusInfo = statusTags[project.status.toLowerCase()] || statusTags['in development'];
    const statusBadgeHTML = `
      <span class="project-status-badge" style="background-color: ${statusInfo.color};">
        ${statusInfo.label}
      </span>
    `;

    // Generate technologies HTML
    const techHTML = project.tags.map(tag => {
      const icon = techIcons[tag];
      return icon ? `
        <div class="project-tech-item">
          <img src="${icon.src}" width="${icon.width}" height="${icon.height}" alt="${tag}" title="${tag}">
          <span>${tag}</span>
        </div>
      ` : `<span class="project-tag">${tag}</span>`;
    }).join('');

    // Generate links HTML
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

    // Generate images gallery HTML if images exist
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

    // Populate modal with project data
    modalBody.innerHTML = `
      <div class="project-modal-header">
        <h2 class="project-modal-title">${project.title}</h2>
        <div style="display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-4);">
          <p class="project-modal-category">${project.category}</p>
          ${statusBadgeHTML}
        </div>
        <p class="project-modal-description">${project.description}</p>
      </div>

      <div class="project-modal-tech">
        <h3>Technologies Used</h3>
        <div class="project-tech-list">
          ${techHTML}
        </div>
      </div>

      ${linksHTML}

      ${imagesHTML}
    `;

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
  }

  // Close modal on close button click
  closeModalBtn.addEventListener('click', closeModal);

  // Close modal on overlay click (outside content)
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Open modal with Read More button
  const readMoreButtons = document.querySelectorAll('.read-more-btn');
  readMoreButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent card flip on button click
      const projectId = button.getAttribute('data-project-id');
      openModal(projectId);
    });
  });
}
