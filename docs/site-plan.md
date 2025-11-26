# Portfolio Site Plan

## Narrative & Tone
- **Identity**: Computer science undergrad with a builder mindset, curious about systems and delightful UX.
- **Voice**: Confident but warm, mentor-friendly, curious; copy should be short, use action verbs.
- **Moodboard cues**: Modernist typography (e.g., Space Grotesk, Inter), thin neon accent (#7AF0FF) on charcoal/ivory.
- **Layout vibe**: Dynamic minimalism — lots of breathing room, staggered grids, micro-interactions.

## Page Structure
1. **Hero / Intro**
   - Animated background gradient or particle field that subtly reacts to pointer.
   - Headline: “Hi, I’m Varun — CS undergrad crafting human-centered systems”.
   - Subtext describing focus areas (system design, ML, creative tools).
   - CTA buttons: `View Resume`, `Contact`.
2. **Experience Timeline**
   - Split layout: left rail with dates, right rail cards with role, org, blurb, stack tags.
   - Scroll-triggered reveal (fade + translate).
3. **Projects Gallery**
   - Masonry or two-column grid with hover tilt/scale.
   - Include case-study modal or “open details” micro-page.
4. **Technical Stack**
   - Grouped badges: Languages, Frameworks, Tools.
   - Animated meter bars or orbiting icons showing depth.
5. **Skills & Impact**
   - Focus on outcomes (performance boosts, users reached).
6. **About + Values**
   - Personal story, fun facts, values (craft, curiosity, community).
7. **Contact / Footer**
   - Minimal contact card with email, socials, and subtle marquee / ticker with achievements.

## Animation/Interaction Ideas
- Hero gradient shifts with pointer velocity using CSS variables + motion blur.
- Section headers slide in with staggered spring animations (Framer Motion).
- Use intersection observers for timeline reveals.
- Hover states with 3D perspective and glassmorphism overlays on project cards.
- Theme toggle: default dark, optional light mode using CSS custom properties.

## Content Checklist
- Experiences: internships, research, leadership roles; include quantifiable wins.
- Projects: at least 3 flagship (deep case) + 3 quick hits.
- Skills: bucketed list with emphasis on CS foundations + design tooling.
- Testimonials or quotes (professors, teammates) if available.

## Figma Tips
- Create an 8px baseline grid, use 12-column layout at 1440px.
- Export reusable components: cards, buttons, badges, timeline nodes.
- Prototype micro-interactions to handoff easing curves (use 450ms cubic-bezier for hero, 220ms for UI).

