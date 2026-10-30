import { mountPublication } from '../utils/publication.js';
import { getVolumeHeading } from '../utils/library-state.js';
import { createCustomEntries } from '../utils/content-model.js';

export function initCustomVolume(volume) {
  const section = document.getElementById(volume.id);
  if (!section) return;
  mountPublication(section, {
    ...getVolumeHeading(volume.id),
    kind: volume.type.toLowerCase(),
    entries: createCustomEntries(volume.pages)
  });
}
