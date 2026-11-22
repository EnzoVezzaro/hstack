// Install: a floating terminal runs `npx skills add`, and skill cards fly out
// of the screen into a shelf, one by one.
import {
  THREE, TAU, PAL, mat, glowMat, box, cyl, sphere, place, CanvasScreen, roundRect, hex,
  terminalScreen, robot, animateRobot, mug, plant,
} from '../lib.js';

export const view = { size: 3.95, target: [0.3, 1.75, 0.1], elevation: 28 };
export const bloom = { strength: 0.6, radius: 0.45, threshold: 0.8 };
export const exposure = 1.3;

const SKILLS = [
  ['hstack', PAL.gold], ['verify-and-fix', PAL.mint], ['coordinate-agents', PAL.blue], ['horizon-loop', PAL.violet],
  ['puff-puff-pass', PAL.mint], ['reconcile-branches', PAL.blue], ['cleanup-orca', PAL.coral], ['humanize', PAL.cream],
  ['release', PAL.gold], ['visual-test', PAL.mint], ['get-stoned', PAL.violet], ['pineapple-express', PAL.coral],
];
const FLY_START = 0.36;
const FLY_END = 0.86;

const smooth = (k) => k * k * (3 - 2 * k);
const seg = (t, a, b) => smooth(Math.max(0, Math.min(1, (t - a) / (b - a))));

function cardTexture(name, color) {
  const s = new CanvasScreen(512, 300, (ctx, w, h) => {
    ctx.fillStyle = '#101a15'; roundRect(ctx, 0, 0, w, h, 34); ctx.fill();
    ctx.fillStyle = hex(color); roundRect(ctx, 0, 0, w, 54, 34); ctx.fill();
    ctx.fillRect(0, 30, w, 24);
    ctx.fillStyle = '#0a120e'; ctx.font = '800 30px Menlo, monospace'; ctx.fillText('SKILL.md', 28, 38);
    ctx.fillStyle = '#e8d6b4';
    const size = name.length > 14 ? 40 : 50;
    ctx.font = `800 ${size}px Menlo, monospace`;
    ctx.fillText(`/${name}`, 28, 150);
    ctx.fillStyle = '#41594a';
    for (let i = 0; i < 3; i++) ctx.fillRect(28, 192 + i * 28, 300 - i * 70, 12);
  });
  s.draw(0);
  return s;
}

export async function build({ scene, camera, sun, hemi }) {
  sun.intensity = 2.0;
  hemi.intensity = 0.85;
  const updates = [];
  const screens = [];

  // ---- platform
  scene.add(place(box(12.5, 0.45, 6.4, mat(PAL.strataA, { r: 0.9 }), { r: 0.1 }), 0.2, -0.22, -0.2));
  scene.add(place(box(12.3, 0.18, 6.2, mat(PAL.strataB, { r: 0.9 }), { r: 0.07 }), 0.2, -0.53, -0.2));
  scene.add(place(box(12.3, 0.03, 6.2, mat(PAL.floor, { r: 0.9 }), { r: 0.01 }), 0.2, 0.0, -0.2));

  // ---- the floating terminal window
  const term = terminalScreen([
    '$ npx skills add EnzoVezzaro/hstack',
    '◇ Found 55 skills',
    '◆ Select skills: all 55',
    '◆ Install for: claude-code, codex',
    '✓ Installed to ~/.claude/skills',
    '✓ Installed to ~/.codex/skills',
    '✓ Done. Restart your agent.',
  ], { title: 'zsh · ~/projects/app', typeSpeed: 0.9 });
  screens.push(term);
  const win = new THREE.Group();
  win.position.set(-2.55, 2.25, 0.4);
  win.rotation.y = Math.PI / 4 - 0.12;
  scene.add(win);
  win.add(place(box(4.3, 2.8, 0.22, mat(PAL.metalDark, { r: 0.4, m: 0.3 }), { r: 0.12 }), 0, 0, 0));
  win.add(place(box(4.3, 0.34, 0.24, mat(0x1d2a23, { r: 0.5 }), { r: 0.1 }), 0, 1.24, 0.005));
  [PAL.coral, PAL.gold, PAL.mint].forEach((c, i) => win.add(place(sphere(0.06, glowMat(c, 1.6), 12), -1.92 + i * 0.2, 1.25, 0.13)));
  const panel = new THREE.Mesh(new THREE.PlaneGeometry(4.05, 2.35), new THREE.MeshStandardMaterial({ color: 0, emissive: 0xffffff, emissiveMap: term.texture, emissiveIntensity: 1.0 }));
  panel.position.set(0, -0.12, 0.115);
  win.add(panel);
  // a soft glowing stand under the floating window
  const pedestal = place(cyl(0.9, 1.1, 0.12, mat(PAL.metalDark, { m: 0.5, r: 0.4 }), 40), -2.55, 0.06, 0.4);
  scene.add(pedestal);
  const halo = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.03, 8, 64), glowMat(PAL.mint, 2.2));
  halo.rotation.x = Math.PI / 2;
  halo.position.set(-2.55, 0.13, 0.4);
  scene.add(halo);
  updates.push((t) => {
    win.position.y = 2.25 + Math.sin(t * TAU * 2) * 0.06;
    halo.material.emissiveIntensity = 1.8 + Math.sin(t * TAU * 4) * 0.6;
  });

  // ---- the shelf that receives the cards
  const shelf = new THREE.Group();
  shelf.position.set(2.75, 0, -0.9);
  shelf.rotation.y = Math.PI / 4 - 0.25;
  scene.add(shelf);
  const cols = 3;
  const rows = 4;
  const sw = 1.25;
  const sh = 0.82;
  const frame = mat(PAL.woodDark, { r: 0.6 });
  shelf.add(place(box(cols * sw + 0.2, rows * sh + 0.3, 0.1, frame, { r: 0.02 }), 0, (rows * sh + 0.3) / 2, -0.3));
  [-1, 1].forEach((sx) => shelf.add(place(box(0.1, rows * sh + 0.3, 0.7, frame, { r: 0.02 }), sx * (cols * sw + 0.1) / 2, (rows * sh + 0.3) / 2, 0)));
  for (let r = 0; r <= rows; r++) shelf.add(place(box(cols * sw + 0.2, 0.06, 0.7, mat(PAL.wood, { r: 0.6 }), { r: 0.01 }), 0, 0.15 + r * sh, 0));
  const glowStrip = place(box(cols * sw, 0.05, 0.05, glowMat(PAL.gold, 0.4), { r: 0.01, shadow: false }), 0, rows * sh + 0.28, 0.32);
  shelf.add(glowStrip);
  const slot = (i) => {
    const r = rows - 1 - Math.floor(i / cols);
    const c = i % cols;
    const p = new THREE.Vector3(-((cols - 1) * sw) / 2 + c * sw, 0.15 + r * sh + 0.36, 0.05);
    return shelf.localToWorld(p);
  };
  shelf.updateMatrixWorld(true);

  // ---- cards
  const cards = SKILLS.map(([name, color]) => {
    const tex = cardTexture(name, color);
    const g = new THREE.Group();
    g.add(place(box(1.1, 0.64, 0.06, mat(PAL.rubber, { r: 0.4 }), { r: 0.04 }), 0, 0, -0.035));
    const face = new THREE.Mesh(new THREE.PlaneGeometry(1.06, 0.62), new THREE.MeshStandardMaterial({ color: 0, map: tex.texture, emissive: 0xffffff, emissiveMap: tex.texture, emissiveIntensity: 1.05, transparent: true }));
    g.add(face);
    scene.add(g);
    return g;
  });
  const fromPoint = () => panel.localToWorld(new THREE.Vector3(0.6, -0.2, 0.3));
  const shelfQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, shelf.rotation.y, 0));
  updates.push((t) => {
    win.updateMatrixWorld(true);
    const start = fromPoint();
    const span = (FLY_END - FLY_START) / SKILLS.length;
    cards.forEach((g, i) => {
      const a = FLY_START + i * span;
      const k = seg(t, a, a + span * 2.2);
      const fade = t > 0.95 ? 1 - seg(t, 0.95, 1) : 1;
      if (t < a) { g.visible = false; return; }
      g.visible = true;
      const end = slot(i);
      const p = start.clone().lerp(end, k);
      p.y += Math.sin(k * Math.PI) * 1.1;
      g.position.copy(p);
      g.quaternion.copy(win.quaternion).slerp(shelfQuat, k);
      g.rotateY((1 - k) * Math.sin(i) * 1.2);
      g.scale.setScalar(Math.max(0.001, (0.35 + 0.65 * k) * fade));
    });
    const full = seg(t, FLY_END + 0.02, FLY_END + 0.06) * (t > 0.95 ? 1 - seg(t, 0.95, 1) : 1);
    glowStrip.material.emissiveIntensity = 0.4 + full * 3.2;
  });

  // ---- a robot watching the shelf fill, and some desk life
  const bot = robot({ accent: PAL.gold, kind: 'assistant', scale: 0.95 });
  place(bot, 0.35, 0, 1.55, Math.PI / 4 + 0.3);
  scene.add(bot);
  updates.push((t) => animateRobot(bot, t, { mode: t > FLY_END ? 'inspect' : 'idle', phase: 0.4 }));
  const cup = mug({ color: PAL.coral });
  place(cup, -0.6, 0, 2.2);
  scene.add(cup);
  updates.push((t) => cup.userData.update(t));
  const pl = plant({ scale: 1.25 });
  place(pl, 5.3, 0, -2.4);
  scene.add(pl);
  updates.push((t) => pl.userData.update(t));
  const cableCurve = new THREE.CatmullRomCurve3([[-2.0, 0.03, 1.1], [-0.6, 0.03, 1.0], [0.9, 0.03, 0.3], [2.0, 0.03, -0.3]].map((v) => new THREE.Vector3(...v)));
  const cableMesh = new THREE.Mesh(new THREE.TubeGeometry(cableCurve, 64, 0.04, 8, false), mat(PAL.rubber, { r: 0.6 }));
  cableMesh.castShadow = true;
  scene.add(cableMesh);
  const packets = [0, 1, 2].map(() => { const p = box(0.09, 0.09, 0.09, glowMat(PAL.gold, 3), { r: 0.02, shadow: false }); scene.add(p); return p; });
  updates.push((t) => packets.forEach((p, i) => {
    const u = (t * 3 + i / 3) % 1;
    p.position.copy(cableCurve.getPointAt(u)).add(new THREE.Vector3(0, 0.08, 0));
  }));

  return (t) => {
    screens.forEach((s) => s.draw(t));
    updates.forEach((u) => u(t));
  };
}
