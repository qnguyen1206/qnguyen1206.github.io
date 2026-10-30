CLASSIC PORTFOLIO

This is the pre-library layout preserved from Git commit 92b58c2a.
It is served by index.html (the default site). The Library preview is served
by library.html using src/main.js. Both pages have a compact version toggle.

The section renderers, styles, initialization and helpers in this directory
are a separate copy. Fixing the Library will not replace Classic's layout.
To edit Classic content, edit its src/classic/sections/ files, which keep the
original inline data. The newer src/content/ model controls the Library only.

Existing long articles in src/sections/blogs/, files in public/, and npm
dependencies are shared. Changes to those can affect both versions.
Only article import paths were adjusted when preserving this snapshot.

Run npm run dev, then visit / (Classic) or /library.html (Library).
npm run build includes both pages with separate entry points. No alternate
deployment, branch switch, local storage, or server route is required.
