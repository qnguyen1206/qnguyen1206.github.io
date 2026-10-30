import { mountPublication } from '../utils/publication.js';
import { getVolumeHeading } from '../utils/library-state.js';
import { contactPages } from '../content/contacts.js';

export function initContacts() {
  const contacts = document.getElementById('contacts');
  if (!contacts) return;
  mountPublication(contacts, {
    ...getVolumeHeading('contacts'),
    entries: contactPages.filter(page => !page.hidden)
  });
}
