import './styles/reset.css';
import './styles/variables.css';
import './styles/animations.css';
import './styles/style.css';
import './styles/projects.css';
import './styles/bubble.css';

import { initNav } from './components/navbar.js';
import { initHero } from './sections/hero.js';
import { initAbout } from './sections/about.js';
import { initSkills } from './sections/skills.js';
import { initProjects } from './sections/projects.js';
import { initCertificates } from './sections/certificates.js';
import { initContacts } from './sections/contacts.js';
import { initAnimations } from './utils/animations.js';
import { initLazyLoading } from './utils/lazyload.js';

document.querySelector('#app').innerHTML = `
  <header id="header"></header>
  <main>
    <section id="hero"></section>
    <section id="about" class="section"></section>
    <section id="skills" class="section"></section>
    <section id="projects" class="section"></section>
    <section id="certificates" class="section"></section>
    <section id="contacts" class="section"></section>
  </main>
`;

// Initialize components
document.addEventListener('DOMContentLoaded', () => {
  //initNav();
  initHero();
  initAbout();
  initSkills();
  initProjects();
  initCertificates();
  initContacts();
  // Initialize animations last to ensure all sections are ready
  setTimeout(() => {
    initAnimations();
    initLazyLoading();
  }, 0);
});

