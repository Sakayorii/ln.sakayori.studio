import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import remarkSceneBreak from './src/utils/remark-scene-break.mjs';
import remarkDropcap from './src/utils/remark-dropcap.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://ln.sakayori.studio',
  output: 'static',
  adapter: cloudflare(),
  integrations: [sitemap()],
  markdown: {
    remarkPlugins: [remarkDropcap, remarkSceneBreak],
  },
  vite: {
    build: {
      // keep font filenames stable for long-term caching
      assetsInlineLimit: 0,
    },
  },
});
