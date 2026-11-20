#!/usr/bin/env node
// Imports the Growth Haus revamp front end (the Next.js export of captured pages) into this Vite app.
//   node scripts/import-revamp.mjs <path-to-revamp-project>
// Writes:
//   src/revamp/pages/<key>.json   one per linked revamp page: { route, title, description, html, css }
//   src/revamp/routes.json        [{ route, key, title, description }]
//   src/revamp/revamp.css         the revamp's global stylesheet (app/globals.css)
//   public/revamp/*               the images, fonts and icons those pages use
// Asset URLs move from /assets/ to /revamp/ because /assets/ is where Vite writes its own build output.
// Re-run it whenever the revamp changes; it overwrites the files above and nothing else.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const frontend = path.resolve(here, '..');
const source = path.resolve(process.argv[2] || '');
if (!process.argv[2] || !fs.existsSync(path.join(source, 'data', 'routes.json'))) {
  console.error('Usage: node scripts/import-revamp.mjs <path-to-revamp-project>');
  process.exit(1);
}

// Only pages the revamp actually links to. The template's leftover pages (case studies, mentorship,
// link-in-bio, book-a-call, legal-pages/*, its own sample blog posts, thank-you) are not imported, nor the
// login, signup, forgot-password, checkout and get-started pages: those keep this site's original pages and flow.
const SKIP = /^\/(case|mentorship|link-in-bio|book-a-call|legal-pages|thank-you|login|signup|forgot-password|checkout|get-started)(\/|$)/;

const routes = JSON.parse(fs.readFileSync(path.join(source, 'data', 'routes.json'), 'utf8'));
const pagesDir = path.join(frontend, 'src', 'revamp', 'pages');
const assetsOut = path.join(frontend, 'public', 'revamp');
fs.rmSync(pagesDir, { recursive: true, force: true });
fs.mkdirSync(pagesDir, { recursive: true });

const rewrite = (text) => text.replace(/(["'(\s,])\/assets\//g, '$1/revamp/');
const used = new Set();
const collect = (text) => { for (const m of text.matchAll(/\/assets\/([\w.-]+)/g)) used.add(m[1]); };

const pages = routes.map((r) => ({ ...r, data: JSON.parse(fs.readFileSync(path.join(source, 'data', 'pages', `${r.key}.json`), 'utf8')) }));
const linked = new Set(['/']);
for (const p of pages) for (const m of p.data.html.matchAll(/href="(\/[^"#?]*)/g)) linked.add(m[1].replace(/\/$/, '') || '/');

const index = [];
for (const p of pages) {
  if (SKIP.test(p.route) || !linked.has(p.route)) continue;
  const { route, title, description, html, css } = p.data;
  collect(html); collect(css);
  fs.writeFileSync(path.join(pagesDir, `${p.key}.json`), JSON.stringify({ route, title, description, html: rewrite(html), css: rewrite(css) }));
  index.push({ route, key: p.key, title, description });
}
fs.writeFileSync(path.join(frontend, 'src', 'revamp', 'routes.json'), `${JSON.stringify(index, null, 2)}\n`);

const globals = fs.readFileSync(path.join(source, 'app', 'globals.css'), 'utf8');
collect(globals);
fs.writeFileSync(path.join(frontend, 'src', 'revamp', 'revamp.css'),
  `/* Imported from the Growth Haus revamp (app/globals.css) by scripts/import-revamp.mjs. Edit the revamp, then re-import. */\n${rewrite(globals)}`);

fs.rmSync(assetsOut, { recursive: true, force: true });
fs.mkdirSync(assetsOut, { recursive: true });
let missing = 0;
for (const name of used) {
  const from = path.join(source, 'public', 'assets', name);
  if (fs.existsSync(from)) fs.copyFileSync(from, path.join(assetsOut, name)); else missing += 1;
}
console.log(`Imported ${index.length} pages and ${used.size - missing} assets${missing ? ` (${missing} referenced but missing)` : ''}.`);
