// The whole HSTACK V5 map, top to bottom: you, the five layers, and what ships.
// Each layer is a platform with its tools' logos, plus a panel listing the
// layer's skills and models. A spine carries tasks down and reports back up.
// Skill-to-layer mapping comes from docs/hstack-v5.md ("Layer that runs it").
import {
  THREE, TAU, PAL, mat, glowMat, box, cyl, sphere, place, CanvasScreen, roundRect, hex,
  robot, animateRobot,
} from '../lib.js';

// Section heights (screen units) follow each panel's content, so nothing floats in empty space.
const PANEL_W = 7.8;
const PX = 1150 / PANEL_W; // panel canvas pixels per unit
const content = { you: 300, 1: 545, 2: 460, 3: 590, 4: 1040, 5: 372, out: 416 };
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
  1: ['hstack', '420', 'a-new-day', 'plan-horizon', 'wrap-day', 'blocker-radar', 'horizon', 'cleanup-chats', 'setup-hstack', 'skill-workbench'],
  2: ['coordinate-agents', 'relay-room', 'stoner', 'handoff', 'resume-work', 'cleanup-orca', 'cleanup-worktrees-branches', 'pineapple-express', 'ace-workspace'],
  3: ['break-it-down', 'patch-patrol', 'security-backend', 'ui-design', 'release', 'publish-git', 'deploy', 'seo-audit', 'product-hunt-launch', 'proagent-equip'],
  4: ['implement-feature', 'verify-and-fix', 'fix-ci', 'puff-puff-pass', 'reconcile-branches', 'horizon-loop', 'horizon-loop-test', 'research-explain', 'check-github', 'get-stoned', 'save-point', 'setup-install', 'cleanup-refactor', 'cleanup-disk-space', 'run-local', 'let-me-watch', 'docs-content', 'humanize', 'antislop-review', 'motion-graphic', 'write-readme-opensource', 'set-analytics', 'acc-context', 'protect-repo', 'reposell-release'],
  5: ['visual-test-ego-lite', 'visual-test-computer-use', 'interface-check', 'horizon-loop-ego-lite', 'haf'],
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

function loadImg(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`image failed: ${src}`));
    img.src = src;
  });
}

async function svgImg(name, color) {
  const txt = await (await fetch(LOGO + name + '.svg')).text();
  const sized = txt.replace('<svg', `<svg width="512" height="512" fill="${color}"`);
  return loadImg('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(sized));
}

// Square logo tile: either an app icon (PNG), a brand mark (SVG) on a colored
// tile, or a plain text chip for providers without a usable mark.
function tile({ img, bg = '#101a15', ring = '#2a3b31', text = null, textColor = '#e8d6b4', full = false }) {
  const s = new CanvasScreen(320, 320, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = bg;
    roundRect(ctx, 6, 6, w - 12, h - 12, 64); ctx.fill();
    ctx.strokeStyle = ring; ctx.lineWidth = 8; ctx.stroke();
    if (img) {
      const pad = full ? 18 : 62;
      ctx.save();
      roundRect(ctx, pad, pad, w - pad * 2, h - pad * 2, full ? 52 : 0);
      ctx.clip();
      ctx.drawImage(img, pad, pad, w - pad * 2, h - pad * 2);
      ctx.restore();
    } else if (text) {
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const size = text.length > 6 ? 58 : text.length > 3 ? 76 : 110;
      ctx.font = `800 ${size}px Helvetica, Arial, sans-serif`;
      ctx.fillText(text, w / 2, h / 2 + 4);
    }
  });
  s.draw(0);
  return s;
}

function standee(scene, tex, pos, size = 1.0, raise = 0.32) {
  const g = new THREE.Group();
  g.position.copy(pos);
  g.rotation.y = Math.PI / 4;
  g.add(place(box(0.55, raise, 0.3, mat(PAL.metalDark, { m: 0.5, r: 0.4 }), { r: 0.04 }), 0, raise / 2, 0));
  g.add(place(box(size + 0.06, size + 0.06, 0.07, mat(PAL.rubber, { r: 0.4 }), { r: 0.06 }), 0, raise + 0.02 + size / 2, -0.02));
  const face = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshStandardMaterial({ color: 0, map: tex.texture, emissive: 0xffffff, emissiveMap: tex.texture, emissiveIntensity: tex.glow ?? 0.85, transparent: true }));
  face.position.set(0, raise + 0.02 + size / 2, 0.02);
  g.add(face);
  scene.add(g);
  return g;
}

function platform(scene, pos, color, lx = 5.0, lz = 3.0) {
  const g = new THREE.Group();
  g.position.copy(pos);
  g.add(place(box(lx, 0.34, lz, mat(PAL.strataA, { r: 0.9 }), { r: 0.08 }), 0, -0.17, 0));
  g.add(place(box(lx - 0.06, 0.04, lz - 0.06, mat(PAL.floor, { r: 0.9 }), { r: 0.02 }), 0, 0.01, 0));
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
    ctx.fillStyle = 'rgba(9,18,14,0.94)';
    roundRect(ctx, 6, 6, w - 12, hh - 12, 36); ctx.fill();
    ctx.strokeStyle = hex(color); ctx.globalAlpha = 0.75; ctx.lineWidth = 5; ctx.stroke(); ctx.globalAlpha = 1;
    draw(ctx, w, hh, t);
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(PANEL_W, ph), new THREE.MeshStandardMaterial({ color: 0, map: screen.texture, emissive: 0xffffff, emissiveMap: screen.texture, emissiveIntensity: 1.0, transparent: true }));
  mesh.position.copy(at(PANEL_X, top - 0.15 - ph / 2)).add(TOWARD.clone().multiplyScalar(3));
  mesh.quaternion.copy(camera.quaternion);
  scene.add(mesh);
  return screen;
}

function header(ctx, x, y, tag, title, sub, color) {
  ctx.fillStyle = hex(color);
  ctx.font = '800 30px Menlo, monospace';
  const tw = ctx.measureText(tag).width + 36;
  roundRect(ctx, x, y, tw, 46, 14); ctx.fill();
  ctx.fillStyle = '#0a120e'; ctx.fillText(tag, x + 18, y + 33);
  ctx.fillStyle = '#e8d6b4'; ctx.font = '800 60px Helvetica, Arial, sans-serif';
  ctx.fillText(title, x + tw + 24, y + 42);
  ctx.fillStyle = '#9fb3a6'; ctx.font = '500 32px Helvetica, Arial, sans-serif';
  ctx.fillText(sub, x, y + 98);
  return y + 128;
}

function models(ctx, x, y, rows) {
  rows.forEach(([tier, color, text]) => {
    ctx.fillStyle = hex(color); roundRect(ctx, x, y - 30, 70, 40, 10); ctx.fill();
    ctx.fillStyle = '#0a120e'; ctx.font = '800 26px Menlo, monospace'; ctx.fillText(tier, x + 13, y - 2);
    ctx.fillStyle = '#e8d6b4'; ctx.font = '500 27px Menlo, monospace'; ctx.fillText(text, x + 88, y);
    y += 48;
  });
  return y + 6;
}

function skillGrid(ctx, x, y, w, names, color) {
  const cols = 2;
  const colW = (w - x * 2) / cols;
  const rows = Math.ceil(names.length / cols);
  ctx.font = '600 31px Menlo, monospace';
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
    freebuff: tile({ img: freebuff, bg: '#2f7d4f', ring: '#57a873' }),
    nvidia: tile({ img: nvidia, bg: '#76b900', ring: '#9bd43a' }),
    mimo: tile({ img: xiaomi, bg: '#ff6900', ring: '#ff9447' }),
    gemini: tile({ img: gemini, bg: '#3b6fe8', ring: '#7aa0f5' }),
    deepseek: tile({ text: 'DeepSeek', bg: '#4d6bfe', ring: '#8197ff', textColor: '#ffffff' }),
    kimi: tile({ text: 'Kimi', bg: '#111111', ring: '#3a4640', textColor: '#ffffff' }),
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
    ctx.fillStyle = '#ffc44a'; ctx.font = '800 76px Helvetica, Arial, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('HSTACK V5 · the whole map', w / 2, 82);
    ctx.fillStyle = '#9fb3a6'; ctx.font = '500 38px Menlo, monospace';
    ctx.fillText(`${Object.values(SKILLS).flat().length} skills · 5 layers · 4 model tiers · $40/mo`, w / 2, 142);
  });
  title.draw(0);
  const titleMesh = new THREE.Mesh(new THREE.PlaneGeometry(15, 1.6), new THREE.MeshStandardMaterial({ color: 0, map: title.texture, emissive: 0xffffff, emissiveMap: title.texture, emissiveIntensity: 1.0, transparent: true }));
  titleMesh.position.copy(at(0, TOTAL / 2 - 1.05)).add(TOWARD.clone().multiplyScalar(3));
  titleMesh.quaternion.copy(camera.quaternion);
  scene.add(titleMesh);

  // ---- YOU
  {
    const s = sec.you;
    const pos = at(PLATFORM_X, s.top - 3.15);
    platPos.you = pos;
    scene.add(place(cyl(1.5, 1.6, 0.3, mat(PAL.strataA, { r: 0.9 }), 48), pos.x, pos.y - 0.15, pos.z));
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.52, 0.04, 8, 64), glowMat(PAL.cream, 1.4));
    ring.rotation.x = Math.PI / 2; ring.position.set(pos.x, pos.y - 0.08, pos.z);
    scene.add(ring);
    const person = new THREE.Group();
    person.position.copy(pos);
    person.rotation.y = Math.PI / 4;
    person.add(place(cyl(0.32, 0.4, 0.95, mat(PAL.green2, { r: 0.8 }), 24), 0, 0.5, 0));
    person.add(place(sphere(0.33, mat(PAL.green2, { r: 0.8 }), 20), 0, 0.98, 0));
    person.add(place(sphere(0.3, mat(0xd9a77c, { r: 0.6 }), 24), 0, 1.45, 0));
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.31, 0.03, 8, 24, Math.PI), mat(PAL.rubber));
    band.position.y = 1.48; band.rotation.y = Math.PI / 2;
    person.add(band);
    [-0.31, 0.31].forEach((x) => { const cup = place(cyl(0.08, 0.08, 0.07, mat(PAL.rubber), 14), 0, 1.45, x); cup.rotation.x = Math.PI / 2; person.add(cup); });
    person.add(place(box(0.03, 0.03, 0.22, mat(PAL.rubber), { r: 0.01 }), 0.15, 1.33, 0.2));
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
    const quote = '/hstack fix the signup bug';
    screens.push(panel(scene, camera, s, (ctx, w, h, t) => {
      let y = header(ctx, 40, 36, 'YOU', 'The owner', 'Talks, decides, approves. Nothing ships without a yes.', s.color);
      const k = Math.min(1, t * 1.6);
      ctx.fillStyle = '#16221c'; roundRect(ctx, 40, y + 4, w - 80, 70, 16); ctx.fill();
      ctx.fillStyle = '#ffc44a'; ctx.font = '600 32px Menlo, monospace';
      const shown = quote.slice(0, Math.floor(k * quote.length));
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
    robots.forEach(([kind, accent, off, mode]) => {
      const r = robot({ kind, accent, scale: 0.42 });
      r.position.copy(pos.clone().add(R.clone().multiplyScalar(off)).add(TOWARD.clone().multiplyScalar(0.85)));
      r.rotation.y = Math.PI / 4;
      scene.add(r);
      updates.push((t) => animateRobot(r, t, { mode, phase: off * 0.3 + 0.2 }));
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
    modelRows: [['T2', PAL.gold, 'gpt-6-luna (Codex) · ChatGPT']],
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
        rack.add(place(box(0.6, 1.25, 0.5, mat(PAL.metalDark, { m: 0.5, r: 0.4 }), { r: 0.03 }), 0, 0.63, 0));
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
    modelRows: [['T2', PAL.gold, 'gpt-6-luna (medium) · Claude Sonnet'], ['T3', PAL.coral, 'Codex on high effort · Claude Opus']],
    robots: [['director', PAL.gold, -1.3, 'inspect'], ['director', PAL.gold, 1.3, 'idle']],
  });
  layer(4, {
    tag: 'LAYER 4', titleText: 'Workers', sub: 'OpenCode, Freebuff, Claude Code, Codex · free models first',
    logos: [T.opencode, T.freebuff, T.nvidia, T.mimo, T.gemini],
    modelRows: [
      ['T0', PAL.mint, 'big-pickle · space-bunny-free · glm-5.3-flash'],
      ['T0', PAL.mint, 'nemotron-3.5-lightning · mimo-v2.6-pro'],
      ['T0', PAL.mint, 'DeepSeek V4 Flash (Freebuff)'],
      ['T1', PAL.blue, 'glm-5.3 · nemotron-3-ultra · DeepSeek V4 Pro · Kimi K2.7'],
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
      const items = ['GitHub PRs and releases', 'PostHog analytics', 'ACC · agent code context', 'Repo Shield · AI-training notice', 'reposell · paid releases', 'ProAgents · specialist profiles', 'ACE · crew workspaces', 'Oreja · music that steps aside'];
      skillGridPlain(ctx, 40, y + 34, w, items, s.color);
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
    ctx.font = '700 38px Menlo, monospace';
    ctx.fillStyle = '#ffc44a'; ctx.fillText('■ tasks ↓', 20, 70);
    ctx.fillStyle = '#9ee68a'; ctx.fillText('■ reports ↑', 20, 140);
  });
  legend.draw(0);
  const legendMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.94), new THREE.MeshStandardMaterial({ color: 0, map: legend.texture, emissive: 0xffffff, emissiveMap: legend.texture, emissiveIntensity: 1.0, transparent: true }));
  legendMesh.position.copy(at(-6.55, TOTAL / 2 - 1.0)).add(TOWARD.clone().multiplyScalar(3));
  legendMesh.quaternion.copy(camera.quaternion);
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
  ctx.font = '600 29px Helvetica, Arial, sans-serif';
  items.forEach((n, i) => {
    const c = Math.floor(i / rows);
    const r = i % rows;
    ctx.fillStyle = hex(color); ctx.beginPath(); ctx.arc(x + c * colW + 9, y + r * 44 - 10, 7, 0, TAU); ctx.fill();
    ctx.fillStyle = '#e8d6b4'; ctx.fillText(n, x + c * colW + 28, y + r * 44);
  });
}
