# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A static personal portfolio site — plain HTML/CSS/JS, no build tooling, no package manager, no framework. Three files make up the whole site: `index.html`, `style.css`, `script.js`.

## Commands

There is no build, lint, or test setup. To preview the site locally, serve the directory as static files, e.g.:

```bash
python -m http.server 5501
```

(This matches the `static-site` config in `.claude/launch.json`, which the `preview_start` tool uses.) Then open `http://localhost:5501`.

## Architecture

**`style.css`** defines a small design-token system in `:root`:
- Spacing scale: `--space-1` through `--space-7`.
- Color palette: `--bg`, `--surface`, `--line`, `--ink`, `--muted` are the only "stated" colors (see the comment above the palette block); `--ink-2` is derived from them via `color-mix`. Don't add new base colors outside this set — extend via `color-mix` the way `--ink-2` does.
- Five "state" hues (`--state-drift`, `--state-sand`, `--state-signal`, `--state-depth`, `--state-resolve`) are the entire accent-color vocabulary. Each `.project` block sets a local `--accent-color` custom property to one of these (see `.project.scree`, `.project.latch`, `.project.ocean`), and everything inside that project (`h3`, links, buttons) inherits from `--accent-color` rather than hardcoding a hue. Follow this pattern when adding a new project or section that needs its own accent.
- Type scale: `--text-size-1/2/3` with a shared `--text-ratio`.

**Interactive grid background**: `script.js` tracks `clientX`/`clientY` (mousemove) and `scroll` (scroll position), and writes them to CSS custom properties `--mx`/`--my` on `document.documentElement`. `.grid-bg` in `style.css` uses these in a `mask-image: radial-gradient(... at var(--mx) var(--my) ...)` to make the background grid fade in around the cursor. If you change one side (the JS coordinate calc or the CSS mask), check the other — they're coupled only through these two custom properties.

**`index.html`** is a single page with four sections (`#hero`, `#projects`, `#about`, `#contact`) linked from the nav. Each `.project` entry follows a fixed shape: `.project-text` (h3, description, `.project-links` with `.btn`/`.btn.primary` links) plus a `.project-image`. Several links are intentional placeholders (`href="#"` for "Case study" links) — leave them as-is unless asked to fill them in.
