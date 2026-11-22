// Any provider fits the same pyramid: GLM (Z.ai), DeepSeek, Kimi, and a plus
// for the rest, as logo cubes with name cards in the banner's style.
import { THREE, loadImg } from '../lib.js';
import { HERO, tower, goldNode, goldTrace, heroFloor, floorGlow, heroCard, text, pulse } from '../kit.js';

export const view = { size: 1.75, target: [0, 0.75, 0], elevation: 26, azimuth: 45 };
export const bloom = { strength: 0.5, radius: 0.4, threshold: 0.84 };
export const exposure = 1.15;
export const shadowSize = 8;

const R2 = Math.SQRT1_2;
const at = (u, w, y = 0) => new THREE.Vector3((u + w) * R2, y, (w - u) * R2);
const CELL = 0.5;

export async function build({ scene, camera }) {
  scene.add(heroFloor({ size: 24, tile: CELL * 2 }));
  const [zai, deepseek, kimi] = await Promise.all(['zai', 'deepseek', 'kimi'].map((n) => loadImg(`assets/logos/${n}.png`)));
  const items = [
    { name: 'GLM (Z.ai)', image: zai },
    { name: 'DeepSeek', image: deepseek },
    { name: 'Kimi', image: kimi },
    { name: 'any provider', icon: 'plus', color: HERO.gold },
  ];
  const us = [-2.4, -0.8, 0.8, 2.4];
  const nodes = [];
  items.forEach((it, i) => {
    const face = it.image ? { image: it.image, size: CELL * 1.6 } : { icon: it.icon, color: it.color, size: CELL * 1.6 };
    const tw = tower({ nx: 2, ny: 2, nz: 2, cell: CELL, seed: 70 + i, panels: [
      { face: 'z', v: CELL, ...face },
      { face: 'x', v: CELL, ...face },
    ] });
    tw.position.copy(at(us[i], 0));
    scene.add(tw);
    const card = heroCard(camera, 1.5, 420, 100, (ctx, w) => {
      text(ctx, it.name, w / 2, 68, 52, it.icon ? HERO.gold : HERO.ink, { align: 'center' });
    }, { border: it.icon ? HERO.gold : 0x3c6334 });
    card.position.copy(at(us[i], 0, CELL * 2 + 0.62));
    scene.add(card);
    const n = goldNode(0.1);
    n.position.copy(at(us[i], 0.9, 0.08));
    scene.add(n);
    nodes.push(n);
    const g = floorGlow(0.6, { opacity: 0.35 });
    g.position.copy(at(us[i], 0.9, 0.01));
    scene.add(g);
  });
  const trace = goldTrace(us.map((u) => at(u, 0.9, 0.04)), { radius: 0.012, packets: 2, packetSize: 0.08 });
  scene.add(trace);

  return (t) => {
    trace.userData.update(t);
    nodes.forEach((n, k) => n.userData.pulse(pulse(t, k, 2)));
  };
}
