import { homeContent } from '../src/content/home.js';
import { volumes, libraryCoverPalette } from '../src/content/library.js';
import { aboutPages } from '../src/content/about.js';
import { experienceData } from '../src/content/experience.js';
import { projectsData } from '../src/content/projects.js';
import { contactPages } from '../src/content/contacts.js';
import { certificatesData, certificateCategories } from '../src/content/certificates.js';
import { blogPosts, writeupSettings } from '../src/content/writeups.js';
import { validatePortfolioContent } from '../src/utils/content-validation.js';

const errors = validatePortfolioContent({
  home: homeContent, volumes, palette: libraryCoverPalette, about: aboutPages,
  experience: experienceData, projects: projectsData, contacts: contactPages,
  certificates: certificatesData, certificateCategories, writeups: blogPosts, writeupSettings
});
if (errors.length) {
  console.error('Fix these content errors before publishing:\n' + errors.map(error => `- ${error}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Content is valid: ${volumes.filter(volume => !volume.hidden).length} sections, ${aboutPages.length} About chapters, ${experienceData.length} experiences, ${projectsData.length} projects, ${blogPosts.length} write-ups.`);
}
