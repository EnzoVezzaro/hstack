// Section divider: a git graph lying on a thin slab. Two branches peel off
// main and merge back while pulses run along every line.
import { THREE, TAU, PAL, mat, glowMat, box, sphere, place } from '../lib.js';

export const view = { size: 1.0, target: [0, 0.1, 0.12], elevation: 30 };
export const bloom = { strength: 0.75, radius: 0.4, threshold: 0.75 };
export const exposure = 1.25;

// Points along the screen-horizontal direction (x up, z down) and toward the viewer.
const along = new THREE.Vector3(1, 0, -1).normalize();
const toward = new THREE.Vector3(1, 0, 1).normalize();
const at = (s, o, y = 0.06) => along.clone().multiplyScalar(s).add(toward.clone().multiplyScalar(o)).setY(y);

export async function build({ scene, sun, hemi }) {
  sun.intensity = 1.6;
  hemi.intensity = 0.8;
  const updates = [];
  const S = 7.6;

  const slab = box(S * 2 + 0.6, 0.08, 0.9, mat(PAL.strataA, { r: 0.9 }), { r: 0.03 });
  slab.position.copy(at(0, 0.1, -0.04));
  slab.rotation.y = Math.PI / 4;
  scene.add(slab);

  const lineMat = mat(PAL.metalDark, { r: 0.5, m: 0.4 });
  const tube = (pts) => {
    const curve = new THREE.CatmullRomCurve3(pts);
    const m = new THREE.Mesh(new THREE.TubeGeometry(curve, 120, 0.028, 8, false), lineMat);
    scene.add(m);
    return curve;
  };
  const main = tube([at(-S, 0), at(S, 0)]);
  const branchA = tube([at(-5.2, 0), at(-4.4, 0.45), at(-1.6, 0.45), at(-0.8, 0)]);
  const branchB = tube([at(1.0, 0), at(1.8, 0.45), at(4.6, 0.45), at(5.4, 0)]);

  const commit = (s, o, color, lit = false) => {
    const n = sphere(0.075, lit ? glowMat(color, 1.8) : mat(color, { r: 0.4 }), 16);
    n.position.copy(at(s, o, 0.08));
    scene.add(n);
    return n;
  };
  const nodes = [];
  for (let s = -S + 0.6; s < S; s += 1.2) nodes.push(commit(s, 0, PAL.cream));
  [-3.8, -2.6].forEach((s) => nodes.push(commit(s, 0.45, PAL.mint)));
  [2.4, 3.6].forEach((s) => nodes.push(commit(s, 0.45, PAL.blue)));
  const merges = [commit(-0.8, 0, PAL.gold, true), commit(5.4, 0, PAL.gold, true)];

  const pulse = (curve, color, speed, offset) => {
    const p = sphere(0.05, glowMat(color, 4), 12);
    scene.add(p);
    updates.push((t) => p.position.copy(curve.getPointAt((t * speed + offset) % 1)).setY(0.09));
  };
  pulse(main, PAL.gold, 1, 0);
  pulse(main, PAL.gold, 1, 0.5);
  pulse(branchA, PAL.mint, 2, 0.2);
  pulse(branchB, PAL.blue, 2, 0.7);
  updates.push((t) => merges.forEach((m, i) => (m.material.emissiveIntensity = 1.8 + Math.max(0, Math.sin((t * 2 + i * 0.5) * TAU)) * 2.5)));

  return (t) => updates.forEach((u) => u(t));
}
