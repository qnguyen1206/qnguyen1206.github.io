// Import projects data
import projectsData from '../data/projects.json';

export function initProjects() {
  const projects = document.getElementById('projects');
  if (!projects) return;
  
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
                <a href="projects/${project.id}.html" class="view-project">View Project</a>
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

