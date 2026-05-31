import { visit } from 'unist-util-visit';

const ASIDE_TYPES = ['doctrine', 'application', 'constraint', 'prohibition'];

const LABELS = {
  doctrine: 'Doctrine',
  application: 'Application',
  constraint: 'Constraint',
  prohibition: 'Prohibition',
};

const SHIELD_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 443.721 478.328" aria-hidden="true" class="aside-icon"><g transform="translate(-3.19)"><path fill="currentColor" d="m36.66 113.39c-.16 4.42-.25 8.84-.25 13.18 0 132.19 72.18 252.31 188.64 314.43 116.45-62.12 188.63-182.24 188.63-314.43 0-4.34-.08-8.76-.25-13.18-66.94-10.35-131.84-35.5-188.39-73.01-56.55 37.51-121.45 62.66-188.39 73.01m180.91 361.16c-63.44-31.98-117-80.73-154.86-140.97-38.94-61.93-58.52-133.52-58.52-207.01 0-9.54.36-19.29 1.07-28.97l1-13.59 13.53-1.67c70.42-8.72 138.45-34.89 196.74-75.67l9.52-6.66 9.53 6.66c58.29 40.78 126.32 66.95 196.74 75.67l13.52 1.67 1 13.6c.71 9.67 1.08 19.42 1.08 28.97 0 73.5-20.58 145.08-59.52 207.02-37.87 60.23-91.42 108.98-154.86 140.97l-7.48 3.77z"/><path fill="currentColor" d="m225.05 316.13-102.54-131.1 102.54-131.1 102.54 131.1zm0-316.13L80.33 185.03l144.72 185.03 144.72-185.03z"/></g></svg>';

export default function rehypeAsides() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      // Look for <aside class="aside aside-doctrine"> etc.
      if (
        node.tagName === 'aside' &&
        node.properties?.className?.some?.(c => ASIDE_TYPES.some(t => c === `aside-${t}`))
      ) {
        const typeClass = node.properties.className.find(c => ASIDE_TYPES.some(t => c === `aside-${t}`));
        const type = typeClass.replace('aside-', '');
        const label = LABELS[type];

        if (!label) return;

        // Check if title already injected (avoid double-processing)
        const firstChild = node.children?.[0];
        if (
          firstChild?.tagName === 'p' &&
          firstChild?.properties?.className?.includes?.('aside-title')
        ) {
          return;
        }

        // Inject title with shield icon as first child
        node.children.unshift({
          type: 'raw',
          value: `<p class="aside-title">${SHIELD_SVG} ${label}</p>`,
        });
      }
    });
  };
}
