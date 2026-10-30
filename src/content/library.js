// Shelf order = array order. Set hidden: true to keep a section as a draft.
// Built-in IDs connect to their specialized content files; keep those IDs/types.
// Any new ID uses the custom page format (see EDITING.txt and templates.js).
export const volumes = [
  { id: 'about', title: 'About Me', subtitle: 'The person behind the work', type: 'Book', color: 'sage',
    readerTitle: 'About Me', readerSubtitle: 'A few pages from my story.' },
  { id: 'experience', title: 'Experience', subtitle: 'Teams, roles & contributions', type: 'Binder', color: 'navy',
    readerTitle: 'Experience', readerSubtitle: 'The teams, the work, and what I contributed.' },
  { id: 'projects', title: 'Projects', subtitle: 'Games, applications & design', type: 'Book', color: 'wine',
    readerTitle: 'My Projects', readerSubtitle: 'An atlas of games, applications, and design.' },
  { id: 'blog', title: 'Write-ups', subtitle: 'Field notes & case studies', type: 'Binder', color: 'teal',
    readerTitle: 'Write-ups', readerSubtitle: 'Field notes, case studies, and lessons learned.' },
  { id: 'certificates', title: 'Honors & Certificates', subtitle: 'A record of learning', type: 'Book', color: 'ochre',
    readerTitle: 'Honors & Certificates', readerSubtitle: 'Milestones in learning and achievement.' },
  { id: 'contacts', title: 'Contact', subtitle: 'The start of a conversation', type: 'Book', color: 'linen',
    readerTitle: 'Get In Touch', readerSubtitle: 'The next chapter starts with a conversation.' }
];

// Both the shelf spine and its open cover use this same palette.
export const libraryCoverPalette = {
  sage: { cover: '#3d5144', edge: '#73836b', ink: '#f6e8c8' },
  navy: { cover: '#304858', edge: '#718795', ink: '#f6e8c8' },
  wine: { cover: '#763f36', edge: '#a67360', ink: '#f6e8c8' },
  teal: { cover: '#35625d', edge: '#7c9b8b', ink: '#f6e8c8' },
  ochre: { cover: '#896536', edge: '#b69663', ink: '#f6e8c8' },
  linen: { cover: '#c0ae8d', edge: '#e0cfac', ink: '#30271c' }
};
