// The V5 stack at work, as an isometric night office.
// Assistant at the main desk, Orca rack routing packets, workers typing,
// a carrier bot taking finished work to the director for review.
import {
  THREE, TAU, PAL, mat, glowMat, box, cyl, sphere, place, CanvasScreen, roundRect, hex,
  codeScreen, terminalScreen, desk, monitor, laptop, keyboard, chair, mug, plant, robot,
  animateRobot, serverRack, cable, diorama,
} from '../lib.js';

export const view = { size: 5.75, target: [0, 1.25, 0], elevation: 30 };
export const bloom = { strength: 0.6, radius: 0.5, threshold: 0.8 };
export const exposure = 1.3;

const LX = 13;
const LZ = 9;
const WALL_H = 3.3;

function browserScreen() {
  return new CanvasScreen(640, 400, (ctx, w, h, t) => {
    ctx.fillStyle = '#0b1310';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#121d17';
    ctx.fillRect(0, 0, w, 40);
    ['#fa866d', '#ffc44a', '#9ee68a'].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(20 + i * 20, 20, 6, 0, TAU); ctx.fill(); });
    ctx.fillStyle = '#1d2a23';
    roundRect(ctx, 90, 9, 360, 22, 11); ctx.fill();
    ctx.fillStyle = '#9fb3a6'; ctx.font = '500 14px Menlo, monospace';
    ctx.fillText('localhost:3000/signup', 106, 25);
    ctx.fillStyle = '#ffc44a'; ctx.font = '700 13px Menlo, monospace';
    ctx.fillText('EGO LITE', 540, 25);
    ctx.fillStyle = '#e8d6b4'; ctx.font = '700 24px Helvetica, Arial, sans-serif';
    ctx.fillText('Create your account', 150, 96);
    const typed = (s, k) => s.slice(0, Math.floor(Math.max(0, Math.min(1, k)) * s.length));
    const fields = [['email', 'enzo@hstack.dev', 0.05, 0.25], ['password', '••••••••••', 0.28, 0.42]];
    fields.forEach(([lab, val, a, b], i) => {
      const y = 128 + i * 70;
      ctx.fillStyle = '#7f978a'; ctx.font = '500 13px Menlo, monospace'; ctx.fillText(lab, 150, y);
      ctx.fillStyle = '#16221c'; roundRect(ctx, 150, y + 8, 340, 38, 8); ctx.fill();
      ctx.strokeStyle = t > a && t < b + 0.05 ? '#ffc44a' : '#2a3b31'; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = '#e8d6b4'; ctx.font = '500 17px Menlo, monospace';
      ctx.fillText(typed(val, (t - a) / (b - a)), 164, y + 33);
    });
    const pressed = t > 0.55 && t < 0.6;
    const done = t > 0.62;
    ctx.fillStyle = done ? '#9ee68a' : pressed ? '#c99a35' : '#ffc44a';
    roundRect(ctx, 150, 284, 340, 44, 10); ctx.fill();
    ctx.fillStyle = '#0b1310'; ctx.font = '700 18px Helvetica, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(done ? '✓ Account created' : 'Sign up', 320, 312);
    ctx.textAlign = 'left';
    if (done) {
      ctx.fillStyle = 'rgba(158,230,138,0.14)'; roundRect(ctx, 150, 342, 340, 34, 8); ctx.fill();
      ctx.fillStyle = '#9ee68a'; ctx.font = '600 14px Menlo, monospace';
      ctx.fillText('flow passed · 10/10 runs', 168, 364);
    }
    // cursor path: field 1, field 2, button
    const keys = [[0, 560, 360], [0.04, 300, 160], [0.27, 300, 230], [0.48, 320, 306], [0.62, 320, 306], [0.9, 560, 360], [1, 560, 360]];
    let cx = 560, cy = 360;
    for (let i = 0; i < keys.length - 1; i++) {
      const [ta, xa, ya] = keys[i]; const [tb, xb, yb] = keys[i + 1];
      if (t >= ta && t <= tb) { const k = (t - ta) / (tb - ta); const e = k * k * (3 - 2 * k); cx = xa + (xb - xa) * e; cy = ya + (yb - ya) * e; }
    }
    ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#0b1310'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx, cy + 24); ctx.lineTo(cx + 7, cy + 18); ctx.lineTo(cx + 15, cy + 30); ctx.lineTo(cx + 19, cy + 28); ctx.lineTo(cx + 12, cy + 16); ctx.lineTo(cx + 21, cy + 16); ctx.closePath(); ctx.fill(); ctx.stroke();
    if (pressed) { ctx.strokeStyle = 'rgba(255,196,74,0.8)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, 16 + (t - 0.55) * 400, 0, TAU); ctx.stroke(); }
  });
}

function dashboardScreen() {
  const rows = [
    ['worker-01', 'fix signup button', 'T0', 0.0],
    ['worker-02', 'write e2e tests', 'T0', 0.18],
    ['director', 'review diff #482', 'T2', 0.42],
    ['ego-lite', 'signup flow x10', 'T0', 0.3],
    ['worker-03', 'update README', 'T1', 0.6],
  ];
  const tierColor = { T0: '#9ee68a', T1: '#79a9ed', T2: '#ffc44a', T3: '#fa866d' };
  return new CanvasScreen(800, 480, (ctx, w, h, t) => {
    ctx.fillStyle = '#0a120e'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#e8d6b4'; ctx.font = '700 28px Helvetica, Arial, sans-serif';
    ctx.fillText('crew · live', 30, 48);
    ctx.fillStyle = '#9ee68a'; ctx.beginPath(); ctx.arc(200, 39, 7 + Math.sin(t * TAU * 4) * 2, 0, TAU); ctx.fill();
    ctx.fillStyle = '#7f978a'; ctx.font = '500 17px Menlo, monospace';
    ctx.fillText('$40/mo · 5 agents · 0 babysitters', 30, 80);
    rows.forEach(([who, task, tier, off], i) => {
      const y = 120 + i * 70;
      ctx.fillStyle = i % 2 ? '#0e1813' : '#111d17'; ctx.fillRect(20, y - 6, w - 40, 62);
      ctx.fillStyle = '#e8d6b4'; ctx.font = '600 19px Menlo, monospace'; ctx.fillText(who, 36, y + 22);
      ctx.fillStyle = '#9fb3a6'; ctx.font = '500 17px Menlo, monospace'; ctx.fillText(task, 36, y + 46);
      ctx.fillStyle = tierColor[tier]; roundRect(ctx, 400, y + 6, 54, 30, 8); ctx.fill();
      ctx.fillStyle = '#0a120e'; ctx.font = '700 16px Menlo, monospace'; ctx.fillText(tier, 412, y + 27);
      const p = (t + off) % 1;
      ctx.fillStyle = '#1d2a23'; roundRect(ctx, 480, y + 14, 200, 14, 7); ctx.fill();
      const done = p > 0.8;
      ctx.fillStyle = done ? '#9ee68a' : tierColor[tier];
      roundRect(ctx, 480, y + 14, 200 * Math.min(1, p / 0.8), 14, 7); ctx.fill();
      ctx.fillStyle = done ? '#9ee68a' : '#7f978a'; ctx.font = '600 16px Menlo, monospace';
      ctx.fillText(done ? '✓ done' : 'busy', 700, y + 27);
    });
  });
}

function skylineScreen() {
  const rnd = (i) => Math.abs(Math.sin(i * 91.3) * 43758.5453) % 1;
  return new CanvasScreen(520, 340, (ctx, w, h, t) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#0a1424'); g.addColorStop(0.7, '#1b2a3a'); g.addColorStop(1, '#2d3b3a');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 40; i++) { ctx.fillStyle = `rgba(255,255,230,${0.3 + 0.5 * rnd(i)})`; ctx.fillRect(rnd(i + 3) * w, rnd(i + 7) * h * 0.5, 2, 2); }
    ctx.fillStyle = '#f3e7c4'; ctx.beginPath(); ctx.arc(w * 0.78, h * 0.22, 26, 0, TAU); ctx.fill();
    ctx.fillStyle = '#0a1424'; ctx.beginPath(); ctx.arc(w * 0.78 + 10, h * 0.22 - 6, 24, 0, TAU); ctx.fill();
    let x = 0; let i = 0;
    while (x < w) {
      const bw = 34 + rnd(i) * 50; const bh = 80 + rnd(i + 11) * 170;
      ctx.fillStyle = i % 2 ? '#0d1712' : '#111f18';
      ctx.fillRect(x, h - bh, bw, bh);
      for (let wy = h - bh + 10; wy < h - 8; wy += 16) {
        for (let wx = x + 6; wx < x + bw - 8; wx += 12) {
          const k = rnd(wx * 3.1 + wy * 1.7);
          const on = k > 0.55 && Math.sin((t * (1 + Math.floor(k * 3)) + k) * TAU) > -0.6;
          if (on) { ctx.fillStyle = k > 0.85 ? '#ffc44a' : '#e8d6b4'; ctx.fillRect(wx, wy, 5, 7); }
        }
      }
      x += bw + 4; i++;
    }
  });
}

function rackStatusScreen() {
  return new CanvasScreen(256, 128, (ctx, w, h, t) => {
    ctx.fillStyle = '#07100c'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#ffc44a'; ctx.font = '700 30px Menlo, monospace'; ctx.fillText('ORCA', 14, 40);
    ctx.fillStyle = '#9ee68a'; ctx.font = '500 16px Menlo, monospace'; ctx.fillText('routing 5 agents', 14, 66);
    for (let i = 0; i < 12; i++) {
      const v = 0.3 + 0.7 * Math.abs(Math.sin((t * 2 + i * 0.13) * TAU));
      ctx.fillStyle = i % 3 ? '#79a9ed' : '#9ee68a';
      ctx.fillRect(14 + i * 19, 118 - v * 40, 12, v * 40);
    }
  });
}

function lidLogo() {
  return new CanvasScreen(128, 128, (ctx, w, h) => {
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#9ee68a'; ctx.font = '700 64px Menlo, monospace'; ctx.textAlign = 'center'; ctx.fillText('h', w / 2, 84);
  });
}

function bookshelf() {
  const g = new THREE.Group();
  const frame = mat(PAL.woodDark, { r: 0.6 });
  g.add(place(box(1.4, 2.4, 0.05, frame, { r: 0.01 }), 0, 1.2, -0.2));
  [-0.68, 0.68].forEach((x) => g.add(place(box(0.05, 2.4, 0.45, frame, { r: 0.01 }), x, 1.2, 0)));
  g.add(place(box(1.42, 0.06, 0.47, frame, { r: 0.01 }), 0, 2.42, 0));
  const colors = [PAL.coral, PAL.cream, PAL.green2, PAL.blue, PAL.gold, PAL.creamDark, PAL.green3];
  for (let s = 0; s < 4; s++) {
    const y = 0.08 + s * 0.58;
    g.add(place(box(1.32, 0.04, 0.42, mat(PAL.wood, { r: 0.6 })), 0, y, 0));
    let x = -0.6;
    let i = s * 3;
    while (x < 0.52) {
      const bw = 0.07 + ((i * 37) % 5) * 0.015;
      const bh = 0.3 + ((i * 13) % 4) * 0.045;
      const book = place(box(bw, bh, 0.3, mat(colors[i % colors.length], { r: 0.7 }), { r: 0.01 }), x + bw / 2, y + 0.02 + bh / 2, 0.02);
      if (i % 7 === 3) { book.rotation.z = 0.28; book.position.x += 0.04; }
      g.add(book);
      x += bw + 0.012;
      i++;
    }
  }
  const trophy = new THREE.Group();
  trophy.add(place(cyl(0.06, 0.08, 0.06, mat(PAL.woodDark), 12), 0, 0.03, 0));
  trophy.add(place(cyl(0.09, 0.04, 0.14, mat(PAL.gold, { m: 0.8, r: 0.25 }), 16), 0, 0.14, 0));
  place(trophy, 0.45, 2.45, 0.05);
  g.add(trophy);
  return g;
}

function crate() {
  const g = new THREE.Group();
  const body = box(0.42, 0.34, 0.42, mat(PAL.creamDark, { r: 0.6 }), { r: 0.04 });
  body.position.y = 0.17;
  g.add(body);
  g.add(place(box(0.44, 0.06, 0.1, mat(PAL.woodDark, { r: 0.6 }), { r: 0.01 }), 0, 0.3, 0));
  const tag = place(box(0.16, 0.1, 0.01, glowMat(PAL.gold, 1.6), { r: 0.01 }), 0, 0.17, 0.215);
  g.add(tag);
  g.userData.body = body;
  g.userData.tag = tag;
  return g;
}

function checkMark() {
  const g = new THREE.Group();
  const m = glowMat(PAL.mint, 3.2);
  const a = box(0.09, 0.26, 0.06, m, { r: 0.02, shadow: false });
  a.position.set(-0.1, -0.04, 0); a.rotation.z = 0.75;
  const b = box(0.09, 0.5, 0.06, m, { r: 0.02, shadow: false });
  b.position.set(0.1, 0.06, 0); b.rotation.z = -0.62;
  g.add(a, b);
  return g;
}

const smooth = (k) => k * k * (3 - 2 * k);
const clamp01 = (k) => Math.max(0, Math.min(1, k));

export async function build({ scene, camera, sun, hemi }) {
  sun.intensity = 2.1;
  hemi.intensity = 0.85;
  const updates = [];

  // ---- room shell
  scene.add(diorama(LX, LZ));
  const wallMat = mat(PAL.wall, { r: 0.9 });
  const trimMat = mat(PAL.wallTrim, { r: 0.7 });
  scene.add(place(box(0.25, WALL_H, LZ, wallMat, { r: 0.03 }), -LX / 2 + 0.125, WALL_H / 2, 0));
  scene.add(place(box(LX, WALL_H, 0.25, wallMat, { r: 0.03 }), 0, WALL_H / 2, -LZ / 2 + 0.125));
  scene.add(place(box(0.32, 0.12, LZ, trimMat, { r: 0.03 }), -LX / 2 + 0.16, WALL_H + 0.06, 0));
  scene.add(place(box(LX, 0.12, 0.32, trimMat, { r: 0.03 }), 0, WALL_H + 0.06, -LZ / 2 + 0.16));
  scene.add(place(box(0.06, 0.16, LZ - 0.4, trimMat, { r: 0.01 }), -LX / 2 + 0.27, 0.08, 0.2));
  scene.add(place(box(LX - 0.4, 0.16, 0.06, trimMat, { r: 0.01 }), 0.2, 0.08, -LZ / 2 + 0.27));

  // ---- main desk on the left wall: the assistant's station
  const main = desk(3.6, 1.35);
  place(main, -LX / 2 + 0.95, 0, 0.4, Math.PI / 2);
  scene.add(main);
  const top = main.userData.top;
  const code = codeScreen();
  const term = terminalScreen([
    '$ npx skills add EnzoVezzaro/hstack',
    '◇ Found 52 skills',
    '◆ Installing for claude-code, codex',
    '✓ hstack          ✓ verify-and-fix',
    '✓ horizon-loop    ✓ puff-puff-pass',
    '✓ Done. Restart your agent.',
    '$ /hstack <project> fix the signup button',
    '◇ routing → verify-and-fix (T1)',
    '✓ repro · fix · rerun: green',
  ], { title: 'zsh · hstack' });
  const web = browserScreen();
  const screens = [code, term, web];
  const mon = (screen, z, ry, w = 1.3) => {
    const m = monitor(screen, { w, h: w * 0.62 });
    place(m, -LX / 2 + 0.75, top, z, ry);
    scene.add(m);
  };
  mon(code, 0.4, Math.PI / 2, 1.5);
  mon(term, 1.95, Math.PI / 2 - 0.28, 1.3);
  mon(web, -1.15, Math.PI / 2 + 0.22, 1.3);
  const kb = keyboard();
  place(kb, -LX / 2 + 1.45, top, 0.4, Math.PI / 2);
  scene.add(kb);
  updates.push((t) => kb.userData.update(t));
  const cup = mug();
  place(cup, -LX / 2 + 1.25, top, 2.0);
  scene.add(cup);
  updates.push((t) => cup.userData.update(t));
  // desk lamp with warm light
  const lamp = new THREE.Group();
  lamp.add(place(cyl(0.13, 0.15, 0.04, mat(PAL.metalDark, { m: 0.6 }), 20), 0, 0.02, 0));
  const arm = place(cyl(0.02, 0.02, 0.6, mat(PAL.metal, { m: 0.7 }), 8), 0, 0.3, 0);
  arm.rotation.z = 0.25;
  lamp.add(arm);
  const shade = place(cyl(0.06, 0.16, 0.18, mat(PAL.gold, { r: 0.4, m: 0.3 }), 20), -0.08, 0.6, 0);
  shade.rotation.z = 0.5;
  lamp.add(shade);
  lamp.add(place(sphere(0.045, glowMat(0xfff1c7, 1.8), 12), -0.11, 0.53, 0));
  const lampLight = new THREE.PointLight(0xffd9a0, 3.5, 4, 2);
  lampLight.position.set(-LX / 2 + 0.75, top + 0.45, -2.0);
  scene.add(lampLight);
  const monLight = new THREE.PointLight(0x9fdcc4, 8, 5, 2);
  monLight.position.set(-LX / 2 + 1.8, top + 0.9, 0.4);
  scene.add(monLight);

  const seat = chair({ color: PAL.green });
  place(seat, -LX / 2 + 2.45, 0, 0.4, -Math.PI / 2);
  scene.add(seat);
  const assistant = robot({ accent: PAL.blue, kind: 'assistant', scale: 0.95 });
  place(assistant, -LX / 2 + 2.3, 0.52, 0.4, -Math.PI / 2);
  scene.add(assistant);
  updates.push((t) => animateRobot(assistant, t, { mode: 'type', phase: 0.1 }));
  // voice rings: the owner talking to the assistant
  const rings = [0, 1, 2].map(() => {
    const r = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.018, 8, 48), new THREE.MeshBasicMaterial({ color: PAL.blue, transparent: true, toneMapped: false }));
    r.rotation.x = Math.PI / 2;
    scene.add(r);
    return r;
  });
  updates.push((t) => rings.forEach((r, i) => {
    const k = (t * 2 + i / 3) % 1;
    r.position.set(-LX / 2 + 2.3, 2.05 + k * 0.35, 0.4);
    r.scale.setScalar(0.45 + k * 0.9);
    r.material.opacity = (1 - k) * 0.55;
  }));

  // ---- Orca racks in the back corner
  const racks = [-4.75, -3.6].map((x, i) => {
    const r = serverRack({ units: 8, h: 2.6 - i * 0.3 });
    place(r, x, 0, -LZ / 2 + 0.75);
    scene.add(r);
    updates.push((t) => r.userData.update(t));
    return r;
  });
  const status = rackStatusScreen();
  screens.push(status);
  const statusPanel = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.4), new THREE.MeshStandardMaterial({ color: 0, emissive: 0xffffff, emissiveMap: status.texture, emissiveIntensity: 1.4 }));
  statusPanel.position.set(-4.75, 2.85, -LZ / 2 + 0.3);
  scene.add(statusPanel);
  scene.add(place(box(0.92, 0.5, 0.08, mat(PAL.rubber), { r: 0.02 }), -4.75, 2.85, -LZ / 2 + 0.25));

  // ---- window, dashboard, bookshelf on the back wall
  const sky = skylineScreen();
  screens.push(sky);
  const win = new THREE.Group();
  win.add(place(box(2.7, 1.8, 0.1, mat(PAL.woodDark, { r: 0.6 }), { r: 0.03 }), 0, 0, 0));
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 1.6), new THREE.MeshStandardMaterial({ color: 0, emissive: 0xffffff, emissiveMap: sky.texture, emissiveIntensity: 1.0 }));
  glass.position.z = 0.06;
  win.add(glass);
  win.add(place(box(0.05, 1.6, 0.04, mat(PAL.woodDark)), 0, 0, 0.08));
  win.add(place(box(2.5, 0.05, 0.04, mat(PAL.woodDark)), 0, 0, 0.08));
  win.add(place(box(2.9, 0.08, 0.3, mat(PAL.wood, { r: 0.6 }), { r: 0.02 }), 0, -0.94, 0.12));
  place(win, -0.6, 1.95, -LZ / 2 + 0.3);
  scene.add(win);
  const mini = plant({ scale: 0.6 });
  place(mini, 0.3, 1.97, -LZ / 2 + 0.42);
  scene.add(mini);
  updates.push((t) => mini.userData.update(t));

  const dash = dashboardScreen();
  screens.push(dash);
  scene.add(place(box(2.5, 1.55, 0.1, mat(PAL.rubber, { r: 0.4 }), { r: 0.03 }), 3.0, 1.95, -LZ / 2 + 0.3));
  const dashPanel = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 1.41), new THREE.MeshStandardMaterial({ color: 0, emissive: 0xffffff, emissiveMap: dash.texture, emissiveIntensity: 1.25 }));
  dashPanel.position.set(3.0, 1.95, -LZ / 2 + 0.36);
  scene.add(dashPanel);
  const shelf = bookshelf();
  place(shelf, 5.45, 0, -LZ / 2 + 0.5);
  scene.add(shelf);

  // ---- worker desks with laptops
  const logo = lidLogo();
  logo.draw(0);
  const workers = [0.0, 2.3].map((x, i) => {
    const d = desk(1.7, 0.95, { top: PAL.creamDark });
    place(d, x, 0, -1.55);
    scene.add(d);
    const lapScreen = codeScreen(undefined, { scrollLines: 6 + i * 3, title: i ? 'tests.ts' : 'signup.ts' });
    screens.push(lapScreen);
    const lap = laptop(lapScreen);
    place(lap, x - 0.2, d.userData.top, -1.45, Math.PI);
    scene.add(lap);
    const back = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.22), new THREE.MeshStandardMaterial({ color: 0, emissive: 0xffffff, emissiveMap: logo.texture, emissiveIntensity: 2.2, transparent: true }));
    back.position.set(x - 0.2, d.userData.top + 0.25, -1.27);
    scene.add(back);
    const bot = robot({ accent: PAL.mint, scale: 0.95 });
    place(bot, x - 0.2, 0.0, -2.3, 0);
    scene.add(bot);
    updates.push((t) => animateRobot(bot, t, { mode: 'type', phase: 0.3 + i * 0.37, typeRate: 14 }));
    const mugB = mug({ color: i ? PAL.coral : PAL.blue });
    place(mugB, x + 0.55, d.userData.top, -1.4);
    scene.add(mugB);
    updates.push((t) => mugB.userData.update((t + 0.5 * i) % 1));
    return bot;
  });
  // rug under the worker desks
  const rug = place(box(5.6, 0.03, 2.6, mat(0x2a3d31, { r: 1 }), { r: 0.02 }), 1.15, 0.015, -1.75);
  scene.add(rug);
  scene.add(place(box(5.2, 0.032, 2.2, mat(0x324a3b, { r: 1 }), { r: 0.02 }), 1.15, 0.016, -1.75));

  // ---- review table and the director
  const table = new THREE.Group();
  table.add(place(cyl(0.7, 0.7, 0.07, mat(PAL.wood, { r: 0.5 }), 40), 0, 1.15, 0));
  table.add(place(cyl(0.06, 0.06, 1.1, mat(PAL.metal, { m: 0.7 }), 12), 0, 0.57, 0));
  table.add(place(cyl(0.38, 0.42, 0.05, mat(PAL.metalDark, { m: 0.6 }), 24), 0, 0.03, 0));
  place(table, 3.55, 0, 2.05);
  scene.add(table);
  const director = robot({ accent: PAL.gold, kind: 'director', scale: 1.05 });
  place(director, 2.7, 0, 1.25, Math.PI / 4);
  scene.add(director);
  // magnifier in the director's right hand
  const lens = new THREE.Group();
  const ringMesh = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.022, 8, 24), mat(PAL.gold, { m: 0.7, r: 0.3 }));
  lens.add(ringMesh);
  lens.add(new THREE.Mesh(new THREE.CircleGeometry(0.11, 24), new THREE.MeshStandardMaterial({ color: 0xbfe3ff, transparent: true, opacity: 0.35, roughness: 0.05 })));
  lens.add(place(box(0.04, 0.2, 0.04, mat(PAL.rubber), { r: 0.01 }), 0, -0.2, 0));
  lens.position.set(0, -0.55, 0.12);
  director.userData.parts.arms[1].add(lens);
  updates.push((t) => animateRobot(director, t, { mode: 'inspect', phase: 0.2 }));

  // carrier bot loop: worker area -> review table -> back
  const carrier = robot({ accent: PAL.mint, scale: 0.82 });
  scene.add(carrier);
  const box1 = crate();
  scene.add(box1);
  const check = checkMark();
  scene.add(check);
  const S = new THREE.Vector3(1.35, 0, -0.55);
  const E = new THREE.Vector3(3.15, 0, 2.85);
  const tableTop = new THREE.Vector3(3.55, 1.19, 2.05);
  updates.push((t) => {
    let pos;
    let carrying = false;
    let facing;
    if (t < 0.4) {
      const k = smooth(t / 0.4);
      pos = S.clone().lerp(E, k);
      carrying = true;
      facing = E.clone().sub(S);
    } else if (t < 0.55) {
      pos = E.clone();
      carrying = t < 0.47;
      facing = tableTop.clone().sub(E);
    } else if (t < 0.95) {
      const k = smooth((t - 0.55) / 0.4);
      pos = E.clone().lerp(S, k);
      facing = S.clone().sub(E);
    } else {
      pos = S.clone();
      facing = E.clone().sub(S);
    }
    carrier.position.copy(pos).add(new THREE.Vector3(0, 0.08 + Math.sin(t * TAU * 6) * 0.03, 0));
    carrier.rotation.y = Math.atan2(facing.x, facing.z);
    animateRobot(carrier, t, { mode: carrying ? 'carry' : 'idle', phase: 0.6 });
    // crate: in the carrier's arms, then on the table, then shipped
    if (carrying) {
      const fwd = new THREE.Vector3(Math.sin(carrier.rotation.y), 0, Math.cos(carrier.rotation.y));
      box1.position.copy(carrier.position).add(fwd.multiplyScalar(0.42)).add(new THREE.Vector3(0, 0.62, 0));
      box1.scale.setScalar(1);
      box1.visible = true;
    } else if (t >= 0.47 && t < 0.97) {
      box1.position.copy(tableTop);
      const shrink = t > 0.9 ? 1 - (t - 0.9) / 0.07 : 1;
      box1.scale.setScalar(Math.max(0.001, shrink));
      box1.visible = true;
    } else {
      box1.visible = false;
    }
    const verified = t > 0.6 && t < 0.92;
    box1.userData.tag.material.emissive.setHex(verified ? PAL.mint : PAL.gold);
    box1.userData.tag.material.emissiveIntensity = verified ? 3 : 1.6;
    check.visible = verified;
    const ck = clamp01((t - 0.6) / 0.06);
    check.position.set(tableTop.x, tableTop.y + 1.0 + Math.sin(t * TAU * 3) * 0.05, tableTop.z);
    check.scale.setScalar(1.25 * smooth(ck) + 0.001);
    check.quaternion.copy(camera.quaternion);
  });

  // ---- cables from the racks with packets out and reports back
  const y = 0.035;
  const cables = [
    cable([[-4.6, y, -3.6], [-4.7, y, -2.6], [-5.4, y, -1.9], [-5.7, y, -1.1]], { packets: 3, speed: 2, color: PAL.gold }),
    cable([[-4.3, y, -3.6], [-3.0, y, -2.9], [-1.2, y, -2.75], [-0.2, y, -2.0]], { packets: 3, speed: 2, color: PAL.gold }),
    cable([[-3.4, y, -3.7], [-1.8, y, -3.4], [1.0, y, -3.2], [2.1, y, -2.05]], { packets: 3, speed: 1, color: PAL.mint, reverse: true }),
    cable([[-3.3, y, -3.5], [-1.6, y, -1.0], [0.8, y, 0.9], [3.45, y, 1.95]], { packets: 4, speed: 1, color: PAL.gold }),
  ];
  cables.forEach((c) => { scene.add(c); updates.push((t) => c.userData.update(t)); });

  // ---- floor details: plant, floor lamp, boxes
  const big = plant({ scale: 1.7 });
  place(big, -LX / 2 + 0.75, 0, 3.55);
  scene.add(big);
  updates.push((t) => big.userData.update(t));
  const floorLamp = new THREE.Group();
  floorLamp.add(place(cyl(0.22, 0.25, 0.05, mat(PAL.metalDark, { m: 0.6 }), 24), 0, 0.025, 0));
  floorLamp.add(place(cyl(0.025, 0.025, 2.1, mat(PAL.metal, { m: 0.7 }), 10), 0, 1.07, 0));
  floorLamp.add(place(cyl(0.22, 0.32, 0.36, mat(PAL.cream, { r: 0.8, e: 0xffd59a, ei: 0.6 }), 24), 0, 2.2, 0));
  place(floorLamp, 5.6, 0, 0.6);
  scene.add(floorLamp);
  const warm = new THREE.PointLight(0xffd59a, 10, 6, 2);
  warm.position.set(5.6, 2.0, 0.6);
  scene.add(warm);
  [[5.2, 0, 2.6, 0.7], [5.75, 0, 3.2, 0.55], [5.4, 0.62, 2.8, 0.5]].forEach(([x, yy, z, s], i) => {
    const b = box(s, s * 0.85, s, mat(i === 2 ? PAL.creamDark : 0xa98463, { r: 0.85 }), { r: 0.03 });
    place(b, x, yy + (s * 0.85) / 2, z, 0.2 * i);
    scene.add(b);
  });


  // ---- lounge corner: couch, coffee table, pizza, controller
  const couch = new THREE.Group();
  const fabric = mat(PAL.green2, { r: 0.95 });
  couch.add(place(box(2.1, 0.42, 0.95, fabric, { r: 0.1 }), 0, 0.33, 0));
  couch.add(place(box(2.1, 0.75, 0.28, fabric, { r: 0.12 }), 0, 0.72, -0.36));
  [-1, 1].forEach((sx) => couch.add(place(box(0.24, 0.62, 0.95, fabric, { r: 0.1 }), sx * 1.0, 0.45, 0)));
  [-0.48, 0.48].forEach((x) => couch.add(place(box(0.92, 0.16, 0.7, mat(PAL.cream, { r: 0.95 }), { r: 0.07 }), x, 0.6, 0.06)));
  couch.add(place(box(0.42, 0.36, 0.14, mat(PAL.coral, { r: 0.95 }), { r: 0.06 }), -0.62, 0.82, -0.18));
  [[-0.95, -0.4], [0.95, -0.4], [-0.95, 0.4], [0.95, 0.4]].forEach(([x, z]) => couch.add(place(cyl(0.04, 0.03, 0.12, mat(PAL.woodDark), 8), x, 0.06, z)));
  place(couch, -4.75, 0, 3.0, Math.PI / 2);
  scene.add(couch);
  const coffee = new THREE.Group();
  coffee.add(place(box(1.2, 0.07, 0.75, mat(PAL.wood, { r: 0.5 }), { r: 0.03 }), 0, 0.45, 0));
  [[-0.52, -0.3], [0.52, -0.3], [-0.52, 0.3], [0.52, 0.3]].forEach(([x, z]) => coffee.add(place(box(0.06, 0.42, 0.06, mat(PAL.woodDark), { r: 0.01 }), x, 0.21, z)));
  const pizza = place(box(0.52, 0.06, 0.52, mat(0xe9dcc0, { r: 0.85 }), { r: 0.01 }), -0.2, 0.52, 0.02, 0.3);
  coffee.add(pizza);
  coffee.add(place(box(0.2, 0.005, 0.2, mat(PAL.coral, { r: 0.8 })), -0.2, 0.553, 0.02, 0.3));
  const pad = place(box(0.3, 0.06, 0.16, mat(PAL.rubber, { r: 0.4 }), { r: 0.04 }), 0.32, 0.51, -0.05, -0.4);
  coffee.add(pad);
  coffee.add(place(box(0.05, 0.02, 0.05, glowMat(PAL.coral, 2), { r: 0.01 }), 0.36, 0.55, -0.08));
  place(coffee, -3.3, 0, 3.0, Math.PI / 2);
  scene.add(coffee);

  // ---- whiteboard with the tier ladder
  const boardScreen = new CanvasScreen(720, 460, (ctx, w, h) => {
    ctx.fillStyle = '#f4efe2'; ctx.fillRect(0, 0, w, h);
    ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const steps = [['T0 free', '#2f7d4f'], ['T1 strong free', '#2f6fb3'], ['T2 director', '#b8860b'], ['T3 top brain', '#c0392b']];
    steps.forEach(([txt, c], i) => {
      const x = 40 + i * 150; const y = 360 - i * 85;
      ctx.strokeStyle = c; ctx.strokeRect(x, y, 140, 56);
      ctx.fillStyle = c; ctx.font = '700 24px "Marker Felt", "Comic Sans MS", sans-serif'; ctx.fillText(txt, x + 10, y + 37);
      if (i < 3) {
        ctx.strokeStyle = '#c0392b'; ctx.beginPath(); ctx.moveTo(x + 100, y - 6); ctx.quadraticCurveTo(x + 150, y - 50, x + 190, y - 30); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x + 190, y - 30); ctx.lineTo(x + 172, y - 42); ctx.moveTo(x + 190, y - 30); ctx.lineTo(x + 176, y - 14); ctx.stroke();
      }
    });
    ctx.fillStyle = '#c0392b'; ctx.font = '700 22px "Marker Felt", "Comic Sans MS", sans-serif';
    ctx.fillText('fails twice? go up', 40, 60);
    ctx.fillStyle = '#2f7d4f'; ctx.fillText('plan written? go back down', 40, 92);
    ctx.strokeStyle = '#2f7d4f'; ctx.beginPath(); ctx.moveTo(640, 150); ctx.quadraticCurveTo(700, 300, 230, 420); ctx.stroke();
    ctx.fillStyle = '#555'; ctx.font = '600 18px "Marker Felt", "Comic Sans MS", sans-serif'; ctx.fillText('(thinking is $$$, typing is ¢)', 360, 445);
  });
  boardScreen.draw(0);
  const board = new THREE.Group();
  board.add(place(box(2.1, 1.38, 0.06, mat(PAL.metal, { m: 0.5, r: 0.4 }), { r: 0.02 }), 0, 1.55, 0));
  const face = new THREE.Mesh(new THREE.PlaneGeometry(1.98, 1.26), new THREE.MeshStandardMaterial({ map: boardScreen.texture, roughness: 0.35, emissive: 0xffffff, emissiveMap: boardScreen.texture, emissiveIntensity: 0.28 }));
  face.position.set(0, 1.55, 0.035);
  board.add(face);
  [-0.95, 0.95].forEach((x) => {
    board.add(place(box(0.05, 1.0, 0.05, mat(PAL.metal, { m: 0.6 }), { r: 0.01 }), x, 0.5, 0));
    board.add(place(box(0.05, 0.05, 0.55, mat(PAL.metal, { m: 0.6 }), { r: 0.01 }), x, 0.04, 0));
  });
  board.add(place(box(1.9, 0.04, 0.08, mat(PAL.metalDark), { r: 0.01 }), 0, 0.84, 0.06));
  [PAL.coral, PAL.blue, PAL.green2].forEach((c, i) => board.add(place(cyl(0.015, 0.015, 0.14, mat(c), 8), -0.3 + i * 0.12, 0.87, 0.07)).children.at(-1).rotation.set(0, 0, Math.PI / 2));
  place(board, -1.0, 0, 2.6, Math.PI / 4);
  scene.add(board);

  return (t) => {
    screens.forEach((s) => s.draw(t));
    updates.forEach((u) => u(t));
  };
}
