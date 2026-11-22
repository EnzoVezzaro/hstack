// The crew as camo block towers in the banner's style: you talk to the
// assistant, Orca routes work along gold floor traces to three workers, and a
// gold crate rides up to the director, whose check lights when it lands.
import { THREE, TAU } from '../lib.js';
import {
  HERO, css, tower, blocks, boxCells, goldNode, goldTrace, heroFloor, floorGlow, mascot, pulse, ICONS,
} from '../kit.js';

export const view = { size: 3.35, target: [0.15, 1.05, 0.35], elevation: 30, azimuth: 45 };
export const bloom = { strength: 0.55, radius: 0.4, threshold: 0.82 };
export const exposure = 1.15;
export const shadowSize = 12;

const R2 = Math.SQRT1_2;
// u: screen-horizontal, w: toward the viewer.
const at = (u, w) => new THREE.Vector3((u + w) * 0.84 * R2, 0, (w - u) * 0.84 * R2);
const CELL = 0.42;

function place(obj, p) { obj.position.copy(p); return obj; }

function iconDraw(name, colorFn) {
  return (ctx, w, h, t) => {
    const rows = ICONS[name];
    const n = Math.max(rows.length, ...rows.map((r) => r.length));
    const c = Math.floor((w * 0.62) / n);
    const x0 = Math.round(w / 2 - (Math.max(...rows.map((r) => r.length)) * c) / 2);
    const y0 = Math.round(h / 2 - (rows.length * c) / 2);
    const color = colorFn(t);
    ctx.save();
    ctx.shadowColor = color; ctx.shadowBlur = c * 1.6;
    for (let pass = 0; pass < 2; pass++) {
      ctx.fillStyle = color;
      rows.forEach((row, r) => [...row].forEach((ch, k) => { if (ch === '#') ctx.fillRect(x0 + k * c, y0 + r * c, c - 1, c - 1); }));
      ctx.shadowBlur = 0;
    }
    ctx.restore();
  };
}

export async function build({ scene }) {
  scene.add(heroFloor({ size: 40, tile: CELL * 2 }));
  const updates = [];

  // You: a short tower carrying the mascot.
  const youPos = at(-5.0, 1.4);
  const you = place(tower({ nx: 2, ny: 2, nz: 2, cell: CELL, seed: 3, panels: [{ face: 'z', v: CELL, image: mascot(), size: CELL * 1.7 }] }), youPos);
  scene.add(you);

  // A small leaf block beside you, kept quiet.
  const leafPos = at(-6.1, 2.6);
  scene.add(place(tower({ nx: 1, ny: 1, nz: 1, cell: CELL, seed: 4, panels: [{ face: 'x', v: CELL / 2, icon: 'leaf', color: 0x7fa86a, size: CELL * 0.82, glow: 0.8 }] }), leafPos));

  // Assistant: headset and chat.
  const asstPos = at(-3.0, -0.4);
  const asst = place(tower({ nx: 2, ny: 5, nz: 2, cell: CELL, seed: 11, panels: [
    { face: 'z', v: CELL * 3.6, icon: 'headset' },
    { face: 'x', v: CELL * 1.6, icon: 'chat' },
  ] }), asstPos);
  scene.add(asst);

  // Orca: the router, tallest in the room.
  const orcaPos = at(-0.4, -2.0);
  const orca = place(tower({ nx: 2, ny: 7, nz: 2, cell: CELL, seed: 17, panels: [
    { face: 'z', v: CELL * 5.6, icon: 'orca' },
    { face: 'x', v: CELL * 3.4, icon: 'server' },
  ] }), orcaPos);
  scene.add(orca);

  // Workers: three short towers.
  const workerIcons = ['code', 'doc', 'terminal'];
  const workerPos = [at(1.6, -1.2), at(3.2, -1.2), at(4.8, -1.2)];
  workerPos.forEach((p, i) => scene.add(place(tower({ nx: 2, ny: 3, nz: 2, cell: CELL, seed: 30 + i, panels: [
    { face: 'z', v: CELL * 1.9, icon: 'laptop' },
    { face: 'x', v: CELL * 1.5, icon: workerIcons[i] },
  ] }), p)));

  // Director: crown, and a check that lights when the crate lands.
  const dirPos = at(2.4, 2.6);
  const landed = (t) => t > 0.72 && t < 0.97;
  const director = place(tower({ nx: 2, ny: 4, nz: 2, cell: CELL, seed: 41, panels: [
    { face: 'z', v: CELL * 2.6, icon: 'crown' },
    { face: 'x', v: CELL * 2.0, draw: iconDraw('check', (t) => (landed(t) ? css(HERO.mint) : '#3d4a3c')) },
  ] }), dirPos);
  scene.add(director);
  const checkPanel = director.userData.panels[1];

  // A few loose cubes on the floor, like the banner's scattered tiles.
  [[at(-1.6, 2.8), 51], [at(5.6, 1.4), 52], [at(-5.8, -1.2), 53]].forEach(([p, s]) => {
    const b = blocks(boxCells(0, 0, 0, 1, 1, 1), { cell: CELL, seed: s });
    b.position.set(p.x - CELL / 2, 0, p.z - CELL / 2);
    scene.add(b);
  });

  // Floor traces: you -> assistant -> Orca -> each worker.
  const foot = (p, half = CELL) => new THREE.Vector3(p.x + half, 0.03, p.z + half);
  const nodeAt = (p) => {
    const n = goldNode(0.12);
    n.position.set(p.x, 0.09, p.z);
    scene.add(n);
    const gl = floorGlow(0.7, { opacity: 0.45 });
    gl.position.set(p.x, 0.01, p.z);
    scene.add(gl);
    return n;
  };
  const traces = [];
  const addTrace = (pts, opts) => { const tr = goldTrace(pts, { radius: 0.016, packetSize: 0.1, ...opts }); scene.add(tr); traces.push(tr); return tr; };
  const a = foot(youPos), b = foot(asstPos), c = foot(orcaPos);
  addTrace([a, new THREE.Vector3(b.x, 0.03, a.z), b], { packets: 1 });
  addTrace([b, new THREE.Vector3(c.x, 0.03, b.z), c], { packets: 2 });
  workerPos.forEach((p, i) => {
    const d = foot(p);
    addTrace([c, new THREE.Vector3(c.x, 0.03, d.z), d], { packets: 1, speed: 1 });
  });
  const nodes = [a, b, c, ...workerPos.map((p) => foot(p))].map(nodeAt);

  // The crate: a worker's finished job rides up to the director.
  const crateSize = CELL * 0.62;
  const crate = new THREE.Group();
  const crateBody = blocks([[0, 0, 0]], { cell: crateSize, seed: 61, palette: [[0xc9a46a, 1]] });
  crateBody.position.set(-crateSize / 2, -crateSize / 2, -crateSize / 2);
  crate.add(crateBody);
  const crateGlow = goldNode(crateSize * 0.45);
  crateGlow.position.y = crateSize * 0.55;
  crate.add(crateGlow);
  scene.add(crate);
  const from = new THREE.Vector3(workerPos[1].x, CELL * 3 + crateSize / 2, workerPos[1].z);
  const to = new THREE.Vector3(dirPos.x, CELL * 4 + crateSize / 2, dirPos.z);
  const arc = new THREE.QuadraticBezierCurve3(from, from.clone().lerp(to, 0.5).add(new THREE.Vector3(0, 1.4, 0)), to);
  const arcTrace = goldTrace(arc.getPoints(24), { radius: 0.01, packets: 0 });
  scene.add(arcTrace);
  const dirGlow = floorGlow(1.0, { opacity: 0.0 });
  dirGlow.position.set(dirPos.x, CELL * 4 + 0.01, dirPos.z);
  scene.add(dirGlow);

  updates.push((t) => {
    traces.forEach((tr) => tr.userData.update(t));
    nodes.forEach((n, k) => n.userData.pulse(pulse(t, k, 2)));
    const u = THREE.MathUtils.clamp((t - 0.2) / 0.52, 0, 1);
    const e = u < 0.5 ? 2 * u * u : 1 - (-2 * u + 2) ** 2 / 2;
    crate.position.copy(arc.getPoint(e));
    crate.rotation.y = e * TAU * 0.5;
    crate.visible = t > 0.12 && t < 0.97;
    checkPanel.userData.screen.draw(t);
    dirGlow.material.opacity = landed(t) ? 0.55 : 0;
  });

  return (t) => updates.forEach((f) => f(t));
}
