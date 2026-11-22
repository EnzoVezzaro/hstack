#!/usr/bin/env node
// Resolve every local Markdown link in the repository. Anchors are ignored;
// external URLs and data URIs are skipped. No network access.
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
const skip = new Set(['.git', 'node_modules', '__pycache__', '.pytest_cache', 'frames']);
const errors = [];
let files = 0;
let links = 0;

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (skip.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (entry.endsWith('.md')) check(full);
  }
}

function check(file) {
  files += 1;
  const body = readFileSync(file, 'utf8');
  for (const m of body.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
    let href = m[1].trim().split(/\s+"/)[0];
    if (!href || /^(?:https?:|mailto:|data:|#)/i.test(href)) continue;
    href = decodeURIComponent(href.split('#')[0]);
    if (!href) continue;
    links += 1;
    if (!existsSync(resolve(dirname(file), href))) {
      errors.push(`${file.slice(root.length + 1)}: ${href}`);
    }
  }
}

walk(root);
console.log(`Checked ${files} Markdown files and ${links} local links.`);
if (errors.length) { console.error('Broken links:\n' + errors.join('\n')); process.exitCode = 1; }
else console.log('All local Markdown links resolve.');
