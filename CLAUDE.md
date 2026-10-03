# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Instructions

Do not write any code unless instructed.

## Overview

A static personal portfolio site, live at https://alaklouk.com (deployed on Vercel from `main`). Plain HTML/CSS/JS: no build tooling, no package manager, no framework. The site is three flat files, `index.html`, `style.css`, `script.js`, plus `assets/` (fonts, media, favicon, OG image), `CV.pdf`, `robots.txt` and `sitemap.xml`. The flat layout was a deliberate choice; don't move files into `css/`/`js/` folders.

`.vercelignore` keeps development-only files (`CLAUDE.md`, `.claude/`) off the live site. Add new ones there.

## Remaining work

The site was rebuilt by hand to match a reference design in `../new site/`. `REDESIGN-PLAN.md` (gitignored, local only) holds the stage-by-stage plan (`[/]` = done, `[ ]` = to do). Stages 0–11 are done and live; Stage 12 (falling-sand hero), Stage 13 (polish) and Stage 14 (load performance) are not. The user builds these by hand as a learning exercise, so explain and review rather than implementing stages unless explicitly asked. The reference is a guide, not a spec.

Naming is BEM (`.block__element--modifier`, e.g. `.project__title`, `.btn--primary`, `.media__frame--wide`). JS hooks use a `js-` prefix (`.js-clock`, `.js-video`, `.js-copy`, `.js-footer-year`) and aren't styled.

## Commands

There is no build, lint, or test setup. To preview the site locally, serve the directory as static files:

```bash
python -m http.server 5501
```

(This matches the `static-site` config in `.claude/launch.json`, which the `preview_start` tool uses; `static-site-alt` is the same on port 5502.) Then open `http://localhost:5501`. The reference site is served from inside `../new site/` with `python -m http.server 5173`.

## Design system (`style.css` `:root`)

**Colour.** A warm-black neutral ramp plus a small set of accents, and nothing else:

- Neutrals: `--bg`, `--bg-2`, `--fg`, `--fg-2`, `--muted`.
- Lines: `--line` and `--line-strong` are `--fg` at 12% / 24% opacity, not separate greys. Structure comes from 1px lines at these two strengths, not from cards and backgrounds.
- Accents: `--sand` is the site accent (selection, focus rings, hovers, `<em>` highlights). `--scree`, `--latch`, `--ocean` are one per project. Don't add new base colours; derive variants with `color-mix()`.
- `--accent` is the per-component accent. It defaults to `--scree` in `:root`, and `.project.scree` / `.latch` / `.ocean` set it to their project colour. Everything inside a project (feature bullets, `.btn`, `.inline--link`, the `.media__frame` hover glow) reads `var(--accent)` rather than a hardcoded hue. Follow this pattern for anything that needs its own accent.

**Fonts.** Self-hosted Latin-subset `.woff2` files in `assets/fonts/`, declared with `@font-face` at the top of `style.css` and preloaded in `index.html`. Each has one job:

- `--font-display` (Bricolage Grotesque, variable weight): all content text.
- `--font-serif` (Instrument Serif, italic only): `<em>`, project kickers, `.row__sub`, `.contact__hello`. It uses `font-display: optional`, not `swap`, because the wider Georgia fallback wraps the hero tagline on phones and swapping later shifts the hero name.
- `--font-mono` (JetBrains Mono): only small labels (`.label`, `dt`, tech pills, skills headings, `.contact__btn`).

**Spacing.** `--space-3xs`/`2xs`/`xs` are fixed (4/8/12px); `--space-s` through `--space-3xl` are fluid `clamp()` values scaling between 375px and 1440px viewports. `--pad` (page edge padding) and `--gap` are aliases of `--space-m` and `--space-s`. `--measure` is the paragraph max width.

**Type.** `--text-xs` through `--text-4xl`, all fluid `clamp()` except `xs`. Headings use large sizes with tight/negative tracking; small labels use mono, uppercase, positive tracking. That scale contrast is the core of the look. Weights go through `--font-weight-normal/medium/semibold/bold`.

**Other tokens:** `--radius-s`, `--radius` (also read by `script.js` in the media-frame clip-path), `--radius-pill`, `--nav-h`, `--ease-out`.

## Base styles and global pieces

- Reset: `border-box` everywhere, margins zeroed on headings/`p`/`dl`/`dd`/`figure`, list styles removed, media `display: block`.
- `body::after` is a fixed full-screen film-grain overlay (inline SVG `feTurbulence`, ~5% opacity, `pointer-events: none`, `z-index: 100`).
- `::selection` and `:focus-visible` use `--sand`.
- `.skip` is a "Skip to work" link, first focusable element in `<body>`, pushed off-screen until focused.
- `.label` is the small mono uppercase label used across the page.

## Page structure (`index.html`)

- `header.nav`: fixed bar with brand, a live Gebze clock (hidden under 720px) and links to `#work`, `#about`, `#contact`. Gets `.scrolled` (blurred background) after 40px of scroll.
- `section.hero#top`: label, two-line `h1.hero__name`, tagline in `.hero__ground`.
- `div.below` wraps everything after the hero and draws the blueprint grid (see below). Inside it, in order: `.intro`, `#work` (three `article.project` blocks: Scree, Latch, The Deep Ocean), `.marquee`, `#about`, `.background` (education rows in a `dl.rows`, then `.skills`), `#contact`.
- `footer`: copyright year, clock, back-to-top link.

Each `.project` has `.project__head` (title, kicker) and `.project__body`, a 7fr/5fr grid of a `figure.media__frame` (Scree and Ocean are muted looping `.mp4` with `.webp` posters; Latch is a responsive `srcset` image) and `.project__info` (description, features, tech stack, links). Under 1024px the body is one column.

## JavaScript (`script.js`)

GSAP, ScrollTrigger and Lenis load from jsDelivr with `defer`. Every feature checks the library exists and respects `prefers-reduced-motion`, so the page works without them.

- **Lenis smooth scroll**, driven by `gsap.ticker` when GSAP is present, otherwise its own rAF loop. Clicks on `a[href^="#"]` go through `lenis.scrollTo` and move focus to the target.
- **Entrance animations:** `js-anim` on `<html>` (only added when GSAP and ScrollTrigger loaded) hides `[data-reveal]` elements, which `ScrollTrigger.batch` fades in. The intro statement is split into `.word` spans that brighten on scroll. Media frames get a clip-path reveal and a scroll-scrubbed scale. The hero name fades as you scroll past.
- **Blueprint grid:** `.below::before` is a faint static grid masked into patches; `.below::after` is a `--sand` grid revealed in a circle around the cursor. On hover-capable devices, JS writes `--mx`/`--my` (pointer position relative to `.below`) as inline styles on `.below` and toggles `.is-lit`. The JS and the CSS mask are coupled only through those properties; change one, check the other.
- **Marquee:** a CSS `scroll-left` animation; JS flips its direction to match the scroll direction.
- **Small widgets:** the clocks (`.js-clock`, Europe/Istanbul time, every 15s), videos that play only while on screen, the degree progress bar (computed from `data-start`/`data-end` on `.timeline`), the copy-email button and the footer year.
