// Section divider: a low ridge of camo cubes with gold nodes and a trace whose
// packets run end to end, in the banner's style.
import { THREE } from '../lib.js';
import { blocks, boxCells, goldNode, goldTrace, floorGlow, pulse } from '../kit.js';

export const view = { size: 0.5, target: [0, 0.22, 0], elevation: 22, azimuth: 6 };
export const bloom = { strength: 0.6, radius: 0.35, threshold: 0.8 };
export const exposure = 1.3;
export const shadowSize = 8;
export const vignette = 0.35;

const CELL = 0.25;
const LEN = 30;

export async function build({ scene }) {
  // Ridge: one row high, two deep, with a few raised cubes for rhythm.
  const cells = boxCells(0, 0, 0, LEN, 1, 2, { shell: false });
  [3, 4, 11, 18, 19, 26].forEach((x) => cells.push([x, 1, 0]));
  const ridge = blocks(cells, { cell: CELL, seed: 21 });
  ridge.position.set((-LEN * CELL) / 2, 0, -CELL);
  scene.add(ridge);

  const nodeXs = [-2.6, -1.3, 0, 1.3, 2.6];
  const y = CELL + 0.06;
  const nodes = nodeXs.map((x) => {
    const n = goldNode(0.1);
    n.position.set(x, y + 0.05, 0);
    scene.add(n);
    const glow = floorGlow(0.35, { opacity: 0.35 });
    glow.position.set(x, CELL + 0.003, 0);
    scene.add(glow);
    return n;
  });
  const trace = goldTrace(nodeXs.map((x) => new THREE.Vector3(x, y + 0.05, 0)), { radius: 0.008, packets: 2, packetSize: 0.05 });
  scene.add(trace);

  return (t) => {
    trace.userData.update(t);
    nodes.forEach((n, k) => n.userData.pulse(pulse(t, k * 1.5, 2)));
  };
}
