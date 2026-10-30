// Copy an object into the matching content array. These examples are NOT published.
// Keep IDs unique. Use hidden: true for drafts, or delete that property to publish.
export const aboutPageTemplate = {
  title: 'A new chapter',
  caption: 'Photo caption',
  images: [['images/GT.png', 'Describe your photo']],
  text: `<p>Your first paragraph.</p><p>Your next paragraph.</p>`,
  hidden: true
};

export const experiencePageTemplate = {
  company: 'Company name', shortName: 'Short name', title: 'Your position',
  monogram: 'CO', date: 'Month Year – Present',
  // logo: 'images/company-logo.png',
  bullets: ['What you did.', 'The result or impact.'], hidden: true
};

export const projectPageTemplate = {
  id: 'my-new-project', title: 'My new project', category: 'App Development',
  description: 'A short introduction.', tags: ['JavaScript'], status: 'in development',
  role: 'Developer', duration: 'Month Year – Present',
  image: '', images: [], githubLink: '', externalLink: '',
  writeup: `## What I built
Describe the project here.`, hidden: true
};

export const certificatePageTemplate = {
  title: 'Course or certificate name', issuer: 'Organization', date: 'Month Year',
  link: '', hidden: true
};

export const contactPageTemplate = {
  label: 'New contact page',
  left: '<h3>Let’s connect</h3><p>An introduction.</p>',
  right: '<h3>Email</h3><a href="mailto:you@example.com">you@example.com</a>',
  hidden: true
};

// Use inline in blogPosts, or in an article file with "export default { ... }".
export const writeupPageTemplate = {
  id: 'my-new-writeup', title: 'My new write-up', category: 'Design',
  difficulty: 'Easy', tags: ['Design'], date: '2026-10-29T12:00:00',
  excerpt: 'A brief introduction.', content: `## Introduction
Write your article here.`, hidden: true
};

// Copy into volumes in library.js. No renderer or main.js edits needed.
export const customBookTemplate = {
  id: 'reading-notes', title: 'Reading Notes', subtitle: 'Things I have learned',
  type: 'Book', color: 'sage', hidden: true,
  pages: [
    {
      label: 'First chapter',
      left: { kicker: 'Notes', title: 'A new chapter', paragraphs: ['Your introduction.'] },
      right: { title: 'What I learned', paragraphs: ['Your story.'], bullets: ['A useful takeaway.'] }
    }
  ]
};

export const customBinderTemplate = {
  id: 'research-notes', title: 'Research Notes', subtitle: 'A collection of notes',
  type: 'Binder', color: 'navy', hidden: true,
  pages: [
    { label: 'First sheet', body: { title: 'Research topic', paragraphs: ['Your notes.'] } }
  ]
};
