#!/usr/bin/env node
/* Fetch self-hosted woff2 fonts (vietnamese subset) at prebuild time.
   Keeps Google Fonts out of the runtime path: privacy + no external dependency. */
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'fonts');
mkdirSync(OUT, { recursive: true });

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

const TARGETS = [
  { family: 'Noto Serif', weights: ['400', '700'], styles: ['normal', 'italic'], file: (w, s) => `noto-serif-${w}${s === 'italic' ? '-italic' : ''}.woff2` },
  { family: 'Be Vietnam Pro', weights: ['400', '700'], styles: ['normal'], file: (w) => `be-vietnam-pro-${w}.woff2` },
];

async function vietnameseUrls(family, weight, style) {
  const qs = new URLSearchParams({
    family: `${family}:ital,wght@${style === 'italic' ? 1 : 0},${weight}`,
    display: 'swap',
  });
  const css = await (await fetch(`https://fonts.googleapis.com/css2?${qs}`, {
    headers: { 'User-Agent': UA },
  })).text();
  // split into @font-face blocks, keep the one marked /* vietnamese */
  const blocks = css.match(/\/\* [a-z-]+ \*\/\s*@font-face \{[^}]+\}/g) || [];
  const vi = blocks.find((b) => b.startsWith('/* vietnamese */')) || blocks[blocks.length - 1];
  const m = vi && vi.match(/url\((https:[^)]+\.woff2)\)/);
  if (!m) throw new Error(`no woff2 url for ${family} ${weight} ${style}`);
  return m[1];
}

let done = 0;
for (const t of TARGETS) {
  for (const w of t.weights) {
    for (const s of t.styles) {
      const dest = join(OUT, t.file(w, s));
      if (existsSync(dest)) { console.log('skip', dest); continue; }
      const url = await vietnameseUrls(t.family, w, s);
      const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
      writeFileSync(dest, buf);
      console.log('saved', dest, `${(buf.length / 1024).toFixed(1)}kb`);
      done++;
    }
  }
}
console.log(`fonts: ${done} downloaded`);
