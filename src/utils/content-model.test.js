import test from 'node:test';
import assert from 'node:assert/strict';
import { createLibraryVolumes, createShelfRows, createCustomEntries, renderPagePanel } from './content-model.js';
import { validatePortfolioContent } from './content-validation.js';
import { volumes, libraryCoverPalette } from '../content/library.js';
import { homeContent } from '../content/home.js';
import { aboutPages } from '../content/about.js';
import { experienceData } from '../content/experience.js';
import { projectsData } from '../content/projects.js';
import { contactPages } from '../content/contacts.js';
import { certificatesData, certificateCategories } from '../content/certificates.js';
import { blogPosts, writeupSettings } from '../content/writeups.js';
import { customBookTemplate, customBinderTemplate } from '../content/templates.js';

const content = {
  home: homeContent, volumes, palette: libraryCoverPalette, about: aboutPages,
  experience: experienceData, projects: projectsData, contacts: contactPages,
  certificates: certificatesData, certificateCategories, writeups: blogPosts, writeupSettings
};
const fixtureVolumes = [
  { id: 'about', title: 'About', type: 'Book', color: 'sage' },
  { id: 'experience', title: 'Experience', type: 'Binder', color: 'navy' },
  { id: 'blog', title: 'Write-ups', type: 'Binder', color: 'teal' }
];

test('current portfolio content is valid and the Home action has an editable label', () => {
  assert.deepEqual(validatePortfolioContent(content), []);
  assert.ok(homeContent.libraryLinkLabel);
});

test('reorder, hide, add, and remove sections without changing the source objects', () => {
  const definitions = [fixtureVolumes[2], { ...fixtureVolumes[0], hidden: true }, fixtureVolumes[1], { ...customBookTemplate, hidden: false }];
  const before = structuredClone(definitions);
  const result = createLibraryVolumes(definitions, libraryCoverPalette);
  assert.deepEqual(result.map(item => item.id), ['blog', 'experience', 'reading-notes']);
  assert.deepEqual(result.map(item => item.number), ['01', '02', '03']);
  assert.deepEqual(definitions, before);
  assert.deepEqual(createLibraryVolumes([], libraryCoverPalette), []);
});

test('shelf rows support empty, partial, and additional rows without losing a section', () => {
  for (const count of [0, 1, 2, 3, 4, 6, 7, 12, 19]) {
    const items = Array.from({ length: count }, (_, i) => ({ id: `volume-${i}` }));
    const rows = createShelfRows(items);
    assert.equal(rows[0], null);
    assert.equal(rows.at(-1), null);
    assert.deepEqual(rows.filter(Boolean).flat(), items);
    assert.ok(rows.filter(Boolean).every(row => row.length <= 3));
  }
});

test('invalid section definitions provide an actionable error', () => {
  for (const change of [{ id: 'hero' }, { id: 'not a valid id' }, { color: 'missing' }, { type: 'Magazine' }, { title: '' }]) {
    assert.throws(() => createLibraryVolumes([{ ...customBookTemplate, ...change }], libraryCoverPalette), /Library/);
  }
  assert.throws(() => createLibraryVolumes([fixtureVolumes[0], fixtureVolumes[0]], libraryCoverPalette), /duplicate/);
  assert.throws(() => createLibraryVolumes([{ ...fixtureVolumes[0], type: 'Binder' }], libraryCoverPalette), /specialized/);
  assert.throws(() => createLibraryVolumes([{ ...customBookTemplate, pages: undefined }], libraryCoverPalette), /pages array/);
});

test('custom books and binders render their editable page data, filtering drafts', () => {
  const book = createCustomEntries([...customBookTemplate.pages, { label: 'Draft', hidden: true }]);
  assert.equal(book.length, 1);
  assert.match(book[0].left, /Your introduction/);
  assert.match(book[0].right, /A useful takeaway/);
  const binder = createCustomEntries(customBinderTemplate.pages);
  assert.match(binder[0].html, /Research topic/);
  assert.match(binder[0].html, /Your notes/);
  assert.deepEqual(createCustomEntries([]), []);
});

test('custom plain text is escaped; trusted HTML panels remain intact', () => {
  assert.equal(renderPagePanel({ title: '<script>', paragraphs: ['A & B'], bullets: ['<item>'] }), '<h3>&lt;script&gt;</h3><p>A &amp; B</p><ul><li>&lt;item&gt;</li></ul>');
  assert.equal(renderPagePanel('<p><strong>Trusted content</strong></p>'), '<p><strong>Trusted content</strong></p>');
  assert.equal(renderPagePanel(undefined), '');
});

test('empty collections are supported, and malformed content is caught before publishing', () => {
  const empty = { ...content, volumes: [], about: [], experience: [], projects: [], contacts: [], certificates: {}, certificateCategories: {}, writeups: [] };
  assert.deepEqual(validatePortfolioContent(empty), []);
  const malformed = { ...empty, about: [{ title: 'Chapter', caption: '', images: 'wrong', text: '<p>Hello</p>', hidden: 'true' }], writeupSettings: { order: 'wrong', postsPerPage: 0 } };
  const errors = validatePortfolioContent(malformed).join('\n');
  assert.match(errors, /images/);
  assert.match(errors, /hidden/);
  assert.match(errors, /order/);
  assert.match(errors, /postsPerPage/);
});

test('both custom volume templates pass validation when published', () => {
  assert.deepEqual(validatePortfolioContent({ ...content, volumes: [{ ...customBookTemplate, hidden: false }, { ...customBinderTemplate, hidden: false }] }), []);
});
