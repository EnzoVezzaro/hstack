// Install, in the banner's style: a camo block monolith carries a terminal that
// runs `npx skills add`, and skill cards fly out of the screen along a gold arc
// onto a camo shelf, one by one.
import { THREE, CanvasScreen, roundRect, terminalScreen } from '../lib.js';
import {
  HERO, css, blocks, boxCells, goldNode, goldTrace, heroFloor, floorGlow, pulse,
} from '../kit.js';

export const view = { size: 3.2, target: [0.4, 1.35, 0.2], elevation: 26, azimuth: 45 };
export const bloom = { strength: 0.5, radius: 0.4, threshold: 0.84 };
export const exposure = 1.15;
export const shadowSize = 10;

const CELL = 0.34;
const SKILLS = [
  ['hstack', HERO.gold], ['verify-and-fix', HERO.mint], ['coordinate-agents', HERO.blue], ['horizon-loop', HERO.violet],
  ['puff-puff-pass', HERO.mint], ['reconcile-branches', HERO.blue], ['cleanup-orca', HERO.coral], ['humanize', HERO.cream],
  ['release', HERO.gold], ['visual-test', HERO.mint], ['get-stoned', HERO.violet], ['pineapple-express', HERO.coral],
];
const FLY_START = 0.36;
const FLY_END = 0.86;
const smooth = (k) => k * k * (3 - 2 * k);
const seg = (t, a, b) => smooth(Math.max(0, Math.min(1, (t - a) / (b - a))));
const TURN = Math.PI / 4 - 0.3; // show the front plus a sliver of side, like the banner

function cardTexture(name, color) {
  const s = new CanvasScreen(512, 300, (ctx, w, h) => {
    ctx.fillStyle = css(HERO.panel); roundRect(ctx, 0, 0, w, h, 26); ctx.fill();
    ctx.fillStyle = css(color); ctx.fillRect(0, 0, w, 50);
    ctx.fillStyle = css(HERO.bg); ctx.font = "400 30px 'HStack Type', monospace"; ctx.fillText('SKILL.md', 26, 36);
    ctx.fillStyle = css(HERO.ink);
    ctx.font = `400 ${name.length > 14 ? 40 : 50}px 'HStack Type', monospace`;
    ctx.fillText(`/${name}`, 26, 148);
    ctx.fillStyle = '#3c4a3e';
    for (let i = 0; i < 3; i++) ctx.fillRect(26, 190 + i * 28, 300 - i * 70, 12);
  });
  s.draw(0);
  return s;
}

export async function build({ scene }) {
  scene.add(heroFloor({ size: 36, tile: CELL * 2 }));
  const updates = [];

  // Monolith with the terminal on its face.
  const mono = new THREE.Group();
  const body = blocks(boxCells(0, 0, 0, 10, 7, 2), { cell: CELL, seed: 15 });
  body.position.set(-5 * CELL, 0, -2 * CELL);
  mono.add(body);
  const term = terminalScreen([
    '$ npx skills add EnzoVezzaro/hstack',
    '◇ Found 55 skills',
    '◆ Select skills: all 55',
    '◆ Install for: claude-code, codex',
    '✓ Installed to ~/.claude/skills',
    '✓ Installed to ~/.codex/skills',
    '✓ Done. Restart your agent.',
  ], { title: 'zsh · ~/projects/app', typeSpeed: 0.9 });
  const slab = new THREE.Mesh(new THREE.BoxGeometry(CELL * 8.6, CELL * 5.4, 0.06), new THREE.MeshStandardMaterial({ color: HERO.panel, roughness: 0.7 }));
  slab.position.set(0, CELL * 3.5, 0.03);
  mono.add(slab);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(CELL * 8.2, CELL * 5.1), new THREE.MeshStandardMaterial({ color: 0, emissive: 0xffffff, emissiveMap: term.texture, emissiveIntensity: 1.05 }));
  screen.position.set(0, CELL * 3.5, 0.065);
  mono.add(screen);
  mono.rotation.y = TURN;
  mono.position.set(-1.9, 0, 0.9);
  scene.add(mono);
  const monoGlow = floorGlow(1.2, { opacity: 0.16 });
  monoGlow.position.set(-1.2, 0.01, 1.6);
  scene.add(monoGlow);

  // Shelf: three camo ledges.
  const shelf = new THREE.Group();
  const shelfCells = [
    ...boxCells(0, 0, 0, 9, 1, 2, { shell: false }),
    ...boxCells(0, 3, 0, 9, 1, 2, { shell: false }),
    ...boxCells(0, 6, 0, 9, 1, 2, { shell: false }),
    ...boxCells(0, 1, 0, 1, 8, 1, { shell: false }),
    ...boxCells(8, 1, 0, 1, 8, 1, { shell: false }),
    ...boxCells(1, 8, 0, 7, 1, 1, { shell: false }),
  ];
  const sb = blocks(shelfCells, { cell: CELL, seed: 27 });
  sb.position.set(-4.5 * CELL, 0, -1 * CELL);
  shelf.add(sb);
  shelf.rotation.y = TURN;
  shelf.position.set(2.35, 0, -0.9);
  scene.add(shelf);

  // Slots on the ledges, in shelf space.
  const slots = SKILLS.map((_, i) => {
    const row = Math.floor(i / 4), col = i % 4;
    const local = new THREE.Vector3((-1.5 + col) * CELL * 1.85, (row * 3 + 1) * CELL + CELL * 0.62, CELL * 1.25);
    return local.applyAxisAngle(new THREE.Vector3(0, 1, 0), TURN).add(shelf.position);
  });

  // Cards.
  const cw = CELL * 1.7, ch = cw * 0.59;
  const launch = new THREE.Vector3(0, CELL * 3.5, 0.2).applyAxisAngle(new THREE.Vector3(0, 1, 0), TURN).add(mono.position);
  const cards = SKILLS.map(([name, color], i) => {
    const tex = cardTexture(name, color);
    const g = new THREE.Group();
    const b = new THREE.Mesh(new THREE.BoxGeometry(cw, ch, 0.05), new THREE.MeshStandardMaterial({ color: HERO.panel, roughness: 0.6 }));
    b.castShadow = true;
    g.add(b);
    const f = new THREE.Mesh(new THREE.PlaneGeometry(cw * 0.97, ch * 0.95), new THREE.MeshStandardMaterial({ color: 0, emissive: 0xffffff, emissiveMap: tex.texture, emissiveIntensity: 1.0 }));
    f.position.z = 0.027;
    g.add(f);
    g.rotation.y = TURN;
    scene.add(g);
    const start = FLY_START + (i / SKILLS.length) * (FLY_END - FLY_START - 0.06);
    return { g, start, end: start + 0.09, slot: slots[i] };
  });

  // Gold arc from the screen to the shelf, with packets.
  const mid = launch.clone().lerp(slots[5], 0.5).add(new THREE.Vector3(0, 1.3, 0));
  const arc = new THREE.QuadraticBezierCurve3(launch, mid, slots[5]);
  const arcTrace = goldTrace(arc.getPoints(30), { radius: 0.008, packets: 2, packetSize: 0.06 });
  scene.add(arcTrace);
  const n1 = goldNode(0.12); n1.position.copy(launch); scene.add(n1);

  updates.push((t) => {
    term.draw(Math.min(1, t / 0.4));
    arcTrace.userData.update(t);
    n1.userData.pulse(pulse(t, 0, 4));
    cards.forEach(({ g, start, end, slot }) => {
      const k = seg(t, start, end);
      const visible = t >= start;
      g.visible = visible && t < 0.985;
      if (!visible) return;
      const m = launch.clone().lerp(slot, 0.5).add(new THREE.Vector3(0, 1.1, 0));
      const c = new THREE.QuadraticBezierCurve3(launch, m, slot);
      g.position.copy(c.getPoint(k));
      g.rotation.z = (1 - k) * 0.5;
      g.scale.setScalar(0.6 + 0.4 * k);
    });
  });

  return (t) => updates.forEach((f) => f(t));
}
