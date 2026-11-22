// Escalation, told in the banner's style: four camo terraces (T0 workers,
// T1 supervisors, T2 directors, T3 high mode) beside a lift on a gold rail.
// A task crate fails twice on T0, rides up to T1 and fails again, gets a plan
// from the directors on T2, and rides back down to T0, where it passes.
import { THREE } from '../lib.js';
import {
  HERO, css, tower, blocks, boxCells, goldNode, goldTrace, heroFloor, floorGlow, heroCard, text, chip, pulse, ICONS,
} from '../kit.js';

export const view = { size: 3.5, target: [2.0, 2.5, 0.9], elevation: 28, azimuth: 45 };
export const bloom = { strength: 0.55, radius: 0.4, threshold: 0.82 };
export const exposure = 1.15;
export const shadowSize = 12;

const CELL = 0.4;
const LEVEL = 3; // cells per floor
const TIERS = [
  { name: 'T0', title: 'workers', color: HERO.mint, icon: 'laptop' },
  { name: 'T1', title: 'supervisors', color: HERO.blue, icon: 'eye' },
  { name: 'T2', title: 'directors', color: HERO.gold, icon: 'crown' },
  { name: 'T3', title: 'high mode', color: HERO.coral, icon: 'brain' },
];
const LOG = [
  [0.0, 'T0', 'attempt 1 on a worker model', 'busy'],
  [0.1, 'T0', 'attempt 1 failed verification', 'fail'],
  [0.2, 'T0', 'attempt 2 failed · escalate', 'fail'],
  [0.26, 'T1', 'riding up to a supervisor', 'move'],
  [0.4, 'T1', 'attempt 3 failed · escalate', 'fail'],
  [0.48, 'T2', 'riding up to the director', 'move'],
  [0.6, 'T2', 'plan written · acceptance check set', 'plan'],
  [0.71, 'T0', 'plan goes back down to T0', 'move'],
  [0.86, 'T0', 'done on a worker model', 'pass'],
];
const KIND = { busy: HERO.ink, fail: HERO.coral, move: HERO.blue, plan: HERO.gold, pass: HERO.mint };

// Stepped terraces: step k spans x 0..STEP_X(k), z 0..STEP_Z(k), and its top
// sits at (k + 1) * LEVEL cells. The lift stands in front of every step.
const STEP_X = (k) => 8 - 2 * k;
const STEP_Z = (k) => 6 - k;
const LIFT = 9.5;
const DESK = 'desk';
const deskX = (level) => STEP_X(Math.round(level)) - 1.1;
// Crate keyframes: [t, level, x]; x is a cell column or DESK on that level.
const KEYS = [
  [0.0, 0, DESK], [0.2, 0, DESK], [0.23, 0, LIFT], [0.29, 1, LIFT], [0.32, 1, DESK],
  [0.4, 1, DESK], [0.43, 1, LIFT], [0.48, 2, LIFT], [0.51, 2, DESK], [0.6, 2, DESK],
  [0.63, 2, LIFT], [0.69, 0, LIFT], [0.72, 0, DESK], [1.0, 0, DESK],
];
function crateAt(t) {
  for (let i = 0; i < KEYS.length - 1; i++) {
    const [t0, l0, x0] = KEYS[i], [t1, l1, x1] = KEYS[i + 1];
    if (t >= t0 && t <= t1) {
      const u = t1 > t0 ? (t - t0) / (t1 - t0) : 0;
      const e = u * u * (3 - 2 * u);
      const a = x0 === DESK ? deskX(l0) : x0, b = x1 === DESK ? deskX(l1) : x1;
      return [l0 + (l1 - l0) * e, a + (b - a) * e];
    }
  }
  return [0, deskX(0)];
}

function glyphDraw(rowsFn, colorFn) {
  return (ctx, w, h, t) => {
    const rows = ICONS[rowsFn(t)];
    const cols = Math.max(...rows.map((r) => r.length));
    const c = Math.floor((w * 0.62) / Math.max(rows.length, cols));
    const x0 = Math.round(w / 2 - (cols * c) / 2), y0 = Math.round(h / 2 - (rows.length * c) / 2);
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

const near = (t, at, w = 0.035) => t >= at && t < at + w;

export async function build({ scene, camera }) {
  scene.add(heroFloor({ size: 44, tile: CELL * 2 }));
  const updates = [];

  // Terraces: a stepped stack of camo blocks, one step per tier, each with a
  // walkway out to the lift.
  const cells = [];
  for (let k = 0; k < 4; k++) {
    cells.push(...boxCells(0, k * LEVEL, 0, STEP_X(k), LEVEL, STEP_Z(k)));
    if (k < 3) cells.push(...boxCells(STEP_X(k), (k + 1) * LEVEL - 1, 2, 9 - STEP_X(k), 1, 1, { shell: false }));
  }
  const building = blocks(cells, { cell: CELL, seed: 5 });
  scene.add(building);

  // Lift shaft: a camo column with a gold rail up its front.
  const shaft = blocks(boxCells(9, 0, 1, 1, LEVEL * 3 + 2, 2, { shell: false }), { cell: CELL, seed: 9 });
  scene.add(shaft);
  const rail = goldTrace([[10 * CELL + 0.02, 0.02, 2 * CELL], [10 * CELL + 0.02, (LEVEL * 3 + 2) * CELL, 2 * CELL]], { radius: 0.014, packets: 0 });
  scene.add(rail);

  // Tier towers with glyphs; their side panel shows live status.
  const status = [];
  TIERS.forEach((tier, k) => {
    const y0 = (k + 1) * LEVEL * CELL;
    const statusIcon = (t) => {
      if (k === 0 && (near(t, 0.1) || near(t, 0.2))) return 'cross';
      if (k === 1 && near(t, 0.4)) return 'cross';
      if (k === 2 && t >= 0.55 && t < 0.72) return 'doc';
      if (k === 0 && t >= 0.86) return 'check';
      return tier.icon;
    };
    const statusColor = (t) => {
      if (k === 0 && (near(t, 0.1) || near(t, 0.2))) return css(HERO.coral);
      if (k === 1 && near(t, 0.4)) return css(HERO.coral);
      if (k === 2 && t >= 0.55 && t < 0.72) return css(HERO.gold);
      if (k === 0 && t >= 0.86) return css(HERO.mint);
      return css(tier.color);
    };
    const tw = tower({ nx: 2, ny: 2, nz: 2, cell: CELL, seed: 20 + k, panels: [
      { face: 'z', v: CELL, icon: tier.icon, color: tier.color },
      { face: 'x', v: CELL, draw: glyphDraw(statusIcon, statusColor) },
    ] });
    tw.position.set((STEP_X(k) - 3.2) * CELL, y0, (STEP_Z(k) - 1.6) * CELL);
    scene.add(tw);
    status.push(tw.userData.panels[1]);
    if (k === 3) {
      const leaf = tower({ nx: 1, ny: 1, nz: 1, cell: CELL, seed: 33, panels: [{ face: 'z', v: CELL / 2, icon: 'leaf', color: 0x7fa86a, glow: 0.8 }] });
      leaf.position.set(0.9 * CELL, y0, (STEP_Z(k) - 0.6) * CELL);
      scene.add(leaf);
    }
    // Tier label card, floating off the left of each floor.
    const card = heroCard(camera, 1.55, 520, 120, (ctx, w, h) => {
      chip(ctx, tier.name, 22, 80, 44, tier.color);
      text(ctx, tier.title, 150, 80, 44, HERO.ink);
    }, { border: tier.color });
    card.position.set(-1.2, y0 + 0.2, 2.6);
    scene.add(card);
  });

  // The crate and its glow.
  const cs = CELL * 0.7;
  const crate = new THREE.Group();
  const body = blocks([[0, 0, 0]], { cell: cs, palette: [[0xc9a46a, 1]], seed: 2 });
  body.position.set(-cs / 2, 0, -cs / 2);
  crate.add(body);
  const lamp = goldNode(cs * 0.4);
  lamp.position.y = cs + cs * 0.25;
  crate.add(lamp);
  scene.add(crate);
  const glow = floorGlow(0.6, { opacity: 0.5 });
  scene.add(glow);

  // Task log card.
  const log = heroCard(camera, 2.6, 900, 470, (ctx, w, h, t) => {
    text(ctx, 'task #482', 36, 58, 30, HERO.muted);
    text(ctx, 'fix the flaky checkout test', 36, 104, 38, HERO.ink, { weight: 400 });
    let y = 160;
    LOG.filter(([at]) => t >= at).forEach(([, tier, line, kind], i, arr) => {
      const color = TIERS.find((x) => x.name === tier).color;
      chip(ctx, tier, 36, y, 24, color);
      text(ctx, line, 120, y, 27, KIND[kind], { weight: i === arr.length - 1 ? 700 : 400 });
      y += 36;
    });
  });
  log.position.set(6.3, 0.7, 1.0);
  scene.add(log);

  updates.push((t) => {
    const [level, x] = crateAt(t);
    const y = (level + 1) * LEVEL * CELL;
    const shake = (near(t, 0.1, 0.02) || near(t, 0.2, 0.02) || near(t, 0.4, 0.02)) ? Math.sin(t * 900) * 0.03 : 0;
    crate.position.set(x * CELL + shake, y, 2.5 * CELL);
    glow.position.set(x * CELL, y + 0.01, 2.5 * CELL);
    const ok = t >= 0.86;
    lamp.userData.cube.material.color.set(ok ? HERO.mint : HERO.gold);
    lamp.userData.cube.material.emissive.set(ok ? HERO.mint : HERO.gold);
    lamp.userData.pulse(pulse(t, 0, 4));
    status.forEach((p) => p.userData.screen.draw(t));
    log.userData.screen.draw(t);
  });

  return (t) => updates.forEach((f) => f(t));
}
