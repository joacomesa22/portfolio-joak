---
name: Stay within requested scope
description: Do not upgrade or change dependencies beyond what the user explicitly asked for
type: feedback
---

Only upgrade/change what the user explicitly asks for. Do not upgrade adjacent dependencies (e.g., upgrading Tailwind when asked to upgrade Astro).

**Why:** User was frustrated when Tailwind was upgraded to v4 alongside an Astro upgrade they requested. It introduced unwanted breaking changes.

**How to apply:** When upgrading a package, keep all other dependencies at their current major versions unless they are strictly incompatible. Ask before making additional upgrades.
