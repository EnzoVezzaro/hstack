// "Cheap first, smart when it matters" as a building with a glass elevator.
// A task fails twice on T0, rides up to T1, fails again, rides up to T2,
// gets a plan, and goes straight back down to T0, where it finally lands.
import {
  THREE, TAU, PAL, mat, glowMat, box, cyl, sphere, place, CanvasScreen, roundRect, hex,
  codeScreen, laptop, monitor, robot, animateRobot, serverRack, plant,
} from '../lib.js';

export const view = { size: 7.3, target: [1.6, 3.4, -2.6], elevation: 30 };
export const bloom = { strength: 0.65, radius: 0.45, threshold: 0.8 };
export const exposure = 1.3;

const LX = 6.6;
const LZ = 3.6;
const H = 1.95;
const STEP = 2.4;
const TRACK_X = LX / 2 + 0.8;
const floorZ = (i) => -STEP * i;
const station = (i) => new THREE.Vector3(TRACK_X, i * H + 0.02, floorZ(i) + 0.75);
const TIERS = [
  { name: 'T0', title: 'workers', color: PAL.mint },
  { name: 'T1', title: 'supervisors', color: PAL.blue },
  { name: 'T2', title: 'directors', color: PAL.gold },
  { name: 'T3', title: 'high mode', color: PAL.coral },
];

const smooth = (k) => k * k * (3 - 2 * k);
const seg = (t, a, b) => smooth(Math.max(0, Math.min(1, (t - a) / (b - a))));

// Where the elevator car is (in floors) at time t.
function carLevel(t) {
  if (t < 0.26) return 0;
  if (t < 0.34) return seg(t, 0.26, 0.34);
  if (t < 0.48) return 1;
  if (t < 0.57) return 1 + seg(t, 0.48, 0.57);
  if (t < 0.71) return 2;
  if (t < 0.83) return 2 - 2 * seg(t, 0.71, 0.83);
  return 0;
}

const STEPS = [
  [0.0, 'T0', 'attempt 1 on a worker model', 'busy'],
  [0.1, 'T0', 'attempt 1 failed verification', 'fail'],
  [0.2, 'T0', 'attempt 2 failed · escalate', 'fail'],
  [0.26, 'T1', 'riding up to a supervisor', 'move'],
  [0.4, 'T1', 'attempt 3 failed · escalate', 'fail'],
  [0.48, 'T2', 'riding up to the director', 'move'],
  [0.6, 'T2', 'plan written · acceptance check set', 'plan'],
  [0.71, 'T0', 'plan goes back down to T0', 'move'],
  [0.86, 'T0', 'done on a worker model ✓', 'pass'],
];

function taskCard() {
  const colors = { busy: '#e8d6b4', fail: '#fa866d', move: '#79a9ed', plan: '#ffc44a', pass: '#9ee68a' };
  return new CanvasScreen(720, 640, (ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(10,22,16,0.92)';
    roundRect(ctx, 6, 6, w - 12, h - 12, 28); ctx.fill();
    ctx.strokeStyle = 'rgba(158,230,138,0.6)'; ctx.lineWidth = 4; ctx.stroke();
    ctx.fillStyle = '#7f978a'; ctx.font = '600 26px Menlo, monospace';
    ctx.fillText('task #482', 40, 62);
    ctx.fillStyle = '#e8d6b4'; ctx.font = '700 34px Helvetica, Arial, sans-serif';
    ctx.fillText('fix the flaky checkout test', 40, 112);
    const shown = STEPS.filter(([at]) => t >= at);
    shown.slice(-7).forEach(([, tier, text, kind], i, arr) => {
      const y = 172 + i * 62;
      const last = i === arr.length - 1;
      ctx.globalAlpha = last ? 1 : 0.55;
      const tc = TIERS.find((x) => x.name === tier).color;
      ctx.fillStyle = hex(tc); roundRect(ctx, 40, y - 30, 70, 42, 10); ctx.fill();
      ctx.fillStyle = '#0a120e'; ctx.font = '800 24px Menlo, monospace'; ctx.fillText(tier, 54, y - 1);
      ctx.fillStyle = colors[kind]; ctx.font = `${last ? 700 : 500} 25px Menlo, monospace`;
      ctx.fillText(text, 128, y);
      ctx.globalAlpha = 1;
    });
  });
}

function sign(tier) {
  const s = new CanvasScreen(1024, 300, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(8,16,12,0.9)';
    roundRect(ctx, 8, 8, w - 16, h - 16, 40); ctx.fill();
    ctx.strokeStyle = hex(tier.color); ctx.lineWidth = 8; ctx.stroke();
    ctx.fillStyle = hex(tier.color); ctx.font = '800 120px Menlo, monospace';
    ctx.fillText(tier.name, 50, 192);
    ctx.fillStyle = '#e8d6b4'; ctx.font = '600 76px Helvetica, Arial, sans-serif';
    ctx.fillText(tier.title, 270, 180);
  });
  s.draw(0);
  return s;
}

function planSheet() {
  const s = new CanvasScreen(256, 320, (ctx, w, h) => {
    ctx.fillStyle = '#f4ead2'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#b8860b'; ctx.font = '800 34px Menlo, monospace'; ctx.fillText('PLAN', 24, 52);
    ctx.fillStyle = '#5b4a2c';
    for (let i = 0; i < 7; i++) ctx.fillRect(24, 86 + i * 30, 120 + ((i * 53) % 80), 9);
    ctx.strokeStyle = '#2f7d4f'; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(170, 270); ctx.lineTo(195, 295); ctx.lineTo(236, 240); ctx.stroke();
  });
  s.draw(0);
  return s;
}

export async function build({ scene, camera, sun, hemi }) {
  sun.intensity = 2.0;
  hemi.intensity = 0.8;
  const updates = [];
  const screens = [];

  // ---- base plaza under the terraces
  scene.add(place(box(LX + 3.2, 0.5, LZ + STEP * 3 + 1.4, mat(PAL.strataA, { r: 0.9 }), { r: 0.08 }), 0.75, -0.27, -STEP * 1.5));
  scene.add(place(box(LX + 3.0, 0.18, LZ + STEP * 3 + 1.2, mat(PAL.strataB, { r: 0.9 }), { r: 0.06 }), 0.75, -0.6, -STEP * 1.5));
  scene.add(place(box(LX + 3.0, 0.02, LZ + STEP * 3 + 1.2, mat(0x1a2620, { r: 0.95 }), { r: 0.01 }), 0.75, -0.015, -STEP * 1.5));

  // ---- terraces, each one step back and one floor up
  const lamps = [];
  const floors = TIERS.map((tier, i) => {
    const g = new THREE.Group();
    g.position.set(0, i * H, floorZ(i));
    const slabT = i === 0 ? 0.16 : 0.24;
    g.add(place(box(LX, slabT, LZ, mat(PAL.floor, { r: 0.85 }), { r: 0.04 }), 0, -slabT / 2, 0));
    g.add(place(box(LX - 0.12, 0.02, LZ - 0.12, mat(i % 2 ? 0x22332a : 0x1f2e26, { r: 0.9 }), { r: 0.01 }), 0, 0.005, 0));
    g.add(place(box(LX - 0.1, 0.06, 0.06, glowMat(tier.color, 1.4), { r: 0.02, shadow: false }), 0, -0.04, LZ / 2 + 0.02));
    const wall = mat(PAL.wall, { r: 0.9 });
    g.add(place(box(0.18, 1.55, LZ, wall, { r: 0.02 }), -LX / 2 + 0.09, 0.78, 0));
    g.add(place(box(LX, 1.55, 0.18, wall, { r: 0.02 }), 0, 0.78, -LZ / 2 + 0.09));
    g.add(place(box(LX - 0.4, 0.07, 0.04, glowMat(tier.color, 1.5), { r: 0.02, shadow: false }), 0.1, 1.3, -LZ / 2 + 0.2));
    g.add(place(box(0.04, 0.07, LZ - 0.4, glowMat(tier.color, 1.5), { r: 0.02, shadow: false }), -LX / 2 + 0.2, 1.3, 0.1));
    if (i > 0) {
      [[-LX / 2 + 0.2, -LZ / 2 + 0.2], [LX / 2 - 0.2, -LZ / 2 + 0.2]].forEach(([x, z]) => {
        scene.add(place(box(0.16, i * H, 0.16, mat(PAL.metalDark, { m: 0.4, r: 0.5 }), { r: 0.03 }), x, (i * H) / 2 - 0.1, floorZ(i) + z));
      });
    }
    const light = new THREE.PointLight(0xfff1d6, 4, 6, 2);
    light.position.set(0, 2.0, 0.6);
    g.add(light);
    const lamp = place(sphere(0.12, glowMat(0x333333, 2), 16), LX / 2 - 0.3, 1.25, LZ / 2 - 0.35);
    g.add(lamp);
    g.add(place(box(0.1, 0.9, 0.1, mat(PAL.metalDark, { m: 0.5 }), { r: 0.02 }), LX / 2 - 0.3, 0.7, LZ / 2 - 0.35));
    lamps.push(lamp);
    const sg = sign(tier);
    const signMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.7), new THREE.MeshStandardMaterial({ color: 0, map: sg.texture, emissive: 0xffffff, emissiveMap: sg.texture, emissiveIntensity: 1.1, transparent: true }));
    signMesh.position.set(-LX / 2 - 1.1, i * H + 1.0, floorZ(i) + LZ / 2 - 0.2);
    signMesh.quaternion.copy(camera.quaternion);
    scene.add(signMesh);
    scene.add(g);
    return g;
  });
  const local = (i, x, y, z) => new THREE.Vector3(x, i * H + y, floorZ(i) + z);
  const put = (obj, i, x, y, z, ry = 0) => { obj.position.copy(local(i, x, y, z)); obj.rotation.y = ry; scene.add(obj); return obj; };

  // ---- T0: four workers at a long bench
  put(box(4.8, 0.08, 0.9, mat(PAL.creamDark, { r: 0.55 }), { r: 0.03 }), 0, -0.55, 0.95, -0.55);
  [-2.85, 1.75].forEach((x) => put(box(0.08, 0.92, 0.8, mat(PAL.metalDark, { m: 0.5 }), { r: 0.02 }), 0, x, 0.46, -0.55));
  const t0bots = [-2.4, -1.25, -0.1, 1.05].map((x, i) => {
    const sc = codeScreen(undefined, { scrollLines: 5 + i * 2, title: `w0${i + 1}.ts` });
    screens.push(sc);
    put(laptop(sc, { w: 0.6 }), 0, x, 0.99, -0.42, Math.PI);
    return put(robot({ accent: PAL.mint, scale: 0.86 }), 0, x, 0, -1.3);
  });
  updates.push((t) => t0bots.forEach((r, i) => animateRobot(r, t, { mode: 'type', phase: i * 0.21, typeRate: 16 })));
  const crateSpot = local(0, 2.45, 0.0, 0.9);

  // ---- T1: two stronger workers with monitors
  const t1bots = [-1.8, 0.7].map((x, i) => {
    put(box(1.9, 0.08, 0.9, mat(PAL.wood, { r: 0.55 }), { r: 0.03 }), 1, x, 0.95, -0.55);
    [-0.85, 0.85].forEach((dx) => put(box(0.07, 0.92, 0.8, mat(PAL.metalDark), { r: 0.02 }), 1, x + dx, 0.46, -0.55));
    const sc = codeScreen(undefined, { scrollLines: 7 + i * 3, title: i ? 'checkout.spec.ts' : 'cart.ts' });
    screens.push(sc);
    put(monitor(sc, { w: 0.95, h: 0.6 }), 1, x, 0.99, -0.4, Math.PI);
    return put(robot({ accent: PAL.blue, scale: 0.86 }), 1, x, 0, -1.3);
  });
  updates.push((t) => t1bots.forEach((r, i) => animateRobot(r, t, { mode: 'type', phase: 0.4 + i * 0.3, typeRate: 12 })));

  // ---- T2: the director and a big screen
  const dirScreen = codeScreen(undefined, { scrollLines: 4, title: 'plan.md' });
  screens.push(dirScreen);
  put(box(2.6, 0.08, 0.9, mat(PAL.wood, { r: 0.5 }), { r: 0.03 }), 2, -1.4, 0.94, -0.95);
  [-1.15, 1.15].forEach((dx) => put(box(0.08, 0.9, 0.8, mat(PAL.metalDark), { r: 0.02 }), 2, -1.4 + dx, 0.45, -0.95));
  put(monitor(dirScreen, { w: 1.7, h: 0.98 }), 2, -1.4, 0.98, -1.05, 0);
  const director = put(robot({ accent: PAL.gold, kind: 'director', scale: 1.0 }), 2, 1.0, 0, 0.25, Math.PI / 4);
  updates.push((t) => animateRobot(director, t, { mode: t > 0.57 && t < 0.7 ? 'inspect' : 'idle', phase: 0.15 }));
  const shelfPlant = put(plant({ scale: 0.85 }), 2, 2.6, 0, -1.2);
  updates.push((t) => shelfPlant.userData.update(t));

  // ---- T3: the big brain, mostly resting
  const rackA = put(serverRack({ units: 6, h: 1.55 }), 3, -2.4, 0, -1.2);
  const rackB = put(serverRack({ units: 6, h: 1.55 }), 3, -1.3, 0, -1.2);
  updates.push((t) => { rackA.userData.update(t * 0.5); rackB.userData.update((t * 0.5 + 0.3) % 1); });
  const brainBot = put(robot({ accent: PAL.coral, kind: 'director', scale: 1.08 }), 3, 0.6, 0, -0.1, -0.2);
  updates.push((t) => animateRobot(brainBot, t, { mode: 'idle', phase: 0.7 }));
  const brain = new THREE.Mesh(new THREE.IcosahedronGeometry(0.42, 1), new THREE.MeshBasicMaterial({ color: new THREE.Color(PAL.coral).multiplyScalar(1.6), wireframe: true, toneMapped: false }));
  brain.position.copy(local(3, 2.1, 1.25, 0.1));
  scene.add(brain);
  const core = place(sphere(0.17, glowMat(PAL.coral, 2.5), 16), brain.position.x, brain.position.y, brain.position.z);
  scene.add(core);
  updates.push((t) => { brain.rotation.y = t * TAU; brain.rotation.x = Math.sin(t * TAU) * 0.3; core.scale.setScalar(1 + Math.sin(t * TAU * 2) * 0.12); });
  const zz = new CanvasScreen(256, 128, (ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#fa866d'; ctx.font = '700 46px Menlo, monospace';
    ctx.fillText('z'.repeat(1 + (Math.floor(t * 6) % 3)), 30, 84);
  });
  screens.push(zz);
  const zzMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.4), new THREE.MeshBasicMaterial({ map: zz.texture, transparent: true, toneMapped: false }));
  zzMesh.position.copy(local(3, 1.1, 1.85, 0.0));
  zzMesh.quaternion.copy(camera.quaternion);
  scene.add(zzMesh);

  // ---- funicular track up the terraces
  const metal = mat(PAL.metal, { m: 0.7, r: 0.3 });
  const path = new THREE.CurvePath();
  for (let i = 0; i < 3; i++) path.add(new THREE.LineCurve3(station(i), station(i + 1)));
  [-0.42, 0.42].forEach((dx) => {
    const railPath = new THREE.CurvePath();
    for (let i = 0; i < 3; i++) railPath.add(new THREE.LineCurve3(station(i).add(new THREE.Vector3(dx, 0.04, 0)), station(i + 1).add(new THREE.Vector3(dx, 0.04, 0))));
    const rail = new THREE.Mesh(new THREE.TubeGeometry(railPath, 60, 0.04, 8, false), metal);
    rail.castShadow = true;
    scene.add(rail);
  });
  for (let i = 0; i < 4; i++) {
    const st = station(i);
    scene.add(place(box(1.2, 0.08, 1.2, mat(PAL.metalDark, { m: 0.4, r: 0.5 }), { r: 0.03 }), st.x, st.y - 0.04, st.z));
    if (i > 0) scene.add(place(box(0.14, st.y, 0.14, mat(PAL.metalDark, { m: 0.4 }), { r: 0.03 }), st.x + 0.5, st.y / 2 - 0.05, st.z + 0.5));
  }
  for (let k = 0; k < 3; k++) {
    for (let j = 1; j < 6; j++) {
      const p = station(k).lerp(station(k + 1), j / 6);
      scene.add(place(box(1.0, 0.04, 0.12, mat(PAL.woodDark), { r: 0.01 }), p.x, p.y + 0.01, p.z));
    }
  }
  const car = new THREE.Group();
  car.add(place(box(1.05, 0.1, 1.05, mat(PAL.metalDark, { m: 0.5, r: 0.4 }), { r: 0.03 }), 0, 0.1, 0));
  [[-0.48, -0.48], [0.48, -0.48], [-0.48, 0.48], [0.48, 0.48]].forEach(([dx, dz]) => car.add(place(box(0.05, 0.5, 0.05, metal, { r: 0.01 }), dx, 0.38, dz)));
  car.add(place(box(1.0, 0.04, 0.04, glowMat(PAL.gold, 2.5), { r: 0.01, shadow: false }), 0, 0.6, 0.48));
  car.add(place(box(0.04, 0.04, 1.0, glowMat(PAL.gold, 2.5), { r: 0.01, shadow: false }), 0.48, 0.6, 0));
  const carLight = new THREE.PointLight(0xffd59a, 2.5, 3, 2);
  carLight.position.set(0, 1.0, 0);
  car.add(carLight);
  scene.add(car);

  // ---- the task crate and the plan
  const crate = new THREE.Group();
  crate.add(place(box(0.5, 0.42, 0.5, mat(PAL.creamDark, { r: 0.6 }), { r: 0.05 }), 0, 0.21, 0));
  crate.add(place(box(0.52, 0.07, 0.12, mat(PAL.woodDark), { r: 0.01 }), 0, 0.38, 0));
  const tag = place(box(0.2, 0.12, 0.012, glowMat(PAL.gold, 1.8), { r: 0.01 }), 0, 0.21, 0.255);
  crate.add(tag);
  scene.add(crate);
  const ps = planSheet();
  const plan = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.52), new THREE.MeshStandardMaterial({ map: ps.texture, emissive: 0xffffff, emissiveMap: ps.texture, emissiveIntensity: 0.9, side: THREE.DoubleSide }));
  scene.add(plan);
  const check = new THREE.Group();
  const cm = glowMat(PAL.mint, 3.2);
  const a = box(0.11, 0.32, 0.07, cm, { r: 0.02, shadow: false }); a.position.set(-0.12, -0.05, 0); a.rotation.z = 0.75;
  const b = box(0.11, 0.62, 0.07, cm, { r: 0.02, shadow: false }); b.position.set(0.12, 0.07, 0); b.rotation.z = -0.62;
  check.add(a, b);
  scene.add(check);
  const cross = new THREE.Group();
  const xm = glowMat(PAL.red, 3);
  [0.78, -0.78].forEach((rz) => { const bar = box(0.1, 0.55, 0.07, xm, { r: 0.02, shadow: false }); bar.rotation.z = rz; cross.add(bar); });
  scene.add(cross);

  const card = taskCard();
  screens.push(card);
  const cardMesh = new THREE.Mesh(new THREE.PlaneGeometry(4.0, 3.55), new THREE.MeshBasicMaterial({ map: card.texture, transparent: true, toneMapped: false }));
  cardMesh.position.set(9.7, 2.5, -0.5);
  cardMesh.quaternion.copy(camera.quaternion);
  scene.add(cardMesh);

  const fails = [0.1, 0.2, 0.4];
  updates.push((t) => {
    const lvl = carLevel(t);
    const lo = Math.min(2, Math.floor(lvl));
    const carPos = station(lo).lerp(station(lo + 1), lvl - lo);
    car.position.copy(carPos);
    // crate path
    const inCar = carPos.clone().add(new THREE.Vector3(0, 0.15, 0));
    let pos;
    if (t < 0.22) pos = crateSpot.clone();
    else if (t < 0.26) pos = crateSpot.clone().lerp(inCar, seg(t, 0.22, 0.26));
    else if (t < 0.83) pos = inCar;
    else if (t < 0.87) pos = inCar.clone().lerp(crateSpot, seg(t, 0.83, 0.87));
    else pos = crateSpot.clone();
    crate.position.copy(pos);
    const fade = t < 0.04 ? seg(t, 0, 0.04) : t > 0.95 ? 1 - seg(t, 0.95, 1) : 1;
    crate.scale.setScalar(Math.max(0.001, fade));
    const done = t > 0.87;
    tag.material.emissive.setHex(done ? PAL.mint : t > 0.6 ? PAL.gold : PAL.coral);
    // the plan rides with the crate once T2 writes it
    plan.visible = t > 0.6 && t < 0.95;
    plan.position.copy(crate.position).add(new THREE.Vector3(0, 0.95 + Math.sin(t * TAU * 3) * 0.05, 0));
    plan.quaternion.copy(camera.quaternion);
    plan.scale.setScalar(t < 0.64 ? seg(t, 0.6, 0.64) + 0.001 : 1);
    // pass / fail markers
    const failing = fails.find((f) => t >= f && t < f + 0.05);
    cross.visible = failing !== undefined;
    if (cross.visible) {
      cross.position.copy(crate.position).add(new THREE.Vector3(0, 1.0, 0));
      cross.quaternion.copy(camera.quaternion);
      cross.scale.setScalar(seg(t, failing, failing + 0.015) + 0.001);
    }
    check.visible = t > 0.87 && t < 0.97;
    check.position.copy(crate.position).add(new THREE.Vector3(0, 1.05 + Math.sin(t * TAU * 4) * 0.04, 0));
    check.quaternion.copy(camera.quaternion);
    check.scale.setScalar(seg(t, 0.87, 0.9) * 1.1 + 0.001);
    // floor status lamps
    lamps.forEach((l, i) => {
      let c = 0x2a2a2a; let k = 0.6;
      const here = Math.round(lvl) === i && Math.abs(lvl - Math.round(lvl)) < 0.02;
      if (here) { c = TIERS[i].color; k = 2.2; }
      if (failing !== undefined && here) { c = PAL.red; k = 3.5; }
      if (i === 2 && t > 0.6 && t < 0.71) { c = PAL.gold; k = 3.5; }
      if (i === 0 && done) { c = PAL.mint; k = 3.5; }
      l.material.emissive.setHex(c);
      l.material.emissiveIntensity = k;
    });
  });

  return (t) => {
    screens.forEach((s) => s.draw(t));
    updates.forEach((u) => u(t));
  };
}
