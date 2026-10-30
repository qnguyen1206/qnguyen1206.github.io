import { volumes, libraryCoverPalette } from '../content/library.js';
import { createLibraryVolumes } from './content-model.js';
export { libraryCoverPalette } from '../content/library.js';

export const libraryVolumes = createLibraryVolumes(volumes, libraryCoverPalette);

export function getVolumeHeading(id) {
  const volume = libraryVolumes.find(item => item.id === id);
  return { title: volume?.readerTitle ?? volume?.title ?? '', subtitle: volume?.readerSubtitle ?? volume?.subtitle ?? '' };
}

export function resolveLibraryVolume(hash) {
  return libraryVolumes.find(volume => `#${volume.id}` === hash) || null;
}

export function applyVolumeCover(element, volume) {
  const palette = libraryCoverPalette[volume.color];
  element.style.setProperty('--volume-cover', palette.cover);
  element.style.setProperty('--volume-edge', palette.edge);
  element.style.setProperty('--volume-ink', palette.ink);
}

// The reader's private scroll runway drives page turns without moving the site.
export function readingScroller(section) {
  return section.closest('.library-reader-volumes') || window;
}

export function readingScrollTop(section) {
  const scroller = readingScroller(section);
  return scroller === window ? window.scrollY : scroller.scrollTop;
}

export function scrollReadingTo(section, options) {
  readingScroller(section).scrollTo(options);
}

export function readingOffset(section) {
  return Number(section.dataset.readerOffset || 0);
}
