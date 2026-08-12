export const experienceData = [
  {
    title: 'Full Stack Developer Intern',
    company: 'Y22 AI',
    date: 'Aug 17th, 2026 - Dec 10th, 2026',
    bullets: [
      
    ],
  },
  {
    title: 'Developer Experience Assistant',
    company: 'Hashforest Technology LLC',
    date: 'July 1st, 2026 - Present',
    bullets: [
      'Validated Phala Cloud infrastructure by testing CLI tools, REST APIs, Python SDKs, Docker deployments, and Trusted Execution Environment (TEE) applications across Linux and Windows environments.',
      'Executed end-to-end deployment testing for confidential cloud applications, debugging Docker containers, networking, encrypted environment variables, authentication, SSH connectivity, and cloud deployment workflows.',
      'Built and deployed confidential AI web applications to validate deployment pipelines, platform APIs, and secure execution environments.',
      'Investigated and documented reproducible software defects, platform inconsistencies, documentation issues, and cross-platform compatibility problems, enabling faster engineering triage and product improvements.',
      'Verified cryptographic functionality including remote attestation, deterministic key derivation, secure secret management, and Ethereum/Solana key generation using the Dstack SDK.'

    ]
  },
  {
    title: 'Designer',
    company: 'Biophilia VR',
    date: 'June 1st, 2026 - Present',
    bullets: [
      'Designed immersive VR gallery environments in Unity, creating concept art, layouts, lighting, and shaders to support interactive museum experiences. ',
      'Created 7 iterative sketches and 9 spatial prototypes to communicate environment composition, navigation flow, and user experience to the development team. ',
      'Researched museum architecture and VR exhibition design to inform layout, lighting, and environmental storytelling.',
      'Built and refined VR gallery environment, implementing scene composition, lighting, shaders and interactive layouts.',
      'Collaborated with developers to evaluate design alternatives, balancing immersion, accessibility, and technical constraints throughout development.',
    ]
  },
];

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function initExperience(data = experienceData) {
  const experience = document.getElementById('experience');
  if (!experience) return;

  function getBulletChar(style) {
    switch (style) {
      case 'dash': return '—';
      case 'check': return '✓';
      case 'arrow': return '→';
      case 'circle': return '◦';
      case 'dot':
      default:
        return '•';
    }
  }

  const itemsHtml = data.map((item) => `
    <article class="experience-item reveal">
      <header class="job-header">
        <h3 class="job-title">${escapeHtml(item.title)}</h3>
        <span class="job-company">${escapeHtml(item.company)}</span>
        <time class="job-date">${escapeHtml(item.date)}</time>
      </header>
      <div class="job-description">
        <details class="bullet-toggle">
          <summary>What I did</summary>
          <ul>
            ${item.bullets.map(b => `
              <li>
                <span class="bullet-icon">${escapeHtml(getBulletChar(item.bulletStyle))}</span>
                <span class="bullet-text">${escapeHtml(b)}</span>
              </li>
            `).join('')}
          </ul>
        </details>
      </div>
    </article>
  `).join('');

  experience.innerHTML = `
    <div class="container">
      <h2 class="section-title reveal">Experience</h2>
      <div class="experience-list">
        ${itemsHtml}
      </div>
    </div>

    <style>
      #experience { padding: var(--space-16) 0; }

      #experience .container { max-width: 1320px; }

      .experience-list { max-width: 1180px; margin: 0 auto; display: flex; flex-direction: column; gap: var(--space-8); }

      .experience-item {
        background: linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06));
        border: 1px solid rgba(255,255,255,0.12);
        backdrop-filter: blur(8px);
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        border-radius: var(--radius-xl);
        padding: var(--space-8) var(--space-10);
       }

      .job-header { display:flex; flex-wrap:wrap; align-items:baseline; gap: var(--space-3); margin-bottom: var(--space-3); }

      .job-title { font-size: var(--font-size-xl); margin: 0; color: var(--color-white); }
      .job-company { font-weight: 600; color: var(--color-gray-300); }
      .job-date { margin-left: auto; color: var(--color-gray-400); font-size: var(--font-size-sm); }

      .job-description ul { margin: 0; padding-left: 0; color: var(--color-gray-300); line-height: 1.7; list-style: none; }
      .job-description li { display:flex; gap: var(--space-5, 1.25rem); align-items:flex-start; margin-bottom: calc(var(--space-2, 0.5rem)); }
      .bullet-icon { width: 36px; display:inline-flex; align-items:flex-start; justify-content:center; color: var(--color-accent, #00bfff); font-weight:700; flex-shrink:0; }
      .bullet-text { display:inline-block; }
      .bullet-toggle { margin-top: var(--space-2); }
      .bullet-toggle summary {
        cursor: pointer;
        list-style: none;
        color: var(--color-primary-300);
        font-weight: 600;
        margin-bottom: var(--space-4);
        width: fit-content;
        user-select: none;
      }
      .bullet-toggle summary::-webkit-details-marker { display: none; }
      .bullet-toggle summary::after {
        content: '▾';
        display: inline-block;
        margin-left: var(--space-2);
        transition: transform 150ms ease;
      }
      .bullet-toggle[open] summary::after { transform: rotate(180deg); }

      @media (max-width: 768px) {
        .experience-item { padding: var(--space-6) var(--space-4); }

        .job-header { flex-direction: column; align-items: flex-start; }
        .job-date { margin-left: 0; }
      }
    </style>
  `;

  experience.querySelectorAll('.reveal').forEach((element) => element.classList.add('active'));
}

export function addExperience(entry) {
  experienceData.push(entry);
  initExperience();
}