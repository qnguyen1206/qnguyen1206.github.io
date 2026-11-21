export const SAVE_KEY = 'between-two-languages.save.v1';
export const SETTINGS_KEY = 'between-two-languages.translations.v1';
export const newState = story => ({ version: 1, trail: [story.start] });
export const currentNode = (story, state) => story.nodes[state.trail.at(-1)];

export function advance(story, state, choiceIndex) {
  const node = currentNode(story, state);
  const next = node.choices ? node.choices[choiceIndex]?.next : node.next;
  if (!next || !story.nodes[next]) return state;
  return { ...state, trail: [...state.trail, next] };
}

export function goBack(state) {
  return state.trail.length > 1 ? { ...state, trail: state.trail.slice(0, -1) } : state;
}

export function restore(story, raw) {
  try {
    const state = JSON.parse(raw);
    if (state?.version !== 1 || !Array.isArray(state.trail) || !state.trail.length || state.trail.length > Object.keys(story.nodes).length) return null;
    if (state.trail[0] !== story.start) return null;
    for (let i = 0; i < state.trail.length; i++) {
      const id = state.trail[i];
      if (typeof id !== 'string' || !Object.hasOwn(story.nodes, id)) return null;
      if (!i) continue;
      const previous = story.nodes[state.trail[i - 1]];
      if (previous.choices ? !previous.choices.some(choice => choice.next === id) : previous.next !== id) return null;
    }
    return { version: 1, trail: [...state.trail] };
  } catch { return null; }
}

export function getJournal(story, state) {
  return state.trail.flatMap((id, i) => {
    const node = story.nodes[id];
    const choice = node.choices?.find(option => option.next === state.trail[i + 1]);
    return choice ? [{ title: node.sceneTitle, episodeIndex: node.episodeIndex, label: choice.label, reflection: choice.reflection, note: node.note }] : [];
  });
}
