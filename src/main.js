import './styles/reset.css';
import './styles/variables.css';
import './styles/animations.css';
import './styles/style.css';

import { initNav } from './components/navbar.js';
import { initHero } from './sections/hero.js';
import { initAbout } from './sections/about.js';
import { initSkills } from './sections/skills.js';
import { initProjects } from './sections/projects.js';
import { initFooter } from './components/footer.js';
import { initAnimations } from './utils/animations.js';
import { initResume } from './sections/resume.js';

document.querySelector('#app').innerHTML = `
  <header id="header"></header>
  <main>
    <section id="hero" class="section"></section>
    <section id="about" class="section"></section>
    <section id="skills" class="section"></section>
    <section id="projects" class="section"></section>
    <section id="resume" class="section"></section>
  </main>
  <footer id="footer"></footer>
`;

// Initialize components
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initHero();
  initAbout();
  initSkills();
  initProjects();
  initFooter();
  initAnimations();
  initResume();
});

