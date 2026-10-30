import test from 'node:test';
import assert from 'node:assert/strict';
import { afterFeedbackPaint, startPickupFeedback } from './interaction-feedback.js';

test('pickup acknowledges the click synchronously without constructing a reader', () => {
  const calls = [];
  const source = { animate(frames, options) {
    calls.push({ frames, options });
    return { finished: Promise.resolve(), cancel() { calls.push('cancel'); } };
  } };
  const feedback = startPickupFeedback(source);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].frames[0].opacity, .78);
  assert.equal(calls[0].options.delay, undefined);
  assert.ok(calls[0].frames.every(frame => Object.keys(frame).every(key => ['transform', 'opacity'].includes(key))));
  feedback.cancel();
  assert.equal(calls.at(-1), 'cancel');
});

test('pickup respects reduced motion and missing animation support', () => {
  startPickupFeedback({ animate() { throw new Error('Must not animate'); } }, false).cancel();
  startPickupFeedback(null).cancel();
  startPickupFeedback({}).cancel();
});

test('reader work resumes in a task after the feedback frame, not inside its paint callback', async () => {
  const keys = ['document', 'requestAnimationFrame', 'setTimeout'];
  const originals = keys.map(key => Object.getOwnPropertyDescriptor(globalThis, key));
  let frame, task, resumed = false;
  try {
    globalThis.document = { hidden: false };
    globalThis.requestAnimationFrame = callback => { frame = callback; };
    globalThis.setTimeout = callback => { task = callback; };
    const pending = afterFeedbackPaint().then(() => { resumed = true; });
    assert.equal(task, undefined);
    frame();
    await Promise.resolve();
    assert.equal(resumed, false);
    task();
    await pending;
    assert.equal(resumed, true);
    globalThis.document.hidden = true;
    await afterFeedbackPaint(); // Background tabs must not wait on a suspended RAF.
  } finally {
    keys.forEach((key, index) => {
      if (originals[index]) Object.defineProperty(globalThis, key, originals[index]);
      else delete globalThis[key];
    });
  }
});
