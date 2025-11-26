# Portfolio Website

This repository hosts a lightweight, animation-friendly portfolio for showcasing your CS experience, projects, and skills. It is intentionally framework-free so it can be deployed as static files or dropped into any hosting setup.

## Quick Start

```bash
# Serve locally with any static server
npx serve .
# or use python
python3 -m http.server
```

Open `http://localhost:8000` (or the port provided) to preview the site.

## Customize Content
- Update copy and hero text directly in `index.html`.
- Edit experiences, projects, skills, and quick facts in `src/data/content.js`.
- Adjust styling, colors, and animations in `src/styles/main.css`.

## Design Notes
- Layout uses CSS custom properties for theming and glassmorphism cards.
- Animations rely on `IntersectionObserver` and pointer-reactive hero gradients.
- Theme toggle stores preference in `localStorage`.

## Next Steps
- Translate this layout into Figma using the plan in `docs/site-plan.md`.
- Replace placeholder links (resume, socials, email) with real destinations.
- Add analytics or contact form if needed (Netlify Forms, Formspree, etc.).

## Deploy to Vercel
1. **Push to Git**: Commit these files to a GitHub/GitLab repo.
2. **Create project**: In the [Vercel dashboard](https://vercel.com/new), import the repository. Vercel auto-detects the root.
3. **Configure build**:
   - Framework preset: `Other`.
   - Build command: _leave empty_ (static site).
   - Output directory: `.` (the repo root).
4. **Deploy**: Click deploy; the included `vercel.json` ensures every path serves the static file bundle.

### CLI alternative
```bash
npm install -g vercel
vercel login
vercel --prod
```
Accept the defaults (project name, root `.`). Each push/`vercel --prod` redeploys automatically.
