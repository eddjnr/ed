# eddjnr

Personal portfolio built with SvelteKit, mdsvex, Tailwind CSS and Vite+.

## Requirements

- Vite+ (`vp`)
- Node.js managed through `vp env`

## Development

```sh
vp install
vp dev
```

## Quality checks

```sh
vp check
vp test
vp build
```

`vp check --fix` applies formatting and safe lint fixes.

## Content

Blog posts live in `src/content/blog` as Markdown files with this frontmatter:

```yaml
---
title: Post title
description: Short summary
date: "2026-03-28"
published: true
---
```

Project and career data are centralized in `src/lib/data`.

## Deployment

The site uses `@sveltejs/adapter-static`. Production output is written to `build` by `vp build`.
