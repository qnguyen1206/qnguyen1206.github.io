BETWEEN TWO LANGUAGES — LMC 3206
===============================

Run from the repository root:
  npm.cmd run dev
  Open the printed local URL followed by /LMC3206/

On macOS/Linux or a shell without PowerShell's npm.ps1 restriction, use npm
instead of npm.cmd. A plain static HTTP server also works: no backend, API
keys, database, or runtime framework is required. Do not double-click the
HTML file: browser file:// restrictions can prevent loading JSON.

Check the story:
  npm.cmd run test:lmc3206

Build the repository:
  npm.cmd run build

The production entry is dist/LMC3206/index.html. Deploy the entire dist
directory, including its shared assets directory. The Vite build copies
the three JSON files to dist/LMC3206/data without embedding their prose
in JavaScript. The standalone source folder can also be served directly.
No deployment or Git push is performed by this implementation.

EDIT THE STORY HERE
  data/home.json       Episode 1: Home
  data/school.json     Episode 2: School
  data/identity.json   Episode 3: Between worlds

See DATA-GUIDE.txt for the complete format and a copyable scene example.
Edit source files under LMC3206, not generated files under dist. When the
dev server is running, refresh the page after editing JSON. Rebuild before
publishing. Begin a fresh story after reorganizing scenes or reactions.

WHAT IS IMPLEMENTED
  Three connected episodes, nine decisions, 27 distinct reaction sequences.
  English translations for all Vietnamese dialogue.
  Optional context notes and a toggle for English translations.
  A journal reflecting your actual choices and a conversation transcript.
  Backtracking, restart confirmation, and a downloadable text journal.
  Browser-local progress and translation preference, with storage fallback.
  Original SVG scene illustrations, responsive CSS, native buttons/dialogs,
  visible focus styles, language attributes, and reduced-motion support.

Choices branch locally and rejoin at the next scene. The final decision
changes the closing passage; the journal also reflects earlier decisions.
There is no score, relationship meter, or best ending. Earlier choices do
not secretly lock later options. This keeps the story easy to edit.

WHERE THINGS LIVE
  index.html           Screens and accessible controls
  styles/main.css      Layout, responsive styling, color and typography
  scripts/story.js     JSON loading, validation, and dialogue graph
  scripts/state.js     Progress, transitions, save validation, journal
  scripts/game.js      Rendering, events, translations and browser storage
  assets/*.svg         Original scene artwork and favicon
  tests/*.test.js      Story-path, state, and controller checks
  docs/*.txt           Design document, research and submission drafts

KNOWN LIMITS / BEFORE SUBMISSION
  The story is fictional and is not presented as your personal experience.
  Have Vietnamese dialogue reviewed for your intended speaker/dialect.
  Target playtime is 10–15 minutes; it has not been measured with players.
  Google Fonts is optional: local serif/sans-serif fallbacks remain usable.
  No sound is played. The recorder is an object in the story, not a feature.
  Saves belong to one browser/origin. Moving hosts or devices does not carry
  progress over. Invalid or outdated paths are rejected with a visible note.
  Browser visual QA, mobile QA, and screen-reader testing remain pending:
  no connected browser was available during implementation. Node controller
  tests use DOM doubles and do not certify browser rendering or accessibility.
  Research drafts distinguish public abstracts/catalog records from full
  text. No Georgia Tech Library access or human playtest is claimed.
  Confirm grading equivalence and finish the library access/playtest records.

The existing deleted .github workflow files were present before this work
and were left untouched. Restore/configure deployment separately if needed.
