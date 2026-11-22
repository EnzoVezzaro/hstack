// The ship pipeline in the banner's style: crates ride a camo bridge past
// commit, build, test, review, and release towers to the cloud. Release waits
// on you (the mascot panel) before anything goes out.
import { THREE } from '../lib.js';
import {
  HERO, tower, blocks, boxCells, goldNode, goldTrace, heroFloor, floorGlow, heroCard, text, chip, mascot, pulse,
} from '../kit.js';

export const view = { size: 3.05, target: [0.2, 1.0, 0.25], elevation: 28, azimuth: 45 };
export const bloom = { strength: 0.55, radius: 0.4, threshold: 0.82 };
export const exposure = 1.15;
export const shadowSize = 12;

const R2 = Math.SQRT1_2;
const at = (u, w, y = 0) => new THREE.Vector3((u * 0.82 - 0.35 + w) * R2, y, (w - u * 0.82 + 0.35) * R2);
const CELL = 0.36;
const STATIONS = [
  { u: -4.3, name: 'commit', icon: 'branch', color: HERO.ink },
  { u: -2.5, name: 'build', icon: 'gear', color: HERO.blue },
  { u: -0.7, name: 'test', icon: 'check', color: HERO.mint },
  { u: 1.1, name: 'review', icon: 'eye', color: HERO.gold },
  { u: 2.9, name: 'release', icon: 'rocket', color: HERO.coral },
];
const END_U = 4.8;

export async function build({ scene, camera }) {
  scene.add(heroFloor({ size: 40, tile: CELL * 2 }));
  const updates = [];

  // The bridge: a long camo ridge running screen-left to screen-right.
  const len = Math.round((END_U + 5.2) / (CELL / R2 * R2) / 1);
  const ridgeCells = [];
  const n = Math.round(((END_U + 4.9) * 0.82) / CELL);
  for (let i = 0; i < n; i++) for (let j = 0; j < 2; j++) ridgeCells.push([i, 0, j]);
  const ridge = blocks(ridgeCells, { cell: CELL, seed: 12 });
  // Lay the ridge along the u axis: rotate so local x points along screen-right.
  const ridgeGroup = new THREE.Group();
  ridgeGroup.add(ridge);
  ridge.position.set(0, 0, -CELL);
  ridgeGroup.rotation.y = Math.PI / 4;
  ridgeGroup.position.copy(at(-4.9, 0.9));
  scene.add(ridgeGroup);
  void len;

  // Stations behind the bridge.
  STATIONS.forEach((s, i) => {
    const panels = [{ face: 'z', v: CELL * 2.2, icon: s.icon, color: s.color }];
    if (s.name === 'release') panels.push({ face: 'x', v: CELL * 1.6, image: mascot(), size: CELL * 1.5 });
    const tw = tower({ nx: 2, ny: 4 + (i % 2), nz: 2, cell: CELL, seed: 40 + i, panels });
    tw.position.copy(at(s.u, -0.35));
    scene.add(tw);
    const card = heroCard(camera, 0.95, 340, 96, (ctx, w, h) => {
      text(ctx, s.name, w / 2, 64, 46, s.color, { align: 'center' });
    }, { border: s.color });
    card.position.copy(at(s.u, -0.35, CELL * (5 + (i % 2)) + 0.45));
    scene.add(card);
    const g = floorGlow(0.6, { opacity: 0.35 });
    g.position.copy(at(s.u, 0.55, CELL + 0.01));
    scene.add(g);
  });

  // The cloud at the end of the line.
  const cloud = tower({ nx: 3, ny: 3, nz: 3, cell: CELL, seed: 70, panels: [
    { face: 'z', v: CELL * 1.6, icon: 'cloud', color: HERO.gold },
    { face: 'x', v: CELL * 1.6, icon: 'box', color: HERO.gold },
  ] });
  cloud.position.copy(at(END_U + 0.3, 0.9));
  scene.add(cloud);
  const shipped = heroCard(camera, 2.0, 640, 230, (ctx) => {
    text(ctx, 'SHIPPED TO', 30, 56, 38, HERO.gold, { weight: 400 });
    text(ctx, 'GitHub · Vercel · AWS · npm', 30, 108, 32, HERO.ink);
    text(ctx, 'Google Cloud · Cloudflare', 30, 152, 32, HERO.ink);
    text(ctx, 'target + version confirmed by you', 30, 196, 24, HERO.muted);
  }, { border: HERO.gold });
  shipped.position.copy(at(END_U - 0.3, 0.9, CELL * 3 + 1.25));
  scene.add(shipped);
  const tag = heroCard(camera, 0.7, 240, 90, (ctx, w) => { chip(ctx, 'v5.1.0', 22, 62, 40, HERO.gold); }, { border: HERO.gold, opacity: 0 });
  tag.position.copy(at(END_U + 1.3, 1.9, 0.6));
  scene.add(tag);

  // The belt line and nodes on top of the bridge.
  const top = CELL + 0.04;
  const line = goldTrace([at(-4.7, 0.9, top), at(END_U - 0.4, 0.9, top)], { radius: 0.012, packets: 0 });
  scene.add(line);
  const nodes = STATIONS.map((s) => {
    const nd = goldNode(0.1);
    nd.position.copy(at(s.u, 0.9, top + 0.05));
    scene.add(nd);
    return nd;
  });

  // Crates riding the bridge.
  const cs = CELL * 0.72;
  const crates = [0, 1, 2].map((k) => {
    const g = new THREE.Group();
    const body = blocks([[0, 0, 0]], { cell: cs, palette: [[0xc9a46a, 1]], seed: 80 + k });
    body.position.set(-cs / 2, 0, -cs / 2);
    g.add(body);
    const lamp = goldNode(cs * 0.36);
    lamp.position.y = cs * 1.25;
    g.add(lamp);
    g.rotation.y = Math.PI / 4;
    scene.add(g);
    return { g, lamp, k };
  });
  const startU = -4.6, endU = END_U - 0.5;

  updates.push((t) => {
    nodes.forEach((nd, i) => nd.userData.pulse(pulse(t, i, 2)));
    crates.forEach(({ g, lamp, k }) => {
      const u = (t + k / crates.length) % 1;
      // Pause briefly at release: waiting on the owner's yes.
      const relU = (STATIONS[4].u - startU) / (endU - startU);
      let p = u < relU ? u : u < relU + 0.12 ? relU : (u - 0.12) / 0.88;
      p = Math.min(p, 1);
      g.position.copy(at(startU + (endU - startU) * p, 0.9, CELL));
      g.visible = p < 0.98;
      lamp.userData.pulse(u >= relU && u < relU + 0.12 ? 1 : 0.4);
    });
  });

  return (t) => updates.forEach((f) => f(t));
}
