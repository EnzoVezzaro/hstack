// "Ship it": an isometric assembly line. Crates of code ride a conveyor through
// build, test, review, and release stations, then leave through a glowing portal.
import {
  THREE, TAU, PAL, mat, glowMat, box, cyl, sphere, place, CanvasScreen, roundRect, hex,
  robot, animateRobot,
} from '../lib.js';

export const view = { size: 4.45, target: [0.05, 1.5, 0.2], elevation: 28, azimuth: 32 };
export const bloom = { strength: 0.7, radius: 0.45, threshold: 0.78 };
export const exposure = 1.3;

const BELT_Z = 0;
const X0 = -7.2;
const X1 = 6.6;
const BELT_Y = 0.78;
const STATIONS = [
  { x: -4.4, name: 'build', color: PAL.blue },
  { x: -1.4, name: 'test', color: PAL.mint },
  { x: 1.6, name: 'review', color: PAL.gold },
  { x: 4.4, name: 'release', color: PAL.coral },
];

const smooth = (k) => k * k * (3 - 2 * k);
const near = (x, cx, w) => Math.max(0, 1 - Math.abs(x - cx) / w);

function stationSign(name, color) {
  const s = new CanvasScreen(512, 160, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(8,16,12,0.92)';
    roundRect(ctx, 6, 6, w - 12, h - 12, 30); ctx.fill();
    ctx.strokeStyle = hex(color); ctx.lineWidth = 7; ctx.stroke();
    ctx.fillStyle = hex(color); ctx.font = '800 76px Menlo, monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(name, w / 2, h / 2 + 4);
  });
  s.draw(0);
  return s;
}

function crateLabel() {
  const s = new CanvasScreen(128, 128, (ctx, w, h) => {
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#ffc44a'; ctx.font = '800 64px Menlo, monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('{ }', w / 2, h / 2 + 4);
  });
  s.draw(0);
  return s;
}

function tagLabel() {
  const s = new CanvasScreen(256, 96, (ctx, w, h) => {
    ctx.fillStyle = '#ffc44a'; roundRect(ctx, 0, 0, w, h, 18); ctx.fill();
    ctx.fillStyle = '#0a120e'; ctx.font = '800 54px Menlo, monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('v5.1.0', w / 2, h / 2 + 3);
  });
  s.draw(0);
  return s;
}

function testScreen() {
  return new CanvasScreen(320, 200, (ctx, w, h, t) => {
    ctx.fillStyle = '#07100c'; ctx.fillRect(0, 0, w, h);
    const n = 40 + Math.floor(((t * 4) % 1) * 15);
    ctx.fillStyle = '#9ee68a'; ctx.font = '800 54px Menlo, monospace';
    ctx.fillText(`✓ ${n}`, 22, 92);
    ctx.fillStyle = '#7f978a'; ctx.font = '600 26px Menlo, monospace';
    ctx.fillText('tests passing', 24, 140);
    ctx.fillStyle = '#1d2a23'; ctx.fillRect(24, 160, 270, 14);
    ctx.fillStyle = '#9ee68a'; ctx.fillRect(24, 160, 270 * ((t * 4) % 1), 14);
  });
}

export async function build({ scene, camera, sun, hemi }) {
  sun.intensity = 2.1;
  hemi.intensity = 0.85;
  const updates = [];
  const screens = [];

  // ---- factory floor slab
  scene.add(place(box(16.4, 0.5, 6.4, mat(PAL.strataA, { r: 0.9 }), { r: 0.08 }), -0.3, -0.25, 0.3));
  scene.add(place(box(16.2, 0.18, 6.2, mat(PAL.strataB, { r: 0.9 }), { r: 0.06 }), -0.3, -0.59, 0.3));
  scene.add(place(box(16.2, 0.03, 6.2, mat(PAL.floor, { r: 0.9 }), { r: 0.01 }), -0.3, 0.0, 0.3));
  // hazard stripes along the belt
  const hazard = new CanvasScreen(1024, 64, (ctx, w, h) => {
    ctx.fillStyle = '#1d2a23'; ctx.fillRect(0, 0, w, h);
    for (let x = -h; x < w; x += 48) {
      ctx.fillStyle = '#c99a35';
      ctx.beginPath(); ctx.moveTo(x, h); ctx.lineTo(x + 24, h); ctx.lineTo(x + 24 + h, 0); ctx.lineTo(x + h, 0); ctx.closePath(); ctx.fill();
    }
  });
  hazard.draw(0);
  [-1, 1].forEach((side) => {
    const strip = new THREE.Mesh(new THREE.PlaneGeometry(X1 - X0 + 0.6, 0.18), new THREE.MeshStandardMaterial({ map: hazard.texture, roughness: 0.8 }));
    strip.rotation.x = -Math.PI / 2;
    strip.position.set((X0 + X1) / 2, 0.02, BELT_Z + side * 0.95);
    strip.receiveShadow = true;
    scene.add(strip);
  });

  // ---- conveyor: frame, rollers, and a scrolling belt
  const len = X1 - X0;
  scene.add(place(box(len, 0.16, 1.2, mat(PAL.metalDark, { m: 0.5, r: 0.4 }), { r: 0.03 }), (X0 + X1) / 2, BELT_Y - 0.14, BELT_Z));
  for (let x = X0 + 0.3; x < X1; x += 1.3) {
    [-0.52, 0.52].forEach((dz) => scene.add(place(box(0.1, BELT_Y - 0.2, 0.1, mat(PAL.metal, { m: 0.6 }), { r: 0.02 }), x, (BELT_Y - 0.2) / 2, BELT_Z + dz)));
  }
  const beltTex = new CanvasScreen(1024, 64, (ctx, w, h) => {
    ctx.fillStyle = '#151d19'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#222d27';
    for (let x = 0; x < w; x += 32) ctx.fillRect(x, 0, 14, h);
  });
  beltTex.draw(0);
  beltTex.texture.wrapS = THREE.RepeatWrapping;
  beltTex.texture.repeat.set(8, 1);
  const belt = new THREE.Mesh(new THREE.PlaneGeometry(len, 1.0), new THREE.MeshStandardMaterial({ map: beltTex.texture, roughness: 0.75 }));
  belt.rotation.x = -Math.PI / 2;
  belt.position.set((X0 + X1) / 2, BELT_Y - 0.055, BELT_Z);
  belt.receiveShadow = true;
  scene.add(belt);
  const rollers = [];
  for (let x = X0 + 0.15; x < X1; x += 0.5) {
    const r = cyl(0.06, 0.06, 1.12, mat(PAL.metal, { m: 0.8, r: 0.25 }), 12);
    r.rotation.x = Math.PI / 2;
    r.position.set(x, BELT_Y - 0.12, BELT_Z);
    scene.add(r);
    rollers.push(r);
  }
  // belt speed: the texture scroll and the crates move together
  const SPEED = 1; // belt lengths per loop
  updates.push((t) => {
    beltTex.texture.offset.x = -t * SPEED * 8;
    rollers.forEach((r) => (r.rotation.y = -t * TAU * 6));
  });

  // ---- intake chute on the left
  scene.add(place(box(1.0, 1.2, 1.2, mat(PAL.metalDark, { m: 0.5 }), { r: 0.05 }), X0 + 0.2, BELT_Y + 0.8, BELT_Z));
  [[0, 0.6, 1.04, 0.05], [0, -0.6, 1.04, 0.05]].forEach(([dx, dz, w, d]) => scene.add(place(box(w, 0.05, d, glowMat(PAL.mint, 1.4), { r: 0.01, shadow: false }), X0 + 0.2 + dx, BELT_Y + 1.42, BELT_Z + dz)));
  [[0.5, 0], [-0.5, 0]].forEach(([dx]) => scene.add(place(box(0.05, 0.05, 1.24, glowMat(PAL.mint, 1.4), { r: 0.01, shadow: false }), X0 + 0.2 + dx, BELT_Y + 1.42, BELT_Z)));
  const commitSign = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.44), new THREE.MeshStandardMaterial({ color: 0, map: stationSign('commit', PAL.mint).texture, emissive: 0xffffff, emissiveMap: stationSign('commit', PAL.mint).texture, emissiveIntensity: 1.1, transparent: true }));
  commitSign.position.set(X0 + 0.2, BELT_Y + 2.0, BELT_Z);
  commitSign.quaternion.copy(camera.quaternion);
  scene.add(commitSign);

  // ---- station signs
  STATIONS.forEach((st) => {
    const sg = stationSign(st.name, st.color);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.47), new THREE.MeshStandardMaterial({ color: 0, map: sg.texture, emissive: 0xffffff, emissiveMap: sg.texture, emissiveIntensity: 1.15, transparent: true }));
    m.position.set(st.x, 3.05, BELT_Z - 0.2);
    m.quaternion.copy(camera.quaternion);
    scene.add(m);
  });

  // ---- BUILD: robotic arm with welding sparks
  const armBase = new THREE.Group();
  armBase.position.set(STATIONS[0].x, 0, BELT_Z - 1.45);
  scene.add(armBase);
  armBase.add(place(cyl(0.42, 0.5, 0.3, mat(PAL.metalDark, { m: 0.6, r: 0.35 }), 28), 0, 0.15, 0));
  const turret = new THREE.Group();
  turret.position.y = 0.3;
  armBase.add(turret);
  turret.add(place(cyl(0.28, 0.32, 0.3, mat(PAL.blue, { r: 0.4, m: 0.3 }), 24), 0, 0.15, 0));
  const shoulder = new THREE.Group();
  shoulder.position.y = 0.32;
  turret.add(shoulder);
  shoulder.add(place(sphere(0.18, mat(PAL.metal, { m: 0.7 }), 16), 0, 0, 0));
  shoulder.add(place(box(0.2, 1.2, 0.2, mat(PAL.blue, { r: 0.45, m: 0.2 }), { r: 0.06 }), 0, 0.6, 0));
  const elbow = new THREE.Group();
  elbow.position.y = 1.2;
  shoulder.add(elbow);
  elbow.add(place(sphere(0.14, mat(PAL.metal, { m: 0.7 }), 16), 0, 0, 0));
  elbow.add(place(box(0.16, 0.95, 0.16, mat(PAL.creamDark, { r: 0.45 }), { r: 0.05 }), 0, 0.47, 0));
  const torch = place(cyl(0.05, 0.03, 0.22, mat(PAL.metalDark, { m: 0.7 }), 10), 0, 1.0, 0);
  elbow.add(torch);
  const tip = place(sphere(0.06, glowMat(0xbfe6ff, 5), 10), 0, 1.12, 0);
  elbow.add(tip);
  const sparks = [];
  for (let i = 0; i < 14; i++) {
    const sp = box(0.035, 0.035, 0.035, glowMat(i % 2 ? PAL.gold : 0xffffff, 4.5), { r: 0, shadow: false });
    scene.add(sp);
    sparks.push(sp);
  }

  // ---- TEST: scanner arch with a sweeping laser and a results screen
  const archX = STATIONS[1].x;
  [-0.85, 0.85].forEach((dz) => scene.add(place(box(0.22, 2.2, 0.22, mat(PAL.metalDark, { m: 0.5 }), { r: 0.05 }), archX, 1.1, BELT_Z + dz)));
  scene.add(place(box(0.3, 0.3, 2.0, mat(PAL.metalDark, { m: 0.5 }), { r: 0.06 }), archX, 2.25, BELT_Z));
  const archLight = place(box(0.32, 0.08, 1.9, glowMat(PAL.gold, 2), { r: 0.02, shadow: false }), archX, 2.07, BELT_Z);
  scene.add(archLight);
  const laser = new THREE.Mesh(new THREE.PlaneGeometry(0.02, 1.7), new THREE.MeshBasicMaterial({ color: new THREE.Color(PAL.red).multiplyScalar(2.5), transparent: true, opacity: 0.85, side: THREE.DoubleSide, toneMapped: false }));
  laser.rotation.y = Math.PI / 2;
  scene.add(laser);
  const laserSheet = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 1.1), new THREE.MeshBasicMaterial({ color: new THREE.Color(PAL.red).multiplyScalar(1.2), transparent: true, opacity: 0.12, side: THREE.DoubleSide, toneMapped: false, depthWrite: false }));
  laserSheet.rotation.y = Math.PI / 2;
  scene.add(laserSheet);
  const ts = testScreen();
  screens.push(ts);
  scene.add(place(box(1.0, 0.68, 0.08, mat(PAL.rubber), { r: 0.03 }), archX + 0.75, 1.95, BELT_Z - 1.3));
  const tsPanel = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.56), new THREE.MeshStandardMaterial({ color: 0, emissive: 0xffffff, emissiveMap: ts.texture, emissiveIntensity: 1.1 }));
  tsPanel.position.set(archX + 0.75, 1.95, BELT_Z - 1.25);
  scene.add(tsPanel);
  scene.add(place(box(0.08, 1.6, 0.08, mat(PAL.metal, { m: 0.6 }), { r: 0.02 }), archX + 0.75, 0.8, BELT_Z - 1.33));

  // ---- REVIEW: the director with a stamp
  const director = robot({ accent: PAL.gold, kind: 'director', scale: 1.0 });
  place(director, STATIONS[2].x, 0, BELT_Z - 1.3, 0);
  scene.add(director);
  const stampArm = new THREE.Group();
  stampArm.position.set(STATIONS[2].x, 2.3, BELT_Z);
  scene.add(stampArm);
  scene.add(place(box(0.16, 1.7, 0.16, mat(PAL.metalDark, { m: 0.5 }), { r: 0.04 }), STATIONS[2].x, 1.5, BELT_Z - 0.95));
  scene.add(place(box(0.16, 0.16, 1.1, mat(PAL.metalDark, { m: 0.5 }), { r: 0.04 }), STATIONS[2].x, 2.35, BELT_Z - 0.45));
  const piston = place(cyl(0.05, 0.05, 0.5, mat(PAL.metal, { m: 0.8, r: 0.25 }), 10), 0, -0.25, 0);
  stampArm.add(piston);
  const stamp = place(box(0.4, 0.14, 0.4, mat(PAL.green3, { r: 0.5 }), { r: 0.04 }), 0, -0.55, 0);
  stampArm.add(stamp);

  // ---- RELEASE: tag printer and the shipping portal
  const relX = STATIONS[3].x;
  scene.add(place(box(0.9, 0.9, 0.7, mat(PAL.creamDark, { r: 0.5 }), { r: 0.06 }), relX, 1.75, BELT_Z - 0.85));
  scene.add(place(box(0.3, 0.06, 0.32, glowMat(PAL.coral, 2), { r: 0.02, shadow: false }), relX, 1.32, BELT_Z - 0.6));
  scene.add(place(box(0.14, 1.3, 0.14, mat(PAL.metalDark, { m: 0.5 }), { r: 0.03 }), relX, 0.65, BELT_Z - 1.0));
  const portal = new THREE.Group();
  portal.position.set(X1 - 0.2, BELT_Y + 0.55, BELT_Z);
  portal.rotation.y = Math.PI / 2;
  scene.add(portal);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.09, 16, 48), mat(PAL.metalDark, { m: 0.6, r: 0.35 }));
  ring.castShadow = true;
  portal.add(ring);
  const ringGlow = new THREE.Mesh(new THREE.TorusGeometry(0.66, 0.035, 8, 48), glowMat(PAL.coral, 3.5));
  portal.add(ringGlow);
  const disc = new THREE.Mesh(new THREE.CircleGeometry(0.64, 40), new THREE.MeshBasicMaterial({ color: new THREE.Color(PAL.coral).multiplyScalar(0.9), transparent: true, opacity: 0.35, toneMapped: false, depthWrite: false, side: THREE.DoubleSide }));
  portal.add(disc);
  scene.add(place(box(0.3, 0.6, 0.6, mat(PAL.metalDark, { m: 0.5 }), { r: 0.04 }), X1 - 0.2, 0.3, BELT_Z));
  updates.push((t) => {
    ringGlow.material.emissiveIntensity = 3 + Math.sin(t * TAU * 4) * 1.2;
    disc.material.opacity = 0.25 + Math.sin(t * TAU * 2) * 0.1;
    disc.rotation.z = t * TAU;
  });

  // ---- factory dressing: truss with hanging lamps, pallets, shipped counter
  const trussMat = mat(PAL.metalDark, { m: 0.6, r: 0.35 });
  scene.add(place(box(len + 0.6, 0.14, 0.14, trussMat, { r: 0.03 }), (X0 + X1) / 2, 3.65, BELT_Z - 2.1));
  scene.add(place(box(len + 0.6, 0.14, 0.14, trussMat, { r: 0.03 }), (X0 + X1) / 2, 3.25, BELT_Z - 2.1));
  for (let x = X0; x <= X1; x += 0.8) {
    const diag = place(box(0.05, 0.56, 0.05, trussMat, { r: 0.01 }), x + 0.2, 3.45, BELT_Z - 2.1);
    diag.rotation.z = (Math.round((x - X0) / 0.8) % 2 ? 1 : -1) * 0.62;
    scene.add(diag);
  }
  [X0 + 0.3, X1 - 0.3].forEach((x) => scene.add(place(box(0.16, 3.7, 0.16, trussMat, { r: 0.03 }), x, 1.85, BELT_Z - 2.1)));
  STATIONS.forEach((st) => {
    scene.add(place(cyl(0.012, 0.012, 0.9, mat(PAL.rubber), 6), st.x + 0.7, 3.2, BELT_Z - 1.3));
    const shade = place(cyl(0.12, 0.3, 0.22, mat(PAL.metalDark, { m: 0.5, r: 0.4 }), 20), st.x + 0.7, 2.7, BELT_Z - 1.3);
    shade.castShadow = false;
    scene.add(shade);
    scene.add(place(sphere(0.08, glowMat(0xffe3a8, 3), 12), st.x + 0.7, 2.6, BELT_Z - 1.3));
    const pl = new THREE.PointLight(0xffd9a0, 4, 4, 2);
    pl.position.set(st.x + 0.7, 2.5, BELT_Z - 1.3);
    scene.add(pl);
  });
  const pallet = (x, z, n) => {
    scene.add(place(box(1.2, 0.14, 1.0, mat(PAL.woodDark, { r: 0.8 }), { r: 0.02 }), x, 0.07, z));
    for (let k = 0; k < n; k++) {
      const cx = x - 0.3 + (k % 2) * 0.6;
      const cz = z - 0.25 + (Math.floor(k / 2) % 2) * 0.5;
      const cy = 0.14 + Math.floor(k / 4) * 0.44 + 0.21;
      scene.add(place(box(0.52, 0.42, 0.46, mat(k % 3 ? PAL.creamDark : 0xa98463, { r: 0.8 }), { r: 0.04 }), cx, cy, cz, (k % 3) * 0.05));
    }
  };
  pallet(X0 + 0.9, BELT_Z + 2.2, 6);
  pallet(X0 + 2.4, BELT_Z + 2.35, 3);
  const counter = new CanvasScreen(320, 160, (ctx, w, h, t) => {
    ctx.fillStyle = '#07100c'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#7f978a'; ctx.font = '600 26px Menlo, monospace'; ctx.fillText('shipped today', 22, 46);
    ctx.fillStyle = '#fa866d'; ctx.font = '800 64px Menlo, monospace'; ctx.fillText(String(20 + Math.floor(t * 5)), 22, 126);
  });
  screens.push(counter);
  scene.add(place(box(1.0, 0.56, 0.08, mat(PAL.rubber), { r: 0.03 }), X1 - 1.0, 1.95, BELT_Z - 1.3));
  const cPanel = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.45), new THREE.MeshStandardMaterial({ color: 0, emissive: 0xffffff, emissiveMap: counter.texture, emissiveIntensity: 1.15 }));
  cPanel.position.set(X1 - 1.0, 1.95, BELT_Z - 1.25);
  scene.add(cPanel);
  scene.add(place(box(0.08, 1.6, 0.08, mat(PAL.metal, { m: 0.6 }), { r: 0.02 }), X1 - 1.0, 0.8, BELT_Z - 1.33));

  // ---- crates riding the belt
  const lab = crateLabel();
  const tagTex = tagLabel();
  const crates = [];
  const N = 5;
  for (let i = 0; i < N; i++) {
    const g = new THREE.Group();
    g.add(place(box(0.55, 0.45, 0.55, mat(PAL.creamDark, { r: 0.6 }), { r: 0.05 }), 0, 0.225, 0));
    g.add(place(box(0.57, 0.08, 0.14, mat(PAL.woodDark, { r: 0.6 }), { r: 0.01 }), 0, 0.4, 0));
    const face = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.3), new THREE.MeshStandardMaterial({ color: 0, emissive: 0xffffff, emissiveMap: lab.texture, emissiveIntensity: 0.0, transparent: true }));
    face.position.set(0, 0.24, 0.28);
    g.add(face);
    const check = new THREE.Group();
    const cm = glowMat(PAL.mint, 2.6);
    const a = box(0.05, 0.12, 0.02, cm, { r: 0.01, shadow: false }); a.position.set(-0.05, -0.02, 0); a.rotation.z = 0.75;
    const b = box(0.05, 0.24, 0.02, cm, { r: 0.01, shadow: false }); b.position.set(0.05, 0.03, 0); b.rotation.z = -0.62;
    check.add(a, b);
    check.position.set(0.28, 0.25, 0);
    check.rotation.y = Math.PI / 2;
    g.add(check);
    const tagM = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.13), new THREE.MeshStandardMaterial({ color: 0, map: tagTex.texture, emissive: 0xffffff, emissiveMap: tagTex.texture, emissiveIntensity: 1.2 }));
    tagM.position.set(0, 0.452, 0.06);
    tagM.rotation.x = -Math.PI / 2;
    g.add(tagM);
    scene.add(g);
    crates.push({ g, face, check, tagM });
  }

  updates.push((t) => {
    let welding = 0;
    let scanning = 0;
    let stamping = 0;
    crates.forEach((c, i) => {
      const u = (t * SPEED + i / N) % 1;
      const x = X0 + 0.2 + u * (len - 0.4);
      const appear = Math.min(1, u / 0.04);
      const vanish = x > X1 - 0.5 ? Math.max(0, 1 - (x - (X1 - 0.5)) / 0.3) : 1;
      c.g.position.set(x, BELT_Y - 0.03, BELT_Z);
      c.g.scale.setScalar(Math.max(0.001, Math.min(appear, vanish)));
      c.face.material.emissiveIntensity = x > STATIONS[0].x ? 1.4 : 0.0;
      c.check.visible = x > STATIONS[2].x;
      c.tagM.visible = x > STATIONS[3].x;
      welding = Math.max(welding, near(x, STATIONS[0].x, 0.45));
      scanning = Math.max(scanning, near(x, STATIONS[1].x, 0.5));
      stamping = Math.max(stamping, near(x, STATIONS[2].x, 0.35));
    });
    // build arm: reaches toward the belt when a crate is under it
    turret.rotation.y = 0.6 + Math.sin(t * TAU * 5) * 0.12;
    shoulder.rotation.x = 0.55 + welding * 0.2;
    elbow.rotation.x = 1.15 + Math.sin(t * TAU * 10) * 0.05;
    tip.material.emissiveIntensity = welding > 0.2 ? 2.6 + Math.sin(t * TAU * 40) * 0.8 : 0.4;
    const tipPos = new THREE.Vector3();
    tip.getWorldPosition(tipPos);
    sparks.forEach((sp, k) => {
      const life = (t * 12 + k / sparks.length) % 1;
      const ang = k * 2.39996;
      sp.visible = welding > 0.2;
      sp.position.set(tipPos.x + Math.cos(ang) * life * 0.5, tipPos.y + life * 0.35 - life * life * 0.9, tipPos.z + Math.sin(ang) * life * 0.5);
      sp.scale.setScalar(1 - life);
    });
    // test arch: laser sweeps while a crate passes, light goes green
    const sweep = Math.sin(t * TAU * 8) * 0.55;
    laser.position.set(archX + sweep, BELT_Y + 0.65, BELT_Z);
    laserSheet.position.set(archX + sweep, BELT_Y + 0.65, BELT_Z);
    laser.visible = scanning > 0.05;
    laserSheet.visible = scanning > 0.05;
    archLight.material.emissive.setHex(scanning > 0.35 ? PAL.mint : PAL.gold);
    archLight.material.emissiveIntensity = scanning > 0.35 ? 3 : 1.8;
    // review stamp: presses when a crate is right underneath
    const press = smooth(stamping);
    piston.position.y = -0.25 - press * 0.45;
    stamp.position.y = -0.55 - press * 0.95;
    animateRobot(director, t, { mode: 'inspect', phase: 0.3 });
  });

  return (t) => {
    screens.forEach((s) => s.draw(t));
    updates.forEach((u) => u(t));
  };
}
