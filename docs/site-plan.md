# Site Design & Architecture Reference

> This documents the site **as built**. The original draft of this file
> described an early, abandoned concept (light/charcoal theme, Framer Motion,
> Next.js); the project shipped a different direction and this file now reflects
> reality.

## Concept

A terminal / "hacker rig" persona. The whole page is framed as a machine the
visitor boots into and explores. Copy uses shell-command framing
(`$ whoami`, `cat experience.log`, `ls ~/projects`) to carry the theme without
needing a literal interactive terminal.

## Visual Language

- **Palette**: near-black background (`#050505`) with a single phosphor-green
  accent family (`--green` `#00ff41` → `--green-bright` `#39ff14`). No second
  hue. All variables live in `:root` in `styles/terminal.css`.
- **Type**: JetBrains Mono everywhere — monospace is the whole identity.
- **Surfaces**: liquid-glass cards — translucent dark green gradients,
  `backdrop-filter: blur()`, subtle inner highlight, green border that brightens
  on hover.
- **Depth**: cards tilt in 3D on pointer move; sections reveal with GSAP on
  scroll; glow orbs parallax behind the content.
- **Dark only.** No theme toggle. `color-scheme: dark` is fixed.

## Page Flow

1. **Boot screen** — ASCII logo, fake kernel log, progress bar. Auto-completes
   in ~3s; any key or click skips it.
2. **Hero** — `$ whoami`, name, typewriter tagline, lede, resume/contact CTAs,
   stat row, and a glitch-effect profile image.
3. **Experience** — `cat experience.log`; glass timeline cards from data.
4. **Projects** — `ls ~/projects`; grid of cards with a hover decrypt/scramble
   text effect.
5. **Stack** — `cat tech_stack.json`; grouped skill columns.
6. **About** — `cat readme.md`; bio panel + `status.log` quick-facts panel.
7. **Contact** — `./contact --help`; links card.
8. **Footer** — year + "all systems operational".

## Interaction Inventory

- Boot sequence (skippable)
- Canvas matrix rain background
- Generative ambient audio engine + click/hover SFX, mute persisted to
  `localStorage` (`#sound-toggle`)
- GSAP ScrollTrigger reveals + orb parallax
- 3D pointer tilt on cards
- Magnetic buttons
- Custom cursor (fine-pointer devices only)
- Scroll-progress pill that renames itself per section
  (`init_varun.exe` → `experience.log` → …)
- IntersectionObserver active-nav highlighting
- Hover text-scramble ("decrypt") on project cards
- Hero image glitch burst on hover

## Architecture Notes

- **Content is data-driven.** `scripts/data/content.js` is the single source of
  truth; `scripts/terminal.js` renders every section from it into empty
  containers in `index.html`. Add/edit content there only.
- **No build.** Static files; GSAP loaded via CDN. `vercel.json` sets
  `framework: null`.
- **`/resume`** is a tiny HTML redirect that fires a `resume_download`
  analytics event before sending the user to `assets/SWE.pdf`.

## Accessibility / Performance

- `prefers-reduced-motion` kills animations and hides the heaviest decorative
  layers (scanlines, grid, orbs).
- Custom cursor and tilt are gated to fine pointers.
- Matrix rain runs on a throttled interval; keep an eye on it if adding more
  canvas work.

## Possible Next Steps

- Project case-study detail pages / modals.
- Lazy-init or pause the matrix canvas when offscreen / tab hidden.
- Keyboard navigation pass for the nav pill and skip-to-content.
