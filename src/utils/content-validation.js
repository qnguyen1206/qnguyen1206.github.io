import { createLibraryVolumes } from './content-model.js';

// Report authoring mistakes before a deployment, with the file/entry to fix.
export function validatePortfolioContent(content) {
  const errors = [];
  const report = (path, message) => errors.push(`${path}: ${message}`);
  function records(value, path, check) {
    if (!Array.isArray(value)) { report(path, 'expected an array'); return; }
    value.forEach((record, i) => {
      if (!record || typeof record !== 'object') { report(`${path}[${i}]`, 'expected an object'); return; }
      if (record.hidden !== undefined && typeof record.hidden !== 'boolean') report(`${path}[${i}].hidden`, 'use true or false, not quoted text');
      check(record, `${path}[${i}]`);
    });
  }
  function string(value, path, allowEmpty = false) {
    if (typeof value !== 'string' || (!allowEmpty && !value.trim())) report(path, 'expected text');
  }
  function strings(value, path) {
    if (!Array.isArray(value) || value.some(item => typeof item !== 'string')) report(path, 'expected an array of text strings');
  }
  function uniqueIds(items, path) {
    const seen = new Set();
    records(items, path, (item, where) => {
      string(item.id, `${where}.id`);
      if (seen.has(item.id)) report(where, `duplicate id "${item.id}"`);
      seen.add(item.id);
    });
  }
  function panel(value, path) {
    if (value === undefined || typeof value === 'string') return;
    if (!value || typeof value !== 'object' || Array.isArray(value)) { report(path, 'expected a panel object or HTML string'); return; }
    for (const key of ['title', 'kicker']) if (value[key] !== undefined) string(value[key], `${path}.${key}`, true);
    for (const key of ['paragraphs', 'bullets']) if (value[key] !== undefined) strings(value[key], `${path}.${key}`);
    if (value.image) {
      string(value.image.src, `${path}.image.src`);
      string(value.image.alt, `${path}.image.alt`, true);
    }
  }
  try { createLibraryVolumes(content.volumes, content.palette); } catch (error) { errors.push(error.message); }
  records(content.volumes, 'library.js volumes', (volume, path) => {
    if (volume.pages) records(volume.pages, `${path}.pages`, (page, where) => {
      string(page.label, `${where}.label`);
      for (const side of ['left', 'right', 'body']) panel(page[side], `${where}.${side}`);
      if (volume.type === 'Book' && page.left === undefined && page.right === undefined) report(where, 'a book spread needs left and/or right');
      if (volume.type === 'Binder' && page.body === undefined && page.left === undefined && page.right === undefined) report(where, 'a binder sheet needs body');
    });
  });
  for (const [key, colors] of Object.entries(content.palette || {})) {
    for (const field of ['cover', 'edge', 'ink']) if (!/^#[0-9a-f]{6}$/i.test(colors[field])) report(`library.js palette.${key}.${field}`, 'use a six-digit hex color');
  }
  records(content.about, 'about.js', (item, path) => {
    string(item.title, `${path}.title`);
    string(item.caption, `${path}.caption`, true);
    string(item.text, `${path}.text`, true);
    if (!Array.isArray(item.images) || item.images.some(image => !Array.isArray(image) || image.length !== 2 || image.some(value => typeof value !== 'string'))) report(`${path}.images`, 'expected [path, alt text] pairs');
  });
  records(content.experience, 'experience.js', (item, path) => {
    for (const key of ['title', 'company', 'date']) string(item[key], `${path}.${key}`);
    strings(item.bullets, `${path}.bullets`);
  });
  uniqueIds(content.projects, 'projects.js');
  records(content.projects, 'projects.js', (item, path) => {
    string(item.title, `${path}.title`);
    strings(item.tags, `${path}.tags`);
  });
  records(content.contacts, 'contacts.js', (item, path) => {
    for (const key of ['label', 'left', 'right']) string(item[key], `${path}.${key}`, key !== 'label');
  });
  const categories = content.certificateCategories || {};
  for (const [key, label] of Object.entries(categories)) {
    if (!/^[a-z][a-zA-Z0-9-]*$/.test(key)) report(`certificates.js ${key}`, 'use a simple category key');
    string(label, `certificates.js category ${key}`);
    records(content.certificates?.[key], `certificates.js ${key}`, (item, path) => {
      for (const field of ['title', 'issuer', 'date']) string(item[field], `${path}.${field}`);
    });
  }
  for (const key of Object.keys(content.certificates || {})) {
    if (!Object.hasOwn(categories, key)) report(`certificates.js ${key}`, 'add a matching label to certificateCategories or remove this array');
  }
  uniqueIds(content.writeups, 'writeups.js');
  records(content.writeups, 'writeups.js', (item, path) => {
    for (const key of ['title', 'category', 'difficulty', 'date', 'excerpt', 'content']) string(item[key], `${path}.${key}`, key === 'content');
    strings(item.tags, `${path}.tags`);
    if (!Number.isFinite(Date.parse(item.date))) report(`${path}.date`, 'expected a valid date');
  });
  if (!['newest', 'manual'].includes(content.writeupSettings?.order)) report('writeups.js order', 'use newest or manual');
  if (!Number.isInteger(content.writeupSettings?.postsPerPage) || content.writeupSettings.postsPerPage < 1) report('writeups.js postsPerPage', 'use a positive whole number');
  for (const key of ['name', 'libraryLinkLabel', 'documentTitle', 'copyright']) string(content.home?.[key], `home.js ${key}`);
  records(content.home?.buttons, 'home.js buttons', (button, path) => {
    string(button.label, `${path}.label`);
    string(button.section, `${path}.section`);
  });
  return errors;
}
