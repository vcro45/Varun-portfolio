# Copilot Instructions: Varun's Portfolio

## Architecture Overview

This is a **framework-free portfolio website** with terminal/cyberpunk theming, smooth animations, and cinematic effects. The architecture prioritizes vanilla JavaScript modularity, GSAP animations, and performance.

### Key Components

- **index.html**: Main entry point with terminal-themed UI, boot sequence, and matrix-style background
- **scripts/terminal.js**: Primary application logic with ambient sound system, GSAP scroll animations, and interactive components
- **scripts/app.js**: Secondary application variant with stellar/particle background effects
- **scripts/data/content.js**: Single source of truth for all portfolio content (experiences, projects, tech stack, contact info)
- **styles/terminal.css**: Primary theme with liquid glass effects, 3D transforms, and matrix aesthetics
- **src/**: Mirror structure of scripts/styles for potential future refactoring

### Critical Patterns

#### Content Management
All content updates happen in [scripts/data/content.js](scripts/data/content.js) or [src/data/content.js](src/data/content.js). Never hardcode content in HTML or JS files. Export structured objects:
```javascript
export const experience = [{ role, org, timeframe, summary, stack }, ...]
export const projects = [{ name, blurb, highlight }, ...]
```

#### Animation Philosophy
- GSAP (loaded via CDN) drives all complex animations
- IntersectionObserver triggers scroll-based reveals
- Prefer `gsap.fromTo()` with explicit start/end states
- Staggered animations use sequential promises or GSAP timelines
- Check `prefersReducedMotion` before initializing animations

#### Boot Sequence Pattern
[index.html](index.html) includes a terminal boot screen (`#boot-screen`) that:
1. Shows ASCII art and simulated system logs
2. Animates boot lines with staggered delays via `data-delay` attributes
3. Progress bar fills over ~2.3s
4. Fades out when user presses any key or automatically after completion
5. Implemented in [scripts/terminal.js](scripts/terminal.js)

#### Ambient Sound System
[scripts/terminal.js](scripts/terminal.js#L11-L160) implements a Web Audio API-based ambient soundscape:
- Layered oscillators (sub bass, pad, shimmer) create atmospheric drone
- User preference persisted in `localStorage.soundEnabled`
- Toggle button `#sound-toggle` shows muted/unmuted state
- Always check `this.audioContext.state` and resume if suspended

## Development Workflow

### Local Development
```bash
# Serve the site (no build step required)
npx serve .
# or
python3 -m http.server
```
Open `http://localhost:8000`. Hot reload requires browser refresh.

### Deployment
Site is deployed to Vercel as a static site:
- **vercel.json** is minimal: `{"framework": null}`
- Root directory serves all files
- No build command needed
- Deploy via: `vercel --prod` or push to connected Git repo

### File Organization
- Dual structure exists: `scripts/` and `src/scripts/`, `styles/` and `src/styles/`
- Active files are in root `scripts/` and `styles/` directories
- `src/` contains alternate implementations (e.g., [src/scripts/experience.react.js](src/scripts/experience.react.js) is unused)
- When editing, modify files in root directories unless specifically targeting `src/` variants

## Project-Specific Conventions

### CSS Custom Properties
Terminal theme uses extensive CSS variables in `:root`:
```css
--bg-terminal, --bg-card, --glass-bg, --glass-border
--green, --green-dim, --green-bright, --green-glow
```
All color changes should update these variables, not individual selectors.

### Rendering Pattern
Dynamic content rendering follows this structure:
```javascript
const renderExperience = () => {
  const timeline = qs('#experience-timeline');
  if (!timeline) return;
  experience.forEach((item, index) => {
    const card = document.createElement('article');
    card.className = 'timeline-card';
    // ... populate innerHTML
    timeline.appendChild(card);
  });
};
```
Always check for element existence before rendering.

### Scroll Effects Integration
When adding scroll-triggered animations:
1. Use GSAP's ScrollTrigger plugin (loaded via CDN)
2. Integrate with Lenis smooth scroll if available
3. Sync with `ScrollTrigger.update()` on scroll events
4. Example in [scripts/app.js](scripts/app.js#L114-L129)

### Canvas Background Pattern
Background particle effects use multi-canvas layering:
- `#matrix-bg` for matrix rain effect (terminal theme)
- Separate canvases for static stars, drift particles, fast-moving starfield (app.js variant)
- Use offscreen buffer canvas for static elements
- Handle window resize with proper DPI scaling

## Testing & Validation

- Test boot sequence by forcing reload with Cmd+Shift+R
- Verify sound toggle persists across page refreshes
- Check scroll animations work at different viewport heights
- Test responsiveness: mobile (375px), tablet (768px), desktop (1440px+)
- Validate all links in [scripts/data/content.js](scripts/data/content.js) contactLinks array

## Common Gotchas

1. **Module imports**: Use relative paths like `'./data/content.js'` or `'../data/content.js'`
2. **GSAP availability**: Always check `if (window.gsap)` before using GSAP features
3. **Audio context**: Browsers block audio until user interaction; handle suspended state
4. **Canvas DPI**: Multiply canvas dimensions by `window.devicePixelRatio` for retina displays
5. **Lenis smooth scroll**: Check `if (window.Lenis)` before instantiating
6. **Dual content files**: `scripts/data/content.js` and `src/data/content.js` may drift out of sync

## Editing Checklist

- [ ] Update content in [scripts/data/content.js](scripts/data/content.js)
- [ ] Maintain terminal/matrix theme consistency (green accents, monospace fonts)
- [ ] Preserve performance (avoid heavy DOM operations in scroll handlers)
- [ ] Test with sound on/off
- [ ] Verify boot sequence still works
- [ ] Check motion preferences respected
- [ ] Validate no console errors in browser DevTools

## Design Language

- **Typeface**: JetBrains Mono (monospace), loaded from Google Fonts
- **Color palette**: Matrix green (#00ff41), dark backgrounds (#050505), glowing accents
- **Effects**: Liquid glass, scanlines, glitch layers, particle systems, 3D card tilts
- **Interaction**: Terminal prompts ($ cat, $ whoami), command-line aesthetics
- **Animation timing**: ~750ms for card reveals, ~2.3s for boot sequence
