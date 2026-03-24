// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import remarkAsides from './src/plugins/remark-asides.mjs';
import rehypeAsides from './src/plugins/rehype-asides.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://aegis-docs.com',
  markdown: {
    remarkPlugins: [remarkAsides],
    rehypePlugins: [rehypeAsides],
  },
  integrations: [mdx()],
});
