// Shared builder for the model pyramids: four floating slabs, wide at the bottom
// and narrow at the top, each with its crew, its providers' logos, and a panel
// listing the models it uses. A task climbs when it fails; the plan comes back down.
import {
  THREE, TAU, PAL, mat, glowMat, box, cyl, sphere, place, CanvasScreen, roundRect, hex,
  robot, animateRobot, standee,
} from '../lib.js';

const COS = Math.cos(THREE.MathUtils.degToRad(30));
const R = new THREE.Vector3(1, 0, -1).normalize();
const TOWARD = new THREE.Vector3(1, 0, 1).normalize();
const at = (sx, sy) => R.clone().multiplyScalar(sx).add(new THREE.Vector3(0, sy / COS, 0));
// Same screen spot, pulled d units toward the camera (which would otherwise lower it by d/2 on screen).
const front = (sx, sy, d = 4) => at(sx, sy + d * 0.5).add(TOWARD.clone().multiplyScalar(d));

const PYR_X = -5.0;
const PANEL_X = 3.95;
const PANEL_W = 8.4;
const PX = 1100 / PANEL_W;
const LAYER_H = 0.62;
const GAP = 2.34;
const SIZES = [4.4, 3.3, 2.3, 1.35];
const layerY = (i) => -5.45 + i * (LAYER_H + GAP);

const smooth = (k) => k * k * (3 - 2 * k);
const seg = (t, a, b) => smooth(Math.max(0, Math.min(1, (t - a) / (b - a))));

function flatPanel(scene, camera, canvasW, canvasH, worldW, pos) {
  const sc = new CanvasScreen(canvasW, canvasH, () => {});
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(worldW, (worldW * canvasH) / canvasW), new THREE.MeshStandardMaterial({ color: 0, map: sc.texture, emissive: 0xffffff, emissiveMap: sc.texture, emissiveIntensity: 1, transparent: true }));
  mesh.position.copy(pos);
  mesh.quaternion.copy(camera.quaternion);
  scene.add(mesh);
  return sc;
}

function person(scene) {
  const g = new THREE.Group();
  g.add(place(cyl(0.2, 0.25, 0.6, mat(PAL.green2, { r: 0.8 }), 20), 0, 0.32, 0));
  g.add(place(sphere(0.21, mat(PAL.green2, { r: 0.8 }), 16), 0, 0.62, 0));
  g.add(place(sphere(0.19, mat(0xd9a77c, { r: 0.6 }), 20), 0, 0.92, 0));
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.022, 8, 20, Math.PI), mat(PAL.rubber));
  band.position.y = 0.94;
  band.rotation.y = Math.PI / 2;
  g.add(band);
  g.rotation.y = Math.PI / 4;
  scene.add(g);
  return g;
}

export async function buildPyramid({ scene, camera, sun, hemi }, cfg) {
  sun.intensity = 2.0;
  hemi.intensity = 0.9;
  const updates = [];
  const screens = [];

  // ---- title
  const title = flatPanel(scene, camera, 1500, 190, 13, front(0, cfg.head ? 8.6 : 6.05));
  {
    const ctx = title.ctx;
    ctx.clearRect(0, 0, 1500, 190);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffc44a'; ctx.font = '800 74px Helvetica, Arial, sans-serif';
    ctx.fillText(cfg.title, 750, 80);
    ctx.fillStyle = '#9fb3a6'; ctx.font = '500 36px Helvetica, Arial, sans-serif';
    ctx.fillText(cfg.subtitle, 750, 140);
    title.texture.needsUpdate = true;
  }

  // ---- slabs
  const center = at(PYR_X, 0);
  const slabs = cfg.tiers.map((tier, i) => {
    const g = new THREE.Group();
    g.position.set(center.x, layerY(i), center.z);
    const s = SIZES[i];
    g.add(place(box(s, LAYER_H, s, mat(PAL.strataA, { r: 0.85 }), { r: 0.08 }), 0, -LAYER_H / 2, 0));
    g.add(place(box(s - 0.06, 0.05, s - 0.06, mat(PAL.floor, { r: 0.9 }), { r: 0.02 }), 0, 0.005, 0));
    g.add(place(box(s + 0.04, 0.06, 0.06, glowMat(tier.color, 1.8), { r: 0.02, shadow: false }), 0, -0.12, s / 2 + 0.01));
    g.add(place(box(0.06, 0.06, s + 0.04, glowMat(tier.color, 1.8), { r: 0.02, shadow: false }), s / 2 + 0.01, -0.12, 0));
    const tag = new CanvasScreen(512, 160, (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = hex(tier.color); ctx.font = '900 112px Menlo, monospace';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(tier.name, w / 2, h / 2 + 6);
    });
    tag.draw(0);
    const tw = Math.min(1.5, s * 0.5);
    const tagMesh = new THREE.Mesh(new THREE.PlaneGeometry(tw, tw * 0.31), new THREE.MeshStandardMaterial({ color: 0, map: tag.texture, emissive: 0xffffff, emissiveMap: tag.texture, emissiveIntensity: 1.2, transparent: true }));
    tagMesh.position.set(0, -LAYER_H / 2 - 0.02, s / 2 + 0.012);
    g.add(tagMesh);
    scene.add(g);
    return g;
  });
  updates.push((t) => slabs.forEach((g, i) => { g.position.y = layerY(i) + Math.sin(t * TAU) * 0.06 * i; }));

  // ---- logos and crews
  cfg.tiers.forEach((tier, i) => {
    const s = SIZES[i];
    const logos = tier.logos || [];
    const n = logos.length;
    const spread = Math.min(s * 0.32, 0.62 * (n - 1));
    logos.forEach((tex, k) => {
      const off = n === 1 ? 0 : -spread + (2 * spread * k) / (n - 1);
      const local = R.clone().multiplyScalar(off).add(TOWARD.clone().multiplyScalar(-s * 0.2));
      const st = standee(scene, tex, slabs[i].position.clone().add(local), 0.52, 0.14);
      updates.push((t) => { st.position.copy(slabs[i].position).add(local); st.position.y += Math.sin((t * 2 + k * 0.2) * TAU) * 0.02; });
    });
    const c = tier.crew;
    if (c && c.kind === 'person') {
      const p = person(scene);
      const local = R.clone().multiplyScalar(-s * 0.18).add(TOWARD.clone().multiplyScalar(s * 0.12));
      updates.push((t) => { p.position.copy(slabs[i].position).add(local); });
    } else if (c) {
      for (let k = 0; k < c.count; k++) {
        const r = robot({ accent: tier.color, kind: c.kind, scale: c.scale });
        const off = c.count === 1 ? -s * 0.24 : -s * 0.32 + (k * (s * 0.64)) / (c.count - 1);
        const local = R.clone().multiplyScalar(off).add(TOWARD.clone().multiplyScalar(s * 0.24));
        r.rotation.y = Math.PI / 4;
        scene.add(r);
        updates.push((t) => { r.position.copy(slabs[i].position).add(local); animateRobot(r, t, { mode: c.mode, phase: k * 0.23 + i * 0.1 }); });
      }
    }
  });

  // ---- the top: a napping brain, or nothing
  if (cfg.napTop) {
    const brain = new THREE.Mesh(new THREE.IcosahedronGeometry(0.26, 1), new THREE.MeshBasicMaterial({ color: new THREE.Color(PAL.coral).multiplyScalar(1.6), wireframe: true, toneMapped: false }));
    scene.add(brain);
    const halo = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.025, 8, 32), glowMat(PAL.gold, 2.6));
    halo.rotation.x = Math.PI / 2;
    scene.add(halo);
    const zz = new CanvasScreen(256, 128, (ctx, w, h, t) => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#fa866d'; ctx.font = '800 54px Menlo, monospace';
      ctx.fillText('z'.repeat(1 + (Math.floor(t * 6) % 3)), 20, 86);
    });
    screens.push(zz);
    const zzMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.31), new THREE.MeshBasicMaterial({ map: zz.texture, transparent: true, toneMapped: false }));
    zzMesh.quaternion.copy(camera.quaternion);
    scene.add(zzMesh);
    updates.push((t) => {
      const top = slabs[3].position;
      brain.position.copy(top).add(R.clone().multiplyScalar(0.34)).add(new THREE.Vector3(0, 0.48, 0));
      brain.rotation.y = t * TAU;
      halo.position.copy(brain.position).add(new THREE.Vector3(0, 0.38, 0));
      zzMesh.position.copy(top).add(R.clone().multiplyScalar(-0.2)).add(new THREE.Vector3(0, 0.95, 0));
    });
  }

  // ---- busy task cubes on the bottom slab
  const cubes = [];
  for (let k = 0; k < 6; k++) {
    const cb = box(0.13, 0.13, 0.13, glowMat(k % 2 ? PAL.mint : PAL.gold, 2.2), { r: 0.02, shadow: false });
    scene.add(cb);
    cubes.push(cb);
  }
  updates.push((t) => cubes.forEach((cb, k) => {
    const a = (t * (k % 2 ? 1 : -1) + k / cubes.length) * TAU;
    const rr = (1.35 + (k % 3) * 0.28) * 0.7;
    cb.position.copy(slabs[0].position).add(new THREE.Vector3(Math.cos(a) * rr, 0.12, Math.sin(a) * rr));
    cb.rotation.y = a * 2;
  }));

  // ---- one task climbing to the directors, the plan dropping back to the workers
  const climber = box(0.2, 0.2, 0.2, glowMat(PAL.gold, 3.2), { r: 0.03, shadow: false });
  scene.add(climber);
  const planBox = box(0.24, 0.03, 0.3, glowMat(PAL.mint, 2.8), { r: 0.01, shadow: false });
  scene.add(planBox);
  const lane = R.clone().multiplyScalar(-0.95).add(TOWARD.clone().multiplyScalar(0.4));
  const lanePoint = (i, lift = 0.12) => slabs[i].position.clone().add(lane).add(new THREE.Vector3(0, lift, 0));
  updates.push((t) => {
    let p;
    if (t < 0.12) p = lanePoint(0);
    else if (t < 0.3) p = lanePoint(0).lerp(lanePoint(1), seg(t, 0.12, 0.3));
    else if (t < 0.4) p = lanePoint(1);
    else if (t < 0.58) p = lanePoint(1).lerp(lanePoint(2), seg(t, 0.4, 0.58));
    else p = lanePoint(2);
    climber.position.copy(p);
    climber.visible = t < 0.66;
    climber.rotation.y = t * TAU * 3;
    planBox.visible = t >= 0.62 && t < 0.96;
    planBox.position.copy(t < 0.7 ? lanePoint(2, 0.3) : lanePoint(2, 0.3).lerp(lanePoint(0, 0.3), seg(t, 0.7, 0.9)));
    planBox.rotation.y = Math.sin(t * TAU * 4) * 0.4;
  });

  // ---- panels with providers, models, cost, and use
  cfg.tiers.forEach((tier, i) => {
    const hpx = 40 + 70 + tier.lines.length * 50 + (tier.note ? 46 : 0) + 52 + 36;
    const slabScreenY = layerY(i) * COS - 0.15;
    const sc = flatPanel(scene, camera, 1100, hpx, PANEL_W, front(PANEL_X, slabScreenY));
    const ctx = sc.ctx;
    const w = 1100;
    ctx.clearRect(0, 0, w, hpx);
    ctx.fillStyle = 'rgba(9,18,14,0.94)';
    roundRect(ctx, 6, 6, w - 12, hpx - 12, 30); ctx.fill();
    ctx.strokeStyle = hex(tier.color); ctx.globalAlpha = 0.8; ctx.lineWidth = 5; ctx.stroke(); ctx.globalAlpha = 1;
    ctx.fillStyle = hex(tier.color); roundRect(ctx, 36, 34, 96, 52, 14); ctx.fill();
    ctx.fillStyle = '#0a120e'; ctx.font = '900 34px Menlo, monospace'; ctx.fillText(tier.name, 54, 72);
    ctx.fillStyle = '#e8d6b4'; ctx.font = '800 50px Helvetica, Arial, sans-serif'; ctx.fillText(tier.title, 152, 76);
    ctx.fillStyle = hex(tier.color); ctx.font = '700 32px Menlo, monospace';
    const cw = ctx.measureText(tier.cost).width;
    ctx.fillText(tier.cost, w - 40 - cw, 72);
    let y = 136;
    tier.lines.forEach(([who, models]) => {
      ctx.fillStyle = '#9fb3a6'; ctx.font = '600 30px Helvetica, Arial, sans-serif'; ctx.fillText(who, 40, y);
      ctx.fillStyle = '#e8d6b4'; ctx.font = '600 33px Menlo, monospace'; ctx.fillText(models, 245, y);
      y += 50;
    });
    if (tier.note) {
      ctx.fillStyle = tier.noteColor || '#ff7b7b'; ctx.font = '600 29px Menlo, monospace'; ctx.fillText(tier.note, 40, y - 4);
      y += 46;
    }
    ctx.fillStyle = '#7f978a'; ctx.font = '500 30px Helvetica, Arial, sans-serif'; ctx.fillText(tier.use, 40, y + 6);
    sc.texture.needsUpdate = true;
    // leader line from the slab's right corner to the panel
    const from = new THREE.Vector3(center.x, layerY(i) - 0.1, center.z).add(R.clone().multiplyScalar(SIZES[i] * 0.7071 + 0.1));
    const to = front(PANEL_X - PANEL_W / 2 - 0.05, slabScreenY);
    const dir = to.clone().sub(from);
    const line = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, dir.length(), 6), new THREE.MeshBasicMaterial({ color: new THREE.Color(tier.color).multiplyScalar(1.3), toneMapped: false }));
    line.position.copy(from).add(dir.clone().multiplyScalar(0.5));
    line.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    scene.add(line);
    const dot = sphere(0.06, glowMat(tier.color, 2.4), 12);
    dot.position.copy(from);
    scene.add(dot);
  });

  // ---- the head: you, then ChatGPT as the main coordinator and assistant, above high mode
  if (cfg.head) {
    const c0 = at(PYR_X, 0);
    const hy = layerY(3) + LAYER_H + GAP * 0.5;
    const chatTex = cfg.head.chatTex;
    const chat = standee(scene, chatTex, new THREE.Vector3(c0.x, hy, c0.z).add(R.clone().multiplyScalar(-0.5)).add(TOWARD.clone().multiplyScalar(-0.2)), 0.62, 0.14);
    const you = person(scene);
    you.position.set(c0.x, hy, c0.z);
    you.position.add(R.clone().multiplyScalar(0.55)).add(TOWARD.clone().multiplyScalar(0.1));
    const link = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.05, 6), new THREE.MeshBasicMaterial({ color: new THREE.Color(PAL.cream).multiplyScalar(1.4), toneMapped: false }));
    link.position.set(c0.x, hy + 0.3, c0.z);
    link.rotation.z = Math.PI / 2; link.rotation.y = Math.PI / 4;
    scene.add(link);
    updates.push((t) => { chat.position.y = hy + Math.sin(t * TAU) * 0.03; you.position.y = hy + Math.sin(t * TAU + 1) * 0.03; });
    const rows = cfg.head.lines;
    const hpx = 40 + 70 + rows.length * 50 + 52 + 36;
    const hy2 = layerY(3) * COS + 2.85;
    const sc = flatPanel(scene, camera, 1100, hpx, PANEL_W, front(PANEL_X, hy2));
    const ctx = sc.ctx; const w = 1100;
    ctx.clearRect(0, 0, w, hpx);
    ctx.fillStyle = 'rgba(9,18,14,0.94)'; roundRect(ctx, 6, 6, w - 12, hpx - 12, 30); ctx.fill();
    ctx.strokeStyle = '#e8d6b4'; ctx.globalAlpha = 0.8; ctx.lineWidth = 5; ctx.stroke(); ctx.globalAlpha = 1;
    ctx.fillStyle = '#e8d6b4'; roundRect(ctx, 36, 34, 96, 52, 14); ctx.fill();
    ctx.fillStyle = '#0a120e'; ctx.font = '900 30px Menlo, monospace'; ctx.fillText('YOU', 54, 72);
    ctx.fillStyle = '#e8d6b4'; ctx.font = '800 50px Helvetica, Arial, sans-serif'; ctx.fillText('Owner and coordinator', 152, 76);
    let y = 136;
    rows.forEach(([who, what]) => {
      ctx.fillStyle = '#9fb3a6'; ctx.font = '600 30px Helvetica, Arial, sans-serif'; ctx.fillText(who, 40, y);
      ctx.fillStyle = '#e8d6b4'; ctx.font = '600 31px Menlo, monospace'; ctx.fillText(what, 245, y);
      y += 50;
    });
    ctx.fillStyle = '#7f978a'; ctx.font = '500 30px Helvetica, Arial, sans-serif'; ctx.fillText(cfg.head.use, 40, y + 6);
    sc.texture.needsUpdate = true;
  }

  // ---- the two moves
  const note = (text, color, sx, sy) => {
    const sc = flatPanel(scene, camera, 900, 110, 4.78, front(sx, sy));
    sc.ctx.clearRect(0, 0, 900, 110);
    sc.ctx.fillStyle = hex(color); sc.ctx.font = '700 40px Menlo, monospace';
    sc.ctx.fillText(text, 10, 70);
    sc.texture.needsUpdate = true;
  };
  note('↑ fails twice: go up', PAL.gold, -8.3, 1.9);
  note('↓ plan written: go back down', PAL.mint, -8.3, 1.3);

  // ---- optional footer box (the free version's limits)
  if (cfg.footer) {
    const lines = cfg.footer.lines;
    const fh = 110 + lines.length * 52 + 30;
    const sc = flatPanel(scene, camera, 1800, fh, 17.2, front(0, cfg.footer.y));
    const ctx = sc.ctx;
    ctx.clearRect(0, 0, 1800, fh);
    ctx.fillStyle = 'rgba(30,12,12,0.92)';
    roundRect(ctx, 6, 6, 1788, fh - 12, 30); ctx.fill();
    ctx.strokeStyle = '#ff7b7b'; ctx.lineWidth = 5; ctx.stroke();
    ctx.fillStyle = '#ff9b8a'; ctx.font = '800 48px Helvetica, Arial, sans-serif'; ctx.fillText(cfg.footer.title, 44, 76);
    lines.forEach((ln, k) => {
      ctx.fillStyle = '#ff7b7b'; ctx.beginPath(); ctx.arc(56, 128 + k * 52, 8, 0, TAU); ctx.fill();
      ctx.fillStyle = '#e8d6b4'; ctx.font = '500 34px Helvetica, Arial, sans-serif'; ctx.fillText(ln, 80, 140 + k * 52);
    });
    sc.texture.needsUpdate = true;
  }

  return (t) => {
    screens.forEach((s) => s.draw(t));
    updates.forEach((u) => u(t));
  };
}
