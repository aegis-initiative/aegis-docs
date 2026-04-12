# Components

Local Astro components for aegis-docs. Shared UI primitives live in the
`@aegis-initiative/design-system` package and should be imported from there:

```astro
import Header from '@aegis-initiative/design-system/components/Header.astro';
import AegisLogo from '@aegis-initiative/design-system/components/AegisLogo.astro';
import AegisWordmark from '@aegis-initiative/design-system/components/AegisWordmark.astro';
import Search from '@aegis-initiative/design-system/components/Search.astro';
```

## What stays local

Components in this directory are either:

- site-specific wrappers around a shared component (e.g. `Header.astro` wraps
  the design-system `Header`)
- not yet migrated to the design system (e.g. `Aside`, `PrevNext`, `Footer`,
  `Sidebar`, `TableOfContents`, `Breadcrumb`)

New shared primitives should be added to the design-system package first and
consumed here, not duplicated locally.
