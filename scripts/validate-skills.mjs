#!/usr/bin/env node
// HStack source-of-truth checks. No dependencies and no machine-specific Orca required.
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const skillsDir = join(root, 'skills');
const errors = [];
const paths = [];
for (const folder of readdirSync(skillsDir).sort()) {
  const path = join(skillsDir, folder, 'SKILL.md');
  if (!existsSync(path)) { errors.push(`Missing SKILL.md: ${folder}`); continue; }
  paths.push(path);
}
const expected = 60;
if (paths.length !== expected) {
  errors.push(`Expected ${expected} published skills; found ${paths.length}. Update the catalog count and this test intentionally when adding/removing a route.`);
}
for (const file of paths) {
  const name = file.split('/').at(-2);
  const body = readFileSync(file, 'utf8');
  const fm = body.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!fm) { errors.push(`Missing YAML frontmatter: ${name}`); continue; }
  const declared = fm[1].match(/^name:\s*["']?([a-z0-9-]+)["']?\s*$/m)?.[1];
  if (declared !== name) errors.push(`Name mismatch: ${name}, frontmatter=${declared}`);
  const description = fm[1].match(/^description:\s*(.+)$/m)?.[1] || '';
  if (!description || !/use|entry point/i.test(description)) errors.push(`Missing trigger-focused description: ${name}`);
  if (/\bRetro\b|switchboard|burn bay/i.test(description)) errors.push(`Legacy theme in description: ${name}`);
  if (!body.includes('../../docs/skill-contract.md')) errors.push(`Missing execution-contract link: ${name}`);
  if (/This skill (covers|extends) the \*\*W\d+/i.test(body)) errors.push(`Unresolved legacy workflow label: ${name}`);
  if (!/^#\s+[^\n]+/m.test(body)) errors.push(`Missing visible heading: ${name}`);
  for (const hit of body.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
    const href = hit[1].trim().split(/\s+"/)[0];
    if (!href || /^(?:https?:|mailto:|#|data:)/i.test(href)) continue;
    const target = decodeURIComponent(href.split('#')[0]);
    if (!target) continue;
    const full = resolve(dirname(file), target);
    if (!existsSync(full)) errors.push(`Broken relative link in ${name}: ${href}`);
  }
}
const relay = readFileSync(join(skillsDir, 'relay-room', 'SKILL.md'), 'utf8');
for (const marker of ['NOT SENT', 'delivery acknowledged', 'independently verified']) {
  if (!relay.toLowerCase().includes(marker.toLowerCase())) errors.push(`relay-room missing explicit handoff state: ${marker}`);
}
console.log(`Checked ${paths.length} skills and local links.`);
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log('HStack skill validation passed.');
