export function initProjects() {
  const projects = document.getElementById('projects');

  // Project data
  const projectsData = [
    {
      id: 'kart-tech-racing',
      title: 'Kart: A Tech Filled Racing Game',
      category: 'Game Development',
      image: 'images/KartIcon.png',
      description: 'A multiplayer racing game where cars and technology meet, designed using Godot and Steamworks.',
      tags: ['GDscript', 'GodotSteam', 'GitLab', 'Steamworks'],
      fullDescription: `
        <h3>Overview</h3>
        <p>A multiplayer racing game where cars and technology meet, designed using Godot and Steamworks.</p>
        
        <h3>Key Features</h3>
        <ul>
          <li>Multiplayer racing</li>
          <li>Advanced physics and mechanics</li>
          <li>Steamworks integration</li>
        </ul>
        
        <h3>Technical Details</h3>
        <p>Developed using Godot with GDscript and Steamworks integration. Managed with GitLab for version control.</p>
      `
    },
    {
      id: 'infinity-mythical-hunt',
      title: 'Infinity: Mythical Hunt',
      category: 'Game Development',
      image: 'images/InQnityIcon.png',
      description: 'A co-op game where players immerse in the world of mythical creatures with real-world folklores and fantasies.',
      tags: ['GDscript', 'GodotSteam', 'GitLab', 'Steamworks'],
      fullDescription: `
        <h3>Overview</h3>
        <p>A co-op game where players immerse in the world of mythical creatures with real-world folklores and fantasies.</p>
        
        <h3>Key Features</h3>
        <ul>
          <li>Co-op gameplay</li>
          <li>Mythical creature encounters</li>
          <li>Rich storytelling</li>
        </ul>
        
        <h3>Technical Details</h3>
        <p>Built using Godot with GDscript and Steamworks integration. Managed with GitLab for version control.</p>
      `
    },
    {
      id: 'todo-app',
      title: 'TO DO App',
      category: 'App Development',
      image: 'images/clipboard.png',
      description: 'A simple gamified to-do list app with DeepSeek-R1 14B param local AI integrated for personal use.',
      tags: ['Python', 'Tkinter', 'PrettyTable', 'PyInstaller'],
      fullDescription: `
        <h3>Overview</h3>
        <p>A simple gamified to-do list app with DeepSeek-R1 14B param local AI integrated for personal use.</p>
        
        <h3>Key Features</h3>
        <ul>
          <li>Task management</li>
          <li>AI integration</li>
          <li>Gamified experience</li>
        </ul>
        
        <h3>Technical Details</h3>
        <p>Developed using Python with Tkinter for the GUI and DeepSeek-R1 for AI integration.</p>
      `
    },
    {
      id: 'gamify-saving-app',
      title: 'Gamify Saving App',
      category: 'App Development',
      image: 'images/inqnity_banking_image.png',
      description: 'A gamified saving app to make saving easier and more fun.',
      tags: ['HTML', 'CSS', 'JavaScript', 'React', 'NodeJS', 'Firebase'],
      fullDescription: `
        <h3>Overview</h3>
        <p>A gamified saving app to make saving easier and more fun.</p>
        
        <h3>Key Features</h3>
        <ul>
          <li>Interactive saving goals</li>
          <li>Gamified user experience</li>
          <li>Responsive design</li>
        </ul>
        
        <h3>Technical Details</h3>
        <p>Built using React and NodeJS for the web application, with Firebase for backend services.</p>
      `
    },
    {
      id: 'rock-open-game',
      title: 'Rock Open Game',
      category: 'Game Development',
      image: 'images/webrockgameicon.png',
      description: 'A personal project to bring a high school project to a web game.',
      tags: ['HTML', 'CSS', 'JavaScript', 'React', 'NodeJS', 'Firebase'],
      fullDescription: `
        <h3>Overview</h3>
        <p>A personal project to bring a high school project to a web game.</p>
        
        <h3>Key Features</h3>
        <ul>
          <li>Interactive gameplay</li>
          <li>Web-based platform</li>
          <li>Responsive design</li>
        </ul>
        
        <h3>Technical Details</h3>
        <p>Built using React and NodeJS for the web application, with Firebase for backend services.</p>
      `
    },
    {
      id: 'wander-sync-app',
      title: 'WanderSync App',
      category: 'App Development',
      image: 'images/AndroidStudioIcon.png',
      description: 'A course project using Java and Firebase to learn about Agile and Sprint methodology.',
      tags: ['Java', 'Firebase', 'Android Studio', 'GitHub'],
      fullDescription: `
        <h3>Overview</h3>
        <p>A course project using Java and Firebase to learn about Agile and Sprint methodology.</p>
        
        <h3>Key Features</h3>
        <ul>
          <li>Task synchronization</li>
          <li>Agile development practices</li>
        </ul>
        
        <h3>Technical Details</h3>
        <p>Developed using Java and Firebase, with Android Studio for app development and GitHub for version control.</p>
      `
    },
    {
      id: 'tower-offense-game',
      title: 'Tower Offense Game',
      category: 'Game Development',
      image: 'images/Castle.png',
      description: 'A course project using Unity and C# to create a 2D tower offense game.',
      tags: ['Unity', 'C#', 'GitHub'],
      fullDescription: `
        <h3>Overview</h3>
        <p>A course project using Unity and C# to create a 2D tower offense game.</p>
        
        <h3>Key Features</h3>
        <ul>
          <li>2D tower offense mechanics</li>
          <li>Strategic gameplay</li>
        </ul>
        
        <h3>Technical Details</h3>
        <p>Developed using Unity and C#, with GitHub for version control.</p>
      `
    },
    {
      id: 'stella-in-space',
      title: 'Stella In Space',
      category: 'Game Development',
      image: 'images/stellaInSpaceIcon.png',
      description: 'A course project using Unity and C# to create a 2D platformer game.',
      tags: ['Unity', 'C#', 'GitHub'],
      fullDescription: `
        <h3>Overview</h3>
        <p>A course project using Unity and C# to create a 2D platformer game.</p>
        
        <h3>Key Features</h3>
        <ul>
          <li>2D platformer mechanics</li>
          <li>Engaging level design</li>
        </ul>
        
        <h3>Technical Details</h3>
        <p>Developed using Unity and C#, with GitHub for version control.</p>
      `
    },
    {
      id: 'what-yours-is-mime',
      title: 'What Yours is Mime',
      category: 'Game Development',
      image: 'images/WYiMIcon.png',
      description: 'A 2.5D bullet-hell game where players battle through a kingdom\'s dungeon as a jester.',
      tags: ['Unity', 'C#', 'GitHub'],
      fullDescription: `
        <h3>Overview</h3>
        <p>A 2.5D bullet-hell game where players battle through a kingdom's dungeon as a jester.</p>
        
        <h3>Key Features</h3>
        <ul>
          <li>Bullet-hell mechanics</li>
          <li>Unique jester character</li>
        </ul>
        
        <h3>Technical Details</h3>
        <p>Developed using Unity and C#, with GitHub for version control.</p>
      `
    },
    {
      id: 'gastropoda',
      title: 'Gastropoda',
      category: 'Game Development',
      image: 'images/GastropodaIcon.png',
      description: 'A 2D platformer game where players escape from a mutant snail that broke out from the lab.',
      tags: ['Unity', 'C#', 'GitHub'],
      fullDescription: `
        <h3>Overview</h3>
        <p>A 2D platformer game where players escape from a mutant snail that broke out from the lab.</p>
        
        <h3>Key Features</h3>
        <ul>
          <li>2D platformer mechanics</li>
          <li>Engaging escape gameplay</li>
        </ul>
        
        <h3>Technical Details</h3>
        <p>Developed using Unity and C#, with GitHub for version control.</p>
      `
    },
    {
      id: 'customer-service-app',
      title: 'Customer Service App',
      category: 'App Development',
      image: 'images/ndaAppIcon.png',
      description: 'A customer service app providing connection between customers, employees, and company services.',
      tags: ['C#', 'PHP', 'MySQL', 'PHPMyAdmin'],
      fullDescription: `
        <h3>Overview</h3>
        <p>A customer service app providing connection between customers, employees, and company services.</p>
        
        <h3>Key Features</h3>
        <ul>
          <li>Customer support integration</li>
          <li>Employee management</li>
        </ul>
        
        <h3>Technical Details</h3>
        <p>Developed using C#, PHP, and MySQL, with PHPMyAdmin for database management.</p>
      `
    },
    {
      id: 'chatbot-project',
      title: 'ChatBot Project',
      category: 'Web Development',
      image: 'images/ChatGPTIcon.png',
      description: 'A course project using ChatGPT APIs to create a chatbot with personality.',
      tags: ['HTML', 'CSS', 'JavaScript', 'ChatGPT API'],
      fullDescription: `
        <h3>Overview</h3>
        <p>A course project using ChatGPT APIs to create a chatbot with personality.</p>
        
        <h3>Key Features</h3>
        <ul>
          <li>Chatbot with personality</li>
          <li>Interactive user experience</li>
        </ul>
        
        <h3>Technical Details</h3>
        <p>Developed using HTML, CSS, and JavaScript, with ChatGPT API integration.</p>
      `
    },
    {
      id: 'aframe-project',
      title: 'Aframe Project',
      category: 'Web Development',
      image: 'images/AframeIcon.png',
      description: 'A course project using Aframe to display 3D objects on a website.',
      tags: ['HTML', 'CSS', 'Aframe'],
      fullDescription: `
        <h3>Overview</h3>
        <p>A course project using Aframe to display 3D objects on a website.</p>
        
        <h3>Key Features</h3>
        <ul>
          <li>3D object rendering</li>
          <li>Interactive web experience</li>
        </ul>
        
        <h3>Technical Details</h3>
        <p>Developed using HTML, CSS, and Aframe for 3D rendering.</p>
      `
    },
    {
      id: 'gba-game-project',
      title: 'GBA Game Project',
      category: 'Game Development',
      image: 'images/GameBoyIcon.png',
      description: 'A course project creating a simple game for GameBoy Advance.',
      tags: ['C', 'GBA SDK'],
      fullDescription: `
        <h3>Overview</h3>
        <p>A course project creating a simple game for GameBoy Advance.</p>
        
        <h3>Key Features</h3>
        <ul>
          <li>GameBoy Advance compatibility</li>
          <li>Simple gameplay mechanics</li>
        </ul>
        
        <h3>Technical Details</h3>
        <p>Developed using C and the GBA SDK.</p>
      `
    },
    {
      id: 'pwnagotchi-implementation',
      title: 'Pwnagotchi Implementation',
      category: 'Cybersecurity Research',
      image: 'images/pwnagotchiIcon.png',
      description: 'A custom implementation of Pwnagotchi for WiFi security research and analysis.',
      tags: ['Python', 'Raspberry Pi'],
      fullDescription: `
        <h3>Overview</h3>
        <p>A custom implementation of Pwnagotchi for WiFi security research and analysis.</p>
        
        <h3>Key Features</h3>
        <ul>
          <li>WiFi security analysis</li>
          <li>Custom Pwnagotchi implementation</li>
        </ul>
        
        <h3>Technical Details</h3>
        <p>Developed using Python and Raspberry Pi hardware.</p>
      `
    },
    {
      id: 'rf-security-analysis-tool',
      title: 'RF Security Analysis Tool',
      category: 'Cybersecurity Research',
      image: 'images/flipperzeroIcon.png',
      description: 'A research project exploring radio frequency security using Flipper Zero, focusing on automotive systems.',
      tags: ['C', 'Flipper Zero', 'RF Analysis'],
      fullDescription: `
        <h3>Overview</h3>
        <p>A research project exploring radio frequency security using Flipper Zero, focusing on automotive systems.</p>
        
        <h3>Key Features</h3>
        <ul>
          <li>RF security analysis</li>
          <li>Automotive system focus</li>
        </ul>
        
        <h3>Technical Details</h3>
        <p>Developed using C and Flipper Zero for RF analysis.</p>
      `
    },
    {
      id: 'web-security-vulnerabilities',
      title: 'Common Web Security Vulnerabilities and Prevention',
      category: 'Cybersecurity Research',
      image: 'images/webIcon.png',
      description: 'A study of common web security vulnerabilities and prevention techniques.',
      tags: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
      fullDescription: `
        <h3>Overview</h3>
        <p>A study of common web security vulnerabilities and prevention techniques.</p>
        
        <h3>Key Features</h3>
        <ul>
          <li>Web security analysis</li>
          <li>Prevention techniques</li>
        </ul>
        
        <h3>Technical Details</h3>
        <p>Developed using HTML, CSS, JavaScript, PHP, and MySQL.</p>
      `
    }
  ];

  // Store projects data in localStorage for access in project details page
  localStorage.setItem('projectsData', JSON.stringify(projectsData));
  
  // Generate HTML
  projects.innerHTML = `
    <div class="container">
      <h2 class="section-title reveal">My Projects</h2>
      
      <div class="projects-filters reveal">
        <button class="filter-btn active" data-filter="all">All</button>
        <button class="filter-btn" data-filter="Web Development">Web Development</button>
        <button class="filter-btn" data-filter="Game Development">Game Development</button>
        <button class="filter-btn" data-filter="App Development">App Development</button>
        <button class="filter-btn" data-filter="Cybersecurity Research">Cybersecurity Research</button>
      </div>
      
      <div class="projects-grid">
        ${projectsData.map((project) => `
          <div class="project-card reveal" data-category="${project.category}">
            <div class="project-image">
              <img src="${project.image}" alt="${project.title}">
              <div class="project-overlay">
                <a href="/project.html?id=${project.id}" class="view-project">View Project</a>
              </div>
            </div>
            <div class="project-info">
              <h3>${project.title}</h3>
              <p class="project-category">${project.category}</p>
              <p class="project-description">${project.description}</p>
              <div class="project-tags">
                ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
    
    <style>
      .projects-filters {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: var(--space-2);
        margin-bottom: var(--space-10);
      }
      
      .filter-btn {
        background-color: transparent;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-full);
        padding: var(--space-2) var(--space-4);
        font-size: var(--font-size-sm);
        cursor: pointer;
        transition: all var(--transition-normal);
        color: white;
      }
      
      .filter-btn:hover {
        background-color: var(--color-primary-50);
        border-color: var(--color-primary-300);
      }
      
      .filter-btn.active {
        background-color: var(--color-primary-500);
        border-color: var(--color-primary-500);
      }
      
      .projects-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
        gap: var(--space-6);
      }
      
      .project-card {
        background-color: var(--color-surface);
        border-radius: var(--radius-lg);
        overflow: hidden;
        box-shadow: var(--shadow-md);
        transition: transform var(--transition-normal), box-shadow var(--transition-normal);
      }
      
      .project-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-xl);
      }
      
      .project-image {
        position: relative;
        overflow: hidden;
        aspect-ratio: 16 / 9;
      }
      
      .project-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform var(--transition-normal);
      }
      
      .project-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity var(--transition-normal);
      }
      
      .project-card:hover .project-image img {
        transform: scale(1.05);
      }
      
      .project-card:hover .project-overlay {
        opacity: 1;
      }
      
      .view-project {
        padding: var(--space-2) var(--space-4);
        background-color: var(--color-primary-500);
        color: white;
        border-radius: var(--radius-md);
        font-weight: var(--font-weight-medium);
        transition: background-color var(--transition-normal), transform var(--transition-normal);
      }
      
      .view-project:hover {
        background-color: var(--color-primary-600);
        transform: scale(1.05);
      }
      
      .project-info {
        padding: var(--space-4) var(--space-5);
      }
      
      .project-info h3 {
        margin-bottom: var(--space-2);
      }
      
      .project-category {
        color: var(--color-primary-500);
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        margin-bottom: var(--space-3);
      }
      
      .project-description {
        margin-bottom: var(--space-3);
        color: var(--color-text-secondary);
        font-size: var(--font-size-sm);
      }
      
      .project-tags {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2);
      }
      
      .project-tag {
        background-color: var(--color-primary-500);
        color: white;
        padding: var(--space-1) var(--space-2);
        border-radius: var(--radius-sm);
        font-size: var(--font-size-xs);
      }
      
      @media (max-width: 768px) {
        .projects-grid {
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        }
      }
      
      @media (max-width: 480px) {
        .projects-grid {
          grid-template-columns: 1fr;
        }
      }
    </style>
  `;
  
  // Filter functionality
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Filter projects
      const filter = button.getAttribute('data-filter');
      
      projectCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}