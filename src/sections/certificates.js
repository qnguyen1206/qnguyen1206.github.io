import { certificatesData, certificateCategories, issuerIcons } from '../content/certificates.js';
import { getVolumeHeading } from '../utils/library-state.js';
import { mountPublication, escapePublicationText as escapeText } from '../utils/publication.js';


function getIssuerClassName(issuer) {
  return String(issuer || "default")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function hasMultipleIssuers(issuer) {
  return String(issuer || "")
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean).length > 1;
}

function getIssuerIcon(issuer) {
  const issuers = String(issuer || "")
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);

  if (issuers.length > 1) {
    return `
      <div class="issuer-combo" aria-label="${issuers.join(" x ")} logos">
        ${issuers
          .map(
            (name, index) => `
              <div class="issuer-logo">${getIssuerIcon(name)}</div>
              ${index < issuers.length - 1 ? '<span class="issuer-separator">X</span>' : ""}
            `
          )
          .join("")}
      </div>
    `;
  }

  const icon = issuerIcons[issuer] || issuerIcons["default"];

  if (typeof icon === "string") {
    return `<img src="${icon}" alt="${issuer} logo" class="issuer-image issuer-image-${getIssuerClassName(issuer)}" />`;
  } else if (icon.type === "svg") {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/>${icon.content}</svg>`;
  }

  return getIssuerIcon("default");
}

export function initCertificates() {
  const section = document.getElementById('certificates');
  if (!section) return;
  const categories = certificateCategories;
  let active = Object.keys(categories)[0];
  const toolbar = document.createElement('div');
  toolbar.className = 'certificate-book-tabs';
  toolbar.setAttribute('role', 'group');
  toolbar.setAttribute('aria-label', 'Certificate and honor categories');
  toolbar.innerHTML = Object.entries(categories).map(([key, label]) =>
    `<button type="button" data-certificate-category="${key}" aria-pressed="${key === active}">${label}</button>`
  ).join('');

  function render(resetPosition = false) {
    const records = (certificatesData[active] || []).filter(record => !record.hidden);
    const entries = records.map(cert => ({
      label: cert.title,
      left: `<span class="publication-kicker">${escapeText((categories[active] || 'No records'))} / Record of achievement</span>
        <div class="certificate-emblem">${getIssuerIcon(cert.issuer)}</div>
        <p class="publication-caption">${escapeText(cert.issuer)}</p>
        <p class="certificate-book-date">${escapeText(cert.date)}</p>`,
      right: `<span class="publication-kicker">${active === 'honors' ? 'Academic honor' : active === 'courses' ? 'Course record' : 'Certificate'}</span>
        <h3>${escapeText(cert.title)}</h3>
        <dl class="publication-meta"><div><dt>Issued by</dt><dd>${escapeText(cert.issuer)}</dd></div><div><dt>Date</dt><dd>${escapeText(cert.date)}</dd></div></dl>
        ${cert.link ? `<div class="publication-actions"><a href="${escapeText(cert.link)}" target="_blank" rel="noopener noreferrer">View credential ↗</a></div>` : ''}`
    }));
    if (!entries.length) entries.push({
      label: (categories[active] || 'No records'),
      left: `<span class="publication-kicker">The learning journal</span><div class="publication-monogram" aria-hidden="true">QN</div><p class="publication-caption">${escapeText((categories[active] || 'No records'))}</p>`,
      right: `<span class="publication-kicker">A chapter in progress</span><h3>${escapeText((categories[active] || 'No records'))}</h3><p>${active === 'courses' ? 'Courses will be added soon.' : 'No certificates in this category yet.'}</p>`
    });
    const book = mountPublication(section, {
      ...getVolumeHeading('certificates'),
      entries, toolbar
    });
    toolbar.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.certificateCategory === active)));
    if (resetPosition) book.goTo(0, true);
  }
  toolbar.addEventListener('click', event => {
    const button = event.target.closest('[data-certificate-category]');
    if (!button || button.dataset.certificateCategory === active) return;
    active = button.dataset.certificateCategory;
    render(true);
    button.focus({ preventScroll: true });
  });
  render();
}
