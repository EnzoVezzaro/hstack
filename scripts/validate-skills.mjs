#!/usr/bin/env node
// HStack source-of-truth checks. No dependencies beyond Python 3 + PyYAML
// (used for the real frontmatter parser). No network and no Orca required.
import { readdirSync, readFileSync, statSync, existsSync, cpSync, rmSync, mkdtempSync } from 'node:fs';
import { join, resolve, dirname, basename } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const skillsDir = join(root, 'skills');
const errors = [];
const paths = [];
for (const folder of readdirSync(skillsDir).sort()) {
  const path = join(skillsDir, folder, 'SKILL.md');
  if (!existsSync(path)) { errors.push(`Missing SKILL.md: ${folder}`); continue; }
  paths.push(path);
}
const EXPECTED = 62;
if (paths.length !== EXPECTED) errors.push(`Expected ${EXPECTED} published skills; found ${paths.length}.`);

// Real YAML frontmatter validation (PyYAML), not a regex approximation.
let frontmatter = { count: 0, errors: [] };
try {
  const out = execFileSync('python3', [join(root, 'scripts', 'quality', 'check_frontmatter.py'), '--json'], { encoding: 'utf8' });
  frontmatter = JSON.parse(out.trim().split('\n').pop());
  for (const e of frontmatter.errors) errors.push(`frontmatter: ${e}`);
} catch (e) {
  errors.push(`frontmatter validator unavailable: ${(e.stderr || e.message || '').toString().slice(0, 300)}`);
}

// Generated references must match the single docs/ source of truth.
try {
  execFileSync('python3', [join(root, 'scripts', 'quality', 'generate_skill_references.py'), '--check'], { stdio: 'pipe' });
} catch (e) {
  errors.push(`generated reference drift: ${(e.stdout || e.stderr || e.message || '').toString().slice(0, 300)}`);
}
const REQUIRED_REFS = ['skill-contract.md', 'hstack-v5.md', 'model-routing.md'];
for (const file of paths) {
  const name = basename(dirname(file));
  for (const ref of REQUIRED_REFS) {
    if (!existsSync(join(dirname(file), 'references', ref))) errors.push(`Missing bundled reference: ${name}/references/${ref}`);
  }
}

function localLinks(body) {
  const out = [];
  for (const hit of body.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
    const href = hit[1].trim().split(/\s+"/)[0];
    if (!href || /^(?:https?:|mailto:|data:|#)/i.test(href)) continue;
    out.push(decodeURIComponent(href.split('#')[0]));
  }
  return out;
}

const names = paths.map(p => basename(dirname(p)));
for (const file of paths) {
  const name = basename(dirname(file));
  const body = readFileSync(file, 'utf8');
  const description = body.match(/^description:\s*(.+)$/m)?.[1] || '';
  if (!description || !/use|entry point|when/i.test(description)) errors.push(`Missing trigger-focused description: ${name}`);
  if (/\bRetro\b|switchboard|burn bay/i.test(description)) errors.push(`Legacy theme in description: ${name}`);
  if (!body.includes('references/skill-contract.md')) errors.push(`Missing bundled contract reference: ${name}`);
  if (!body.includes('optional companions')) errors.push(`Missing optional-companion classification: ${name}`);
  if (/This skill (covers|extends) the \*\*W\d+/i.test(body)) errors.push(`Unresolved legacy workflow label: ${name}`);
  if (!/^#\s+[^\n]+/m.test(body)) errors.push(`Missing visible heading: ${name}`);
  if (/\b(pixel|pixels|voxel|voxels)\b/i.test(body)) errors.push(`Art-style term in textual skill: ${name}`);
  for (const href of localLinks(body)) {
    if (href.startsWith('references/')) {
      if (!existsSync(resolve(dirname(file), href))) errors.push(`Broken bundled reference in ${name}: ${href}`);
    } else if (/^\.\.\/[^/]+\/SKILL\.md$/.test(href)) {
      // Explicitly classified optional companion; absence is allowed in a
      // single-skill install, and a broken source link is still caught by check-links.
      if (!existsSync(resolve(dirname(file), href))) errors.push(`Broken companion link in source: ${name}: ${href}`);
    } else {
      errors.push(`Unexpected local link in ${name}: ${href}`);
    }
  }
}

// Router integrity: the /hstack table links every other skill exactly once.
const router = readFileSync(join(skillsDir, 'hstack', 'SKILL.md'), 'utf8');
const routed = [];
for (const line of router.split(/\r?\n/)) {
  if (!line.trim().startsWith('|')) continue;
  for (const m of line.matchAll(/\[[^\]]+\]\(\.\.\/([^/]+)\/SKILL\.md\)/g)) routed.push(m[1]);
}
const expectedRoutes = names.filter(n => n !== 'hstack').sort();
const routedSet = new Set(routed);
for (const n of expectedRoutes) if (!routedSet.has(n)) errors.push(`Router missing skill: ${n}`);
for (const n of routedSet) if (!expectedRoutes.includes(n)) errors.push(`Router has unknown skill: ${n}`);
if (routed.length !== routedSet.size) errors.push('Router has duplicate skill links');

// Cross-document consistency.
const readme = readFileSync(join(root, 'README.md'), 'utf8');
const workflows = readFileSync(join(root, 'docs', 'workflows.md'), 'utf8');
const sourceSkills = readFileSync(join(root, 'docs', 'source-skills.md'), 'utf8');
for (const name of names) {
  if (!readme.includes(`skills/${name}/SKILL.md`)) errors.push(`README missing route: ${name}`);
  if (!workflows.includes(`\`${name}\``)) errors.push(`docs/workflows.md missing route: ${name}`);
}
if (!sourceSkills.includes('bundled') || !sourceSkills.includes('optional')) {
  errors.push('source-skills.md must distinguish bundled from optional capabilities');
}

// Raw payload validation: copied individual skill, a selected subset (the
// shape a skills CLI install produces), the full collection, and the installer.
const checker = join(root, 'scripts', 'install', 'check-payload.mjs');
const installer = join(root, 'scripts', 'install', 'install.sh');
if (!existsSync(checker) || !existsSync(installer)) errors.push('Installer or payload checker missing');
else {
  const tmp = mkdtempSync(join(tmpdir(), 'hstack-payload-check-'));
  const check = (dir, selected, label) => {
    try {
      const out = execFileSync('node', [checker, dir, ...selected], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
      if (!out.includes('Payload OK')) errors.push(`${label}: checker did not report OK`);
    } catch (e) {
      errors.push(`${label}: ${(e.stdout || e.stderr || e.message || '').toString().slice(0, 300)}`);
    }
  };
  try {
    const rawAll = join(tmp, 'raw-all');
    cpSync(skillsDir, rawAll, { recursive: true });
    check(rawAll, names, 'raw full collection');

    const rawOne = join(tmp, 'raw-one');
    const one = names.find(n => n !== 'hstack');
    cpSync(join(skillsDir, one), join(rawOne, one), { recursive: true });
    check(rawOne, [one], 'raw copied individual skill');

    const selected = names.filter(n => ['hstack', 'interface-check', 'publish-git'].includes(n));
    const rawSelected = join(tmp, 'raw-selected');
    for (const s of selected) cpSync(join(skillsDir, s), join(rawSelected, s), { recursive: true });
    check(rawSelected, selected, 'skills-CLI-style selected install');

    const installed = join(tmp, 'installed');
    execFileSync('bash', [installer, '--all', '--skills-root', join(installed, 'skills')], { stdio: 'pipe' });
    check(join(installed, 'skills'), names, 'installer payload');
  } catch (e) {
    errors.push(`payload simulation failed: ${(e.stderr || e.message || '').toString().slice(0, 300)}`);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

console.log(`Validated ${paths.length} skills via PyYAML, ${frontmatter.count} frontmatters, ${routed.length} router links, generated refs and four payload shapes.`);
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log('HStack skill validation passed.');
