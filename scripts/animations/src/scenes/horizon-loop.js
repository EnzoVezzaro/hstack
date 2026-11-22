// Horizon loop in the banner's style: a gold runner laps a ring of camo cubes,
// one change per lap, while the score card climbs until it crosses the goal.
import { THREE, TAU } from '../lib.js';
import {
  HERO, css, tower, blocks, goldNode, goldTrace, heroFloor, floorGlow, heroCard, text, pulse,
} from '../kit.js';

export const view = { size: 3.6, target: [0.6, 0.9, 0.2], elevation: 30, azimuth: 45 };
export const bloom = { strength: 0.55, radius: 0.4, threshold: 0.82 };
export const exposure = 1.15;
export const shadowSize = 10;

const CELL = 0.36;
const RING = 8; // ring radius in cells
const LAPS = 6;
const SCORES = [58, 66, 71, 79, 87, 96];
const GOAL = 95;
const WIN = 5 / LAPS + 0.03;

export async function build({ scene, camera }) {
  scene.add(heroFloor({ size: 36, tile: CELL * 2 }));
  const updates = [];

  // The ring: a one-cube-high loop, two cubes wide.
  const cells = [];
  for (let x = -RING - 1; x <= RING; x++) for (let z = -RING - 1; z <= RING; z++) {
    const r = Math.hypot(x + 0.5, z + 0.5);
    if (r >= RING - 1.2 && r <= RING + 0.6) cells.push([x, 0, z]);
  }
  const ring = blocks(cells, { cell: CELL, seed: 14 });
  scene.add(ring);

  // Centre tower: the metric, with a chart glyph and the loop's gear.
  const hub = tower({ nx: 3, ny: 4, nz: 3, cell: CELL, seed: 22, panels: [
    { face: 'z', v: CELL * 2.6, icon: 'chart', color: HERO.mint },
    { face: 'x', v: CELL * 2.0, icon: 'gear', color: HERO.gold },
  ] });
  scene.add(hub);
  const hubGlow = floorGlow(1.6, { opacity: 0.25 });
  hubGlow.position.y = 0.01;
  scene.add(hubGlow);

  // Lap gates: gold nodes spaced around the ring, with a faint trace loop.
  const rr = (RING - 0.3) * CELL;
  const top = CELL + 0.05;
  const loop = [...Array(49)].map((_, i) => new THREE.Vector3(Math.cos((i / 48) * TAU) * rr, top, Math.sin((i / 48) * TAU) * rr));
  scene.add(goldTrace(loop, { radius: 0.01, packets: 0 }));
  const gates = [...Array(LAPS)].map((_, i) => {
    const a = (i / LAPS) * TAU;
    const n = goldNode(0.11);
    n.position.set(Math.cos(a) * rr, top + 0.06, Math.sin(a) * rr);
    scene.add(n);
    return n;
  });

  // Runner: a bright gold cube with a short trail.
  const runner = goldNode(0.2, { light: 1.2 });
  scene.add(runner);
  const trail = [0, 1, 2, 3].map((k) => {
    const m = goldNode(0.12 - k * 0.022);
    scene.add(m);
    return m;
  });

  // Score card.
  const card = heroCard(camera, 3.0, 900, 560, (ctx, w, h, t) => {
    text(ctx, 'lighthouse score', 40, 64, 40, HERO.ink, { weight: 400 });
    const lap = Math.min(LAPS, Math.floor(t * LAPS) + 1);
    text(ctx, `iteration ${lap} · one change per run`, 40, 106, 26, HERO.muted);
    const x0 = 80, x1 = w - 60, y0 = h - 60, y1 = 150;
    const ys = (v) => y0 - ((v - 50) / 50) * (y0 - y1);
    const xs = (i) => x0 + (i / (LAPS - 1)) * (x1 - x0);
    ctx.strokeStyle = '#26302a'; ctx.lineWidth = 2;
    [60, 70, 80, 90, 100].forEach((v) => { ctx.beginPath(); ctx.moveTo(x0, ys(v)); ctx.lineTo(x1, ys(v)); ctx.stroke(); text(ctx, String(v), 24, ys(v) + 8, 20, '#4f5f53'); });
    ctx.strokeStyle = css(HERO.gold); ctx.lineWidth = 4; ctx.setLineDash([14, 10]);
    ctx.beginPath(); ctx.moveTo(x0, ys(GOAL)); ctx.lineTo(x1, ys(GOAL)); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, `goal ${GOAL}`, x1 - 130, ys(GOAL) - 14, 24, HERO.gold);
    const shown = Math.min(LAPS, t * LAPS + 1);
    const pts = [];
    for (let i = 0; i < Math.floor(shown); i++) pts.push([i, SCORES[i]]);
    const frac = shown - Math.floor(shown);
    if (Math.floor(shown) < LAPS && pts.length) {
      const i = Math.floor(shown);
      pts.push([i - 1 + frac, SCORES[i - 1] + (SCORES[i] - SCORES[i - 1]) * frac]);
    }
    ctx.strokeStyle = css(HERO.mint); ctx.lineWidth = 6;
    ctx.beginPath();
    pts.forEach(([i, v], k) => (k ? ctx.lineTo(xs(i), ys(v)) : ctx.moveTo(xs(i), ys(v))));
    ctx.stroke();
    pts.forEach(([i, v]) => {
      if (i % 1 !== 0) return;
      ctx.fillStyle = css(v >= GOAL ? HERO.gold : HERO.mint);
      ctx.fillRect(xs(i) - 9, ys(v) - 9, 18, 18);
    });
    if (t > WIN) {
      ctx.fillStyle = 'rgba(255,196,74,0.16)'; ctx.fillRect(w - 330, 26, 296, 78);
      text(ctx, 'goal reached', w - 312, 78, 36, HERO.gold, { weight: 400 });
    }
  }, { border: HERO.mint });
  card.position.set(4.6, 1.15, -0.4);
  scene.add(card);

  updates.push((t) => {
    const a = (t * LAPS) % 1 * TAU;
    const pos = (ang) => new THREE.Vector3(Math.cos(ang) * rr, top + 0.12, Math.sin(ang) * rr);
    runner.position.copy(pos(a));
    trail.forEach((m, k) => m.position.copy(pos(a - (k + 1) * 0.12)).setY(top + 0.08));
    const won = t > WIN;
    runner.userData.cube.material.emissive.set(won ? HERO.gold : HERO.goldHot);
    gates.forEach((g, i) => g.userData.pulse(i < Math.min(LAPS, Math.floor(t * LAPS) + 1) ? 1 : 0.15));
    hubGlow.material.opacity = won ? 0.35 + pulse(t, 0, 6) * 0.2 : 0.18;
    card.userData.screen.draw(t);
  });

  return (t) => updates.forEach((f) => f(t));
}
