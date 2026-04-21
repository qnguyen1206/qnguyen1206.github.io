import { trackProjectView } from '../utils/analytics.js';

export function initProjects() {
  const projects = document.getElementById('projects');
  if (!projects) return;

  const PROJECTS_PER_PAGE = 6;
  let currentPage = 1;

  /*
   * =====================================================
   * PROJECT DATA STRUCTURE
   * =====================================================
   * 
   * REQUIRED FIELDS:
   *   id: 'unique-id'              → Unique identifier (used internally)
   *   title: 'Project Name'        → Display title
   *   category: 'Game Development' → Category label
   *   tags: ['Tag1', 'Tag2']       → Technology/skill tags
   * 
   * OPTIONAL FIELDS:
   *   image: 'images/icon.jpg'     → Card thumbnail image
   *   description: 'Text...'       → Short description (first line shows on card)
   *   status: 'release'            → Project status badge
   *   role: 'Developer'            → Your role in the project
   *   teamSize: '5'                → Number of team members
   *   duration: '2 years'          → Project timeline
   *   githubLink: 'url'            → GitHub repository URL
   *   gitlabLink: 'url'            → GitLab repository URL
   *   externalLink: 'url'          → Live project/demo URL
   *   hidden: true                 → Hide project from display
   *   images: [                    → Gallery images for modal
   *     { src: 'path.png', alt: 'Description', caption: 'Optional caption' }
   *   ]
   *   writeup: `...`               → Detailed writeup of what you did
   * 
   * STATUS OPTIONS:
   *   'alpha'          → Red badge
   *   'beta'           → Yellow badge
   *   'mvp'            → Cyan badge
   *   'release'        → Green badge
   *   'in development' → Purple badge
   *   'on hold'        → Orange badge
   *   'complete'       → Blue badge
   * 
   * WRITEUP FORMATTING:
   *   ## Header        → Section header
   *   ### Subheader    → Subsection header
   *   **bold**         → Bold text
   *   *italic*         → Italic text
   *   `code`           → Inline code
   *   - item           → Bullet list
   *   1. item          → Numbered list
   *   (blank line)     → New paragraph
   * 
   * =====================================================
   */

  const projectsData = [
    {
      id: 'biophilia',
      title: 'Biophilia',
      category: '',
      image: '',
      description: '',
      tags: [],
      status: '',
      role: '',
      teamSize: '',
      duration: '',
      githubLink: '',
      gitlabLink: '',
      externalLink: '',
      images: [],
      writeup: ``,
      hidden: true,
    },
    {
      id: 'kart-tech-racing',
      title: 'Kart: The Tech Filled Racing Game',
      category: 'Game Development',
      image: 'images/KartIcon.jpg',
      description: 'A multiplayer racing game where cars and technology meet, designed using Godot and Steamworks.',
      tags: ['Godot', 'GDScript', 'Steamworks', 'GitLab', 'Krita', 'Blender', 'MS Paint'],
      status: 'beta',
      role: 'Lead Programmer, Gameplay Designer, UI/UX Designer, Artist, Technical Editor',
      teamSize: '3',
      duration: '5 years (2020 - Present)',
      gitlabLink: '',
      externalLink: 'https://store.steampowered.com/app/2165230/Kart_The_Tech_Filled_Racing_Game/',
      images: [
        { src: 'images/kart-tech-racing/kart_screenshot1.png', alt: 'Kart: The Tech Filled Racing Game Screenshot 1' },
        { src: 'images/kart-tech-racing/kart_screenshot2.png', alt: 'Kart: The Tech Filled Racing Game Screenshot 2' },
        { src: 'images/kart-tech-racing/kart_screenshot3.png', alt: 'Kart: The Tech Filled Racing Game Screenshot 3' },
        { src: 'images/kart-tech-racing/artist_cred.png', alt: 'Artist Credit' },
        { src: 'images/kart-tech-racing/designer_cred.png', alt: 'Designer Credit' },
        { src: 'images/kart-tech-racing/programmer_cred.png', alt: 'Programmer Credit' },
        { src: 'images/kart-tech-racing/quang_cred.png', alt: 'Quang Credit' },
        { src: 'images/kart-tech-racing/technical_editor.png', alt: 'Technical Editor Credit' }
      ],
      writeup: `
## Lead Programmer
- Design and implemented P2P multiplayer system including lobby, in-game chat, and leaderboard using Steamworks' API and GodotSteam built-in functions.
- Programmed gameplay logic, karts physics and ability system.
- Design and implemented persistent save system using custom scripts.
- Reviewed and solved merge conflicts using GitHub desktop.

## Gameplay Designer
- Designed and balanced abilities for each kart.
- Designed map layout and environment.

## UI/UX Designer
- Designed and implemented settings menu, pause menu, and in-game UI.
- Established UI typography, layout and visual consistency across the game.
- Designed and implemented start screen, lobby screen, and end screen UI.
- Enhanced user experience by adding particles effects.

## Artist
- Created game arts including karts abilities icons, tabs icons and buttons UI.

## Technical Editor
- Maintained the game's design documented.
`,
    },
    {
      id: 'turnover',
      title: 'TurnOver',
      category: 'App Development',
      image: 'images/Turnover-Logo.jpg',
      description: 'A web app that allow the coaches and athletes to track and analyze their performance through video analysis using computer vision.',
      tags: ["HTML", "CSS", "JavaScript", "React", "Vite", "MongoDB", "Express", "Cloudinary", "Python", "Flask", "YOLO"],
      status: 'MVP',
      role: 'Co-Founder, Developer, Designer',
      teamSize: '4',
      duration: '6 months (2025 - Present)',
      githubLink: 'https://github.com/qnguyen1206/cs4803',
      externalLink: 'https://cs4803-eight.vercel.app/',
      images: [],
      writeup: `
## Co-Founder
- Initiated the project idea
- Conducted market research to validate the idea.

## Developer
- Implemented user authentication and authorization using JSON Web Tokens (JWT).
- Implemented video upload and storage using Cloudinary.
- Implemented video analysis using YOLO object detection model.

## Designer
- Designed and implemented the app's UI/UX.
- Created the app's logo and branding.

For more information about the design process, please visit the <a href="javascript:void(0)" onclick="window.openBlogPost('turnover-design-process')" style="color: var(--primary); text-decoration: underline; cursor: pointer;">design process page</a>.
`
    },
    {
      id: 'window-washing-game',
      title: 'Window Washing Game',
      category: 'Game Development',
      image: 'images/windowWashingIcon.png',
      description: 'A party co-op game where players work together to clean the windows.',
      tags: ['Unity', 'C#', 'GitHub', 'Figma', 'Trello'],
      status: 'in development',
      role: 'Programmer, System Designer, UI/UX Designer',
      teamSize: '6',
      duration: '3 months (2026 - Present)',
      githubLink: '',
      externalLink: '',
      images: [],
      writeup: `
## Programmer
- Implemented game's mechanics and logic.
- Implemented game's online multiplayer using PurrNet.
- Resolving merge conflicts

## System Designer
- Designed game's system architecture.
- Designed game's data model.

## UI/UX Designer
- Designed lobby's UI including players cards.

For MDM, please visit the <a href="javascript:void(0)" onclick="window.openBlogPost('window-washing-game-mdm')" style="color: var(--primary); text-decoration: underline; cursor: pointer;">writeup page</a>.
`
    },
    {
      id: 'escape-from-team-rocket',
      title: 'Escape from Team Rocket',
      category: 'Game Development',
      image: '',
      description: '',
      tags: ['Unity', 'C#', 'GitHub'],
      status: 'in development',
      role: '',
      teamSize: '3',
      duration: '5 months (Jan 2026 - May 2026)',
      githubLink: '',
      gitlabLink: '',
      externalLink: '',
      images: [],
      writeup: ``,
      hidden: true,
    },
    {
      id: 'redesign-ebay',
      title: 'Redesign Ebay',
      category: 'App Development',
      image: '',
      description: '',
      tags: [],
      status: 'in development',
      role: '',
      teamSize: '4',
      duration: '5 months (Jan 2026 - May 2026)',
      githubLink: '',
      gitlabLink: '',
      externalLink: '',
      images: [],
      writeup: ``,
      hidden: true,
    },
    {
      id: 'todo-app',
      title: 'TO DO App',
      category: 'App Development',
      image: 'images/clipboard.png',
      description: 'A gamified to-do list app with DeepSeek-R1 14B param local AI integrated for personal use.',
      tags: ['Python', 'Tkinter', 'MySQL'],
      status: 'release',
      role: 'Solo Developer',
      duration: '1 year (2025 - Present)',
      githubLink: 'https://github.com/Kairu1206/todoapp',
      externalLink: 'https://github.com/Kairu1206/todoapp',
      images: [
        { src: 'images/todoapp/todo-app-screenshot1.png', alt: 'TO DO App Screenshot 1' },
        { src: 'images/todoapp/todo-app-screenshot2.png', alt: 'TO DO App Screenshot 2' },
        { src: 'images/todoapp/todo-app-screenshot3.png', alt: 'TO DO App Screenshot 3' },
        { src: 'images/todoapp/todo-app-screenshot4.png', alt: 'TO DO App Screenshot 4' },
        { src: 'images/todoapp/todo-app-screenshot5.png', alt: 'TO DO App Screenshot 5' },
      ], 
      writeup: `
For more information, please visit the <a href="javascript:void(0)" onclick="window.openBlogPost('todo-app')" style="color: var(--primary); text-decoration: underline; cursor: pointer;">writeup page</a>.
`
    },
    {
      id: 'rock-open-game',
      title: 'Rock Open Game',
      category: 'Game Development',
      image: 'images/webrockgameicon.png',
      description: 'A browser-based multiplayer game reimagining a high school project with modern web technologies.\n I started this project because I want to learn HTML, CSS, and JavaScript. In addition, I want to learn more about React, NodeJS, and Tailwind CSS. Moreover, I learn how hosting a website on Firebase and learn how to secure it.',
      tags: ['JavaScript', 'React', 'Firebase', 'NodeJS'],
      status: 'release',
      role: 'Solo Developer',
      duration: '9 months (2025)',
      githubLink: 'https://github.com/qnguyen1206/RockOpenGameWeb',
      externalLink: 'https://rockopengameweb.web.app/',
      images: [
        { src: 'images/rock-open-game/rock_open_game_screenshot1.png', alt: 'Rock Open Game Screenshot 1' },
        { src: 'images/rock-open-game/rock_open_game_screenshot2.png', alt: 'Rock Open Game Screenshot 2' },
        { src: 'images/rock-open-game/rock_open_game_screenshot3.png', alt: 'Rock Open Game Screenshot 3' },
        { src: 'images/rock-open-game/rock_open_game_screenshot4.png', alt: 'Rock Open Game Screenshot 4' }
      ]
    },
    {
      id: 'infinity-mythical-hunt',
      title: 'Mythical Hunt',
      category: 'Game Development',
      image: 'images/InQnityIcon.png',
      description: 'A co-op game where players immerse in the world of mythical creatures with real-world folklores and fantasies.',
      tags: ['Godot', 'GDScript', 'Steamworks', 'GitLab'],
      status: 'in development',
      role: 'Sole Developer',
      duration: '5 years (2021 - Present)',
      gitlabLink: 'https://gitlab.com/infinity-mythical-hunt',
      images: [],
      writeup: `
For more information about Game Design Docs (GDD), please visit this <a href="https://docs.google.com/document/d/1UJy3OC_YYUjv-iYgKN2nyl05vAzpec3FY6-ygIBCkA4/edit?usp=sharing">link</a>.
`,
    },
    {
      id: 'what-yours-is-mime',
      title: 'What Yours is Mime',
      category: 'Game Development',
      image: 'images/WYiMIcon.png',
      description: 'A 2.5D bullet-hell game where players battle through a kingdom\'s dungeon as a jester.\n This is a club project for Georigia State Panther Dev Club where I was tasked to program the game\'s enemy logic and implement the game\'s instruction system. I learned how to use Unity, C#, and Unity Plastic SCM to build and mantain the game.',
      tags: ['Unity', 'C#', 'Unity Plastic SCM', 'GitHub'],
      status: 'release',
      role: 'Programmer',
      teamSize: '16',
      duration: '4 months (Jan 2023 - April 2023)',
      externalLink: 'https://jhaboon.itch.io/wyim',
      images: [
        { src: 'images/wyim/wyim_screenshot1.png', alt: 'What Yours is Mime Screenshot 1' },
        { src: 'images/wyim/wyim_screenshot2.png', alt: 'What Yours is Mime Screenshot 2' },
        { src: 'images/wyim/wyim_screenshot3.png', alt: 'What Yours is Mime Screenshot 3' }
      ],
      writeup: `
## Programmer
- Implemented player movement and attack logic using C#.
- Implemented the game's instruction system using C#.
`
    },
    {
      id: 'gastropoda',
      title: 'Gastropoda',
      category: 'Game Development',
      image: 'images/GastropodaIcon.png',
      description: 'A 2D platformer game where players have to escape from a giant snail.',
      tags: ['Unity', 'C#', 'GitHub'],
      status: 'release',
      role: 'Programmer',
      teamSize: '18',
      duration: '4 months (Aug 2022 - Dec 2022)',
      githubLink: 'https://github.com/aimbesi1/gastropoda',
      externalLink: 'https://jhaboon.itch.io/gastropoda-v115',
      images: [],
      writeup: `
## Programmer
- Implemented player movement and physical interactions using C#.
- Implemented items interactions using C#.
`
    },
    {
      id: 'wander-sync-app',
      title: 'WanderSync App',
      category: 'App Development',
      image: 'images/AndroidStudioIcon.png',
      description: 'A collaborative travel planning app built using Agile methodology.\nThis is a course project for CS 2340 at Georgia Tech. We learn how Agile methodology works and how to build an app using Android Studio and Firebase. In addition, we also learn how to use SonarQube to analyze our code quality. We also learn how to create unit tests and how to use JUnit to test our code.',
      tags: ['Java', 'Firebase', 'Android Studio', 'GitHub'],
      status: 'complete',
      role: 'Backend Programmer',
      teamSize: '6',
      duration: '4 months (Aug 2023 - Dec 2023)',
      githubLink: 'https://github.com/Kairu1206/CS2340D_Team26',
      images: [],
      writeup: `
## Backend Programmer
- Implemented user authentication and authorization using Firebase Authentication and Security Rules.
- Implemented user profile management and travel plan creation/editing/deletion using Firebase Realtime Database.
- Implemented unit tests for backend functionality using JUnit.
- Analyzed code quality using SonarQube and fixed reported issues.
`,
    },
    {
      id: 'gallery',
      title: 'Gallery',
      category: '',
      image: 'images/gallery/draw_1.png',
      description: 'A collection of my drawings and photos.',
      tags: [],
      status: '',
      role: '',
      duration: '',
      githubLink: '',
      externalLink: '',
      images: [
        { src: 'images/gallery/draw_1.png', alt: 'Gallery Image 1' },
        { src: 'images/gallery/draw_2.png', alt: 'Gallery Image 2' },
        { src: 'images/gallery/draw_4.png', alt: 'Gallery Image 4' },
        { src: 'images/gallery/draw_5.png', alt: 'Gallery Image 5' },
        { src: 'images/gallery/draw_6.png', alt: 'Gallery Image 6' },
        { src: 'images/gallery/draw_7.png', alt: 'Gallery Image 7' },
        { src: 'images/gallery/draw_8.png', alt: 'Gallery Image 8' },
        { src: 'images/gallery/draw_9.png', alt: 'Gallery Image 9' },
        { src: 'images/gallery/digital_0.png', alt: 'Gallery Image 10' },
        { src: 'images/gallery/digital_1.png', alt: 'Gallery Image 11' },
        { src: 'images/gallery/digital_2.png', alt: 'Gallery Image 12' },
        { src: 'images/gallery/photo_0.png', alt: 'Gallery Image 13' },
        { src: 'images/gallery/photo_1.png', alt: 'Gallery Image 14' },
        { src: 'images/gallery/photo_2.png', alt: 'Gallery Image 15' },
        { src: 'images/gallery/photo_3.png', alt: 'Gallery Image 16' },
        { src: 'images/gallery/photo_4.png', alt: 'Gallery Image 17' },
        { src: 'images/gallery/photo_6.png', alt: 'Gallery Image 19' },
        { src: 'images/gallery/photo_7.png', alt: 'Gallery Image 20' },
        { src: 'images/gallery/photo_8.png', alt: 'Gallery Image 21' },
        { src: 'images/gallery/photo_9.png', alt: 'Gallery Image 22' },
        { src: 'images/gallery/photo_10.png', alt: 'Gallery Image 23' },
        { src: 'images/gallery/photo_11.png', alt: 'Gallery Image 24' },
        { src: 'images/gallery/photo_12.png', alt: 'Gallery Image 25' },
        { src: 'images/gallery/photo_13.png', alt: 'Gallery Image 26' },
        { src: 'images/gallery/photo_14.png', alt: 'Gallery Image 27' },
        { src: 'images/gallery/photo_15.png', alt: 'Gallery Image 28' },
        { src: 'images/gallery/photo_16.png', alt: 'Gallery Image 29' },
        { src: 'images/gallery/photo_17.png', alt: 'Gallery Image 30' },
        { src: 'images/gallery/photo_18.png', alt: 'Gallery Image 31' },
        { src: 'images/gallery/photo_19.png', alt: 'Gallery Image 32' },
        { src: 'images/gallery/photo_20.png', alt: 'Gallery Image 33' },
      ]
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
      
      <div class="projects-pagination" id="projectsPagination"></div>
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

  // Render pagination controls
  function renderPagination(totalProjects, currentPage) {
    const totalPages = Math.ceil(totalProjects / PROJECTS_PER_PAGE);
    
    if (totalPages <= 1) return '';

    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `<button class="pagination-btn pagination-prev ${currentPage === 1 ? 'disabled' : ''}" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}>← Prev</button>`;
    
    // Page numbers
    paginationHTML += '<div class="pagination-numbers">';
    
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      paginationHTML += `<button class="pagination-btn pagination-num" data-page="1">1</button>`;
      if (startPage > 2) {
        paginationHTML += `<span class="pagination-ellipsis">...</span>`;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      paginationHTML += `<button class="pagination-btn pagination-num ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        paginationHTML += `<span class="pagination-ellipsis">...</span>`;
      }
      paginationHTML += `<button class="pagination-btn pagination-num" data-page="${totalPages}">${totalPages}</button>`;
    }

    paginationHTML += '</div>';
    
    // Next button
    paginationHTML += `<button class="pagination-btn pagination-next ${currentPage === totalPages ? 'disabled' : ''}" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}>Next →</button>`;
    
    return paginationHTML;
  }

  // Render project cards for current page
  function renderProjectCards(projectsList, page) {
    const startIndex = (page - 1) * PROJECTS_PER_PAGE;
    const endIndex = startIndex + PROJECTS_PER_PAGE;
    const paginatedProjects = projectsList.slice(startIndex, endIndex);

    return paginatedProjects.map((project) => `
    <article class="project-card" tabindex="0" data-category="${project.category}" data-project-id="${project.id}" aria-labelledby="proj-${project.id}-title">
      ${project.status ? `
        <div class="status-badge status-${project.status.toLowerCase().replace(/\s+/g, '-')}">${statusTags[project.status.toLowerCase()].label}</div>
      ` : ''}

      <div class="thumb-wrap" aria-hidden="true">
        <img class="thumb" data-src="${project.image}" alt="${project.title} thumbnail" loading="lazy">
        <div class="scanline" aria-hidden="true"></div>
        <div class="pixel-shake" aria-hidden="true"></div>
      </div>

      <div class="card-content">
        <h3 id="proj-${project.id}-title" class="card-title">${project.title}</h3>
        <div class="card-subtitle">${project.category}</div>
        
        ${project.description ? `<p class="card-description">${project.description.split('\n')[0]}</p>` : ''}

        <div class="card-tags">
          ${project.tags.slice(0, 4).map(tag => `<span class="card-tag">${tag}</span>`).join('')}
          ${project.tags.length > 4 ? `<span class="card-tag-more">+${project.tags.length - 4}</span>` : ''}
        </div>

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
                  <polyline points="15,3 21,3 21,9"></polyline>
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
  }

  // Update the view with cards and pagination
  function updateProjectsView() {
    const projectsGrid = projects.querySelector('#projectsGrid');
    const paginationContainer = projects.querySelector('#projectsPagination');
    
    // Update cards
    projectsGrid.innerHTML = renderProjectCards(visibleProjects, currentPage);
    
    // Update pagination
    paginationContainer.innerHTML = renderPagination(visibleProjects.length, currentPage);
    
    // Re-attach event listeners
    attachCardListeners();
    attachPaginationListeners();
    
    // Lazy load images
    lazyLoadImages();
  }

  // Lazy load images for current page
  function lazyLoadImages() {
    const images = projects.querySelectorAll('.thumb[data-src]');
    images.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
    });
  }

  // Attach pagination listeners
  function attachPaginationListeners() {
    const paginationBtns = projects.querySelectorAll('.pagination-btn:not(.disabled)');
    paginationBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const page = parseInt(btn.dataset.page);
        if (page !== currentPage) {
          currentPage = page;
          updateProjectsView();
          projects.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // Attach card event listeners
  function attachCardListeners() {
    const cards = projects.querySelectorAll('.project-card');
    const readMoreButtons = projects.querySelectorAll('.read-more-btn');

    readMoreButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const projectId = button.getAttribute('data-project-id');
        openModal(projectId);
      });
    });

    cards.forEach(card => {
      // 3D tilt effect on mouse move
      card.addEventListener('mousemove', function(e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
      });
      
      card.addEventListener('mouseleave', function() {
        card.style.transform = '';
      });

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

  const projectsGrid = projects.querySelector('.projects-grid');

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

    let imagesHTML = '';
    if (project.images && project.images.length > 0) {
      imagesHTML = `
        <div class="project-modal-images">
          <div class="project-images-masonry">
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

      ${caseStudyHTML}

      ${writeupHTML}

      ${linksHTML}

      ${imagesHTML}
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Track project view in Google Analytics
    trackProjectView(project.id, project.title);
  }

  function closeModal() {
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

  // Initial render
  updateProjectsView();
}
