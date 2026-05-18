# Personal Portfolio Website

A single-page portfolio for Varun — a CS undergrad building AI-powered apps and
secure systems. The site uses a hacker / matrix-terminal aesthetic: a fake boot
sequence, matrix rain, ambient generative audio, and scroll-driven motion.

It is fully static — no build step, no framework, no dependencies to install.
Open `index.html` and it runs.

## Tech Stack

- **HTML, CSS, vanilla JavaScript (ES modules)** — no framework
- **GSAP + ScrollTrigger** — scroll-triggered reveals and parallax (CDN)
- **Canvas 2D** — matrix-rain background
- **Web Audio API** — generative ambient drone + UI click/hover SFX
- **IntersectionObserver** — active-nav highlighting and section tracking
- **localStorage** — persists the sound on/off preference
- **Vercel** — hosting, Web Analytics, and Speed Insights

## Project Structure

```
index.html              Page markup + section containers
resume/index.html       /resume route — fires analytics event, redirects to the PDF
styles/terminal.css     All styling, animations, and responsive rules
scripts/terminal.js     Boot sequence, audio engine, matrix rain, GSAP, rendering
scripts/data/content.js Single source of truth for all page content
assets/                 Profile image + resume PDF
docs/site-plan.md       Design & architecture reference
vercel.json             Deploy config (framework: none)
```

## Editing Content

All experience, projects, tech stack, facts, stats, and contact links live in
`scripts/data/content.js`. Edit that file to update the site — the markup in
`index.html` is rendered from it at runtime.

## Running Locally

Any static server works, e.g.:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. (Opening `index.html` directly also works,
though a server is recommended so ES module imports load cleanly.)

## Deployment

Pushed to Vercel as a static site (`vercel.json` sets `framework: null`). No
build command — files are served as-is.
