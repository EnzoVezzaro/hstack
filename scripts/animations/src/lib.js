// Shared building blocks for the HSTACK README animations.
// Every scene exports build(ctx) and returns update(t), where t runs from 0 to 1
// over one loop. Anything periodic uses whole-number frequencies of t, so the
// last frame flows back into the first.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

export { THREE };
export const TAU = Math.PI * 2;

export const PAL = {
  bg: 0x0e1413,
  floor: 0x1d2a23,
  floorTile: 0x22322a,
  wall: 0x17221c,
  wallTrim: 0x2a3b31,
  strataA: 0x24332a,
  strataB: 0x3b5336,
  strataC: 0x56764a,
  cream: 0xe8d6b4,
  creamDark: 0xc9b38c,
  wood: 0xb08a5e,
  woodDark: 0x7e6142,
  green: 0x3b5336,
  green2: 0x56764a,
  green3: 0x71ba70,
  leaf: 0x5a9a4f,
  leafDark: 0x3f7339,
  gold: 0xffc44a,
  mint: 0x9ee68a,
  coral: 0xfa866d,
  blue: 0x79a9ed,
  violet: 0xb59cff,
  red: 0xff5d5d,
  metal: 0x3a4640,
  metalDark: 0x252e29,
  rubber: 0x121815,
  screen: 0x07100c,
};

// ---------------------------------------------------------------- materials

const matCache = new Map();
export function mat(color, { r = 0.62, m = 0.05, e = 0x000000, ei = 1 } = {}) {
  const key = [color, r, m, e, ei].join(':');
  if (!matCache.has(key)) {
    matCache.set(key, new THREE.MeshStandardMaterial({
      color, roughness: r, metalness: m, emissive: e, emissiveIntensity: ei,
    }));
  }
  return matCache.get(key);
}

export function glowMat(color, intensity = 3) {
  return new THREE.MeshStandardMaterial({
    color: 0x000000, emissive: color, emissiveIntensity: intensity, roughness: 1,
  });
}

// ------------------------------------------------------------------ meshes

export function box(w, h, d, material, { r = 0.05, seg = 3, shadow = true } = {}) {
  const radius = Math.min(r, w / 2 - 1e-3, h / 2 - 1e-3, d / 2 - 1e-3);
  const geo = radius > 0.004 ? new RoundedBoxGeometry(w, h, d, seg, radius) : new THREE.BoxGeometry(w, h, d);
  const mesh = new THREE.Mesh(geo, material);
  mesh.castShadow = shadow;
  mesh.receiveShadow = true;
  return mesh;
}

export function cyl(rt, rb, h, material, seg = 32, { shadow = true } = {}) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), material);
  mesh.castShadow = shadow;
  mesh.receiveShadow = true;
  return mesh;
}

export function sphere(r, material, seg = 24) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, seg, Math.max(8, seg / 2)), material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

export function place(obj, x = 0, y = 0, z = 0, ry = 0) {
  obj.position.set(x, y, z);
  obj.rotation.y = ry;
  return obj;
}

export function group(...children) {
  const g = new THREE.Group();
  children.forEach((c) => c && g.add(c));
  return g;
}

// ----------------------------------------------------------- canvas screens

export class CanvasScreen {
  constructor(w, h, draw) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = w;
    this.canvas.height = h;
    this.ctx = this.canvas.getContext('2d');
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.anisotropy = 8;
    this.drawFn = draw;
  }
  draw(t) {
    this.drawFn(this.ctx, this.canvas.width, this.canvas.height, t);
    this.texture.needsUpdate = true;
  }
}

// A lit panel that shows a CanvasScreen. Faces +z in its own space.
export function screenPanel(width, height, screen, intensity = 1.25) {
  const material = new THREE.MeshStandardMaterial({
    color: 0x000000, emissive: 0xffffff, emissiveMap: screen.texture,
    emissiveIntensity: intensity, roughness: 0.4,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
  mesh.receiveShadow = false;
  return mesh;
}

export function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export const hex = (c) => '#' + c.toString(16).padStart(6, '0');

const KEYWORDS = new Set(['export', 'async', 'function', 'const', 'let', 'return', 'await', 'if', 'else', 'import', 'from', 'new', 'for', 'of', 'while', 'true', 'false']);

// Tiny syntax highlighter for the code screens.
export function drawCodeLine(ctx, line, x, y, size) {
  ctx.font = `500 ${size}px Menlo, Monaco, monospace`;
  const comment = line.indexOf('//');
  const code = comment >= 0 ? line.slice(0, comment) : line;
  const tokens = code.match(/('[^']*'|"[^"]*"|`[^`]*`|\b\d+\b|\w+|\s+|[^\w\s])/g) || [];
  let cx = x;
  tokens.forEach((tok, i) => {
    let color = hex(PAL.cream);
    if (/^['"`]/.test(tok)) color = hex(PAL.mint);
    else if (/^\d+$/.test(tok)) color = hex(PAL.coral);
    else if (KEYWORDS.has(tok)) color = hex(PAL.gold);
    else if (/^\w+$/.test(tok) && tokens[i + 1] === '(') color = hex(PAL.blue);
    else if (/^[{}()[\];,.:?=!<>+\-*/&|]+$/.test(tok)) color = '#8fa597';
    ctx.fillStyle = color;
    ctx.fillText(tok, cx, y);
    cx += ctx.measureText(tok).width;
  });
  if (comment >= 0) {
    ctx.fillStyle = '#5f7a68';
    ctx.fillText(line.slice(comment), cx, y);
  }
}

export const ROUTER_CODE = [
  '// pick the cheapest model that can do the job',
  'export async function route(task) {',
  "  let tier = task.risky ? 'T2' : 'T0';",
  '  const worker = await crew.assign(task, tier);',
  '  const result = await worker.run(task.brief);',
  '',
  '  if (!(await verify(result))) {',
  '    return escalate(task, nextTier(tier));',
  '  }',
  '  await report(result.evidence);',
  '  return result;',
  '}',
  '',
  'export function nextTier(tier) {',
  "  return { T0: 'T1', T1: 'T2', T2: 'T3' }[tier];",
  '}',
  '',
  '// nothing ships without a yes',
  'export async function ship(change) {',
  '  await owner.approve(change);',
  '  return git.push(change.branch);',
  '}',
  '',
  'export async function handoff(task, next) {',
  '  const brief = await acc.context(task.area);',
  '  return next.pickUp({ ...task, brief });',
  '}',
];

// Scrolling editor: line numbers, a gutter, a cursor line, and code.
export function codeScreen(lines = ROUTER_CODE, { scrollLines = 8, title = 'route.ts' } = {}) {
  return new CanvasScreen(640, 400, (ctx, w, h, t) => {
    ctx.fillStyle = '#0b1310';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#121d17';
    ctx.fillRect(0, 0, w, 34);
    ['#fa866d', '#ffc44a', '#9ee68a'].forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(20 + i * 20, 17, 6, 0, TAU);
      ctx.fill();
    });
    ctx.fillStyle = '#9fb3a6';
    ctx.font = '500 16px Menlo, monospace';
    ctx.fillText(title, 90, 23);
    const size = 17;
    const lh = 25;
    const offset = t * scrollLines * lh;
    const total = lines.length;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 38, w, h - 38);
    ctx.clip();
    for (let i = -1; i < 18; i++) {
      const raw = Math.floor(offset / lh) + i;
      const idx = ((raw % total) + total) % total;
      const y = 62 + i * lh - (offset % lh);
      if (i === 6) {
        ctx.fillStyle = 'rgba(255,196,74,0.08)';
        ctx.fillRect(0, y - 18, w, lh);
      }
      ctx.fillStyle = '#41594a';
      ctx.font = `500 ${size - 2}px Menlo, monospace`;
      ctx.fillText(String(idx + 1).padStart(2, ' '), 14, y);
      drawCodeLine(ctx, lines[idx], 58, y, size);
    }
    ctx.restore();
  });
}

// Terminal that types a script of lines, then holds and blinks.
export function terminalScreen(script, { title = 'zsh', typeSpeed = 1 } = {}) {
  const plan = [];
  let at = 0.04;
  script.forEach((line) => {
    const typed = line.startsWith('$');
    const dur = typed ? 0.012 * line.length * typeSpeed : 0.035;
    plan.push({ line, typed, start: at, end: at + dur });
    at += dur + (typed ? 0.05 : 0.025);
  });
  const total = at;
  return new CanvasScreen(640, 400, (ctx, w, h, t) => {
    const tt = (t * Math.max(1, total + 0.15)) ;
    ctx.fillStyle = '#08100c';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#111b16';
    ctx.fillRect(0, 0, w, 34);
    ctx.fillStyle = '#9fb3a6';
    ctx.font = '500 16px Menlo, monospace';
    ctx.fillText(title, 18, 23);
    ctx.font = '500 18px Menlo, monospace';
    let y = 66;
    let cursor = null;
    for (const p of plan) {
      if (tt < p.start) break;
      let text = p.line;
      if (p.typed) {
        const k = Math.min(1, (tt - p.start) / (p.end - p.start));
        text = p.line.slice(0, Math.max(1, Math.floor(k * p.line.length)));
        if (k < 1) cursor = [text, y];
      }
      let color = '#e8d6b4';
      if (text.startsWith('$')) color = '#ffc44a';
      else if (text.startsWith('✓')) color = '#9ee68a';
      else if (text.startsWith('◇') || text.startsWith('◆')) color = '#79a9ed';
      else if (text.startsWith('✗')) color = '#fa866d';
      ctx.fillStyle = color;
      ctx.fillText(text, 20, y);
      if (!cursor) cursor = null;
      y += 27;
      if (y > h - 10) break;
    }
    const blink = Math.floor(t * 16) % 2 === 0;
    if (blink) {
      ctx.fillStyle = '#ffc44a';
      if (cursor) {
        const wText = ctx.measureText(cursor[0]).width;
        ctx.fillRect(22 + wText, cursor[1] - 17, 10, 21);
      } else {
        ctx.fillRect(20, y - 17, 10, 21);
      }
    }
  });
}

// ----------------------------------------------------------------- objects

export function desk(w = 3, d = 1.4, { top = PAL.wood, legs = PAL.metalDark, h = 1.05 } = {}) {
  const g = new THREE.Group();
  const slab = place(box(w, 0.09, d, mat(top, { r: 0.55 }), { r: 0.04 }), 0, h, 0);
  g.add(slab);
  const edge = place(box(w - 0.04, 0.05, d - 0.04, mat(PAL.woodDark, { r: 0.6 }), { r: 0.02 }), 0, h - 0.07, 0);
  g.add(edge);
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => {
    g.add(place(box(0.08, h - 0.05, 0.08, mat(legs, { r: 0.35, m: 0.6 }), { r: 0.02 }), sx * (w / 2 - 0.12), (h - 0.05) / 2, sz * (d / 2 - 0.12)));
  });
  const drawer = place(box(0.7, 0.55, d - 0.25, mat(PAL.creamDark, { r: 0.5 }), { r: 0.03 }), w / 2 - 0.5, h - 0.36, 0);
  g.add(drawer);
  [0.18, -0.04].forEach((dy) => g.add(place(box(0.24, 0.03, 0.02, mat(PAL.metal, { m: 0.7, r: 0.3 })), w / 2 - 0.5, h - 0.36 + dy, d / 2 - 0.12)));
  g.userData.top = h + 0.045;
  return g;
}

export function monitor(screen, { w = 1.25, h = 0.78, glow = 0.95 } = {}) {
  const g = new THREE.Group();
  g.add(place(box(0.5, 0.03, 0.32, mat(PAL.metalDark, { m: 0.6, r: 0.35 }), { r: 0.015 }), 0, 0.015, 0));
  g.add(place(box(0.06, 0.42, 0.06, mat(PAL.metal, { m: 0.7, r: 0.3 }), { r: 0.02 }), 0, 0.23, -0.06));
  const bezel = place(box(w + 0.08, h + 0.08, 0.06, mat(PAL.rubber, { r: 0.35 }), { r: 0.025 }), 0, 0.42 + h / 2, -0.02);
  g.add(bezel);
  const panel = screenPanel(w, h, screen, glow);
  panel.position.set(0, 0.42 + h / 2, 0.012);
  g.add(panel);
  return g;
}

export function laptop(screen, { w = 0.7, glow = 0.95 } = {}) {
  const g = new THREE.Group();
  g.add(place(box(w, 0.035, w * 0.66, mat(PAL.metal, { m: 0.5, r: 0.35 }), { r: 0.015 }), 0, 0.018, 0));
  const lid = new THREE.Group();
  lid.position.set(0, 0.035, -w * 0.33);
  lid.rotation.x = -0.22;
  lid.add(place(box(w, w * 0.62, 0.025, mat(PAL.metalDark, { m: 0.5, r: 0.35 }), { r: 0.012 }), 0, w * 0.31, 0));
  const panel = screenPanel(w * 0.9, w * 0.52, screen, glow);
  panel.position.set(0, w * 0.31, 0.014);
  lid.add(panel);
  g.add(lid);
  return g;
}

// Keyboard with individually lit keys.
export function keyboard({ cols = 14, rows = 4 } = {}) {
  const g = new THREE.Group();
  const w = cols * 0.062 + 0.06;
  const d = rows * 0.062 + 0.06;
  g.add(place(box(w, 0.035, d, mat(PAL.metalDark, { r: 0.4, m: 0.3 }), { r: 0.015 }), 0, 0.018, 0));
  const keyGeo = new RoundedBoxGeometry(0.05, 0.025, 0.05, 2, 0.008);
  const keyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5, emissive: 0x000000 });
  const keys = new THREE.InstancedMesh(keyGeo, keyMat, cols * rows);
  const m = new THREE.Matrix4();
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      m.makeTranslation(-w / 2 + 0.06 + c * 0.062, 0.045, -d / 2 + 0.06 + r * 0.062);
      keys.setMatrixAt(r * cols + c, m);
      keys.setColorAt(r * cols + c, new THREE.Color(PAL.cream));
    }
  }
  keys.castShadow = true;
  g.add(keys);
  const base = new THREE.Color(PAL.cream);
  const lit = new THREE.Color(PAL.gold).multiplyScalar(2.2);
  g.userData.update = (t, rate = 22) => {
    const n = cols * rows;
    const step = Math.floor(t * rate * 4);
    for (let i = 0; i < n; i++) keys.setColorAt(i, base);
    for (let k = 0; k < 3; k++) {
      const idx = Math.abs(Math.floor(Math.sin((step + k * 7) * 12.9898) * 43758.5453)) % n;
      keys.setColorAt(idx, lit);
    }
    keys.instanceColor.needsUpdate = true;
  };
  return g;
}

export function chair({ color = PAL.green } = {}) {
  const g = new THREE.Group();
  g.add(place(box(0.62, 0.1, 0.6, mat(color, { r: 0.8 }), { r: 0.05 }), 0, 0.62, 0));
  g.add(place(box(0.62, 0.7, 0.1, mat(color, { r: 0.8 }), { r: 0.05 }), 0, 1.02, -0.28));
  g.add(place(cyl(0.04, 0.04, 0.5, mat(PAL.metal, { m: 0.7, r: 0.3 }), 12), 0, 0.33, 0));
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * TAU;
    const leg = place(box(0.36, 0.04, 0.05, mat(PAL.metalDark, { m: 0.6 }), { r: 0.015 }), Math.cos(a) * 0.17, 0.07, Math.sin(a) * 0.17);
    leg.rotation.y = -a;
    g.add(leg);
    g.add(place(sphere(0.035, mat(PAL.rubber), 10), Math.cos(a) * 0.33, 0.035, Math.sin(a) * 0.33));
  }
  return g;
}

let steamTex = null;
function steamTexture() {
  if (steamTex) return steamTex;
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d');
  const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
  grad.addColorStop(0, 'rgba(255,255,255,0.9)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  steamTex = new THREE.CanvasTexture(c);
  return steamTex;
}

export function mug({ color = PAL.cream } = {}) {
  const g = new THREE.Group();
  g.add(place(cyl(0.11, 0.1, 0.24, mat(color, { r: 0.35 }), 24), 0, 0.12, 0));
  g.add(place(cyl(0.095, 0.095, 0.01, mat(0x3a2414, { r: 0.2 }), 24), 0, 0.235, 0));
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.018, 8, 16, Math.PI), mat(color, { r: 0.35 }));
  handle.position.set(0.11, 0.12, 0);
  handle.rotation.z = -Math.PI / 2;
  handle.castShadow = true;
  g.add(handle);
  const puffs = [];
  for (let i = 0; i < 4; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: steamTexture(), transparent: true, depthWrite: false, opacity: 0 }));
    s.scale.setScalar(0.18);
    g.add(s);
    puffs.push(s);
  }
  g.userData.update = (t) => {
    puffs.forEach((s, i) => {
      const k = (t * 2 + i / puffs.length) % 1;
      s.position.set(Math.sin(k * TAU + i) * 0.05, 0.27 + k * 0.6, Math.cos(k * TAU * 0.5 + i) * 0.03);
      s.material.opacity = Math.sin(k * Math.PI) * 0.35;
      s.scale.setScalar(0.12 + k * 0.22);
    });
  };
  return g;
}

export function plant({ pot = 0xb5694a, scale = 1 } = {}) {
  const g = new THREE.Group();
  g.add(place(cyl(0.2, 0.15, 0.32, mat(pot, { r: 0.7 }), 24), 0, 0.16, 0));
  g.add(place(cyl(0.21, 0.21, 0.04, mat(0xc77a58, { r: 0.7 }), 24), 0, 0.31, 0));
  g.add(place(cyl(0.18, 0.18, 0.02, mat(0x2b1d14, { r: 1 }), 24), 0, 0.32, 0));
  const leaves = new THREE.Group();
  leaves.position.y = 0.32;
  const leafGeo = new THREE.SphereGeometry(0.1, 12, 8);
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * TAU;
    const tilt = 0.5 + (i % 3) * 0.25;
    const leaf = new THREE.Mesh(leafGeo, mat(i % 2 ? PAL.leaf : PAL.leafDark, { r: 0.6 }));
    leaf.scale.set(0.45, 0.16, 1.9);
    leaf.position.set(Math.cos(a) * 0.12, 0.18 + (i % 3) * 0.07, Math.sin(a) * 0.12);
    leaf.rotation.set(0, -a + Math.PI / 2, 0);
    leaf.rotateX(-tilt);
    leaf.castShadow = true;
    leaves.add(leaf);
  }
  g.add(leaves);
  g.scale.setScalar(scale);
  g.userData.update = (t) => {
    leaves.rotation.z = Math.sin(t * TAU) * 0.03;
  };
  return g;
}

// Robot: worker, director, or assistant. Faces +z.
export function robot({ accent = PAL.mint, body = PAL.cream, scale = 1, kind = 'worker' } = {}) {
  const g = new THREE.Group();
  const parts = {};
  const bodyMat = mat(body, { r: 0.42 });
  const darkMat = mat(PAL.rubber, { r: 0.4 });
  const pad = place(cyl(0.3, 0.34, 0.08, mat(PAL.metalDark, { m: 0.6, r: 0.35 }), 24), 0, 0.06, 0);
  g.add(pad);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.022, 8, 32), glowMat(accent, 2.2));
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.03;
  g.add(ring);
  parts.ring = ring;
  const torso = new THREE.Group();
  torso.position.y = 0.1;
  g.add(torso);
  torso.add(place(box(0.62, 0.56, 0.46, bodyMat, { r: 0.12, seg: 4 }), 0, 0.36, 0));
  torso.add(place(box(0.34, 0.2, 0.03, darkMat, { r: 0.03 }), 0, 0.4, 0.23));
  const chestLeds = [];
  for (let i = 0; i < 3; i++) {
    const led = place(box(0.05, 0.05, 0.02, glowMat([accent, PAL.gold, PAL.coral][i], 2.5), { r: 0.01 }), -0.09 + i * 0.09, 0.4, 0.248);
    torso.add(led);
    chestLeds.push(led);
  }
  parts.chestLeds = chestLeds;
  const head = new THREE.Group();
  head.position.y = 0.92;
  torso.add(head);
  head.add(place(box(0.6, 0.44, 0.48, bodyMat, { r: 0.14, seg: 4 }), 0, 0, 0));
  head.add(place(box(0.48, 0.28, 0.03, darkMat, { r: 0.06 }), 0, 0, 0.235));
  const eyeMat = glowMat(accent, 3.2);
  const eyes = [-0.11, 0.11].map((x) => {
    const e = place(box(0.08, 0.11, 0.02, eyeMat, { r: 0.02 }), x, 0.01, 0.255);
    head.add(e);
    return e;
  });
  parts.eyes = eyes;
  head.add(place(cyl(0.012, 0.012, 0.18, mat(PAL.metal, { m: 0.7 }), 8), 0, 0.3, 0));
  const tip = place(sphere(0.045, glowMat(accent, 3.5), 12), 0, 0.41, 0);
  head.add(tip);
  parts.tip = tip;
  if (kind === 'assistant') {
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.025, 8, 24, Math.PI), darkMat);
    band.position.y = 0.05;
    band.castShadow = true;
    head.add(band);
    [-0.33, 0.33].forEach((x) => head.add(place(cyl(0.07, 0.07, 0.06, darkMat, 16), x, 0.02, 0)).children.at(-1).rotation.set(0, 0, Math.PI / 2));
    const mic = place(box(0.18, 0.02, 0.02, darkMat, { r: 0.008 }), -0.26, -0.15, 0.2);
    mic.rotation.y = -0.6;
    head.add(mic);
  }
  if (kind === 'director') {
    const visor = place(box(0.5, 0.06, 0.05, glowMat(PAL.gold, 2.4), { r: 0.02 }), 0, 0.19, 0.22);
    head.add(visor);
    torso.add(place(box(0.64, 0.06, 0.48, mat(PAL.gold, { r: 0.3, m: 0.6 }), { r: 0.02 }), 0, 0.62, 0));
  }
  const arms = [-1, 1].map((s) => {
    const pivot = new THREE.Group();
    pivot.position.set(s * 0.37, 0.58, 0);
    pivot.add(place(sphere(0.07, darkMat, 12), 0, 0, 0));
    const arm = place(box(0.12, 0.38, 0.12, bodyMat, { r: 0.05 }), 0, -0.2, 0);
    pivot.add(arm);
    const hand = place(box(0.13, 0.08, 0.13, darkMat, { r: 0.03 }), 0, -0.41, 0);
    pivot.add(hand);
    torso.add(pivot);
    return pivot;
  });
  parts.arms = arms;
  parts.head = head;
  parts.torso = torso;
  g.scale.setScalar(scale);
  g.userData.parts = parts;
  return g;
}

export function animateRobot(r, t, { mode = 'idle', phase = 0, typeRate = 12 } = {}) {
  const p = r.userData.parts;
  const blink = ((t * 3 + phase) % 1) < 0.05 ? 0.15 : 1;
  p.eyes.forEach((e) => (e.scale.y = blink));
  p.tip.material.emissiveIntensity = 2.5 + Math.sin((t * 4 + phase) * TAU) * 1.2;
  p.torso.position.y = 0.1 + Math.sin((t * 2 + phase) * TAU) * 0.025;
  p.chestLeds.forEach((l, i) => (l.visible = Math.sin((t * 6 + i / 3 + phase) * TAU) > -0.3));
  if (mode === 'type') {
    p.arms[0].rotation.x = -1.15 + Math.sin((t * typeRate + phase) * TAU) * 0.18;
    p.arms[1].rotation.x = -1.15 + Math.sin((t * typeRate + phase + 0.5) * TAU) * 0.18;
    p.head.rotation.x = 0.12 + Math.sin((t * 2 + phase) * TAU) * 0.03;
  } else if (mode === 'carry') {
    p.arms[0].rotation.x = -1.35;
    p.arms[1].rotation.x = -1.35;
  } else if (mode === 'inspect') {
    p.arms[0].rotation.x = -0.2;
    p.arms[1].rotation.x = -1.6 + Math.sin((t * 4 + phase) * TAU) * 0.15;
    p.head.rotation.y = Math.sin((t * 2 + phase) * TAU) * 0.35;
  } else {
    p.arms[0].rotation.x = Math.sin((t * 2 + phase) * TAU) * 0.12;
    p.arms[1].rotation.x = -Math.sin((t * 2 + phase) * TAU) * 0.12;
    p.head.rotation.y = Math.sin((t + phase) * TAU) * 0.25;
  }
}

export function serverRack({ units = 8, h = 2.7 } = {}) {
  const g = new THREE.Group();
  g.add(place(box(1.0, h, 0.9, mat(PAL.metalDark, { m: 0.55, r: 0.4 }), { r: 0.04 }), 0, h / 2, 0));
  const unitH = (h - 0.5) / units;
  const ledGeo = new THREE.BoxGeometry(0.035, 0.035, 0.02);
  const ledMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const perRow = 6;
  const leds = new THREE.InstancedMesh(ledGeo, ledMat, units * perRow);
  const m = new THREE.Matrix4();
  const palette = [PAL.mint, PAL.gold, PAL.blue, PAL.mint];
  const hot = (c) => new THREE.Color(c).multiplyScalar(2.4);
  for (let u = 0; u < units; u++) {
    const y = 0.2 + unitH * u + unitH / 2;
    g.add(place(box(0.86, unitH - 0.04, 0.04, mat(PAL.metal, { m: 0.5, r: 0.35 }), { r: 0.01 }), 0, y, 0.45));
    for (let i = 0; i < 6; i++) g.add(place(box(0.04, unitH * 0.5, 0.01, mat(PAL.rubber)), -0.36 + i * 0.03, y, 0.475));
    for (let i = 0; i < perRow; i++) {
      m.makeTranslation(0.06 + i * 0.06, y, 0.48);
      leds.setMatrixAt(u * perRow + i, m);
      leds.setColorAt(u * perRow + i, hot(palette[(u + i) % 4]));
    }
  }
  g.add(leds);
  const off = new THREE.Color(0x101814);
  g.userData.update = (t) => {
    for (let u = 0; u < units; u++) {
      for (let i = 0; i < perRow; i++) {
        const idx = u * perRow + i;
        const freq = 2 + ((u * 7 + i * 3) % 6);
        const on = Math.sin((t * freq + (u * 0.37 + i * 0.21)) * TAU) > -0.2;
        leds.setColorAt(idx, on ? hot(palette[(u + i) % 4]) : off);
      }
    }
    leds.instanceColor.needsUpdate = true;
  };
  return g;
}

// A cable lying on the floor with glowing packets travelling along it.
export function cable(points, { radius = 0.035, packets = 3, speed = 1, color = PAL.gold, reverse = false } = {}) {
  const g = new THREE.Group();
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
  const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 96, radius, 8, false), mat(PAL.rubber, { r: 0.55 }));
  tube.castShadow = true;
  tube.receiveShadow = true;
  g.add(tube);
  const pk = [];
  for (let i = 0; i < packets; i++) {
    const p = box(0.09, 0.09, 0.09, glowMat(color, 3.2), { r: 0.02, shadow: false });
    g.add(p);
    pk.push(p);
  }
  g.userData.update = (t) => {
    pk.forEach((p, i) => {
      let u = (t * speed + i / packets) % 1;
      if (reverse) u = 1 - u;
      const pos = curve.getPointAt(u);
      p.position.copy(pos).add(new THREE.Vector3(0, radius + 0.03, 0));
      p.rotation.y = u * TAU * 2;
    });
  };
  return g;
}

// Floating hologram plane that always faces the camera.
export function hologram(screen, w, h, camera) {
  const material = new THREE.MeshBasicMaterial({
    map: screen.texture, transparent: true, depthWrite: false,
    blending: THREE.AdditiveBlending, toneMapped: false, side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), material);
  mesh.quaternion.copy(camera.quaternion);
  return mesh;
}

export function label(text, { w = 2, h = 0.5, fg = PAL.cream, bg = 'rgba(0,0,0,0)', font = '700 64px Menlo, monospace', glow = 1.4 } = {}) {
  const screen = new CanvasScreen(Math.round(512 * (w / h)), 512, (ctx, cw, ch) => {
    ctx.clearRect(0, 0, cw, ch);
    if (bg) {
      ctx.fillStyle = bg;
      roundRect(ctx, 0, 0, cw, ch, 60);
      ctx.fill();
    }
    ctx.fillStyle = hex(fg);
    ctx.font = font.replace(/\d+px/, `${Math.round(ch * 0.42)}px`);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, cw / 2, ch / 2 + 6);
  });
  screen.draw(0);
  const material = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xffffff, emissiveMap: screen.texture, emissiveIntensity: glow, transparent: true, alphaMap: null });
  material.map = screen.texture;
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), material);
  return mesh;
}

// Diorama floor slab with layered "strata" edges, like a cut-out of the world.
export function diorama(lx, lz, { tiles = true } = {}) {
  const g = new THREE.Group();
  const layers = [[PAL.strataA, 0.5], [PAL.strataB, 0.18], [PAL.strataC, 0.08]];
  let y = 0;
  layers.forEach(([c, th], i) => {
    const inset = i === 0 ? 0 : 0.0;
    const slab = place(box(lx - inset, th, lz - inset, mat(c, { r: 0.9 }), { r: 0.06 }), 0, y - th / 2, 0);
    g.add(slab);
    y -= th;
  });
  const top = new CanvasScreen(1024, 1024, (ctx, w, h) => {
    ctx.fillStyle = hex(PAL.floor);
    ctx.fillRect(0, 0, w, h);
    if (tiles) {
      ctx.strokeStyle = hex(PAL.floorTile);
      ctx.lineWidth = 4;
      const n = 12;
      for (let i = 0; i <= n; i++) {
        ctx.beginPath(); ctx.moveTo((i / n) * w, 0); ctx.lineTo((i / n) * w, h); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, (i / n) * h); ctx.lineTo(w, (i / n) * h); ctx.stroke();
      }
    }
  });
  top.draw(0);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(lx - 0.04, lz - 0.04), new THREE.MeshStandardMaterial({ map: top.texture, roughness: 0.85 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0.002;
  floor.receiveShadow = true;
  g.add(floor);
  return g;
}

// --------------------------------------------------------------- the boot

export async function boot(mod, width, height, outWidth = width) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  renderer.setSize(width, height);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = mod.exposure ?? 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(PAL.bg);

  const view = mod.view ?? { size: 6, target: [0, 1, 0], elevation: 30 };
  const aspect = width / height;
  const camera = new THREE.OrthographicCamera(-view.size * aspect, view.size * aspect, view.size, -view.size, 0.1, 200);
  const el = THREE.MathUtils.degToRad(view.elevation ?? 30);
  const az = THREE.MathUtils.degToRad(view.azimuth ?? 45);
  const dist = 60;
  const target = new THREE.Vector3(...view.target);
  camera.position.set(
    target.x + dist * Math.cos(el) * Math.sin(az),
    target.y + dist * Math.sin(el),
    target.z + dist * Math.cos(el) * Math.cos(az),
  );
  camera.lookAt(target);

  const hemi = new THREE.HemisphereLight(0xd6f0dc, 0x0e1413, 0.55);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff0d8, 1.7);
  sun.position.set(target.x - 9, target.y + 16, target.z + 11);
  sun.target.position.copy(target);
  sun.castShadow = true;
  sun.shadow.mapSize.set(4096, 4096);
  const sc = sun.shadow.camera;
  sc.left = -16; sc.right = 16; sc.top = 16; sc.bottom = -16; sc.near = 1; sc.far = 80;
  sun.shadow.bias = -0.00035;
  sun.shadow.normalBias = 0.025;
  scene.add(sun, sun.target);
  const rim = new THREE.DirectionalLight(0x9cc8ff, 0.45);
  rim.position.set(target.x + 12, target.y + 6, target.z - 10);
  scene.add(rim);

  const rt = new THREE.WebGLRenderTarget(width, height, { type: THREE.HalfFloatType, samples: 4 });
  const composer = new EffectComposer(renderer, rt);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(width, height), mod.bloom?.strength ?? 0.55, mod.bloom?.radius ?? 0.45, mod.bloom?.threshold ?? 0.82);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  const ctx = { THREE, scene, camera, renderer, sun, hemi, rim, width, height };
  const update = await mod.build(ctx);

  // Downscale in the page (2x supersampling) so frames stay small on disk.
  const out = document.createElement('canvas');
  out.width = outWidth;
  out.height = Math.round((height * outWidth) / width);
  const octx = out.getContext('2d');
  octx.imageSmoothingEnabled = true;
  octx.imageSmoothingQuality = 'high';
  window.__frame = (t) => {
    update(t);
    composer.render();
    octx.drawImage(renderer.domElement, 0, 0, out.width, out.height);
    return out.toDataURL('image/png');
  };
  window.__ready = true;
}
