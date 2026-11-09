// Narrative and field-note content live in data/dialogue.js and data/evidence.js.
// This file only handles navigation, the journal, and local progress.
(() => {
  'use strict';

  const scenes = window.MYTHICAL_HUNT_DIALOGUE || {};
  const evidence = window.MYTHICAL_HUNT_EVIDENCE || {};
  const regions = window.MYTHICAL_HUNT_REGIONS || {};
  const $ = selector => document.querySelector(selector);
  // Preserve the previous story's saves, but never mix its plot evidence into
  // this species journal. These keys belong only to the exploration story.
  const keys = { journal: 'mh-field-journal-v1', expedition: 'mh-field-expedition-v1' };
  const isReady = id => evidence[id]?.status === 'ready' && Boolean(evidence[id].description?.trim());
  const available = Object.keys(evidence).filter(isReady);
  const cleanNotes = list => Array.isArray(list) ? [...new Set(list.filter(isReady))] : [];
  const cleanRegions = list => Array.isArray(list) ? [...new Set(list.filter(id => Object.hasOwn(regions, id) && !['base', 'cave'].includes(id)))] : [];
  let toastTimer;

  function storageNotice() { $('#save-notice').hidden = false; }

  function readSave(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    } catch (error) {
      if (!(error instanceof SyntaxError)) storageNotice();
      return {};
    }
  }

  function writeSave(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch { storageNotice(); }
  }

  const previousJournal = readSave(keys.journal);
  const journal = {
    found: cleanNotes(previousJournal.found),
    expeditions: Number.isSafeInteger(previousJournal.expeditions) && previousJournal.expeditions >= 0 ? previousJournal.expeditions : 0
  };
  const previousExpedition = readSave(keys.expedition);
  let state = null;
  if (typeof previousExpedition.scene === 'string' && Object.hasOwn(scenes, previousExpedition.scene) && previousExpedition.completed !== true) {
    const scene = scenes[previousExpedition.scene];
    state = {
      scene: previousExpedition.scene,
      line: Number.isInteger(previousExpedition.line) ? Math.max(0, Math.min(previousExpedition.line, scene.lines.length)) : 0,
      evidence: cleanNotes(previousExpedition.evidence),
      visited: cleanRegions(previousExpedition.visited),
      completed: false
    };
    journal.found = [...new Set([...journal.found, ...state.evidence])];
  }

  function show(screen) {
    document.querySelectorAll('.screen').forEach(node => node.classList.toggle('active', node.id === screen));
  }

  function updateProgress() {
    $('#title-progress').textContent = `${journal.found.length} / ${available.length}`;
    $('#continue').classList.toggle('hidden', !state || state.completed);
    $('#evidence').textContent = `FIELD NOTES ${journal.found.length} / ${available.length}`;
  }

  function save() {
    writeSave(keys.journal, journal);
    if (state) writeSave(keys.expedition, state);
    updateProgress();
  }

  function toast(message) {
    clearTimeout(toastTimer);
    $('#toast').textContent = message;
    $('#toast').classList.add('show');
    toastTimer = setTimeout(() => $('#toast').classList.remove('show'), 2600);
  }

  function record(id) {
    if (!isReady(id)) {
      toast('FIELD NOTE PENDING — no observation recorded.');
      return;
    }
    const fresh = !journal.found.includes(id);
    if (fresh) journal.found.push(id);
    if (!state.evidence.includes(id)) state.evidence.push(id);
    toast(`${fresh ? 'OBSERVATION RECORDED' : 'OBSERVATION REVIEWED'} // ${evidence[id].title}`);
    save();
  }

  function visit(id) {
    if (!state || !Object.hasOwn(scenes, id)) return;
    state.scene = id;
    state.line = 0;
    const region = scenes[id].region === 'cave' ? 'forest' : scenes[id].region;
    if (region !== 'base' && regions[region] && !state.visited.includes(region)) state.visited.push(region);
    show('story');
    paint();
    save();
  }

  function renderChoices(scene) {
    $('#dialogue').classList.add('hidden');
    const panel = $('#choices');
    panel.replaceChildren();
    scene.choices.forEach((choice, index) => {
      const button = document.createElement('button');
      button.className = 'choice';
      button.dataset.next = choice.next || choice.action || '';
      if (choice.evidence) button.dataset.evidence = choice.evidence;
      const title = document.createElement('b');
      title.textContent = `${String(index + 1).padStart(2, '0')} · ${choice.label}`;
      const detail = document.createElement('small');
      detail.textContent = (choice.detail || '') + (choice.evidence && journal.found.includes(choice.evidence) ? ' · ALREADY RECORDED' : '');
      button.append(title, detail);
      button.addEventListener('click', () => {
        if (choice.evidence) record(choice.evidence);
        if (choice.action === 'complete') complete();
        else visit(choice.next);
      });
      panel.append(button);
    });
    panel.scrollTop = 0;
  }

  function paint() {
    const scene = scenes[state.scene];
    const [speaker, line] = scene.lines[Math.min(state.line, scene.lines.length - 1)];
    $('#chapter').textContent = scene.chapter;
    $('#location').textContent = scene.location;
    $('#objective').textContent = scene.objective;
    $('#speaker').textContent = speaker;
    $('#line').textContent = line;
    const theme = scene.region === 'base' ? 'base' : `${scene.region}-scene`;
    $('#scene-art').className = `scene-art ${theme}`;
    const region = regions[scene.region] || {};
    const image = scene.image || region.sceneImages?.[state.scene] || region.image || '';
    const background = $('#region-image');
    background.style.backgroundImage = image ? `url("${image}")` : '';
    background.style.backgroundPosition = scene.imagePosition || region.imagePositions?.[image] || 'center';
    background.classList.toggle('has-image', Boolean(image));
    $('#character').classList.toggle('hidden', !scene.character);
    $('#choices').replaceChildren();
    $('#dialogue').classList.remove('hidden');
    if (state.line >= scene.lines.length) renderChoices(scene);
    updateProgress();
  }

  function next() {
    if (!state || state.completed || document.querySelector('dialog[open]')) return;
    const scene = scenes[state.scene];
    if (state.line >= scene.lines.length) return;
    state.line++;
    paint();
    save();
  }

  function fresh() {
    state = { scene: 'briefing', line: 0, evidence: [], visited: [], completed: false };
    visit('briefing');
  }

  function complete() {
    if (!state || state.completed) return;
    state.completed = true;
    journal.expeditions++;
    save();
    show('ending');
    $('#ending-evidence').textContent = `${state.evidence.length} ${state.evidence.length === 1 ? 'note' : 'notes'} this expedition`;
    $('#ending-total').textContent = `${journal.found.length} / ${available.length} available notes recorded`;
    $('#ending-regions').textContent = `${state.visited.length} ${state.visited.length === 1 ? 'region' : 'regions'} visited`;
    const missing = available.length - journal.found.length;
    $('#replay-hint').textContent = missing
      ? `${missing} available observation${missing === 1 ? '' : 's'} remain. Return to the field to record what you missed.`
      : 'All currently available observations are recorded. Unfinished species entries remain open for future research.';
  }

  function renderJournal() {
    const pending = Object.values(evidence).filter(entry => entry.status === 'draft').length;
    $('#archive-summary').textContent = `${journal.found.length} of ${available.length} available notes recorded · ${journal.expeditions} ${journal.expeditions === 1 ? 'report' : 'reports'} filed. ${pending} draft entries await species details and do not count toward completion.`;
    const grid = $('#archive-grid');
    grid.replaceChildren();
    const groups = new Map();
    for (const [id, entry] of Object.entries(evidence)) {
      if (!groups.has(entry.species)) groups.set(entry.species, []);
      groups.get(entry.species).push([id, entry]);
    }
    for (const [species, entries] of groups) {
      const group = document.createElement('section');
      group.className = 'journal-species';
      const heading = document.createElement('h3');
      heading.textContent = species;
      const location = document.createElement('p');
      location.className = 'journal-location';
      location.textContent = regions[entries[0][1].region]?.name || 'Region not yet assigned';
      group.append(heading, location);
      for (const [id, entry] of entries) {
        const found = journal.found.includes(id);
        const pending = !isReady(id);
        const card = document.createElement('article');
        card.className = `archive-entry ${pending ? 'pending' : found ? 'recorded' : 'locked'}`;
        card.dataset.evidence = id;
        const title = document.createElement('h4');
        title.textContent = entry.title;
        const label = document.createElement('small');
        label.textContent = `${entry.kind === 'species' ? 'SPECIES' : 'HABIT'} · ${pending ? 'NOTES PENDING' : found ? 'RECORDED' : 'NOT YET RECORDED'}`;
        const description = document.createElement('p');
        description.textContent = pending
          ? 'This entry is reserved for future field notes. No species details or habits have been confirmed here yet.'
          : found ? entry.description : 'Return to this species’ observation sites to add the note to your journal.';
        card.append(title, label, description);
        group.append(card);
      }
      grid.append(group);
    }
  }

  $('#new-game').addEventListener('click', fresh);
  $('#replay').addEventListener('click', fresh);
  $('#continue').addEventListener('click', () => { if (state && !state.completed) { show('story'); paint(); } });
  $('#dialogue').addEventListener('click', next);
  $('#back-title').addEventListener('click', () => show('title'));
  $('#menu-btn').addEventListener('click', () => $('#menu').showModal());
  $('#resume').addEventListener('click', () => $('#menu').close());
  $('#restart').addEventListener('click', () => { $('#menu').close(); fresh(); });
  document.querySelectorAll('[data-travel]').forEach(button => button.addEventListener('click', () => {
    button.closest('dialog')?.close();
    visit('gate_map');
  }));
  document.querySelectorAll('[data-report]').forEach(button => button.addEventListener('click', () => {
    button.closest('dialog')?.close();
    visit('report');
  }));
  document.querySelectorAll('[data-open]').forEach(button => button.addEventListener('click', () => {
    button.closest('dialog')?.close();
    if (button.dataset.open === 'archive') renderJournal();
    $('#' + button.dataset.open).showModal();
  }));
  document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => $('#' + button.dataset.close).close()));
  document.addEventListener('keydown', event => {
    if (event.repeat || document.querySelector('dialog[open]') || !$('#story').classList.contains('active')) return;
    // Keep native keyboard activation on focused buttons; never advance twice.
    if (event.target.closest('input, textarea, select')) return;
    if (event.key === ' ' && !event.target.closest('button, a')) { event.preventDefault(); next(); }
    if (/^[1-9]$/.test(event.key)) $('#choices').children[Number(event.key) - 1]?.click();
  });
  updateProgress();
})();
