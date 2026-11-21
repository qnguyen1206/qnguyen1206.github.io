// The engine reads the editable episode JSON; story prose does not live here.
export function compileStory(episodes) {
  const nodes = {};
  const scenes = [];
  const identifiers = new Set();
  const required = (value, field) => {
    if (typeof value !== 'string' || !value.trim()) throw new Error(`Missing or invalid ${field}.`);
  };
  const validateLine = (line, context) => {
    required(line.speaker, `${context}: speaker`);
    required(line.text, `${context}: text`);
    if (line.lang && line.lang !== 'en') required(line.translation, `${context}: English translation`);
  };
  if (!Array.isArray(episodes) || !episodes.length) throw new Error('At least one episode is required.');
  episodes.forEach((episode, episodeIndex) => {
    for (const field of ['id', 'title', 'subtitle', 'focus', 'theme']) required(episode[field], `episode ${episodeIndex + 1}: ${field}`);
    if (identifiers.has(episode.id)) throw new Error(`Duplicate episode: ${episode.id}`);
    identifiers.add(episode.id);
    if (!['home', 'school', 'identity'].includes(episode.theme)) throw new Error(`Unknown theme: ${episode.theme}`);
    if (!Array.isArray(episode.scenes) || !episode.scenes.length) throw new Error(`No scenes in ${episode.id}.`);
    episode.scenes.forEach(scene => {
      required(scene.id, `${episode.id}: scene id`);
      const key = `${episode.id}.${scene.id}`;
      if (identifiers.has(key)) throw new Error(`Duplicate scene: ${key}`);
      identifiers.add(key);
      required(scene.title, `${key}: title`);
      required(scene.prompt, `${key}: prompt`);
      required(scene.note?.title, `${key}: note title`);
      required(scene.note?.text, `${key}: note text`);
      if (!Array.isArray(scene.lines) || !scene.lines.length) throw new Error(`No dialogue in ${key}.`);
      if (!Array.isArray(scene.choices) || scene.choices.length < 2 || scene.choices.length > 3) throw new Error(`${key} needs two or three choices.`);
      scene.lines.forEach(line => validateLine(line, key));
      const choiceIds = new Set();
      scene.choices.forEach(choice => {
        for (const field of ['id', 'label', 'detail', 'reflection']) required(choice[field], `${key}: choice ${field}`);
        if (choiceIds.has(choice.id)) throw new Error(`Duplicate choice: ${key}.${choice.id}`);
        choiceIds.add(choice.id);
        if (!Array.isArray(choice.reaction) || !choice.reaction.length) throw new Error(`No reaction for ${key}.${choice.id}.`);
        choice.reaction.forEach(line => validateLine(line, `${key}.${choice.id}`));
      });
      scenes.push({ ...scene, key, episodeIndex });
    });
  });
  scenes.forEach((scene, sceneIndex) => {
    const base = { episodeIndex: scene.episodeIndex, sceneIndex, sceneTitle: scene.title };
    const nextScene = scenes[sceneIndex + 1];
    const after = nextScene ? `${nextScene.key}.line.0` : 'end';
    scene.lines.forEach((line, i) => {
      nodes[`${scene.key}.line.${i}`] = { ...base, ...line, next: i + 1 < scene.lines.length ? `${scene.key}.line.${i + 1}` : `${scene.key}.choice` };
    });
    nodes[`${scene.key}.choice`] = {
      ...base, speaker: 'Your words', text: scene.prompt, note: scene.note,
      choices: scene.choices.map(choice => ({ ...choice, next: `${scene.key}.${choice.id}.0` }))
    };
    scene.choices.forEach(choice => choice.reaction.forEach((line, i) => {
      nodes[`${scene.key}.${choice.id}.${i}`] = { ...base, ...line, note: scene.note, next: i + 1 < choice.reaction.length ? `${scene.key}.${choice.id}.${i + 1}` : after };
    }));
  });
  nodes.end = { ending: true, episodeIndex: episodes.length - 1, sceneIndex: scenes.length };
  return { episodes, scenes, nodes, start: `${scenes[0].key}.line.0` };
}

export async function loadStory(base) {
  // Explicit file names keep the data editable and independent of the UI.
  const episodes = await Promise.all(['home', 'school', 'identity'].map(async name => {
    const response = await fetch(new URL(`${name}.json`, base));
    if (!response.ok) throw new Error(`Could not load ${name}.json (HTTP ${response.status}).`);
    try { return await response.json(); }
    catch { throw new Error(`${name}.json is not valid JSON. Check commas and quotation marks.`); }
  }));
  return compileStory(episodes);
}
