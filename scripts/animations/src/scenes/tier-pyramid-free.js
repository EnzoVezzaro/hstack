// The zero-dollar pyramid: only OpenCode and Freebuff. Model names follow
// Freebuff's README and the OpenCode free models seen on this machine.
import { PAL, loadImg, svgImg, tile } from '../lib.js';
import { buildPyramid } from './pyramid-common.js';

export const view = { size: 9.23, target: [0, -2.46, 0], elevation: 30 };
export const bloom = { strength: 0.55, radius: 0.4, threshold: 0.82 };
export const exposure = 1.3;
export const shadowSize = 16;

export async function build(ctx) {
  const opencodeImg = await loadImg('assets/logos/opencode.png');
  const freebuffImg = await svgImg('freebuff', '#ffffff');
  const opencode = tile({ img: opencodeImg, full: true, bg: '#0a0a0a' });
  const freebuff = tile({ img: freebuffImg, bg: '#2f7d4f', ring: '#57a873' });
  return buildPyramid(ctx, {
    title: 'The zero-dollar pyramid',
    subtitle: 'Only OpenCode and Freebuff. It works, with fine print.',
    napTop: false,
    noteX: -7.0,
    tiers: [
      {
        name: 'T0', title: 'Workers', color: PAL.mint, cost: 'Free',
        lines: [['Freebuff', 'DeepSeek V4 Flash · MiMo 2.5'], ['OpenCode', 'big-pickle · space-bunny-free']],
        use: 'Routine work. The rate limits will find you.',
        logos: [freebuff, opencode], crew: { count: 4, kind: 'worker', scale: 0.3, mode: 'type' },
      },
      {
        name: 'T1', title: 'Supervisors', color: PAL.blue, cost: 'Free',
        lines: [['Freebuff', 'MiMo 2.5 Pro · MiniMax M3']],
        note: 'full mode only', noteColor: '#79a9ed',
        use: 'Checking the workers, multi-file changes',
        logos: [freebuff], crew: { count: 2, kind: 'worker', scale: 0.34, mode: 'type' },
      },
      {
        name: 'T2', title: 'Directors', color: PAL.gold, cost: 'Free',
        lines: [['Freebuff', 'DeepSeek V4 Pro · Kimi K2.7 Code'], ['OpenCode', 'strong free model']],
        note: 'full mode only', noteColor: '#ffc44a',
        use: 'Plans and reviews, as good as free gets',
        logos: [freebuff, opencode], crew: { count: 2, kind: 'director', scale: 0.36, mode: 'inspect' },
      },
      {
        name: 'T3', title: 'High mode', color: PAL.coral, cost: 'Priceless',
        lines: [['You', 'no free model gets this job']],
        use: "For the times you need extra high powers",
        logos: [], crew: { kind: 'person' },
      },
    ],
    footer: {
      y: -9.15,
      title: 'Know the limits before you go free',
      lines: [
        'Free models come and go, and rate limits tend to hit in the middle of a task.',
        'Freebuff runs on ads, and full mode is only available in some countries.',
        'Limited mode gets DeepSeek V4 Flash and MiMo 2.5, and six one-hour sessions a day.',
        'Some free models are labeled "Collects data for training". Read the label before you paste code.',
        'Accounts can be suspended without warning. Ask me how I know.',
      ],
    },
  });
}
