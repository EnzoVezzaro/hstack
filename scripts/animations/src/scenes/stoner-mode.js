// Stoner mode: a hands-off loop over every Orca repo. Scan, check PRs, rank,
// work the queue, rescan. Merges wait at the owner's gate. Subtle green cues.
import * as THREE from 'three';
import { CanvasScreen } from '../lib.js';
import { heroBackdrop, flatOverlay } from '../kit.js';

export const view = { size: 7.6, target: [0, 0, 0], elevation: 30, azimuth: 45 };
export const bloom = { strength: 0.5, radius: 0.4, threshold: 0.84 };
export const exposure = 1.15;
export const shadowSize = 16;

const W = 1600;
const H = 1200;
const C = {
  bg: '#0d1512', panel: '#181d18', panel2: '#1d241d', line: '#34483a',
  cream: '#e8d6b4', muted: '#9fb3a6', gold: '#ffc44a', mint: '#9ee68a',
  blue: '#79a9ed', coral: '#fa866d', violet: '#b59cff',
};

function round(ctx, x, y, w, h, r, fill, stroke = null, lineWidth = 2) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke(); }
}

function label(ctx, text, x, y, size, color = C.cream, weight = 600, align = 'left', maxWidth = Infinity) {
  while (size > 13) {
    ctx.font = `400 ${size}px "HStack Type", monospace`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size--;
  }
  ctx.font = `400 ${size}px "HStack Type", monospace`;
  ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

function mono(ctx, text, x, y, size, color = C.muted, align = 'left', maxWidth = Infinity) {
  while (size > 12) {
    ctx.font = `400 ${size}px "HStack Type", monospace`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size--;
  }
  ctx.font = `400 ${size}px "HStack Type", monospace`;
  ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

function dot(ctx, x, y, r, color, alpha = 1) {
  ctx.save(); ctx.globalAlpha = alpha;
  ctx.shadowColor = color; ctx.shadowBlur = r * 4;
  ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function leaf(ctx, x, y, r, color) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(-0.55);
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.moveTo(0, -r);
  ctx.quadraticCurveTo(r, -r * 0.2, 0, r);
  ctx.quadraticCurveTo(-r, -r * 0.2, 0, -r);
  ctx.fill();
  ctx.strokeStyle = '#0a120e'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, -r); ctx.lineTo(0, r); ctx.stroke();
  ctx.restore();
}

function arrow(ctx, x1, y1, x2, y2, color, dashed = false) {
  ctx.save();
  if (dashed) ctx.setLineDash([10, 10]);
  ctx.strokeStyle = color; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.restore();
  const a = Math.atan2(y2 - y1, x2 - x1);
  ctx.save(); ctx.translate(x2, y2); ctx.rotate(a);
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-16, -9); ctx.lineTo(-16, 9); ctx.closePath(); ctx.fill();
  ctx.restore();
}

function station(ctx, x, y, w, h, tag, title, lines, color, active, t) {
  round(ctx, x, y, w, h, 18, active ? '#1d2c22' : C.panel, active ? color : C.line, active ? 3 : 2);
  round(ctx, x + 20, y + 20, 78, 34, 9, color, null);
  label(ctx, tag, x + 59, y + 38, 21, '#0a120e', 800, 'center');
  label(ctx, title, x + 22, y + 82, 30, active ? color : C.cream, 800);
  lines.forEach((line, i) => mono(ctx, line, x + 22, y + 124 + i * 28, 18, C.muted, 'left', w - 44));
  if (active) dot(ctx, x + w - 26, y + h - 26, 7, C.mint, 0.7 + 0.3 * Math.sin((t * 4 + 1) * Math.PI * 2));
}

function prCard(ctx, x, y, w, h, title, state, t, offset) {
  const colors = { red: C.coral, check: C.gold, done: C.mint, wait: C.violet };
  const col = colors[state] || C.muted;
  const bob = Math.sin((t * 4 + offset) * Math.PI * 2) * 2;
  round(ctx, x, y + bob, w, h, 10, '#111c16', col, 2);
  dot(ctx, x + 18, y + bob + h / 2, 5, col);
  mono(ctx, title, x + 32, y + bob + h / 2, 17, C.cream, 'left', w - 46);
}

function draw(ctx, _w, _h, t) {
  // Clear, then a soft wash: the banner's world shows through behind the cards.
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(15,21,19,0.6)'; ctx.fillRect(0, 0, W, H);

  // Header
  label(ctx, 'STONER MODE', 88, 86, 34, C.mint, 800);
  label(ctx, 'Set it and walk away.', 88, 152, 56, C.cream, 800);
  label(ctx, 'One loop: scan every Orca repo, work the PR queue, then check the PRs again.', 90, 210, 26, C.muted, 500);
  leaf(ctx, 1480, 138, 38, '#7fae7a');
  round(ctx, 88, 250, 1424, 2, 1, C.line);

  // Loop stations: top row left to right, then down and back left.
  const boxes = [
    { x: 100, y: 320, tag: '01', title: 'SCAN ORCA', lines: ['repo list · worktree ps', 'map paths to GitHub'], color: C.blue },
    { x: 610, y: 320, tag: '02', title: 'CHECK OPEN PRs', lines: ['red checks · review threads', 'drafts · mergeable state'], color: C.coral },
    { x: 1120, y: 320, tag: '03', title: 'RANK THE QUEUE', lines: ['blockers first · T2', 'one owner + done check'], color: C.gold },
    { x: 610, y: 720, tag: '04', title: 'WORK THE QUEUE', lines: ['max 3 workers · T0/T1', 'push fixes to PR branches'], color: C.mint },
    { x: 100, y: 720, tag: '05', title: 'RESCAN / WAIT', lines: ['queue empty → wait 30m', 'new PRs change everything'], color: C.violet },
  ];
  const active = [0, 1, 2, 3, 4][Math.floor(t * 5) % 5];
  boxes.forEach((b, i) => station(ctx, b.x, b.y, 380, 190, b.tag, b.title, b.lines, b.color, i === active, t));

  // Arrows around the loop.
  arrow(ctx, 486, 415, 600, 415, C.muted);
  arrow(ctx, 996, 415, 1110, 415, C.muted);
  arrow(ctx, 1490, 515, 1490, 710, C.gold);
  arrow(ctx, 1010, 815, 490, 815, C.mint);
  arrow(ctx, 290, 710, 290, 520, C.violet);

  // The pulse travelling the loop.
  const path = [
    [543, 415], [1053, 415], [1490, 415], [1490, 815], [750, 815],
    [290, 815], [290, 560], [543, 560], [543, 415],
  ];
  const u = (t * 1) % 1;
  const seg = u * (path.length - 1);
  const i0 = Math.min(path.length - 2, Math.floor(seg));
  const k = seg - i0;
  const px = path[i0][0] + (path[i0 + 1][0] - path[i0][0]) * k;
  const py = path[i0][1] + (path[i0 + 1][1] - path[i0][1]) * k;
  dot(ctx, px, py, 9, C.gold, 0.9);

  // PR cards under the ranking and work stations.
  label(ctx, 'QUEUE', 1120, 548, 18, C.gold, 800);
  prCard(ctx, 1130, 566, 340, 44, 'PR #41  red CI', 'red', t, 0);
  prCard(ctx, 1130, 620, 340, 44, 'PR #38  review thread', 'check', t, 0.3);
  label(ctx, 'IN FLIGHT', 620, 548, 18, C.mint, 800);
  prCard(ctx, 630, 566, 330, 44, 'PR #44  fix pushed', 'done', t, 0.6);

  // Three workers with a lazy, subtle smoke wisp.
  for (let i = 0; i < 3; i++) {
    const bx = 660 + i * 100;
    round(ctx, bx, 940, 56, 56, 12, '#1c2a21', C.mint, 2);
    dot(ctx, bx + 18, 960, 4, C.mint); dot(ctx, bx + 38, 960, 4, C.mint);
    round(ctx, bx + 16, 976, 24, 6, 3, C.mint, null);
  }
  for (let k = 0; k < 3; k++) {
    const life = (t * 0.5 + k / 3) % 1;
    ctx.save(); ctx.globalAlpha = 0.12 * (1 - life); ctx.fillStyle = '#c9e8d0';
    ctx.beginPath(); ctx.arc(865 + life * 16, 932 - life * 52, 7 + life * 10, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  label(ctx, '3 workers, one owner each', 930, 968, 20, C.muted, 600, 'left', 180);

  // Owner gate: fixes go out, irreversible actions wait.
  round(ctx, 1120, 930, 380, 150, 18, '#221d2d', C.violet, 2);
  label(ctx, 'OWNER GATE', 1310, 966, 24, C.violet, 800, 'center');
  mono(ctx, 'merge · close · delete · deploy', 1310, 1002, 17, C.cream, 'center', 340);
  label(ctx, 'WAITING FOR A YES', 1310, 1042, 20, C.violet, 800, 'center');
  arrow(ctx, 1000, 890, 1120, 940, C.violet, true);

  // Footer rules
  label(ctx, 'Pushes to PR branches are the job. Merges, closes, deletions and deploys wait for the owner or a standing rule.', 90, 1136, 22, C.muted, 500, 'left', 1420);
}

export async function build({ scene, camera }) {
  const screen = new CanvasScreen(W, H, draw);
  const world = heroBackdrop(scene, { traces: false, seed: 11, radius: 9.92 });
  flatOverlay(scene, camera, screen, 16, 12);
  return (t) => { world(t); screen.draw(t); };
}
