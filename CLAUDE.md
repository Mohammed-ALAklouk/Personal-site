# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Instructions

Do not write any code unless instructed.

## Overview

A static personal portfolio site: plain HTML/CSS/JS, no build tooling, no package manager, no framework. The site is three flat files, `index.html`, `style.css`, `script.js`, plus media in `assets/media/`. The flat layout was a deliberate choice; don't move files into `css/`/`js/` folders.

## Redesign in progress

The `redesign` branch is a hand-built rebuild of the site to match a reference design in `../new site/`. `REDESIGN-PLAN.md` holds the stage-by-stage plan (`[/]` = done, `[ ]` = to do). The user is building it by hand as a learning exercise, so explain and review rather than implementing stages unless explicitly asked.

- **Stage 1 (foundations) is done.** Stages 2 onward are not, so most of `index.html` and the section/header/project CSS is still the old design and will be replaced.
- **Naming:** BEM (`.block__element--modifier`, e.g. `.project__title`, `.btn--solid`) was chosen for new work. Existing old-design classes (`.project-text`, `.header-link`, etc.) haven't been converted yet.
- Code that isn't in the reference (the current `.grid-bg`, `--space-*` scale) can differ from it; the reference is a guide, not a spec.

## Commands

There is no build, lint, or test setup. To preview the site locally, serve the directory as static files:

```bash
python -m http.server 5501
```

(This matches the `static-site` config in `.claude/launch.json`, which the `preview_start` tool uses.) Then open `http://localhost:5501`. The reference site is served from inside `../new site/` with `python -m http.server 5173`.

## Design system (`style.css` `:root`)

**Colour.** A warm-black neutral ramp plus a small set of accents, and nothing else:

- Neutrals: `--bg`, `--bg-2`, `--bg-3`, `--fg`, `--fg-2`, `--muted`.
- Lines: `--line` and `--line-strong` are `--fg` at 12% / 24% opacity, not separate greys. Structure comes from 1px lines at these two strengths, not from cards and backgrounds.
- Accents: `--sand` is the site accent (selection, focus rings, hovers). `--scree`, `--latch`, `--ocean` are one per project. Don't add new base colours; derive variants with `color-mix()`.
- `--accent` is the per-component accent. It defaults to `--scree` in `:root`; `.project` resets it to `--sand`, and `.project.scree` / `.latch` / `.ocean` set it to their project colour. Everything inside a project (h3, `.btn`) reads `var(--accent)` rather than a hardcoded hue. Follow this pattern for anything that needs its own accent.

**Fonts.** Loaded from Google Fonts in `index.html`. Each has one job:

- `--font-display` (Bricolage Grotesque, variable `opsz`/`wght`): all content text.
- `--font-serif` (Instrument Serif): only for `<em>`, which is styled serif at weight 400.
- `--font-mono` (JetBrains Mono): only for small labels (`.label`, `dt`).

**Spacing.** `--space-3xs`/`2xs`/`xs` are fixed (4/8/12px); `--space-s` through `--space-3xl` are fluid `clamp()` values scaling between 375px and 1440px viewports. `--pad` (page edge padding) and `--gap` are aliases of `--space-m` and `--space-s`. `--measure` is the paragraph max width.

**Type.** `--text-xs` through `--text-4xl`, all fluid `clamp()` except `xs`. Headings use large sizes with tight/negative tracking; small labels use mono, uppercase, positive tracking. That scale contrast is the core of the look. Weights go through `--font-weight-normal/medium/semibold/bold`.

**Other tokens:** `--radius-s`/`--radius-m`/`--radius`, `--nav-h`, `--ease-out`.

## Base styles and global pieces

- Reset: `border-box` everywhere, margins zeroed on headings/`p`/`dl`/`dd`/`figure`, list styles removed, media `display: block`.
- `body::after` is a fixed full-screen film-grain overlay (inline SVG `feTurbulence`, ~5% opacity, `pointer-events: none`, `z-index: 100`).
- `::selection` and `:focus-visible` use `--sand`.
- `.skip` is a "Skip to projects" link, first focusable element in `<body>`, hidden off-screen until focused.
- `.link` is the underlined uppercase text link used in Contact; `.link.email` is the large email variant.

## JavaScript (`script.js`)

- **Lenis smooth scroll** (loaded from unpkg in `index.html`), driven by its own `requestAnimationFrame` loop. Clicks on `a[href^="#"]` are intercepted and routed through `lenis.scrollTo`.
- **Interactive grid background:** tracks `clientX`/`clientY` (mousemove) and `scrollY` (scroll) and writes them to `--mx`/`--my` on `document.documentElement`. `.grid-bg` uses these in a `mask-image: radial-gradient(... at var(--mx) var(--my) ...)` so the grid fades in around the cursor. The JS calc and the CSS mask are coupled only through those two properties; change one, check the other. This is the old implementation and is slated to be replaced in Stage 10.

## Page structure (`index.html`)

Current sections, in order: `#hero`, `#projects`, `#background`, `#skills`, `#about`, `#contact`, all linked from the header nav. Each `.project` currently has `.project-text` (h3, description, feature list, tech stack, `.project-links` with `.btn`/`.btn.primary`) plus a `.project-image` using the `.webp` posters in `assets/media/`. The `.mp4` files are there for the Stage 5 media windows but not used yet.

Placeholder links (`href="#"` for "Case study" and CV) are intentional; leave them as they are unless asked.
