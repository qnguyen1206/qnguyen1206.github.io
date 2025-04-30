import './styles/reset.css';
import './styles/variables.css';
import './styles/animations.css';
import './styles/style.css';

import { initNav } from './components/navbar.js';
import { initHero } from './sections/hero.js';
import { initAbout } from './sections/about.js';
import { initProjects } from './sections/projects.js';
import { initFooter } from './components/footer.js';
import { initAnimations } from './utils/animations.js';

document.querySelector('#app').innerHTML = `
  <header id="header"></header>
  <main>
    <section id="hero" class="section"></section>
    <section id="about" class="section"></section>
    <section id="projects" class="section"></section>
    <section id="Test" class="section"><a href="project.html"></a></section>
  </main>
  <footer id="footer"></footer>
`;

// Initialize components
window.addEventListener('DOMContentLoaded', () => {
  initNav();
  initHero();
  initAbout();
  initProjects();
  initFooter();
  initAnimations();
});