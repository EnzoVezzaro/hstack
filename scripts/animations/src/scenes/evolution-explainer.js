// H Stack's V1-to-V5 tool evolution and the paid/free model pyramid split.
import * as THREE from 'three';
import { CanvasScreen, PAL } from '../lib.js';

export const view = { size: 11, target: [0, 0, 0], elevation: 0, azimuth: 0 };
export const bloom = { strength: 0.12, radius: 0.25, threshold: 0.92 };
export const exposure = 1;
export const shadowSize = 2;

const W = 1600;
const H = 2200;
const C = {
  bg: '#0e1413', panel: '#15211b', panel2: '#1a2921', line: '#34493a',
  cream: '#e8d6b4', muted: '#a5b5a8', gold: '#ffc44a', mint: '#9ee68a',
  blue: '#79a9ed', coral: '#fa866d', violet: '#b59cff', red: '#ff766e',
};

function round(ctx, x, y, w, h, r, fill, stroke = null, lineWidth = 2) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke(); }
}

function label(ctx, text, x, y, size, color = C.cream, weight = 600, align = 'left', maxWidth = Infinity) {
  while (size > 13) {
    ctx.font = `${weight} ${size}px Helvetica, Arial, sans-serif`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size--;
  }
  ctx.font = `${weight} ${size}px Helvetica, Arial, sans-serif`;
  ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

function mono(ctx, text, x, y, size, color = C.muted, align = 'left', maxWidth = Infinity) {
  while (size > 13) {
    ctx.font = `600 ${size}px Menlo, Monaco, monospace`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size--;
  }
  ctx.font = `600 ${size}px Menlo, Monaco, monospace`;
  ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

function polygon(ctx, points, fill, stroke, lineWidth = 3) {
  ctx.beginPath(); ctx.moveTo(points[0][0], points[0][1]);
  points.slice(1).forEach(([x, y]) => ctx.lineTo(x, y)); ctx.closePath();
  ctx.fillStyle = fill; ctx.fill();
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke(); }
}

function glowDot(ctx, x, y, radius, color, alpha = 1) {
  ctx.save(); ctx.globalAlpha = alpha;
  ctx.shadowColor = color; ctx.shadowBlur = radius * 4;
  ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

const versions = [
  { v: 'V1', tools: ['Herdr', 'OpenCode', 'Freebuff', 'Ego Lite'], step: 'One project, one chain' },
  { v: 'V2', tools: ['Herdr', '+ Codex', 'OpenCode / Freebuff', 'Ego Lite'], step: 'Still one project' },
  { v: 'V3', tools: ['ORCA', 'Herdr / Codex', 'OpenCode / Freebuff', 'Ego Lite'], step: 'Single + multi-project' },
  { v: 'V4', tools: ['ORCA', 'Codex / Claude Code', 'OpenCode / Freebuff', 'Ego Lite'], step: 'Multi-repo directors' },
  { v: 'V5', tools: ['Codex', 'ORCA', 'Codex / Claude Code', 'OpenCode / Freebuff', 'Ego Lite + desktop'], step: 'Routed multi-repo system' },
];

const paidTiers = [
  { title: 'WORKERS', models: 'Haiku  ·  Luna  ·  free models', color: C.mint },
  { title: 'SUPERVISORS', models: 'Sonnet  ·  Terra  ·  OpenCode Go', color: C.blue },
  { title: 'DIRECTORS', models: 'Opus  ·  GPT Sol  ·  OpenCode Go', color: C.gold },
  { title: 'HIGH MODE', models: 'Fable  ·  Astra', color: C.coral },
];

function draw(ctx, _width, _height, t) {
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#101914'); bg.addColorStop(0.55, C.bg); bg.addColorStop(1, '#101720');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  // Fine grid and restrained ambient lights.
  ctx.save(); ctx.globalAlpha = 0.12; ctx.strokeStyle = '#76907b'; ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 80) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y < H; y += 80) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  ctx.restore();

  // Header
  label(ctx, 'FROM V1 TO V5', 88, 88, 34, C.gold, 800);
  label(ctx, 'The stack grew because the work did.', 88, 152, 56, C.cream, 800);
  label(ctx, 'Tools multiplied. Challenges got harder. Skills turned repeatable work into a system.', 90, 214, 28, C.muted, 500);
  round(ctx, 88, 260, 1424, 2, 1, C.line);

  // Tool evolution timeline. The scope bands make the V1-V5 shift explicit:
  // one project, mixed, then multi-repo work.
  label(ctx, 'FIVE VERSIONS · THE SCOPE GREW WITH THE TOOLS', 92, 296, 22, C.muted, 800);
  const left = 90, gap = 18, cardW = 270, cardY = 362, cardH = 330;
  const scopes = [
    { x: left, w: cardW * 2 + gap, text: 'SINGLE PROJECT', color: C.blue },
    { x: left + 2 * (cardW + gap), w: cardW, text: 'SINGLE / MULTI', color: C.violet },
    { x: left + 3 * (cardW + gap), w: cardW * 2 + gap, text: 'MULTI-REPO (PROJECT) FOCUSED', color: C.gold },
  ];
  scopes.forEach((s) => {
    ctx.save(); ctx.globalAlpha = 0.16;
    round(ctx, s.x, 314, s.w, 34, 10, s.color, s.color, 1);
    ctx.restore();
    label(ctx, s.text, s.x + s.w / 2, 331, 17, s.color, 800, 'center', s.w - 10);
  });
  const active = Math.floor((t * 5) % 5);
  versions.forEach((v, i) => {
    const x = left + i * (cardW + gap);
    const pulse = i === active ? 0.75 + 0.25 * Math.sin(t * Math.PI * 10) : 1;
    round(ctx, x, cardY, cardW, cardH, 18, i === 4 ? '#1a2a20' : C.panel, i === 4 ? C.gold : C.line, i === 4 ? 3 : 2);
    label(ctx, v.v, x + 22, cardY + 40, 35, i === 4 ? C.gold : C.cream, 800);
    if (i === active) glowDot(ctx, x + cardW - 27, cardY + 40, 7, C.mint, pulse);
    let yy = cardY + 86;
    v.tools.forEach((tool, j) => {
      const isNew = tool.startsWith('+') || (i === 4 && j > 1);
      round(ctx, x + 20, yy, cardW - 40, 38, 9, isNew ? '#27352a' : '#111a15', isNew ? '#657a45' : '#29382e', 1);
      mono(ctx, tool, x + 34, yy + 20, 21, isNew ? C.mint : C.cream, 'left', cardW - 68);
      yy += 43;
    });
    label(ctx, v.step, x + 20, cardY + cardH - 18, 19, i === 4 ? C.gold : C.muted, 600, 'left', cardW - 40);
  });

  // How skills emerged
  round(ctx, 90, 706, 1420, 166, 18, '#111b16', '#2d4033', 2);
  label(ctx, 'HOW THE SKILLS EVOLVED', 118, 742, 21, C.mint, 800);
  label(ctx, '62 reusable skills in V5', 1480, 742, 17, C.gold, 700, 'right');
  const stages = [
    ['Ad hoc prompts', 250], ['Repeatable workflows', 555], ['Reusable skills', 890], ['Routed skill system', 1240],
  ];
  stages.forEach(([name, x], i) => {
    round(ctx, x - 112, 780, 224, 54, 12, i === 3 ? '#2a3523' : '#19251d', i === 3 ? '#718a45' : '#34483a', 2);
    label(ctx, name, x, 807, 22, i === 3 ? C.gold : C.cream, 700, 'center');
    if (i < stages.length - 1) {
      const ax = x + 120;
      ctx.strokeStyle = C.muted; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ax, 807); ctx.lineTo(ax + 73, 807); ctx.stroke();
      polygon(ctx, [[ax + 73, 800], [ax + 86, 807], [ax + 73, 814]], C.muted, null);
    }
  });
  label(ctx, 'Scope grew too: single project → mixed → multi-repo. Skills added context, routing, and proof.', 800, 852, 21, C.muted, 500, 'center', 1360);

  // Pyramid headings
  label(ctx, 'V5 MODEL ARCHITECTURE', 92, 930, 22, C.muted, 800);
  label(ctx, 'HUMAN ORGANIZATION / COMMAND CENTER', 800, 1005, 26, C.cream, 800, 'center');
  label(ctx, 'Human sets direction, accepts decisions, and owns the outcome.', 800, 1044, 20, C.muted, 500, 'center');
  // Command line across both pyramid systems.
  ctx.strokeStyle = 'rgba(255,196,74,0.65)'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(380, 1080); ctx.lineTo(1220, 1080); ctx.stroke();
  glowDot(ctx, 800, 1080, 5, C.gold, 0.75 + 0.25 * Math.sin(t * Math.PI * 2));

  label(ctx, 'PAID PYRAMID', 430, 1130, 25, C.gold, 800, 'center');
  label(ctx, 'FREE PYRAMID', 1172, 1130, 25, C.mint, 800, 'center');
  label(ctx, 'Full decision range', 430, 1162, 17, C.muted, 500, 'center');
  label(ctx, 'Ceiling: Directors', 1172, 1162, 17, C.muted, 500, 'center');

  // Pyramid geometry. Both bases align; the free version ends at Directors.
  const paidCx = 430, freeCx = 1172, baseY = 1950, tierH = 178;
  paidTiers.forEach((tier, i) => {
    const y = baseY - (i + 1) * tierH;
    const wb = 580 - i * 98, wt = wb - 98;
    const x1 = paidCx - wb / 2, x2 = paidCx + wb / 2, tx1 = paidCx - wt / 2, tx2 = paidCx + wt / 2;
    const fill = i % 2 ? '#233128' : '#1c2a21';
    polygon(ctx, [[tx1, y], [tx2, y], [x2, y + tierH - 8], [x1, y + tierH - 8]], fill, tier.color, 3);
    label(ctx, tier.title, paidCx, y + 57, 27, tier.color, 800, 'center');
    label(ctx, tier.models, paidCx, y + 111, 22, C.cream, 600, 'center', wb - 42);
  });

  const freeTiers = [
    { title: 'WORKERS', models: 'OpenCode free · Freebuff flash', color: C.mint },
    { title: 'SUPERVISORS', models: 'Freebuff: MiMo 2.5 Pro · MiniMax M3', color: C.blue },
    { title: 'DIRECTORS', models: 'Freebuff full · OpenCode strong', color: C.gold },
  ];
  freeTiers.forEach((tier, i) => {
    const y = baseY - (i + 1) * tierH;
    const wb = 470 - i * 98, wt = wb - 98;
    const x1 = freeCx - wb / 2, x2 = freeCx + wb / 2, tx1 = freeCx - wt / 2, tx2 = freeCx + wt / 2;
    polygon(ctx, [[tx1, y], [tx2, y], [x2, y + tierH - 8], [x1, y + tierH - 8]], '#17261e', tier.color, 3);
    label(ctx, tier.title, freeCx, y + 57, 26, tier.color, 800, 'center');
    label(ctx, tier.models, freeCx, y + 111, 18, C.cream, 600, 'center', wb - 42);
  });

  // Dashed Director ceiling and opportunistic bridge to human command.
  const directorY = baseY - tierH * 3;
  ctx.save(); ctx.setLineDash([12, 12]); ctx.strokeStyle = 'rgba(255,196,74,0.8)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(850, directorY + 4); ctx.lineTo(1470, directorY + 4); ctx.stroke(); ctx.restore();
  label(ctx, 'FREE TIER TOPS OUT HERE', 1166, directorY + 24, 18, C.gold, 700, 'center');

  // Exceptional, intermittent bridge: intelligent agents can assist command, not replace the human.
  const bridgePulse = Math.max(0, Math.sin(t * Math.PI * 6));
  ctx.save(); ctx.setLineDash([8, 12]); ctx.strokeStyle = `rgba(181,156,255,${0.25 + bridgePulse * 0.65})`; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(1470, 1245); ctx.bezierCurveTo(1530, 1160, 1450, 1115, 1300, 1082); ctx.stroke(); ctx.restore();
  glowDot(ctx, 1470, 1245, 7, C.violet, bridgePulse);
  round(ctx, 1000, 1186, 500, 150, 16, '#241f31', '#7666a0', 2);
  label(ctx, 'EXCEPTION · NOT THE BASELINE', 1250, 1220, 20, C.violet, 800, 'center');
  mono(ctx, 'Kimi · Grok · other strong paid agents', 1250, 1260, 17, C.cream, 'center');
  label(ctx, 'Occasional bridge toward human command.', 1250, 1300, 18, C.muted, 500, 'center');

  // Work descends; acceptance and context return to the owner.
  const travel = (t * 2) % 1;
  const downX = paidCx, downY = 1340 + travel * 530;
  glowDot(ctx, downX, downY, 7, C.gold, 0.9);
  ctx.strokeStyle = 'rgba(255,196,74,0.45)'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(paidCx - 315, 1320); ctx.lineTo(paidCx - 315, 1885); ctx.stroke();
  polygon(ctx, [[paidCx - 323, 1880], [paidCx - 315, 1894], [paidCx - 307, 1880]], C.gold, null);
  label(ctx, 'WORK DOWN', paidCx - 315, 1300, 18, C.gold, 700, 'center');
  const upY = 1875 - travel * 520;
  glowDot(ctx, 790, upY, 6, C.mint, 0.85);
  ctx.strokeStyle = 'rgba(158,230,138,0.38)'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(790, 1885); ctx.lineTo(790, 1100); ctx.stroke();
  polygon(ctx, [[782, 1110], [790, 1096], [798, 1110]], C.mint, null);
  label(ctx, 'PROBES + REPORTS UP', 790, 1910, 18, C.mint, 700, 'center');

  // Caveat footer
  round(ctx, 90, 2026, 1420, 112, 18, '#111b16', '#34483a', 2);
  label(ctx, 'FREE MODELS CAN BE EXCELLENT.', 118, 2062, 23, C.mint, 800);
  label(ctx, 'OpenCode Go can direct; Freebuff full mode directs in the free stack. Limits vary; humans keep command.', 118, 2102, 20, C.muted, 500, 'left', 1360);
}

export async function build({ scene }) {
  const screen = new CanvasScreen(W, H, draw);
  const texture = screen.texture;
  const material = new THREE.MeshBasicMaterial({ map: texture, toneMapped: false });
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(16, 22), material);
  scene.add(plane);
  return (t) => screen.draw(t);
}
