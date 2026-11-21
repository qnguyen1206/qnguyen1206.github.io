import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { compileStory, loadStory } from '../scripts/story.js';
import { newState, currentNode, advance, goBack, restore, getJournal } from '../scripts/state.js';

const episodes = await Promise.all(['home', 'school', 'identity'].map(name => readFile(new URL(`../data/${name}.json`, import.meta.url), 'utf8').then(JSON.parse)));
const story = compileStory(episodes);

test('all 19,683 combinations reach an ending with nine choices and three episodes', () => {
  let endings = 0;
  const reached = new Set();
  function walk(id, decisions, episodeIds, ancestors) {
    assert.ok(!ancestors.has(id), `Cycle at ${id}`);
    const node = story.nodes[id];
    assert.ok(node, `Broken link: ${id}`);
    reached.add(id);
    const visited = new Set(ancestors).add(id);
    const covered = new Set(episodeIds).add(node.episodeIndex);
    if (node.ending) {
      assert.equal(decisions, 9);
      assert.equal(covered.size, 3);
      endings++;
      return;
    }
    if (node.choices) node.choices.forEach(choice => walk(choice.next, decisions + 1, covered, visited));
    else walk(node.next, decisions, covered, visited);
  }
  walk(story.start, 0, new Set(), new Set());
  assert.equal(endings, 3 ** 9);
  assert.equal(reached.size, Object.keys(story.nodes).length, 'Unreachable story content');
});

test('all non-English dialogue has an English translation; all choices have different reactions', () => {
  for (const node of Object.values(story.nodes)) {
    if (node.lang && node.lang !== 'en') assert.ok(node.translation?.trim());
    if (node.choices) {
      assert.equal(new Set(node.choices.map(choice => choice.next)).size, node.choices.length);
      assert.equal(new Set(node.choices.map(choice => choice.reflection)).size, node.choices.length);
    }
  }
});

test('save/resume preserves each state, including the ending, on three complete playthroughs', () => {
  for (let branch = 0; branch < 3; branch++) {
    let state = newState(story);
    while (!currentNode(story, state).ending) {
      state = advance(story, state, branch);
      assert.deepEqual(restore(story, JSON.stringify(state)), state);
    }
    assert.equal(getJournal(story, state).length, 9);
    assert.equal(advance(story, state), state, 'Ending cannot advance');
  }
});

test('backtracking removes a discarded decision and replaces its journal entry', () => {
  let state = newState(story);
  while (!currentNode(story, state).choices) state = advance(story, state);
  const choiceState = state;
  assert.equal(advance(story, state), state, 'Cannot skip a decision');
  assert.equal(advance(story, state, 9), state, 'Cannot choose a missing option');
  state = advance(story, state, 0);
  assert.equal(getJournal(story, state)[0].label, currentNode(story, choiceState).choices[0].label);
  state = goBack(state);
  assert.equal(getJournal(story, state).length, 0);
  state = advance(story, state, 2);
  assert.equal(getJournal(story, state).length, 1);
  assert.equal(getJournal(story, state)[0].label, currentNode(story, choiceState).choices[2].label);
  assert.deepEqual(goBack(newState(story)), newState(story));
});

test('corrupt, obsolete, and impossible saves are rejected', () => {
  for (const raw of ['{', 'null', '{}', '[]', JSON.stringify({ version: 2, trail: [story.start] }), JSON.stringify({ version: 1, trail: ['end'] }), JSON.stringify({ version: 1, trail: [story.start, 'end'] }), JSON.stringify({ version: 1, trail: [story.start, '__proto__'] }), JSON.stringify({ version: 1, trail: [story.start, 'removed.line'] })]) assert.equal(restore(story, raw), null);
});

test('editable JSON mistakes produce actionable errors', () => {
  const mutate = callback => { const copy = structuredClone(episodes); callback(copy); return () => compileStory(copy); };
  assert.throws(mutate(data => { data[0].scenes[0].choices[0].reaction = []; }), /No reaction/);
  assert.throws(mutate(data => { delete data[0].scenes[0].lines[2].translation; }), /English translation/);
  assert.throws(mutate(data => { data[0].scenes[1].id = data[0].scenes[0].id; }), /Duplicate scene/);
  assert.throws(mutate(data => { data[0].scenes[0].choices[1].id = data[0].scenes[0].choices[0].id; }), /Duplicate choice/);
  assert.throws(mutate(data => { data[0].scenes[0].choices.pop(); data[0].scenes[0].choices.pop(); }), /two or three/);
});

test('loader reports missing files and malformed JSON', async t => {
  t.mock.method(globalThis, 'fetch', async () => ({ ok: false, status: 404 }));
  await assert.rejects(loadStory(new URL('https://example.test/data/')), /home.json.*404/);
  globalThis.fetch = async () => ({ ok: true, json: async () => { throw new SyntaxError(); } });
  await assert.rejects(loadStory(new URL('https://example.test/data/')), /not valid JSON/);
});
