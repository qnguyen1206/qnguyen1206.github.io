import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const read = path => readFileSync(resolve(root, path), 'utf8');

test('Classic is the default entry and Library has its own directly accessible preview', () => {
  const classic = read('index.html');
  const library = read('library.html');
  assert.match(classic, /src="\/src\/classic\/main\.js"/);
  assert.doesNotMatch(classic, /src="\/src\/main\.js"/);
  assert.match(library, /src="\/src\/main\.js"/);
  assert.doesNotMatch(library, /src="\/src\/classic\/main\.js"/);
  assert.match(read('vite.config.js'), /library: resolve\(__dirname, 'library\.html'\)/);
});

test('compact toggles navigate to the other portfolio and expose current/destination labels', () => {
  for (const [file, current, target] of [['index.html', 'classic', 'library.html'], ['library.html', 'library', 'index.html']]) {
    const html = read(file);
    assert.ok(html.includes(`<a class="portfolio-switch" href="./${target}" data-version="${current}"`));
    assert.match(html, /aria-label="Switch to [^"]+Current portfolio: [^"]+"/);
    assert.match(html, /class="portfolio-switch-track" aria-hidden="true"/);
    assert.equal((html.match(/class="portfolio-switch"/g) || []).length, 1);
    const labels = [...html.matchAll(/<span class="portfolio-switch-label" aria-hidden="true">([^<]+)<\/span>/g)];
    assert.equal(labels.length, 1);
    assert.equal(labels[0][1].toLowerCase(), current);
    assert.ok(html.indexOf('class="portfolio-switch-track"') < labels[0].index);
  }
  assert.match(read('src/main.js'), /class="library-reader-version" href="\.\/index\.html"/);
});

test('Classic imports resolve and do not depend on mutable Library layout/content', () => {
  const classicRoot = resolve(root, 'src/classic');
  for (const path of readdirSync(classicRoot, { recursive: true }).filter(path => path.endsWith('.js'))) {
    const file = resolve(classicRoot, path);
    const source = readFileSync(file, 'utf8');
    const imports = [...source.matchAll(/^import\s+(?:.*?from\s+)?['"]([^'"]+)['"]/gm)];
    for (const [, specifier] of imports) {
      if (!specifier.startsWith('.')) continue;
      const target = resolve(dirname(file), specifier);
      assert.ok(existsSync(target), `${path}: missing ${specifier}`);
      assert.ok(target.startsWith(classicRoot + '/') || target.startsWith(classicRoot + '\\') ||
        target.startsWith(resolve(root, 'src/sections/blogs')), `${path}: layout leaked into ${specifier}`);
    }
  }
  assert.match(read('src/classic/main.js'), /initAnimations\(\)/);
  assert.doesNotMatch(read('src/classic/main.js'), /initLibrary|initSkyDescent/);
});
