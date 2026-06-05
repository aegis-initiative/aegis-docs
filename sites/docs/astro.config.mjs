// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import remarkAsides from './src/plugins/remark-asides.mjs';
import rehypeAsides from './src/plugins/rehype-asides.mjs';

// Version is read from the committed VERSION file at the repo root.
// The Header component in @aegis-initiative/design-system reads
// `import.meta.env.AEGIS_VERSION`, which is populated here before
// Astro/Vite loads its env files.
const siteDir = path.dirname(fileURLToPath(import.meta.url));
const versionPath = path.resolve(siteDir, '..', '..', 'VERSION');
const versionData = JSON.parse(fs.readFileSync(versionPath, 'utf8'));
process.env.AEGIS_VERSION = versionData.tag ?? 'unversioned';

// https://astro.build/config
export default defineConfig({
  site: 'https://aegis-docs.com',
  markdown: {
    remarkPlugins: [remarkAsides],
    rehypePlugins: [rehypeAsides],
  },
  integrations: [mdx(), sitemap()],
});
