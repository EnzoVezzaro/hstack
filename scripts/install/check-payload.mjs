#!/usr/bin/env node
// Validate a copied H Stack skill payload: no adjacent root docs/ required.
// Every installed skill must carry the required references; links inside those
// references must resolve locally or be explicit external URLs. Companion
// skill links are optional and may be absent in a single-skill install.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve, join, basename } from 'node:path';

const [skillRoot, ...names] = process.argv.slice(2);
if (!skillRoot || names.length === 0) {
  console.error('usage: check-payload.mjs <skills-dir> <skill>...');
  process.exit(2);
}
const REQUIRED = ['skill-contract.md', 'hstack-v5.md', 'model-routing.md'];
const errors = [];
let links = 0;

function hrefs(body) {
  const out = [];
  for (const m of body.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
    const href = m[1].trim().split(/\s+"/)[0];
    if (!href) continue;
    out.push(href.replace(/#.*$/, ''));
  }
  return out;
}

function classify(href, fromDir, skillName) {
  if (!href || /^(?:https?:|mailto:|data:|#)/i.test(href)) return 'external';
  const resolved = resolve(fromDir, href);
  const rel = resolved.slice(skillRoot.length + 1);
  if (rel.startsWith(`${skillName}/references/`)) {
    if (!existsSync(resolved)) errors.push(`Missing required reference in ${skillName}: ${href}`);
    return 'required';
  }
  if (/^[^/]+\/SKILL\.md$/.test(rel)) return 'optional-companion';
  errors.push(`Unexpected local link in ${skillName}: ${href}`);
  return 'unexpected';
}

for (const name of names) {
  const dir = join(skillRoot, name);
  const skillFile = join(dir, 'SKILL.md');
  if (!existsSync(skillFile)) { errors.push(`Missing installed skill: ${name}`); continue; }
  for (const doc of REQUIRED) {
    if (!existsSync(join(dir, 'references', doc))) errors.push(`Missing required reference: ${name}/references/${doc}`);
  }
  for (const href of hrefs(readFileSync(skillFile, 'utf8'))) classify(href, dir, name);
  const refDir = join(dir, 'references');
  if (existsSync(refDir)) {
    for (const doc of readdirSync(refDir)) {
      if (!doc.endsWith('.md')) continue;
      const file = join(refDir, doc);
      for (const href of hrefs(readFileSync(file, 'utf8'))) {
        links += 1;
        const target = resolve(refDir, href);
        if (/^(?:https?:|mailto:|data:)/i.test(href)) continue;
        if (REQUIRED.includes(basename(href))) {
          if (!existsSync(target)) errors.push(`Broken required-doc link in ${name}/references/${doc}: ${href}`);
        } else if (href.startsWith('./')) {
          if (!existsSync(target)) errors.push(`Broken local link in ${name}/references/${doc}: ${href}`);
        } else {
          errors.push(`Unexpected local link in ${name}/references/${doc}: ${href}`);
        }
      }
    }
  }
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Payload OK: ${names.length} skill(s), required references present, ${links} reference links resolved or external.`);
