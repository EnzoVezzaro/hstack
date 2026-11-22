// HSTACK art kit: the visual language of assets/h-stack-banner.png.
// Chunky bevelled camo cubes, dark slabs carrying chunky cream-gold glyphs,
// glowing gold nodes on thin gold traces, and a near-black tiled floor.
import { THREE, TAU, CanvasScreen, roundRect, loadImg } from './lib.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { ICONS } from './icons.js';

export { ICONS };

export const HERO = {
  bg: 0x0f1513,
  floor: 0x111714,
  floorLine: 0x19211b,
  floorTile: 0x141c17,
  floorTileGreen: 0x1a271c,
  panel: 0x181d18,
  panelEdge: 0x232a22,
  glyph: 0xeacd8a,
  gold: 0xffc44a,
  goldHot: 0xffe08a,
  cream: 0xd6c79a,
  ink: 0xe7dcb8,
  muted: 0x9aa58f,
  coral: 0xfa866d,
  mint: 0x9ee68a,
  blue: 0x79a9ed,
  violet: 0xb59cff,
  red: 0xff5d5d,
};

// Camo mix sampled from the banner: [colour, weight].
export const CAMO = [
  [0x2b4527, 0.24],
  [0x3c6334, 0.24],
  [0x56804a, 0.14],
  [0xd6c79a, 0.16],
  [0x1e251e, 0.22],
];

export const css = (c) => '#' + c.toString(16).padStart(6, '0');

// Small deterministic RNG so every render is identical.
export function rng(seed = 1) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >>> 17;
    s ^= s << 5; s >>>= 0;
    return (s >>> 0) / 4294967296;
  };
}

function pickCamo(rand, palette = CAMO) {
  const total = palette.reduce((a, [, w]) => a + w, 0);
  let r = rand() * total;
  for (const [c, w] of palette) { r -= w; if (r <= 0) return c; }
  return palette[0][0];
}

// ------------------------------------------------------------------ blocks

const geoCache = new Map();
function cubeGeo(cell) {
  const key = cell.toFixed(4);
  if (!geoCache.has(key)) geoCache.set(key, new RoundedBoxGeometry(cell * 0.975, cell * 0.975, cell * 0.975, 2, cell * 0.09));
  return geoCache.get(key);
}
const blockMat = new THREE.MeshStandardMaterial({ roughness: 0.82, metalness: 0.0 });

// Integer cells [x, y, z] for a solid box nx * ny * nz starting at (x0, y0, z0).
export function boxCells(x0, y0, z0, nx, ny, nz, { shell = true } = {}) {
  const out = [];
  for (let x = 0; x < nx; x++) for (let y = 0; y < ny; y++) for (let z = 0; z < nz; z++) {
    const edge = x === 0 || y === 0 || z === 0 || x === nx - 1 || y === ny - 1 || z === nz - 1;
    if (!shell || edge) out.push([x0 + x, y0 + y, z0 + z]);
  }
  return out;
}

// Camo cubes on an integer grid. Cell (0,0,0) sits with its bottom at y = 0.
export function blocks(cells, { cell = 0.5, seed = 7, palette = CAMO, colors = null } = {}) {
  const rand = rng(seed);
  const mesh = new THREE.InstancedMesh(cubeGeo(cell), blockMat, cells.length);
  const m = new THREE.Matrix4();
  const col = new THREE.Color();
  cells.forEach(([x, y, z], i) => {
    m.makeTranslation((x + 0.5) * cell, (y + 0.5) * cell, (z + 0.5) * cell);
    mesh.setMatrixAt(i, m);
    const base = colors ? colors(x, y, z, rand) : pickCamo(rand, palette);
    col.set(base).multiplyScalar(0.92 + rand() * 0.16);
    mesh.setColorAt(i, col);
  });
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  const g = new THREE.Group();
  g.add(mesh);
  g.userData.cell = cell;
  return g;
}

// A camo box in world units, centred on x/z, bottom on y = 0.
export function camoBox(w, h, d, { cell = 0.5, seed = 7, palette } = {}) {
  const nx = Math.max(1, Math.round(w / cell)), ny = Math.max(1, Math.round(h / cell)), nz = Math.max(1, Math.round(d / cell));
  const g = blocks(boxCells(0, 0, 0, nx, ny, nz), { cell, seed, palette });
  g.children[0].position.set((-nx * cell) / 2, 0, (-nz * cell) / 2);
  g.userData.size = [nx * cell, ny * cell, nz * cell];
  return g;
}

// ------------------------------------------------------------------ glyphs

function drawIcon(ctx, rows, cx, cy, cellPx, color) {
  const h = rows.length, w = Math.max(...rows.map((r) => r.length));
  const x0 = Math.round(cx - (w * cellPx) / 2), y0 = Math.round(cy - (h * cellPx) / 2);
  ctx.fillStyle = color;
  rows.forEach((row, r) => [...row].forEach((ch, c) => {
    if (ch !== '.' && ch !== ' ') ctx.fillRect(x0 + c * cellPx, y0 + r * cellPx, cellPx - 1, cellPx - 1);
  }));
}

// Texture for a glyph face: dark slab colour, faint inner frame, glowing icon.
export function glyphTexture({ icon = null, image = null, color = HERO.glyph, px = 256, fill = 0.62, draw = null } = {}) {
  const screen = new CanvasScreen(px, px, (ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = css(HERO.panel);
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = Math.max(2, w / 64);
    ctx.strokeRect(w * 0.04, h * 0.04, w * 0.92, h * 0.92);
    if (draw) { draw(ctx, w, h, t); return; }
    if (image) {
      const s = w * fill;
      ctx.imageSmoothingEnabled = image.width > 96;
      ctx.drawImage(image, (w - s) / 2, (h - s) / 2, s, s);
      return;
    }
    const rows = typeof icon === 'string' ? ICONS[icon] : icon;
    if (!rows) return;
    const n = Math.max(rows.length, ...rows.map((r) => r.length));
    const cellPx = Math.floor((w * fill) / n);
    ctx.save();
    ctx.shadowColor = css(color);
    ctx.shadowBlur = cellPx * 1.6;
    drawIcon(ctx, rows, w / 2, h / 2, cellPx, css(color));
    ctx.restore();
    drawIcon(ctx, rows, w / 2, h / 2, cellPx, css(color));
  });
  screen.texture.magFilter = THREE.LinearFilter;
  screen.draw(0);
  return screen;
}

// A raised dark slab with a glyph face. Faces +z in its own space; bottom-left
// corner of the slab at the origin is not assumed: it is centred.
export function glyphPanel({ size = 1, depth = 0.08, icon, image, color, draw, glow = 1.15 } = {}) {
  const screen = glyphTexture({ icon, image, color, draw });
  const g = new THREE.Group();
  const slab = new THREE.Mesh(new RoundedBoxGeometry(size, size, depth, 2, Math.min(size * 0.05, depth * 0.45)), new THREE.MeshStandardMaterial({ color: HERO.panel, roughness: 0.7 }));
  slab.castShadow = true; slab.receiveShadow = true;
  g.add(slab);
  const face = new THREE.Mesh(new THREE.PlaneGeometry(size * 0.94, size * 0.94), new THREE.MeshStandardMaterial({
    color: 0x000000, emissive: 0xffffff, emissiveMap: screen.texture, emissiveIntensity: glow, roughness: 0.6,
  }));
  face.position.z = depth / 2 + 0.002;
  g.add(face);
  g.userData.screen = screen;
  return g;
}

// ------------------------------------------------------------- gold nodes

const goldMats = new Map();
export function goldMat(color = HERO.gold, intensity = 2.2) {
  const key = `${color}:${intensity}`;
  if (!goldMats.has(key)) goldMats.set(key, new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: intensity, roughness: 0.35 }));
  return goldMats.get(key);
}

export function goldNode(size = 0.22, { color = HERO.gold, light = 0 } = {}) {
  const g = new THREE.Group();
  const cube = new THREE.Mesh(new RoundedBoxGeometry(size, size, size, 2, size * 0.12), goldMat(color, 2.2).clone());
  cube.castShadow = false;
  g.add(cube);
  if (light > 0) {
    const pl = new THREE.PointLight(color, light, size * 14, 2);
    g.add(pl);
  }
  g.userData.cube = cube;
  g.userData.pulse = (k) => { cube.material.emissiveIntensity = 1.6 + k * 1.6; };
  return g;
}

// Thin gold trace through points, with packets that travel along it.
export function goldTrace(points, { radius = 0.014, packets = 2, packetSize = 0.09, color = HERO.gold, speed = 1, reverse = false } = {}) {
  const path = new THREE.CurvePath();
  const pts = points.map((p) => (p.isVector3 ? p : new THREE.Vector3(...p)));
  for (let i = 0; i < pts.length - 1; i++) path.add(new THREE.LineCurve3(pts[i], pts[i + 1]));
  const g = new THREE.Group();
  const segs = Math.max(8, pts.length * 12);
  const tube = new THREE.Mesh(new THREE.TubeGeometry(path, segs, radius, 6, false), goldMat(color, 1.4));
  g.add(tube);
  const list = [...Array(packets)].map(() => {
    const p = new THREE.Mesh(new RoundedBoxGeometry(packetSize, packetSize, packetSize, 2, packetSize * 0.15), goldMat(HERO.goldHot, 3.2));
    g.add(p);
    return p;
  });
  g.userData.update = (t) => {
    list.forEach((p, k) => {
      let u = (t * speed + k / list.length) % 1;
      if (reverse) u = 1 - u;
      p.position.copy(path.getPointAt(u));
      p.visible = true;
    });
  };
  g.userData.path = path;
  return g;
}

// ------------------------------------------------------------------ floor

// Near-black floor with a faint tile grid and a few lighter tiles.
export function heroFloor({ size = 40, tile = 1, y = 0, seed = 3 } = {}) {
  const n = Math.round(size / tile);
  const px = Math.min(4096, n * 32);
  const rand = rng(seed);
  const screen = new CanvasScreen(px, px, (ctx, w, h) => {
    const s = w / n;
    ctx.fillStyle = css(HERO.floor);
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const r = rand();
      if (r < 0.025) { ctx.fillStyle = css(HERO.floorTileGreen); ctx.fillRect(i * s, j * s, s, s); }
      else if (r < 0.14) { ctx.fillStyle = css(HERO.floorTile); ctx.fillRect(i * s, j * s, s, s); }
    }
    ctx.strokeStyle = css(HERO.floorLine);
    ctx.lineWidth = Math.max(1, s / 24);
    for (let i = 0; i <= n; i++) {
      ctx.beginPath(); ctx.moveTo(i * s, 0); ctx.lineTo(i * s, h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * s); ctx.lineTo(w, i * s); ctx.stroke();
    }
  });
  screen.draw(0);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshStandardMaterial({ map: screen.texture, roughness: 0.95 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = y;
  floor.receiveShadow = true;
  return floor;
}

// Warm additive glow pooled on the floor (or any flat surface).
let glowTex = null;
export function floorGlow(radius = 1.4, { color = HERO.gold, opacity = 0.55 } = {}) {
  if (!glowTex) {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const x = c.getContext('2d');
    const gr = x.createRadialGradient(128, 128, 0, 128, 128, 128);
    gr.addColorStop(0, 'rgba(255,255,255,1)');
    gr.addColorStop(0.35, 'rgba(255,255,255,0.35)');
    gr.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = gr; x.fillRect(0, 0, 256, 256);
    glowTex = new THREE.CanvasTexture(c);
  }
  const m = new THREE.Mesh(new THREE.PlaneGeometry(radius * 2, radius * 2), new THREE.MeshBasicMaterial({
    map: glowTex, color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
  }));
  m.rotation.x = -Math.PI / 2;
  return m;
}

// ------------------------------------------------------------------ cards

// Info card in the banner's palette: dark slab, thin border, cream text.
// `draw(ctx, w, h, t)` paints the contents; the card faces the camera.
export function heroCard(camera, worldW, canvasW, canvasH, draw, { border = 0x3c6334, opacity = 0.94 } = {}) {
  const screen = new CanvasScreen(canvasW, canvasH, (ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = `rgba(20,26,21,${opacity})`;
    roundRect(ctx, 4, 4, w - 8, h - 8, Math.min(26, h * 0.12));
    ctx.fill();
    ctx.strokeStyle = css(border);
    ctx.lineWidth = 4;
    ctx.stroke();
    draw(ctx, w, h, t);
  });
  screen.draw(0);
  const worldH = (worldW * canvasH) / canvasW;
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(worldW, worldH), new THREE.MeshBasicMaterial({ map: screen.texture, transparent: true, toneMapped: false, depthWrite: false }));
  mesh.quaternion.copy(camera.quaternion);
  mesh.renderOrder = 10;
  mesh.userData.screen = screen;
  mesh.userData.worldH = worldH;
  return mesh;
}

// Text helpers for cards.
export function text(ctx, str, x, y, size, color = HERO.ink, { weight = 400, align = 'left', max = null } = {}) {
  ctx.font = `${weight} ${size}px 'HStack Type', monospace`;
  ctx.fillStyle = typeof color === 'number' ? css(color) : color;
  ctx.textAlign = align;
  ctx.textBaseline = 'alphabetic';
  if (max) ctx.fillText(str, x, y, max); else ctx.fillText(str, x, y);
}

export function chip(ctx, str, x, y, size, color) {
  ctx.font = `700 ${size}px 'HStack Type', monospace`;
  const w = ctx.measureText(str).width + size * 0.9;
  ctx.fillStyle = css(color);
  roundRect(ctx, x, y - size * 1.05, w, size * 1.45, size * 0.3);
  ctx.fill();
  ctx.fillStyle = css(HERO.bg);
  ctx.textAlign = 'left';
  ctx.fillText(str, x + size * 0.45, y);
  return w;
}

// ---------------------------------------------------------------- mascot

let mascotImg = null;
export async function loadMascot() {
  if (!mascotImg) mascotImg = await loadImg('assets/mascot-sprite.png');
  return mascotImg;
}
export const mascot = () => mascotImg;

// Fonts for cards; loaded once per page.
export async function loadType() {
  for (const weight of [400, 700]) {
    const face = new FontFace('HStack Type', `url(assets/fonts/hstack-type-${weight}.woff2)`, { weight: String(weight) });
    await face.load();
    document.fonts.add(face);
  }
}

// Gentle 0..1 pulse, phase-shifted per index; loops cleanly over t.
export const pulse = (t, k = 0, f = 1) => 0.5 + 0.5 * Math.sin((t * f + k * 0.17) * TAU);

// ------------------------------------------------------------------ towers

// A camo block stack, centred on x/z with its bottom on y = 0, carrying glyph
// panels on the two faces the iso camera sees: 'z' (front-left, +z) and
// 'x' (front-right, +x). Each panel: { face, u, v, size, icon | image | draw, color }
// where u is the offset along the face from its centre and v the panel centre
// height. Returns the group; panels are in group.userData.panels by index.
export function tower({ nx = 2, ny = 4, nz = 2, cell = 0.5, seed = 7, cells = null, panels = [], palette } = {}) {
  const g = new THREE.Group();
  const body = blocks(cells ?? boxCells(0, 0, 0, nx, ny, nz), { cell, seed, palette });
  body.children[0].position.set((-nx * cell) / 2, 0, (-nz * cell) / 2);
  g.add(body);
  const hx = (nx * cell) / 2, hz = (nz * cell) / 2;
  g.userData.panels = panels.map((p) => {
    const size = p.size ?? cell * Math.min(nx, nz) * 0.92;
    const depth = p.depth ?? cell * 0.16;
    const panel = glyphPanel({ size, depth, icon: p.icon, image: p.image, color: p.color, draw: p.draw, glow: p.glow });
    if (p.face === 'x') {
      panel.rotation.y = Math.PI / 2;
      panel.position.set(hx + depth / 2 - 0.004, p.v, p.u ?? 0);
    } else {
      panel.position.set(p.u ?? 0, p.v, hz + depth / 2 - 0.004);
    }
    g.add(panel);
    return panel;
  });
  g.userData.top = ny * cell;
  g.userData.half = [hx, hz];
  return g;
}

// ---------------------------------------------------------------- backdrop

// A banner-style world for diagram scenes: tiled floor, clusters of camo
// towers with glyph panels, and gold traces between them. Returns update(t).
export function heroBackdrop(scene, { seed = 5, radius = 9, cell = 0.5, traces: withTraces = true, icons = ['code', 'doc', 'brain', 'invader', 'terminal', 'orca', 'laptop', 'gear', 'chat', 'leaf'] } = {}) {
  const rand = rng(seed);
  scene.add(heroFloor({ size: radius * 5, tile: cell * 2, seed: seed + 1 }));
  const R2 = Math.SQRT1_2;
  const at = (u, w) => new THREE.Vector3((u + w) * R2, 0, (w - u) * R2);
  const spots = [];
  const count = 9;
  for (let i = 0; i < count; i++) {
    const a = (i / count) * TAU + rand() * 0.4;
    const r = radius * (0.55 + rand() * 0.4);
    spots.push(at(Math.cos(a) * r * 1.25, Math.sin(a) * r * 0.75));
  }
  const nodes = [];
  spots.forEach((p, i) => {
    const icon = icons[i % icons.length];
    const color = icon === 'leaf' ? 0x7fa86a : HERO.glyph;
    const ny = 2 + Math.floor(rand() * 4);
    const t = tower({ nx: 2, ny, nz: 2, cell, seed: seed * 31 + i, panels: [
      { face: rand() > 0.5 ? 'z' : 'x', v: cell * (ny - 1), icon, color },
    ] });
    t.position.copy(p);
    scene.add(t);
    const n = goldNode(0.14);
    n.position.set(p.x + cell * 1.3, 0.1, p.z + cell * 1.3);
    scene.add(n);
    nodes.push(n);
    const g = floorGlow(1.0, { opacity: 0.35 });
    g.position.set(n.position.x, 0.01, n.position.z);
    scene.add(g);
  });
  const traces = [];
  for (let i = 0; withTraces && i < spots.length; i++) {
    const a = nodes[i].position, b = nodes[(i + 1) % nodes.length].position;
    const tr = goldTrace([a.clone().setY(0.03), new THREE.Vector3(b.x, 0.03, a.z), b.clone().setY(0.03)], { radius: 0.014, packets: 1, packetSize: 0.1 });
    scene.add(tr);
    traces.push(tr);
  }
  return (t) => {
    traces.forEach((tr) => tr.userData.update(t));
    nodes.forEach((n, k) => n.userData.pulse(pulse(t, k, 2)));
  };
}

// A camera-facing layer showing a CanvasScreen, drawn over the 3D world.
export function flatOverlay(scene, camera, screen, worldW, worldH) {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(worldW, worldH), new THREE.MeshBasicMaterial({
    map: screen.texture, transparent: true, toneMapped: false, depthTest: false, depthWrite: false,
  }));
  mesh.quaternion.copy(camera.quaternion);
  mesh.renderOrder = 20;
  scene.add(mesh);
  return mesh;
}
