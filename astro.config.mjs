import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkSceneBreak from './src/utils/remark-scene-break.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://ln.sakayori.studio',
  output: 'static',
  integrations: [sitemap()],
  markdown: {
    remarkPlugins: [remarkSceneBreak],
  },
  vite: {
    build: {
      // keep font filenames stable for long-term caching
      assetsInlineLimit: 0,
    },
  },
});
