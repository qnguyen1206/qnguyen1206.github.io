export const experienceData = [
  {
    title: 'Developer Experience Assistant',
    company: 'Hashforest Technology LLC',
    date: 'July 1st - Present',
        bullets: [
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
        <ul>
          ${item.bullets.map(b => `
            <li>
              <span class="bullet-icon">${escapeHtml(getBulletChar(item.bulletStyle))}</span>
              <span class="bullet-text">${escapeHtml(b)}</span>
            </li>
          `).join('')}
        </ul>
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

      .experience-list { max-width: 1000px; margin: 0 auto; display: flex; flex-direction: column; gap: var(--space-8); }

      .experience-item {
        background: linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06));
        border: 1px solid rgba(255,255,255,0.12);
        backdrop-filter: blur(8px);
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
       }

      .job-header { display:flex; flex-wrap:wrap; align-items:baseline; gap: var(--space-3); margin-bottom: var(--space-3); }

      .job-title { font-size: var(--font-size-xl); margin: 0; color: var(--color-white); }
      .job-company { font-weight: 600; color: var(--color-gray-300); }
      .job-date { margin-left: auto; color: var(--color-gray-400); font-size: var(--font-size-sm); }

      .job-description ul { margin: 0; padding-left: 0; color: var(--color-gray-300); line-height: 1.7; list-style: none; }
      .job-description li { display:flex; gap: var(--space-4, 1rem); align-items:flex-start; margin-bottom: calc(var(--space-2, 0.5rem)); }
      .bullet-icon { width: 28px; display:inline-flex; align-items:flex-start; justify-content:center; color: var(--color-accent, #00bfff); font-weight:700; flex-shrink:0; }
      .bullet-text { display:inline-block; }

      @media (max-width: 768px) {
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