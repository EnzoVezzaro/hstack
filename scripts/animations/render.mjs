// Renders the README animations: node render.mjs [scene ...] [--frames N] [--still]
// Needs Google Chrome (or set CHROME=/path/to/chrome) and ffmpeg on PATH.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { chromium } from 'playwright-core';

const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(here, '../../assets/animations');
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

// Render at 2x and downscale for clean edges. fps and frames set loop length.
export const SCENES = {
  'stack-office': { w: 1600, h: 1000, frames: 96, fps: 24, outW: 800 },
  'tier-elevator': { w: 1600, h: 1000, frames: 120, fps: 24, outW: 800 },
  'ship-pipeline': { w: 1600, h: 900, frames: 96, fps: 24, outW: 800 },
  'horizon-loop': { w: 1600, h: 1000, frames: 120, fps: 24, outW: 800 },
  'install-terminal': { w: 1600, h: 900, frames: 96, fps: 24, outW: 800 },
  'divider': { w: 1600, h: 160, frames: 48, fps: 24, outW: 800 },
  'tier-pyramid': { w: 1600, h: 1200, frames: 96, fps: 24, outW: 800 },
  'tier-pyramid-free': { w: 1600, h: 1560, frames: 96, fps: 24, outW: 800 },
  'evolution-explainer': { w: 1600, h: 2200, frames: 96, fps: 24, outW: 800 },
  'stoner-mode': { w: 1600, h: 1200, frames: 96, fps: 24, outW: 800 },
  'architecture': { w: 1600, h: 3558, frames: 72, fps: 24, outW: 800 },
};

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png' };

function serve() {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0]);
    const file = path.join(here, url === '/' ? 'index.html' : url);
    if (!file.startsWith(here) || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

async function renderScene(browser, port, name, opts) {
  const cfg = { ...SCENES[name] };
  if (opts.frames) cfg.frames = opts.frames;
  const page = await browser.newPage({ viewport: { width: cfg.w, height: cfg.h } });
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console.log(`[${name}] ${m.type()}: ${m.text()}`); });
  page.on('pageerror', (e) => console.log(`[${name}] pageerror: ${e.message}`));
  await page.goto(`http://127.0.0.1:${port}/index.html?scene=${name}&w=${cfg.w}&h=${cfg.h}&ow=${cfg.outW}`);
  await page.waitForFunction('window.__ready === true', null, { timeout: 120000 });
  const frameDir = path.join(here, 'frames', name);
  fs.rmSync(frameDir, { recursive: true, force: true });
  fs.mkdirSync(frameDir, { recursive: true });
  const t0 = Date.now();
  const list = opts.still ? [Math.floor(cfg.frames * 0.62)] : [...Array(cfg.frames).keys()];
  for (const i of list) {
    const url = await page.evaluate((t) => window.__frame(t), i / cfg.frames);
    fs.writeFileSync(path.join(frameDir, `f${String(i).padStart(4, '0')}.png`), Buffer.from(url.split(',')[1], 'base64'));
  }
  await page.close();
  console.log(`[${name}] ${list.length} frames in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  fs.mkdirSync(outDir, { recursive: true });
  const stillSrc = path.join(frameDir, `f${String(list.at(-1) === undefined ? 0 : (opts.still ? list[0] : Math.floor(cfg.frames * 0.62))).padStart(4, '0')}.png`);
  fs.copyFileSync(stillSrc, path.join(outDir, `${name}.png`));
  if (opts.still) return;
  const gif = path.join(outDir, `${name}.gif`);
  const stable = path.join(frameDir, 'stable');
  execFileSync('python3', [path.join(here, 'stabilize.py'), frameDir, stable, String(cfg.stabilize ?? 9)], { stdio: 'inherit' });
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(cfg.fps), '-i', path.join(stable, 'f%04d.png'),
    '-vf', `split[a][b];[a]palettegen=max_colors=${cfg.colors ?? 192}:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle`,
    '-loop', '0', gif]);
  try { execFileSync('gifsicle', ['-O3', '--lossy=40', '-b', gif]); } catch { console.log(`[${name}] gifsicle not found; skipping lossy pass`); }
  if (!opts.keep) fs.rmSync(frameDir, { recursive: true, force: true });
  console.log(`[${name}] ${path.relative(path.resolve(here, '../..'), gif)} ${(fs.statSync(gif).size / 1024 / 1024).toFixed(2)} MB`);
}

async function main() {
  const args = process.argv.slice(2);
  const opts = { still: args.includes('--still'), keep: args.includes('--keep') };
  const fi = args.indexOf('--frames');
  if (fi >= 0) opts.frames = Number(args[fi + 1]);
  const names = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--frames');
  const todo = names.length ? names : Object.keys(SCENES);
  const server = await serve();
  const browser = await chromium.launch({
    executablePath: CHROME, headless: true,
    args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--enable-webgl'],
  });
  try {
    for (const name of todo) await renderScene(browser, server.address().port, name, opts);
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
