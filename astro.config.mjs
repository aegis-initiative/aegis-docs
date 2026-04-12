// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { readSiteVersion } from '@aegis-initiative/design-system/build';
import remarkAsides from './src/plugins/remark-asides.mjs';
import rehypeAsides from './src/plugins/rehype-asides.mjs';

// Version is read from the committed VERSION file at the repo root.
// The Header component in @aegis-initiative/design-system reads
// `import.meta.env.AEGIS_VERSION`, which is populated here before
// Astro/Vite loads its env files.
process.env.AEGIS_VERSION = readSiteVersion();

// https://astro.build/config
export default defineConfig({
  site: 'https://aegis-docs.com',
  markdown: {
    remarkPlugins: [remarkAsides],
    rehypePlugins: [rehypeAsides],
  },
  integrations: [mdx()],
});
