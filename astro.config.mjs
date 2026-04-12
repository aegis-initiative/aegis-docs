// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import remarkAsides from './src/plugins/remark-asides.mjs';
import rehypeAsides from './src/plugins/rehype-asides.mjs';

/**
 * Resolve the site version from the committed VERSION file.
 *
 * VERSION is a JSON file at the repo root, written by the nightly
 * release rollup every time a 3-part release tag is cut. The Header
 * component in @aegis-initiative/design-system reads
 * `import.meta.env.AEGIS_VERSION`, which is populated here by
 * mutating `process.env` before Astro/Vite loads.
 *
 * Why a file and not git tags:
 *   1. Works under shallow clones (Cloudflare Pages default)
 *   2. No shell, no globs, no cross-platform quoting
 *   3. Release notes, VERSION, and release tag are committed
 *      together in the nightly rollup — they never disagree
 *   4. Auditable via `git log VERSION`
 *
 * Note: this inline helper will be migrated to
 * `@aegis-initiative/design-system/build`'s `readSiteVersion()`
 * once design-system v0.4.0 is published.
 */
function resolveVersion() {
  try {
    const here = dirname(fileURLToPath(import.meta.url));
    const raw = readFileSync(resolve(here, 'VERSION'), 'utf8');
    const parsed = JSON.parse(raw);
    return parsed.tag || 'dev';
  } catch {
    return 'dev';
  }
}

process.env.AEGIS_VERSION = resolveVersion();

// https://astro.build/config
export default defineConfig({
  site: 'https://aegis-docs.com',
  markdown: {
    remarkPlugins: [remarkAsides],
    rehypePlugins: [rehypeAsides],
  },
  integrations: [mdx()],
});
