<p align="center">
  <img src="https://img.shields.io/badge/ip--owner-Finnoybu%20IP%20LLC-blueviolet?style=flat-square" alt="IP Owner">
  <a href="https://github.com/aegis-initiative"><img src="https://img.shields.io/badge/org-aegis--initiative-0084e7?style=flat-square&logo=github" alt="Org"></a>
  <a href="https://aegis-docs.com"><img src="https://img.shields.io/badge/domain-aegis--docs.com-0084e7?style=flat-square" alt="Domain"></a>
  <img src="https://img.shields.io/badge/visibility-public-lightgrey?style=flat-square" alt="Public">
</p>

<p align="center">
  <img src="assets/AEGIS_logo_aegis-docs.svg" width="80" alt="AEGIS Docs">
</p>

<p align="center">
  <strong>aegis-docs</strong><br>
  The public AEGIS™ documentation site — built with Astro, hosted at aegis-docs.com
</p>

---

## Overview

`aegis-docs` is the public-facing documentation site for the AEGIS™ ecosystem, deployed at [aegis-docs.com](https://aegis-docs.com). It is the primary reference for developers, operators, researchers, and anyone building with or learning about AEGIS™.

> **Capability without constraint is not intelligence™**

---

## What's Here

| Section | Content |
|---|---|
| **Architecture** | System overview, reference architecture, governance runtime design |
| **Constitution** | The AEGIS Constitution — rendered and versioned |
| **Protocol (AGP-1)** | AEGIS Governance Protocol specification |
| **Threat Model (ATM-1)** | Security analysis and threat actor profiles |
| **Federation (GFN-1)** | Governance Federation Network design |
| **API Reference** | Platform API documentation |
| **SDK Reference** | TypeScript and Python SDK documentation |
| **Guides** | Integration guides, operator guides, onboarding materials |
| **RFCs** | Open RFC specifications |

---

## Built With

- **[Astro](https://astro.build/)** with [Starlight](https://starlight.astro.build/) theme
- Content authored in Markdown / MDX
- Deployed to [aegis-docs.com](https://aegis-docs.com)

---

## Contributing to Docs

Documentation contributions are welcome. All content lives in `src/content/`. Navigation is configured in `astro.config.mjs`.

Guidelines:
- All content in Markdown or MDX — no hand-edited HTML
- New pages require a navigation entry in `astro.config.mjs`
- All changes via pull request with 1 required review

---

## Related Repositories

| Repo | Relationship |
|---|---|
| [aegis-constitution](https://github.com/aegis-initiative/aegis-constitution) | Charter content rendered by this site |
| [aegis-core](https://github.com/aegis-initiative/aegis-core) | Protocol and architecture docs sourced from here |
| [aegis-platform](https://github.com/aegis-initiative/aegis-platform) | API docs sourced from here |
| [aegis-sdk](https://github.com/aegis-initiative/aegis-sdk) | SDK reference docs sourced from here |

---

## License & Trademark

Licensed under the [Apache License 2.0](LICENSE).

AEGIS™ and **"Capability without constraint is not intelligence™"** are trademarks of **Finnoybu IP LLC**.
