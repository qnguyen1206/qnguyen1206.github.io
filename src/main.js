import { libraryVolumes } from './utils/library-state.js';
import './styles/reset.css';
import './styles/variables.css';
import './styles/animations.css';
import './styles/bubble.css';
import './styles/style.css';
import './styles/projects-neon.css';

import { initLibrary } from './sections/library.js';
import { initHero } from './sections/hero.js';
import { initSkyDescent } from './utils/sky-descent.js';
import { initAbout } from './sections/about.js';
import {initExperience} from './sections/experience.js';
import { initProjects } from './sections/projects.js';
import { initBlog } from './sections/blog.js';
import { initCertificates } from './sections/certificates.js';
import { initContacts } from './sections/contacts.js';
import { initCustomVolume } from './sections/custom.js';
import { initLazyLoading } from './utils/lazyload.js';
import { initAnalytics } from './utils/analytics.js';

document.querySelector('#app').innerHTML = `
  <main>
    <section id="hero"></section>
    <section id="library" aria-label="The personal library"></section>
    <div id="library-reader" role="dialog" aria-modal="true" aria-label="Portfolio reader" hidden>
      <nav class="library-reader-toolbar" aria-label="Library navigation">
        <div class="library-reader-actions">
          <button type="button" data-library-back>← Return to shelf</button>
          <a class="library-reader-version" href="./index.html" aria-label="Switch to the classic portfolio">Classic</a>
        </div>
        <span class="library-reader-kind">Reading book</span>
        <select aria-label="Open another library volume"></select>
      </nav>
      <div class="library-reader-volumes" tabindex="-1">
        ${libraryVolumes.map(volume => `<section id="${volume.id}" class="section" data-library-section hidden inert></section>`).join('\n')}
      </div>
    </div>
  </main>
`;

document.addEventListener('DOMContentLoaded', () => {
  initHero({ library: true });
  const renderers = { about: initAbout, experience: initExperience, projects: initProjects,
    blog: initBlog, certificates: initCertificates, contacts: initContacts };
  const initialized = new Set();
  function initVolume(volume) {
    if (initialized.has(volume.id)) return;
    if (Object.hasOwn(renderers, volume.id)) renderers[volume.id]();
    else initCustomVolume(volume);
    initialized.add(volume.id);
  }
  // Project descriptions can open an article before the Write-ups binder has
  // ever been opened. Preserve that entry point with an on-demand bridge.
  window.openBlogPost = function openWriteupOnDemand(postId) {
    const volume = libraryVolumes.find(item => item.id === 'blog');
    if (!volume) return;
    initVolume(volume);
    if (window.openBlogPost !== openWriteupOnDemand) window.openBlogPost(postId);
  };
  initLibrary({ initVolume });
  initSkyDescent();

  setTimeout(() => {
    initLazyLoading();
    initAnalytics();
  }, 0);
});
