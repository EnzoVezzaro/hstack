// The whole HSTACK V5 map, top to bottom: you, the five layers, and what ships.
// Each layer is a platform with its tools' logos, plus a panel listing the
// layer's skills and models. A spine carries tasks down and reports back up.
// Skill-to-layer mapping comes from docs/hstack-v5.md ("Layer that runs it").
import {
  THREE, TAU, PAL, mat, glowMat, box, cyl, sphere, place, CanvasScreen, roundRect, hex,
  loadImg, svgImg, tile,
} from '../lib.js';
import { HERO, blocks, boxCells, tower, mascot } from '../kit.js';

// A logo on a camo cube (both faces the camera sees), standing at pos.
function standee(scene, tex, pos, size = 1.0) {
  const cell = size * 0.82;
  const g = tower({ nx: 1, ny: 1, nz: 1, cell, seed: 9, panels: [
    { face: 'z', v: cell / 2, image: tex.canvas, size: cell * 0.88 },
    { face: 'x', v: cell / 2, image: tex.canvas, size: cell * 0.88 },
  ] });
  g.position.copy(pos);
  scene.add(g);
  return g;
}

// Crew member: a camo cube with its role glyph.
function crewCube(scene, kind, accent, smoking) {
  const icon = kind === 'director' ? 'crown' : kind === 'assistant' ? 'headset' : 'laptop';
  const panels = [{ face: 'z', v: 0.25, icon, color: accent, size: 0.44 }];
  if (smoking) panels.push({ face: 'x', v: 0.25, icon: 'leaf', color: 0x7fa86a, size: 0.44, glow: 0.8 });
  const g = tower({ nx: 1, ny: 1, nz: 1, cell: 0.5, seed: 21, panels });
  scene.add(g);
  return g;
}

// Section heights (screen units) follow each panel's content, so nothing floats in empty space.
const PANEL_W = 7.8;
const PX = 1150 / PANEL_W; // panel canvas px per world unit
const content = { you: 300, 1: 500, 2: 460, 3: 590, 4: 992, 5: 372, out: 416 };
const minH = { you: 4.3, 1: 3.4, 2: 3.4, 3: 3.4, 4: 3.4, 5: 3.4, out: 3.4 };
const ORDER = ['you', 1, 2, 3, 4, 5, 'out'];
const TITLE_H = 2.1;
const GAP = 0.55;
const PANEL_H = Object.fromEntries(ORDER.map((k) => [k, content[k] / PX]));
const SEC_H = Object.fromEntries(ORDER.map((k) => [k, Math.max(PANEL_H[k], minH[k]) + GAP]));
export const TOTAL = TITLE_H + ORDER.reduce((a, k) => a + SEC_H[k], 0) + 1.0;
export const view = { size: TOTAL / 2, target: [0, 0, 0], elevation: 30 };
export const bloom = { strength: 0.55, radius: 0.4, threshold: 0.82 };
export const exposure = 1.3;
export const shadowSize = 34;
export const shadowFar = 140;

const COS = Math.cos(THREE.MathUtils.degToRad(30));
const R = new THREE.Vector3(1, 0, -1).normalize();
const TOWARD = new THREE.Vector3(1, 0, 1).normalize();
const at = (sx, sy) => R.clone().multiplyScalar(sx).add(new THREE.Vector3(0, sy / COS, 0));

const LOGO = 'assets/logos/';
const SKILLS = {
  1: ['hstack', '420', 'a-new-day', 'plan-horizon', 'wrap-day', 'blocker-radar', 'horizon', 'cleanup-chats', 'setup-hstack', 'skill-workbench', 'token-balancer', 'take-one-dude'],
  2: ['coordinate-agents', 'relay-room', 'stoner', 'handoff', 'resume-work', 'resume-all', 'cleanup-orca', 'cleanup-worktrees-branches', 'pineapple-express', 'ace-workspace'],
  3: ['break-it-down', 'patch-patrol', 'security-backend', 'ui-design', 'release', 'publish-git', 'deploy', 'seo-audit', 'product-hunt-launch', 'proagent-equip'],
  4: ['implement-feature', 'verify-and-fix', 'fix-ci', 'puff-puff-pass', 'reconcile-branches', 'horizon-loop', 'horizon-loop-test', 'research-explain', 'check-github', 'get-stoned', 'save-point', 'setup-install', 'cleanup-refactor', 'cleanup-disk-space', 'run-local', 'let-me-watch', 'docs-content', 'humanize', 'antislop-review', 'motion-graphic', 'write-readme-opensource', 'set-analytics', 'acc-context', 'protect-repo', 'reposell-release', 'benchmark'],
  5: ['visual-test', 'interface-check', 'horizon-loop-ego-lite', 'haf'],
};

const COLORS = { you: PAL.cream, 1: PAL.blue, 2: PAL.violet, 3: PAL.gold, 4: PAL.mint, 5: PAL.coral, out: PAL.cream };
const SECTIONS = (() => {
  let top = TOTAL / 2 - TITLE_H;
  return ORDER.map((key) => {
    const sec = { key, top, h: SEC_H[key], ph: PANEL_H[key], color: COLORS[key] };
    top -= SEC_H[key];
    return sec;
  });
})();

const PLATFORM_X = -3.85;
const PANEL_X = 3.75;

function platform(scene, pos, color, lx = 5.0, lz = 3.0) {
  const g = new THREE.Group();
  g.position.copy(pos);
  const cell = 0.5;
  const nx = Math.round(lx / cell), nz = Math.round(lz / cell);
  const slab = blocks(boxCells(0, 0, 0, nx, 1, nz), { cell, seed: Math.round(pos.y * 10) & 255 });
  slab.position.set((-nx * cell) / 2, -cell, (-nz * cell) / 2);
  g.add(slab);
  g.add(place(box(lx + 0.04, 0.05, 0.05, glowMat(color, 1.6), { r: 0.02, shadow: false }), 0, -0.1, lz / 2 + 0.01));
  g.add(place(box(0.05, 0.05, lz + 0.04, glowMat(color, 1.6), { r: 0.02, shadow: false }), lx / 2 + 0.01, -0.1, 0));
  scene.add(g);
  return g;
}

// Camera-facing panel with a layer's title, models, and skills.
function panel(scene, camera, { top, ph, color }, draw) {
  const cw = 1150;
  const ch = Math.round((cw * ph) / PANEL_W);
  const screen = new CanvasScreen(cw, ch, (ctx, w, hh, t) => {
    ctx.clearRect(0, 0, w, hh);
    ctx.fillStyle = 'rgba(20,26,21,0.95)';
    roundRect(ctx, 6, 6, w - 12, hh - 12, 36); ctx.fill();
    ctx.strokeStyle = hex(color); ctx.globalAlpha = 0.75; ctx.lineWidth = 5; ctx.stroke(); ctx.globalAlpha = 1;
    draw(ctx, w, hh, t);
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(PANEL_W, ph), new THREE.MeshStandardMaterial({ color: 0, map: screen.texture, emissive: 0xffffff, emissiveMap: screen.texture, emissiveIntensity: 1.0, transparent: true, depthTest: false }));
  mesh.position.copy(at(PANEL_X, top - 0.15 - ph / 2)).add(TOWARD.clone().multiplyScalar(3));
  mesh.quaternion.copy(camera.quaternion);
  mesh.renderOrder = 10;
  scene.add(mesh);
  return screen;
}

function header(ctx, x, y, tag, title, sub, color) {
  ctx.fillStyle = hex(color);
  ctx.font = '400 30px "HStack Type", monospace';
  const tw = ctx.measureText(tag).width + 36;
  roundRect(ctx, x, y, tw, 46, 14); ctx.fill();
  ctx.fillStyle = '#0a120e'; ctx.fillText(tag, x + 18, y + 33);
  ctx.fillStyle = '#e8d6b4'; ctx.font = '400 60px "HStack Type", monospace';
  ctx.fillText(title, x + tw + 24, y + 42);
  ctx.fillStyle = '#9fb3a6'; ctx.font = '400 32px "HStack Type", monospace';
  ctx.fillText(sub, x, y + 98);
  return y + 128;
}

function models(ctx, x, y, rows) {
  rows.forEach(([tier, color, text]) => {
    ctx.fillStyle = hex(color); roundRect(ctx, x, y - 30, 70, 40, 10); ctx.fill();
    ctx.fillStyle = '#0a120e'; ctx.font = '400 26px "HStack Type", monospace'; ctx.fillText(tier, x + 13, y - 2);
    ctx.fillStyle = '#e8d6b4'; ctx.font = '400 27px "HStack Type", monospace'; ctx.fillText(text, x + 88, y);
    y += 48;
  });
  return y + 6;
}

function skillGrid(ctx, x, y, w, names, color) {
  const cols = 2;
  const colW = (w - x * 2) / cols;
  const rows = Math.ceil(names.length / cols);
  ctx.font = '400 31px "HStack Type", monospace';
  names.forEach((n, i) => {
    const c = Math.floor(i / rows);
    const r = i % rows;
    const cx = x + c * colW;
    const cy = y + r * 44;
    ctx.fillStyle = hex(color); ctx.beginPath(); ctx.arc(cx + 9, cy - 10, 7, 0, TAU); ctx.fill();
    ctx.fillStyle = '#e8d6b4'; ctx.fillText('/' + n, cx + 28, cy);
  });
  return y + rows * 44;
}

export async function build({ scene, camera, sun, hemi }) {
  sun.intensity = 1.9;
  hemi.intensity = 0.9;
  const updates = [];
  const screens = [];

  // ---- load logos
  const png = (n) => loadImg(LOGO + n + '.png');
  const [chatgpt, orca, egolite, oreja, opencode] = await Promise.all(['chatgpt', 'orca', 'egolite', 'oreja', 'opencode'].map(png));
  const [openai, claude, anthropic, nvidia, gemini, xiaomi, github, posthog, freebuff] = await Promise.all([
    svgImg('openai', '#e8d6b4'), svgImg('claude', '#ffffff'), svgImg('anthropic', '#e8d6b4'), svgImg('nvidia', '#ffffff'),
    svgImg('googlegemini', '#ffffff'), svgImg('xiaomi', '#ffffff'), svgImg('github', '#e8d6b4'), svgImg('posthog', '#0a120e'), svgImg('freebuff', '#ffffff'),
  ]);
  const T = {
    chatgpt: Object.assign(tile({ img: chatgpt, full: true, bg: '#ffffff' }), { glow: 0.5 }),
    codex: tile({ img: openai, bg: '#0a0a0a', ring: '#3a4640' }),
    oreja: Object.assign(tile({ img: oreja, full: true, bg: '#f2e6c9' }), { glow: 0.6 }),
    orca: tile({ img: orca, full: true, bg: '#000000' }),
    claude: tile({ img: claude, bg: '#d97757', ring: '#f0a585' }),
    anthropic: tile({ img: anthropic, bg: '#191919', ring: '#3a4640' }),
    opencode: tile({ img: opencode, full: true, bg: '#0a0a0a' }),
    freebuff: tile({ img: freebuff, bg: '#2b302d', ring: '#ff5d5d', stamp: 'SUSPENDED' }),
    nvidia: tile({ img: nvidia, bg: '#76b900', ring: '#9bd43a' }),
    mimo: tile({ img: xiaomi, bg: '#3a3a3a', ring: '#555555', dim: true }),
    gemini: tile({ img: gemini, bg: '#3a3a3a', ring: '#555555', dim: true }),
    deepseek: tile({ text: 'DeepSeek', bg: '#2b302d', ring: '#555555', textColor: '#7f8a84' }),
    kimi: tile({ text: 'Kimi', bg: '#2b302d', ring: '#555555', textColor: '#7f8a84' }),
    glm: tile({ text: 'GLM', bg: '#2d3e9e', ring: '#6074d6', textColor: '#ffffff' }),
    egolite: Object.assign(tile({ img: egolite, full: true, bg: '#ffffff' }), { glow: 0.5 }),
    computer: tile({ text: 'CU', bg: '#1d2a23', ring: '#fa866d', textColor: '#fa866d' }),
    github: tile({ img: github, bg: '#161b22', ring: '#3a4640' }),
    posthog: Object.assign(tile({ img: posthog, bg: '#f9bd2b', ring: '#ffd66b' }), { glow: 0.7 }),
  };

  const sec = Object.fromEntries(SECTIONS.map((s) => [s.key, s]));
  const platPos = {};

  // ---- title band
  const title = new CanvasScreen(1600, 170, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#ffc44a'; ctx.font = '400 76px "HStack Type", monospace'; ctx.textAlign = 'center';
    ctx.fillText('HSTACK V5 · the whole map', w / 2, 82);
    ctx.fillStyle = '#9fb3a6'; ctx.font = '400 38px "HStack Type", monospace';
    ctx.fillText(`${Object.values(SKILLS).flat().length} skills · 5 layers · 4 tiers · $40/mo · $50 with Go`, w / 2, 142);
  });
  title.draw(0);
  const titleMesh = new THREE.Mesh(new THREE.PlaneGeometry(15, 1.6), new THREE.MeshStandardMaterial({ color: 0, map: title.texture, emissive: 0xffffff, emissiveMap: title.texture, emissiveIntensity: 1.0, transparent: true, depthTest: false }));
  titleMesh.position.copy(at(0, TOTAL / 2 - 1.05)).add(TOWARD.clone().multiplyScalar(3));
  titleMesh.quaternion.copy(camera.quaternion);
  titleMesh.renderOrder = 10;
  scene.add(titleMesh);

  // ---- YOU
  {
    const s = sec.you;
    const pos = at(PLATFORM_X, s.top - 3.15);
    platPos.you = pos;
    const disc = blocks(boxCells(-3, 0, -3, 6, 1, 6, { shell: false }).filter(([x, , z]) => Math.hypot(x + 0.5, z + 0.5) < 3.1), { cell: 0.5, seed: 77 });
    disc.position.set(pos.x, pos.y - 0.5, pos.z);
    scene.add(disc);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.52, 0.04, 8, 64), glowMat(PAL.cream, 1.4));
    ring.rotation.x = Math.PI / 2; ring.position.set(pos.x, pos.y - 0.08, pos.z);
    scene.add(ring);
    // You: the mascot on a camo cube.
    const person = tower({ nx: 1, ny: 1, nz: 1, cell: 1.0, seed: 3, panels: [
      { face: 'z', v: 0.5, image: mascot(), size: 0.9 },
      { face: 'x', v: 0.5, image: mascot(), size: 0.9 },
    ] });
    person.position.copy(pos);
    scene.add(person);
    const rings = [0, 1, 2].map(() => {
      const r = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.02, 8, 40), new THREE.MeshBasicMaterial({ color: new THREE.Color(PAL.gold).multiplyScalar(1.4), transparent: true, toneMapped: false }));
      r.rotation.x = Math.PI / 2;
      scene.add(r);
      return r;
    });
    updates.push((t) => rings.forEach((r, i) => {
      const k = (t * 2 + i / 3) % 1;
      r.position.set(pos.x, pos.y + 1.95 + k * 0.4, pos.z);
      r.scale.setScalar(0.5 + k * 1.1);
      r.material.opacity = (1 - k) * 0.7;
    }));
    const quote = '/hstack <project> fix bug';
    screens.push(panel(scene, camera, s, (ctx, w, h, t) => {
      let y = header(ctx, 40, 36, 'YOU', 'The owner', 'Talks, decides, approves. Nothing ships without a yes.', s.color);
      const k = Math.min(1, t * 1.6);
      ctx.fillStyle = '#16221c'; roundRect(ctx, 40, y + 4, w - 80, 70, 16); ctx.fill();
      ctx.fillStyle = '#ffc44a'; ctx.font = '400 32px "HStack Type", monospace';
      const shown = quote.slice(0, Math.ceil(k * quote.length));
      ctx.fillText(shown, 64, y + 50);
      if (Math.floor(t * 12) % 2 === 0) { const tw = ctx.measureText(shown).width; ctx.fillRect(66 + tw, y + 22, 14, 34); }
    }));
  }

  // ---- generic layer builder
  const layer = (key, { tag, titleText, sub, logos, extra, modelRows = [], robots = [] }) => {
    const s = sec[key];
    const pos = at(PLATFORM_X, s.top - Math.max(2.2, s.h / 2 - 0.2));
    platPos[key] = pos;
    platform(scene, pos, s.color);
    const n = logos.length;
    const spread = Math.min(2.0, 0.55 * (n - 1) + 0.2);
    logos.forEach((tex, i) => {
      const off = n === 1 ? 0 : -spread + (2 * spread * i) / (n - 1);
      const p = pos.clone().add(R.clone().multiplyScalar(off)).add(TOWARD.clone().multiplyScalar(-0.45));
      const st = standee(scene, tex, p, n > 4 ? 0.82 : 1.0);
      const base = st.position.y;
      updates.push((t) => { st.position.y = base + Math.sin((t * 2 + i * 0.17) * TAU) * 0.03; });
    });
    if (extra) extra(pos);
    robots.forEach(([kind, accent, off, mode, smoking]) => {
      const r = crewCube(scene, kind, accent, smoking);
      const home = pos.clone().add(R.clone().multiplyScalar(off)).add(TOWARD.clone().multiplyScalar(0.85));
      updates.push((t) => {
        r.position.copy(home);
        r.position.y += Math.abs(Math.sin((t * 3 + off * 0.3) * TAU)) * 0.05;
      });
    });
    screens.push(panel(scene, camera, s, (ctx, w) => {
      let y = header(ctx, 40, 36, tag, titleText, sub, s.color);
      if (modelRows.length) y = models(ctx, 40, y + 30, modelRows);
      skillGrid(ctx, 40, y + 34, w, SKILLS[key], s.color);
    }));
  };

  layer(1, {
    tag: 'LAYER 1', titleText: 'Assistant', sub: 'ChatGPT and Codex talk with you · Oreja keeps the music polite',
    logos: [T.chatgpt, T.codex, T.oreja],
    robots: [['assistant', PAL.blue, 1.25, 'idle']],
  });
  layer(2, {
    tag: 'LAYER 2', titleText: 'Orchestrator', sub: 'Orca routes sessions, context, and work · free, open source',
    logos: [T.orca],
    extra: (pos) => {
      [-1.25, 1.25].forEach((off, i) => {
        const rack = new THREE.Group();
        const p = pos.clone().add(R.clone().multiplyScalar(off)).add(TOWARD.clone().multiplyScalar(-0.5));
        rack.position.copy(p);
        rack.rotation.y = Math.PI / 4;
        rack.add(tower({ nx: 1, ny: 3, nz: 1, cell: 0.42, seed: 50 + i, panels: [{ face: 'z', v: 0.84, icon: 'server', color: HERO.gold, size: 0.38 }] }));
        const leds = [];
        for (let k = 0; k < 6; k++) {
          const led = place(box(0.05, 0.05, 0.02, glowMat(k % 2 ? PAL.mint : PAL.gold, 2.6), { r: 0.01, shadow: false }), 0.16, 0.2 + k * 0.17, 0.26);
          rack.add(led);
          leds.push(led);
        }
        scene.add(rack);
        updates.push((t) => leds.forEach((l, k) => (l.visible = Math.sin((t * (2 + ((k + i) % 3)) + k * 0.31) * TAU) > -0.25)));
      });
    },
  });
  layer(3, {
    tag: 'LAYER 3', titleText: 'Directors', sub: 'Claude Code and Codex decide, design, and accept the work',
    logos: [T.claude, T.anthropic, T.codex],
    modelRows: [['T3', PAL.coral, 'High mode: Fable · Astra'], ['T2', PAL.gold, 'Directors: Opus · GPT Sol · OpenCode Go']],
    robots: [['director', PAL.gold, -1.3, 'inspect'], ['director', PAL.gold, 1.3, 'idle', true]],
  });
  layer(4, {
    tag: 'LAYER 4', titleText: 'Workers', sub: 'OpenCode, Claude Code, Codex · free models first · Freebuff benched',
    logos: [T.opencode, T.freebuff, T.nvidia, T.mimo, T.gemini],
    modelRows: [
      ['T1', PAL.blue, 'Supervisors: Sonnet · Terra · OpenCode Go'],
      ['T0', PAL.mint, 'Workers: Haiku · Luna · OpenCode Go or free'],
      ['OFF', PAL.red, 'Freebuff (suspended): MiMo · DeepSeek V4 · Kimi K2.7'],
    ],
    extra: (pos) => {
      [T.deepseek, T.kimi, T.glm].forEach((tex, i) => {
        const p = pos.clone().add(R.clone().multiplyScalar(-1.0 + i * 1.0)).add(TOWARD.clone().multiplyScalar(0.55));
        standee(scene, tex, p, 0.55, 0.12);
      });
    },
    robots: [['worker', PAL.mint, -1.7, 'type'], ['worker', PAL.mint, 1.7, 'type']],
  });
  layer(5, {
    tag: 'LAYER 5', titleText: 'Operators', sub: 'Ego Lite for websites · computer use for desktop apps',
    logos: [T.egolite, T.computer],
    robots: [['worker', PAL.coral, 0, 'idle']],
  });

  // ---- what ships
  {
    const s = sec.out;
    const pos = at(PLATFORM_X, s.top - 2.2);
    platPos.out = pos;
    platform(scene, pos, s.color, 5.0, 2.8);
    [T.github, T.posthog].forEach((tex, i) => standee(scene, tex, pos.clone().add(R.clone().multiplyScalar(-0.9 + i * 1.8)).add(TOWARD.clone().multiplyScalar(-0.4))));
    const crates = [];
    for (let i = 0; i < 3; i++) {
      const c = new THREE.Group();
      c.add(place(box(0.4, 0.34, 0.4, mat(PAL.creamDark, { r: 0.6 }), { r: 0.04 }), 0, 0.17, 0));
      c.add(place(box(0.16, 0.1, 0.01, glowMat(PAL.mint, 2.2), { r: 0.01 }), 0, 0.17, 0.205));
      c.rotation.y = Math.PI / 4;
      scene.add(c);
      crates.push(c);
    }
    updates.push((t) => crates.forEach((c, i) => {
      const k = (t + i / 3) % 1;
      c.position.copy(pos.clone().add(R.clone().multiplyScalar(-1.6 + k * 3.2)).add(TOWARD.clone().multiplyScalar(0.75)));
      c.scale.setScalar(Math.max(0.001, Math.min(1, k * 8, (1 - k) * 8)));
    }));
    screens.push(panel(scene, camera, s, (ctx, w) => {
      let y = header(ctx, 40, 36, 'OUT', 'What ships', 'Merged PRs, releases, deploys, analytics, and my own tools', s.color);
      ctx.fillStyle = '#ffc44a'; ctx.font = '400 25px "HStack Type", monospace';
      ctx.fillText('DEPLOY TO: GitHub · Vercel · AWS · Google Cloud · Cloudflare', 40, y + 14);
      const items = ['GitHub PRs and releases', 'PostHog analytics', 'ACC · agent code context', 'Repo Shield · AI-training notice', 'reposell · paid releases', 'ProAgents · specialist profiles', 'ACE · crew workspaces', 'Oreja · music that steps aside'];
      skillGridPlain(ctx, 40, y + 56, w, items, s.color);
    }));
  }

  // ---- the spine: tasks down, reports up
  const order = ['you', 1, 2, 3, 4, 5, 'out'];
  for (let i = 0; i < order.length - 1; i++) {
    const a = platPos[order[i]].clone().add(R.clone().multiplyScalar(-2.55)).add(new THREE.Vector3(0, -0.1, 0));
    const b = platPos[order[i + 1]].clone().add(R.clone().multiplyScalar(-2.55)).add(new THREE.Vector3(0, 0.05, 0));
    const curve = new THREE.LineCurve3(a, b);
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 8, 0.06, 10, false), mat(PAL.metalDark, { m: 0.5, r: 0.4 }));
    scene.add(tube);
    const down = [0, 1].map(() => { const p = box(0.16, 0.16, 0.16, glowMat(PAL.gold, 3), { r: 0.03, shadow: false }); scene.add(p); return p; });
    const up = box(0.13, 0.13, 0.13, glowMat(PAL.mint, 3), { r: 0.03, shadow: false });
    scene.add(up);
    updates.push((t) => {
      down.forEach((p, k) => p.position.copy(curve.getPointAt((t * 2 + k / 2 + i * 0.13) % 1)));
      up.position.copy(curve.getPointAt(1 - ((t * 2 + 0.25 + i * 0.13) % 1)));
    });
    [a, b].forEach((pt) => scene.add(place(sphere(0.11, glowMat(PAL.cream, 1.4), 12), pt.x, pt.y, pt.z)));
  }
  const legend = new CanvasScreen(512, 200, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.font = '400 38px "HStack Type", monospace';
    ctx.fillStyle = '#ffc44a'; ctx.fillText('■ tasks ↓', 20, 70);
    ctx.fillStyle = '#9ee68a'; ctx.fillText('■ reports ↑', 20, 140);
  });
  legend.draw(0);
  const legendMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.94), new THREE.MeshStandardMaterial({ color: 0, map: legend.texture, emissive: 0xffffff, emissiveMap: legend.texture, emissiveIntensity: 1.0, transparent: true, depthTest: false }));
  legendMesh.position.copy(at(-6.55, TOTAL / 2 - 1.0)).add(TOWARD.clone().multiplyScalar(3));
  legendMesh.quaternion.copy(camera.quaternion);
  legendMesh.renderOrder = 10;
  scene.add(legendMesh);

  return (t) => {
    screens.forEach((sc) => sc.draw(t));
    updates.forEach((u) => u(t));
  };
}

function skillGridPlain(ctx, x, y, w, items, color) {
  const cols = 2;
  const colW = (w - x * 2) / cols;
  const rows = Math.ceil(items.length / cols);
  ctx.font = '400 29px "HStack Type", monospace';
  items.forEach((n, i) => {
    const c = Math.floor(i / rows);
    const r = i % rows;
    ctx.fillStyle = hex(color); ctx.beginPath(); ctx.arc(x + c * colW + 9, y + r * 44 - 10, 7, 0, TAU); ctx.fill();
    ctx.fillStyle = '#e8d6b4'; ctx.fillText(n, x + c * colW + 28, y + r * 44);
  });
}
