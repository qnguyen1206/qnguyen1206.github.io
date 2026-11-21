import { loadStory } from './story.js';
import { SAVE_KEY, SETTINGS_KEY, newState, currentNode, advance, goBack, restore, getJournal } from './state.js';

const $ = id => document.getElementById(id);
// Relative to the HTML, so the same JSON paths work in Vite and static hosting.
const dataBase = new URL('./data/', document.baseURI);
const illustrations = {
  home: new URL('../assets/home.svg', import.meta.url).href,
  school: new URL('../assets/school.svg', import.meta.url).href,
  identity: new URL('../assets/identity.svg', import.meta.url).href
};
const descriptions = {
  home: 'A warmly lit kitchen with a table set for three at dusk.',
  school: 'A library table with project notes, a recorder, and a view of campus.',
  identity: 'A desk beside a night-time window, with a notebook connecting home and school.'
};
const roles = { An: 'Your perspective', Mom: 'Mai · An’s mother', Jules: 'Your friend & project partner', Minh: 'Your classmate & project partner', 'Your words': 'There is more than one way to say it' };
let story, state, showTranslations = true, hasSave = false, savingAvailable = true, activeScreen = 'title';

function element(tag, text, className) {
  const el = document.createElement(tag);
  if (text !== undefined) el.textContent = text;
  if (className) el.className = className;
  return el;
}
function persist() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); }
  catch { savingAvailable = false; }
  hasSave = true;
  $('save-status').textContent = savingAvailable ? 'Saved on this device' : 'Saving unavailable · keep this tab open';
}
function screen(name) {
  activeScreen = name;
  ['title', 'play', 'end'].forEach(key => { $(`${key}-screen`).hidden = key !== name; });
  $('resume-button').hidden = !hasSave;
  document.body.dataset.screen = name;
}
function updateJournalCount() {
  $('journal-count').textContent = String(getJournal(story, state).length).padStart(2, '0');
}
function render(focus = false) {
  const node = currentNode(story, state);
  updateJournalCount();
  if (node.ending) {
    screen('end');
    renderEntries($('end-journal'));
    if (focus) { $('main').focus({ preventScroll: true }); window.scrollTo(0, 0); }
    return;
  }
  screen('play');
  const episode = story.episodes[node.episodeIndex];
  $('episode-number').textContent = `EPISODE ${String(node.episodeIndex + 1).padStart(2, '0')} / ${String(story.episodes.length).padStart(2, '0')}`;
  $('episode-title').textContent = episode.title;
  $('scene-image').src = illustrations[episode.theme];
  $('scene-image').alt = descriptions[episode.theme];
  $('scene-stage').dataset.theme = episode.theme;
  $('scene-location').textContent = episode.subtitle;
  $('scene-theme').textContent = episode.focus;
  $('scene-number').textContent = `${String(node.sceneIndex + 1).padStart(2, '0')} / ${String(story.scenes.length).padStart(2, '0')}`;
  $('scene-title').textContent = node.sceneTitle;
  $('speaker').textContent = node.speaker === 'An' ? 'AN · YOUR THOUGHTS & WORDS' : node.speaker.toUpperCase();
  $('character-name').textContent = node.speaker === 'Your words' ? 'An' : node.speaker;
  $('character-monogram').textContent = node.speaker === 'Your words' ? 'A' : node.speaker[0];
  $('character-role').textContent = roles[node.speaker] || 'In this conversation';
  $('dialogue-text').textContent = node.text;
  $('dialogue-text').lang = node.lang || 'en';
  $('translation-text').textContent = node.translation || '';
  $('translation-wrap').hidden = !node.translation || !showTranslations;
  $('reveal-translation').hidden = !node.translation || showTranslations;
  $('context-button').disabled = !node.note;
  $('choices').replaceChildren();
  if (node.choices) node.choices.forEach((choice, i) => {
    const button = element('button', undefined, 'choice');
    button.append(element('span', String(i + 1).padStart(2, '0'), 'choice-number'));
    const copy = element('span');
    copy.append(element('strong', choice.label), element('small', choice.detail));
    button.append(copy, element('span', '↗', 'choice-arrow'));
    button.addEventListener('click', () => move(i));
    $('choices').append(button);
  });
  $('next-button').hidden = Boolean(node.choices);
  $('back-button').disabled = state.trail.length === 1;
  $('reading-hint').textContent = node.choices ? 'Choose what feels like you' : 'Take your time';
  $('next-button').firstChild.textContent = node.next === 'end' ? 'Finish story ' : 'Continue ';
  $('episode-progress').replaceChildren(...story.episodes.map((item, i) => {
    const li = element('li');
    li.append(element('span', String(i + 1).padStart(2, '0')), element('span', item.id === 'identity' ? 'Between worlds' : item.id === 'home' ? 'Home' : 'School'));
    if (i === node.episodeIndex) li.setAttribute('aria-current', 'step');
    if (i < node.episodeIndex) li.className = 'complete';
    return li;
  }));
  if (focus) $('dialogue-content').focus({ preventScroll: true });
}
function move(choiceIndex) {
  const next = advance(story, state, choiceIndex);
  if (next === state) return;
  state = next;
  persist();
  render(true);
}
function back() {
  state = goBack(state);
  persist();
  render(true);
}
function renderEntries(container) {
  const entries = getJournal(story, state);
  container.replaceChildren();
  if (!entries.length) { container.append(element('p', 'Your journal begins with your first choice. There is nothing to get right before you begin.', 'empty-journal')); return; }
  entries.forEach((entry, i) => {
    const article = element('article', undefined, 'journal-entry');
    article.append(element('span', String(i + 1).padStart(2, '0'), 'entry-number'));
    const copy = element('div');
    copy.append(element('h3', entry.title), element('p', entry.label, 'journal-choice'), element('p', entry.reflection));
    article.append(copy);
    container.append(article);
  });
}
function openJournal() {
  if (!story) return;
  renderEntries($('journal-entries'));
  const transcript = $('transcript-entries');
  transcript.replaceChildren();
  if (hasSave) state.trail.forEach(id => {
    const node = story.nodes[id];
    if (node.ending) return;
    const block = element('p');
    block.append(element('strong', `${node.speaker}: `));
    const text = element('span', node.text);
    text.lang = node.lang || 'en';
    block.append(text);
    if (node.translation) block.append(element('small', node.translation));
    transcript.append(block);
  });
  $('journal-dialog').showModal();
}
function downloadJournal() {
  if (!story) return;
  const entries = getJournal(story, state);
  const text = ['BETWEEN TWO LANGUAGES — YOUR JOURNAL', 'A fictional conversation, not a language score.', '', ...entries.flatMap((entry, i) => [`${i + 1}. ${entry.title}`, entry.label, entry.reflection, ''])].join('\n');
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  const link = element('a');
  link.href = url;
  link.download = 'between-two-languages-journal.txt';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function startFresh() {
  $('load-error').hidden = true;
  state = newState(story);
  persist();
  render(true);
}
function requestStart() {
  if (!story) return;
  if (hasSave && state.trail.length > 1) $('restart-dialog').showModal();
  else startFresh();
}

$('begin-button').addEventListener('click', requestStart);
$('replay-button').addEventListener('click', requestStart);
$('confirm-restart').addEventListener('click', () => { $('restart-dialog').close(); startFresh(); });
$('resume-button').addEventListener('click', () => render(true));
$('home-button').addEventListener('click', () => { screen('title'); $('begin-button').focus(); });
$('next-button').addEventListener('click', () => move());
$('back-button').addEventListener('click', back);
$('end-back-button').addEventListener('click', back);
$('journal-button').addEventListener('click', openJournal);
$('about-button').addEventListener('click', () => $('about-dialog').showModal());
$('context-button').addEventListener('click', () => {
  const note = currentNode(story, state).note;
  if (!note) return;
  $('context-heading').textContent = note.title;
  $('context-text').textContent = note.text;
  $('context-dialog').showModal();
});
$('translations').addEventListener('change', event => {
  showTranslations = event.target.checked;
  try { localStorage.setItem(SETTINGS_KEY, String(showTranslations)); } catch { /* Reading still works without storage. */ }
  render();
});
$('reveal-translation').addEventListener('click', () => { $('translation-wrap').hidden = false; $('reveal-translation').hidden = true; });
['download-button', 'restart-download'].forEach(id => $(id).addEventListener('click', downloadJournal));
document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } }));
document.addEventListener('keydown', event => {
  if (!story || activeScreen !== 'play' || document.querySelector('dialog[open]') || event.altKey || event.ctrlKey || event.metaKey || event.repeat || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return;
  if (event.key === 'ArrowRight' && !currentNode(story, state).choices) { event.preventDefault(); move(); }
  if (event.key === 'ArrowLeft') { event.preventDefault(); back(); }
});

try {
  story = await loadStory(dataBase);
  let raw = null;
  try { raw = localStorage.getItem(SAVE_KEY); showTranslations = localStorage.getItem(SETTINGS_KEY) !== 'false'; }
  catch { savingAvailable = false; }
  const restored = raw ? restore(story, raw) : null;
  state = restored || newState(story);
  hasSave = Boolean(restored);
  $('translations').checked = showTranslations;
  $('begin-button').disabled = false;
  $('begin-button').firstChild.textContent = 'Begin the story ';
  $('resume-button').hidden = !hasSave;
  $('save-status').textContent = savingAvailable ? 'Saved on this device' : 'Saving unavailable · keep this tab open';
  if (raw && !restored) { $('load-error').hidden = false; $('load-error').textContent = 'Your previous save no longer matches the story data. Begin a new story to continue.'; }
  updateJournalCount();
} catch (error) {
  $('begin-button').firstChild.textContent = 'Story unavailable';
  $('load-error').hidden = false;
  $('load-error').textContent = `${error.message} Serve this folder through npm run dev or a static web server, then reload.`;
}
