import { initNav } from './components/navbar.js';
import { initFooter } from './components/footer.js';

// Initialize header and footer
initNav();
initFooter();

// Get project ID from URL hash instead of query parameters
const projectId = window.location.hash.substring(1); // Remove the # character

// Get projects data from localStorage
const projectsData = JSON.parse(localStorage.getItem('projectsData'));
const project = projectsData.find(p => p.id === projectId);

// Display project details
const projectDetails = document.getElementById('project-details');

if (project) {
  projectDetails.innerHTML = `
    <div class="container">
      <div class="project-header">
        <a href="/" class="back-link">
          <span>←</span> Back to Projects
        </a>
        <h1 class="project-title">${project.title}</h1>
        <p class="project-category">${project.category}</p>
      </div>
      
      <div class="project-content">
        <div class="project-image">
          <img src="${project.image}" alt="${project.title}">
        </div>
        
        <div class="project-info">
          <div class="project-tags">
            ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
          </div>
          
          <div class="project-description">
            ${project.fullDescription}
          </div>
        </div>
      </div>
    </div>
    
    <style>
      .project-header {
        text-align: center;
        margin-bottom: var(--space-8);
      }
      
      .back-link {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        color: var(--color-primary-500);
        margin-bottom: var(--space-4);
        transition: transform var(--transition-normal);
      }
      
      .back-link:hover {
        transform: translateX(-5px);
      }
      
      .project-title {
        margin-bottom: var(--space-2);
      }
      
      .project-category {
        color: var(--color-primary-500);
        font-size: var(--font-size-lg);
      }
      
      .project-content {
        max-width: 800px;
        margin: 0 auto;
      }
      
      .project-image {
        margin-bottom: var(--space-8);
        border-radius: var(--radius-lg);
        overflow: hidden;
        box-shadow: var(--shadow-lg);
      }
      
      .project-image img {
        width: 100%;
        height: auto;
      }
      
      .project-tags {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2);
        margin-bottom: var(--space-6);
      }
      
      .project-tag {
        background-color: var(--color-primary-500);
        color: white;
        padding: var(--space-1) var(--space-2);
        border-radius: var(--radius-sm);
        font-size: var(--font-size-sm);
      }
      
      .project-description {
        font-size: var(--font-size-lg);
        line-height: var(--line-height-relaxed);
      }
      
      .project-description h3 {
        margin: var(--space-6) 0 var(--space-4);
        color: var(--color-primary-500);
      }
      
      .project-description ul {
        list-style: disc;
        margin-left: var(--space-6);
        margin-bottom: var(--space-4);
      }
      
      .project-description li {
        margin-bottom: var(--space-2);
      }
      
      @media (max-width: 768px) {
        .project-content {
          padding: 0 var(--space-4);
        }
      }
    </style>
  `;
} else {
  projectDetails.innerHTML = `
    <div class="container">
      <div class="error-message">
        <h2>Project Not Found</h2>
        <p>The project you're looking for doesn't exist.</p>
        <a href="/" class="btn btn-primary">Back to Home</a>
      </div>
    </div>
    
    <style>
      .error-message {
        text-align: center;
        padding: var(--space-16) 0;
      }
      
      .error-message h2 {
        margin-bottom: var(--space-4);
      }
      
      .error-message p {
        margin-bottom: var(--space-8);
      }
    </style>
  `;
}
