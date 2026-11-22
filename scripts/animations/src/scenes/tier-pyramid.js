// The model pyramid: workers at the wide base, high mode at the narrow top.
// Defaults are Anthropic and OpenAI. OpenCode Go directs or supervises; its
// free models work at the base.
import { PAL, loadImg, svgImg, tile } from '../lib.js';
import { buildPyramid } from './pyramid-common.js';

export const view = { size: 9.2, target: [0, 1.7, 0], elevation: 30 };
export const bloom = { strength: 0.55, radius: 0.4, threshold: 0.82 };
export const exposure = 1.3;
export const shadowSize = 14;

export async function build(ctx) {
  const opencodeImg = await loadImg('assets/logos/opencode.png');
  const [openaiImg, claudeImg] = await Promise.all([svgImg('openai', '#e8d6b4'), svgImg('claude', '#ffffff')]);
  const claude = tile({ img: claudeImg, bg: '#d97757', ring: '#f0a585' });
  const openai = tile({ img: openaiImg, bg: '#0a0a0a', ring: '#3a4640' });
  const opencode = tile({ img: opencodeImg, full: true, bg: '#0a0a0a' });
  const chatTex = tile({ img: await loadImg('assets/logos/chatgpt.png'), full: true, bg: '#ffffff' });
  return buildPyramid(ctx, {
    head: {
      chatTex,
      lines: [['You', 'approve, decide, own the product'], ['ChatGPT', 'main coordinator and assistant']],
      use: 'Talks to you, plans the day, routes work down',
    },
    title: 'The model pyramid',
    subtitle: 'Same shape with GLM (Z.ai), DeepSeek, Kimi, or any provider.',
    napTop: true,
    tiers: [
      {
        name: 'T0', title: 'Workers', color: PAL.mint, cost: '$ or free',
        lines: [['Anthropic', 'Haiku'], ['OpenAI', 'Luna'], ['OpenCode', 'free models']],
        use: 'Tests, docs, cleanup, setup, first drafts',
        logos: [claude, openai, opencode], crew: { count: 4, kind: 'worker', scale: 0.3, mode: 'type' },
      },
      {
        name: 'T1', title: 'Supervisors', color: PAL.blue, cost: '$$',
        lines: [['Anthropic', 'Sonnet'], ['OpenAI', 'Terra'], ['OpenCode', 'Go (optional)']],
        use: 'Debugging, multi-file changes, checking the workers',
        logos: [claude, openai, opencode], crew: { count: 2, kind: 'worker', scale: 0.34, mode: 'type' },
      },
      {
        name: 'T2', title: 'Directors', color: PAL.gold, cost: '$$$',
        lines: [['Anthropic', 'Opus'], ['OpenAI', 'GPT Sol'], ['OpenCode', 'Go (optional)']],
        use: 'Plans, reviews, decisions',
        logos: [claude, openai, opencode], crew: { count: 2, kind: 'director', scale: 0.36, mode: 'inspect' },
      },
      {
        name: 'T3', title: 'High mode', color: PAL.coral, cost: '$$$$',
        lines: [['Anthropic', 'Fable'], ['OpenAI', 'Astra']],
        use: "Architecture, security, anything you can't undo",
        logos: [claude, openai], crew: { count: 1, kind: 'director', scale: 0.38, mode: 'idle' },
      },
    ],
  });
}
