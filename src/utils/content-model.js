// Pure helpers shared by the renderer and content checks.
export const builtInTypes = {
  about: 'Book', experience: 'Binder', projects: 'Book',
  blog: 'Binder', certificates: 'Book', contacts: 'Book'
};

export function createLibraryVolumes(definitions, palette) {
  const seen = new Set();
  for (const volume of definitions) {
    if (!/^[a-z][a-z0-9-]*$/.test(volume.id) || ['hero', 'library', 'app', 'library-reader'].includes(volume.id)) {
      throw new Error('Library: use a unique lowercase ID, such as reading-notes (not hero or library).');
    }
    if (seen.has(volume.id)) throw new Error(`Library: duplicate section ID "${volume.id}".`);
    seen.add(volume.id);
    if (!volume.title || !['Book', 'Binder'].includes(volume.type) || !palette[volume.color]) {
      throw new Error(`Library "${volume.id}": title, type (Book/Binder), and a palette color are required.`);
    }
    if (Object.hasOwn(builtInTypes, volume.id) && volume.type !== builtInTypes[volume.id]) {
      throw new Error(`Library "${volume.id}" uses a specialized ${builtInTypes[volume.id]} layout; use a new ID for a custom volume.`);
    }
    if (!Object.hasOwn(builtInTypes, volume.id) && !Array.isArray(volume.pages)) {
      throw new Error(`Library "${volume.id}": custom volumes need a pages array (which can be empty).`);
    }
  }
  return definitions.filter(volume => !volume.hidden).map((volume, index) => ({
    ...volume, number: String(index + 1).padStart(2, '0')
  }));
}

export function createShelfRows(volumes) {
  const rows = [];
  for (let i = 0; i < volumes.length; i += 3) rows.push(volumes.slice(i, i + 3));
  // Keep a full cabinet even when no sections are published yet.
  return [null, ...(rows.length ? rows : [null, null]), null];
}

export const escapeContent = value => String(value ?? '').replace(/[&<>"']/g,
  character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);

// Custom pages accept plain text objects or trusted HTML written by the site owner.
export function renderPagePanel(panel) {
  if (typeof panel === 'string') return panel;
  if (!panel) return '';
  return [
    panel.kicker ? `<span class="publication-kicker">${escapeContent(panel.kicker)}</span>` : '',
    panel.title ? `<h3>${escapeContent(panel.title)}</h3>` : '',
    panel.image ? `<img class="publication-image" src="${escapeContent(panel.image.src)}" alt="${escapeContent(panel.image.alt)}" decoding="async">` : '',
    ...(panel.paragraphs || []).map(text => `<p>${escapeContent(text)}</p>`),
    panel.bullets?.length ? `<ul>${panel.bullets.map(text => `<li>${escapeContent(text)}</li>`).join('')}</ul>` : ''
  ].join('');
}

export function createCustomEntries(pages) {
  return pages.filter(page => !page.hidden).map(page => ({
    label: page.label,
    left: renderPagePanel(page.left),
    right: renderPagePanel(page.right),
    html: renderPagePanel(page.body ?? page.left) + (page.body ? '' : renderPagePanel(page.right))
  }));
}
