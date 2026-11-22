// "The long horizon": a robot runs laps until the metric crosses the threshold.
// Each lap is one iteration of measure, change one thing, keep it if it helped.
import {
  THREE, TAU, PAL, mat, glowMat, box, cyl, sphere, place, CanvasScreen, roundRect, hex,
  robot, animateRobot, plant,
} from '../lib.js';

export const view = { size: 5.0, target: [0, 1.35, 0], elevation: 30 };
export const bloom = { strength: 0.65, radius: 0.45, threshold: 0.8 };
export const exposure = 1.3;

const R = 3.55;
const LAPS = 6;
const SCORES = [58, 66, 71, 79, 87, 96];
const GOAL = 95;
const WIN = 5 / LAPS + 0.03;

const smooth = (k) => k * k * (3 - 2 * k);
const seg = (t, a, b) => smooth(Math.max(0, Math.min(1, (t - a) / (b - a))));

function chartScreen() {
  return new CanvasScreen(900, 560, (ctx, w, h, t) => {
    ctx.fillStyle = '#08110d'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#e8d6b4'; ctx.font = '700 34px Helvetica, Arial, sans-serif';
    ctx.fillText('lighthouse score', 40, 60);
    ctx.fillStyle = '#7f978a'; ctx.font = '500 24px Menlo, monospace';
    const lap = Math.min(LAPS, Math.floor(t * LAPS) + 1);
    ctx.fillText(`iteration ${lap} · one change per run`, 40, 98);
    const x0 = 70; const x1 = w - 50; const y0 = h - 60; const y1 = 140;
    const ys = (v) => y0 - ((v - 50) / 50) * (y0 - y1);
    ctx.strokeStyle = '#1d2a23'; ctx.lineWidth = 2;
    for (let v = 50; v <= 100; v += 10) {
      ctx.beginPath(); ctx.moveTo(x0, ys(v)); ctx.lineTo(x1, ys(v)); ctx.stroke();
      ctx.fillStyle = '#41594a'; ctx.font = '500 18px Menlo, monospace'; ctx.fillText(String(v), 20, ys(v) + 6);
    }
    ctx.setLineDash([14, 10]);
    ctx.strokeStyle = '#ffc44a'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(x0, ys(GOAL)); ctx.lineTo(x1, ys(GOAL)); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#ffc44a'; ctx.font = '700 22px Menlo, monospace'; ctx.fillText(`goal ${GOAL}`, x1 - 120, ys(GOAL) - 12);
    const prog = Math.min(LAPS - 1, t * LAPS);
    const pts = [];
    for (let i = 0; i <= Math.floor(prog); i++) pts.push([i, SCORES[i]]);
    const frac = prog - Math.floor(prog);
    if (Math.floor(prog) < LAPS - 1) {
      const i = Math.floor(prog);
      pts.push([i + frac, SCORES[i] + (SCORES[i + 1] - SCORES[i]) * smooth(frac)]);
    }
    const xs = (i) => x0 + (i / (LAPS - 1)) * (x1 - x0);
    const g = ctx.createLinearGradient(0, y1, 0, y0);
    g.addColorStop(0, 'rgba(158,230,138,0.35)'); g.addColorStop(1, 'rgba(158,230,138,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.moveTo(xs(pts[0][0]), y0);
    pts.forEach(([i, v]) => ctx.lineTo(xs(i), ys(v)));
    ctx.lineTo(xs(pts[pts.length - 1][0]), y0); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#9ee68a'; ctx.lineWidth = 6; ctx.lineJoin = 'round';
    ctx.beginPath(); pts.forEach(([i, v], k) => (k ? ctx.lineTo(xs(i), ys(v)) : ctx.moveTo(xs(i), ys(v)))); ctx.stroke();
    pts.forEach(([i, v], k) => {
      if (k === pts.length - 1 && frac > 0 && Math.floor(prog) < LAPS - 1) return;
      ctx.fillStyle = v >= GOAL ? '#ffc44a' : '#9ee68a';
      ctx.beginPath(); ctx.arc(xs(i), ys(v), 10, 0, TAU); ctx.fill();
    });
    const [li, lv] = pts[pts.length - 1];
    ctx.fillStyle = '#e8d6b4'; ctx.font = '800 30px Menlo, monospace';
    ctx.fillText(String(Math.round(lv)), xs(li) - 20, ys(lv) - 22);
    if (t > WIN) {
      ctx.fillStyle = 'rgba(255,196,74,0.16)'; roundRect(ctx, w - 330, 22, 300, 82, 16); ctx.fill();
      ctx.fillStyle = '#ffc44a'; ctx.font = '800 34px Menlo, monospace';
      ctx.fillText('goal reached ✓', w - 312, 76);
    }
  });
}

function calendarScreen() {
  return new CanvasScreen(256, 256, (ctx, w, h, t) => {
    ctx.fillStyle = '#f4ead2'; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#fa866d'; ctx.fillRect(0, 0, w, 64);
    ctx.fillStyle = '#ffffff'; ctx.font = '800 34px Helvetica, Arial, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('DEC', w / 2, 46);
    ctx.fillStyle = '#2a3b31'; ctx.font = '800 120px Helvetica, Arial, sans-serif';
    ctx.fillText(String(9 + Math.min(LAPS - 1, Math.floor(t * LAPS))), w / 2, 196);
    ctx.textAlign = 'left';
  });
}

function flagScreen() {
  const s = new CanvasScreen(256, 160, (ctx, w, h) => {
    const n = 8;
    for (let y = 0; y < 5; y++) for (let x = 0; x < n; x++) {
      ctx.fillStyle = (x + y) % 2 ? '#0e1413' : '#e8d6b4';
      ctx.fillRect((x * w) / n, (y * h) / 5, w / n + 1, h / 5 + 1);
    }
  });
  s.draw(0);
  return s;
}

export async function build({ scene, camera, sun, hemi }) {
  sun.intensity = 2.1;
  hemi.intensity = 0.85;
  const updates = [];
  const screens = [];

  // ---- floating island with strata
  [[5.4, 0.45, 0x35552f, 0], [5.35, 0.3, PAL.strataB, -0.38], [5.1, 0.35, PAL.strataA, -0.7], [4.4, 0.5, PAL.strataA, -1.1], [3.2, 0.6, 0x1c2822, -1.6]].forEach(([r, h, c, y]) => {
    scene.add(place(cyl(r, r * 0.97, h, mat(c, { r: 0.9 }), 64), 0, y - h / 2 + 0.22, 0));
  });
  // grass ring and track
  const track = new THREE.Mesh(new THREE.RingGeometry(R - 0.45, R + 0.45, 128), mat(0x9a5440, { r: 0.85 }));
  track.rotation.x = -Math.PI / 2;
  track.position.y = 0.235;
  track.receiveShadow = true;
  scene.add(track);
  [R - 0.02, R + 0.02].forEach(() => {});
  [R - 0.15, R + 0.15].forEach((rr) => {
    const lane = new THREE.Mesh(new THREE.RingGeometry(rr - 0.014, rr + 0.014, 128), new THREE.MeshBasicMaterial({ color: 0xe8d6b4 }));
    lane.rotation.x = -Math.PI / 2;
    lane.position.y = 0.24;
    scene.add(lane);
  });
  const infield = new THREE.Mesh(new THREE.CircleGeometry(R - 0.45, 96), mat(0x3f6538, { r: 0.95 }));
  infield.rotation.x = -Math.PI / 2;
  infield.position.y = 0.232;
  infield.receiveShadow = true;
  scene.add(infield);
  // start/finish line
  const finish = new CanvasScreen(256, 64, (ctx, w, h) => {
    for (let y = 0; y < 2; y++) for (let x = 0; x < 8; x++) { ctx.fillStyle = (x + y) % 2 ? '#0e1413' : '#e8d6b4'; ctx.fillRect(x * 32, y * 32, 32, 32); }
  });
  finish.draw(0);
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.22), new THREE.MeshStandardMaterial({ map: finish.texture, roughness: 0.7 }));
  fl.rotation.x = -Math.PI / 2;
  fl.rotation.z = Math.PI / 2;
  fl.position.set(R, 0.242, 0);
  scene.add(fl);

  // ---- central tower with the chart and a clock
  scene.add(place(box(1.6, 3.1, 1.6, mat(PAL.wall, { r: 0.8 }), { r: 0.08 }), -0.4, 1.78, -0.4));
  scene.add(place(box(1.75, 0.16, 1.75, mat(PAL.wallTrim, { r: 0.7 }), { r: 0.04 }), -0.4, 3.38, -0.4));
  scene.add(place(box(1.75, 0.16, 1.75, mat(PAL.wallTrim, { r: 0.7 }), { r: 0.04 }), -0.4, 0.3, -0.4));
  const chart = chartScreen();
  screens.push(chart);
  const screenGroup = new THREE.Group();
  screenGroup.position.set(0.45, 2.15, 0.45);
  screenGroup.rotation.y = Math.PI / 4;
  scene.add(screenGroup);
  screenGroup.add(place(box(2.95, 1.9, 0.14, mat(PAL.rubber, { r: 0.4 }), { r: 0.05 }), 0, 0, -0.02));
  const chartPanel = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 1.74), new THREE.MeshStandardMaterial({ color: 0, emissive: 0xffffff, emissiveMap: chart.texture, emissiveIntensity: 1.05 }));
  chartPanel.position.z = 0.06;
  screenGroup.add(chartPanel);
  // clock on top
  const clock = new THREE.Group();
  clock.position.set(-0.4, 3.95, -0.4);
  clock.rotation.y = Math.PI / 4;
  scene.add(clock);
  clock.add(place(cyl(0.5, 0.5, 0.12, mat(PAL.cream, { r: 0.5 }), 40), 0, 0, 0)).children.at(-1).rotation.set(Math.PI / 2, 0, 0);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.05, 8, 40), mat(PAL.gold, { m: 0.7, r: 0.3 }));
  clock.add(rim);
  for (let k = 0; k < 12; k++) {
    const tick = place(box(0.03, 0.08, 0.02, mat(PAL.rubber)), Math.sin((k / 12) * TAU) * 0.4, Math.cos((k / 12) * TAU) * 0.4, 0.07);
    tick.rotation.z = -(k / 12) * TAU;
    clock.add(tick);
  }
  const hourHand = new THREE.Group(); hourHand.position.z = 0.08; clock.add(hourHand);
  hourHand.add(place(box(0.05, 0.24, 0.02, mat(PAL.rubber)), 0, 0.11, 0));
  const minHand = new THREE.Group(); minHand.position.z = 0.09; clock.add(minHand);
  minHand.add(place(box(0.035, 0.36, 0.02, mat(PAL.coral)), 0, 0.17, 0));
  updates.push((t) => { hourHand.rotation.z = -t * TAU; minHand.rotation.z = -t * TAU * 12; });

  // ---- calendar stand
  const cal = calendarScreen();
  screens.push(cal);
  const calGroup = new THREE.Group();
  calGroup.position.set(-1.9, 0.24, 1.5);
  calGroup.rotation.y = Math.PI / 4;
  scene.add(calGroup);
  calGroup.add(place(box(0.08, 0.9, 0.08, mat(PAL.metal, { m: 0.6 }), { r: 0.02 }), 0, 0.45, -0.05));
  calGroup.add(place(box(0.8, 0.82, 0.06, mat(PAL.woodDark), { r: 0.03 }), 0, 1.25, 0));
  const page = new THREE.Mesh(new THREE.PlaneGeometry(0.72, 0.72), new THREE.MeshStandardMaterial({ map: cal.texture, emissive: 0xffffff, emissiveMap: cal.texture, emissiveIntensity: 0.25 }));
  page.position.set(0, 1.25, 0.04);
  calGroup.add(page);
  const flip = new THREE.Group();
  flip.position.set(0, 1.61, 0.05);
  calGroup.add(flip);
  const flipPage = new THREE.Mesh(new THREE.PlaneGeometry(0.72, 0.72), new THREE.MeshStandardMaterial({ color: 0xf4ead2, side: THREE.DoubleSide, roughness: 0.8 }));
  flipPage.position.y = -0.36;
  flip.add(flipPage);
  updates.push((t) => {
    const k = (t * LAPS) % 1;
    const turning = k < 0.18;
    flip.visible = turning;
    flip.rotation.x = -seg(k, 0, 0.18) * Math.PI * 0.95;
  });

  // ---- flag pole near the finish line
  const flagTex = flagScreen();
  scene.add(place(cyl(0.035, 0.04, 2.6, mat(PAL.metal, { m: 0.7 }), 10), R + 0.85, 1.54, -0.75));
  scene.add(place(sphere(0.07, mat(PAL.gold, { m: 0.8, r: 0.25 }), 12), R + 0.85, 2.88, -0.75));
  const flag = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 0.46, 12, 4), new THREE.MeshStandardMaterial({ map: flagTex.texture, side: THREE.DoubleSide, roughness: 0.7 }));
  flag.castShadow = true;
  scene.add(flag);
  const flagBase = flag.geometry.attributes.position.array.slice();
  updates.push((t) => {
    const up = t < WIN ? 0 : t < 0.95 ? seg(t, WIN, WIN + 0.08) : 1 - seg(t, 0.95, 1);
    flag.position.set(R + 0.85 + 0.4, 0.75 + up * 1.85, -0.75);
    const pos = flag.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = flagBase[i * 3];
      pos.array[i * 3 + 2] = Math.sin((x + 0.4) * 6 - t * TAU * 6) * 0.05 * (x + 0.4);
    }
    pos.needsUpdate = true;
  });

  // ---- lamp posts and bushes around the track
  for (let k = 0; k < 8; k++) {
    const a = (k / 8) * TAU + 0.35;
    const x = Math.cos(a) * (R + 1.05);
    const z = Math.sin(a) * (R + 1.05);
    if (Math.abs(x - (R + 0.85)) < 0.6 && Math.abs(z + 0.75) < 0.6) continue;
    scene.add(place(cyl(0.03, 0.035, 1.1, mat(PAL.metalDark, { m: 0.6 }), 8), x, 0.78, z));
    scene.add(place(sphere(0.09, glowMat(0xffe3a8, 2.6), 12), x, 1.38, z));
  }
  for (let k = 0; k < 7; k++) {
    const a = (k / 7) * TAU + 1.1;
    const rr = 4.75;
    const bush = sphere(0.32 + (k % 3) * 0.08, mat(k % 2 ? PAL.leaf : PAL.leafDark, { r: 0.8 }), 16);
    bush.scale.y = 0.75;
    bush.position.set(Math.cos(a) * rr, 0.42, Math.sin(a) * rr);
    scene.add(bush);
  }
  const p1 = plant({ scale: 1.2 });
  place(p1, -2.1, 0.22, -1.6);
  scene.add(p1);
  updates.push((t) => p1.userData.update(t));

  // ---- the runner and its trail
  const runner = robot({ accent: PAL.mint, scale: 0.95 });
  scene.add(runner);
  const trail = [];
  for (let i = 0; i < 10; i++) {
    const tr = box(0.07, 0.07, 0.07, glowMat(PAL.mint, 3), { r: 0.01, shadow: false });
    scene.add(tr);
    trail.push(tr);
  }
  updates.push((t) => {
    const a = t * LAPS * TAU;
    runner.position.set(Math.cos(a) * R, 0.24 + Math.abs(Math.sin(t * TAU * LAPS * 4)) * 0.08, Math.sin(a) * R);
    runner.rotation.y = -a;
    animateRobot(runner, t, { mode: 'idle', phase: 0.2 });
    runner.userData.parts.arms[0].rotation.x = Math.sin(t * TAU * LAPS * 4) * 0.9;
    runner.userData.parts.arms[1].rotation.x = -Math.sin(t * TAU * LAPS * 4) * 0.9;
    trail.forEach((tr, i) => {
      const b = a - (i + 1) * 0.07;
      tr.position.set(Math.cos(b) * R, 0.36, Math.sin(b) * R);
      tr.scale.setScalar(1 - i / trail.length);
    });
  });

  // ---- confetti when the goal is reached
  const colors = [PAL.gold, PAL.mint, PAL.coral, PAL.blue, PAL.cream];
  const confetti = [];
  for (let i = 0; i < 70; i++) {
    const c = box(0.07, 0.02, 0.05, glowMat(colors[i % colors.length], 1.6), { r: 0, shadow: false });
    scene.add(c);
    const ang = (i * 2.39996) % TAU;
    confetti.push({ c, ang, sp: 0.6 + ((i * 37) % 10) / 10, spin: 2 + (i % 5) });
  }
  updates.push((t) => {
    const live = t > WIN && t < 0.98;
    confetti.forEach(({ c, ang, sp, spin }) => {
      c.visible = live;
      if (!live) return;
      const k = (t - WIN) / (0.98 - WIN);
      const r = sp * 2.6 * Math.min(1, k * 3);
      c.position.set(0.3 + Math.cos(ang) * r, 4.6 + sp * 1.2 * Math.min(1, k * 4) - k * k * 4.2, 0.3 + Math.sin(ang) * r);
      c.rotation.set(k * spin * 6, k * spin * 4, 0);
    });
  });

  return (t) => {
    screens.forEach((s) => s.draw(t));
    updates.forEach((u) => u(t));
  };
}
