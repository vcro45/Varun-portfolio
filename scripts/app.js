// Stellar Nexus motion + data
import { experience, projects, techStack, quickFacts, heroStats, contactLinks } from '../data/content.js';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const qs = (selector, ctx = document) => ctx.querySelector(selector);
const qsa = (selector, ctx = document) => Array.from(ctx.querySelectorAll(selector));

const renderHeroStats = () => {
  const container = qs('#hero-stats');
  if (!container) return;
  heroStats.forEach((stat) => {
    const card = document.createElement('article');
    card.className = 'stat';
    card.innerHTML = `
      <strong>${stat.value}</strong>
      <p>${stat.label}</p>
      ${stat.detail ? `<p class="muted">${stat.detail}</p>` : ''}
    `;
    container.appendChild(card);
  });
};

// Quick warp streak pulse for section transitions.
const flashWarp = () => {
  const streak = qs('.warp-streak') || (() => {
    const el = document.createElement('div');
    el.className = 'warp-streak';
    document.body.appendChild(el);
    return el;
  })();

  if (!window.gsap) return;
  gsap.fromTo(
    streak,
    { opacity: 0, xPercent: -40 },
    { opacity: 0.6, xPercent: 40, duration: 0.35, ease: 'power2.out', onComplete: () => (streak.style.opacity = '0') },
  );
};
const renderExperience = () => {
  const timeline = qs('#experience-timeline');
  if (!timeline) return;
  experience.forEach((item, index) => {
    const side = index % 2 === 0 ? 'left' : 'right';
    const card = document.createElement('article');
    card.className = 'timeline-card';
    card.dataset.side = side;
    card.innerHTML = `
      <p class="timeframe">${item.timeframe}</p>
      <h3>${item.role}</h3>
      <p class="org">${item.org}</p>
      <p class="body-text">${item.summary}</p>
      <div class="tags">${item.stack.map((tech) => `<span class="tag">${tech}</span>`).join('')}</div>
    `;
    timeline.appendChild(card);
  });
};

const renderProjects = () => {
  const grid = qs('#projects-grid');
  if (!grid) return;
  const icons = ['🤖', '🔌', '📊', '✨'];
  projects.forEach((proj, index) => {
    const card = document.createElement('article');
    card.className = 'project-card';
    const categoryMatch = proj.blurb.match(/^([^<]+)<br>/);
    const category = categoryMatch ? categoryMatch[1] : 'Project';
    const description = proj.blurb.replace(/^[^<]+<br>/, '');
    card.innerHTML = `
      <div class="project-card-image">${icons[index % icons.length]}</div>
      <div class="project-card-content">
        <p class="eyebrow">${category}</p>
        <h3>${proj.name}</h3>
        <p class="body-text">${description}</p>
        <p class="highlight">${proj.highlight}</p>
      </div>
    `;
    grid.appendChild(card);
  });
};

const renderStack = () => {
  const columns = qs('#stack-columns');
  if (!columns) return;
  Object.entries(techStack).forEach(([group, skills]) => {
    const card = document.createElement('article');
    card.className = 'stack-card';
    card.innerHTML = `
      <div class="orbit-ring"></div>
      <div class="orbit-glow"></div>
      <p class="eyebrow">${group}</p>
      <h3>${group === 'Tools' ? 'Workflow' : group}</h3>
      <ul>${skills.map((skill) => `<li>${skill}</li>`).join('')}</ul>
    `;
    columns.appendChild(card);
  });
};

const renderQuickFacts = () => {
  const list = qs('#quick-facts');
  if (!list) return;
  quickFacts.forEach((fact) => {
    const li = document.createElement('li');
    li.textContent = fact;
    list.appendChild(li);
  });
};

const renderContactLinks = () => {
  const container = qs('#contact-links');
  if (!container) return;
  contactLinks.forEach((link) => {
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.label;
    a.target = link.href.startsWith('http') ? '_blank' : '_self';
    if (a.target === '_blank') {
      a.rel = 'noreferrer noopener';
    }
    container.appendChild(a);
  });
};

const initLenis = () => {
  if (prefersReducedMotion.matches || !window.Lenis) return null;
  const lenis = new Lenis({
    lerp: 0.12,
    smoothWheel: true,
    smoothTouch: false,
  });

  // Keep ScrollTrigger timelines in sync with the virtual scroll position.
  lenis.on('scroll', () => {
    if (window.ScrollTrigger) ScrollTrigger.update();
  });

  const raf = (time) => {
    lenis.raf(time * 1000);
  };

  if (window.gsap) {
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
  } else {
    const loop = (time) => {
      raf(time / 1000);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  return lenis;
};

const handleAnchorScroll = (lenisInstance) => {
  qsa('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const el = qs(targetId);
      if (!el) return;
      event.preventDefault();
      if (lenisInstance) {
        lenisInstance.scrollTo(el, { offset: -40 });
      } else {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
};

// Stellar Nexus cosmic canvases: micro stars, drifting nebula dust, fast starfield.
const initCosmicCanvases = (lenis) => {
  if (prefersReducedMotion.matches) return;
  const staticCanvas = qs('#stars-static');
  const particleCanvas = qs('#particles-layer');
  const starfieldCanvas = qs('#starfield-fast');
  if (!staticCanvas || !particleCanvas || !starfieldCanvas) return;

  const dpi = window.devicePixelRatio || 1;
  const staticCtx = staticCanvas.getContext('2d');
  const particleCtx = particleCanvas.getContext('2d');
  const starfieldCtx = starfieldCanvas.getContext('2d');

  let width = window.innerWidth * dpi;
  let height = window.innerHeight * dpi;
  let lastScroll = 0;
  const pointer = { x: 0, y: 0 };

  const staticStars = [];
  const driftParticles = [];
  const fastStars = [];
  let staticBuffer = null;
  let staticBufferCtx = null;

  const resize = () => {
    width = window.innerWidth * dpi;
    height = window.innerHeight * dpi;
    [staticCanvas, particleCanvas, starfieldCanvas].forEach((c) => {
      c.width = width;
      c.height = height;
      c.style.width = `${window.innerWidth}px`;
      c.style.height = `${window.innerHeight}px`;
    });

    staticBuffer = document.createElement('canvas');
    staticBuffer.width = width;
    staticBuffer.height = height;
    staticBufferCtx = staticBuffer.getContext('2d');

    staticStars.length = 0;
    for (let i = 0; i < 320; i += 1) {
      staticStars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.2 + 0.3,
        alpha: 0.25 + Math.random() * 0.3,
        flicker: Math.random() * 0.15,
        seed: Math.random() * Math.PI * 2,
      });
    }

    driftParticles.length = 0;
    for (let i = 0; i < 110; i += 1) {
      driftParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 1.6 + 0.8,
        tint: Math.random() < 0.5 ? '78,164,255' : '180,160,255',
      });
    }

    fastStars.length = 0;
    for (let i = 0; i < 140; i += 1) {
      fastStars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: 0.8 + Math.random() * 1.6,
        size: Math.random() * 1.2 + 0.4,
      });
    }

    drawStatic(0);
  };

  const drawStatic = (time) => {
    if (!staticBufferCtx) return;
    staticBufferCtx.clearRect(0, 0, width, height);
    staticStars.forEach((s) => {
      const flicker = Math.sin(time * 0.001 + s.seed) * s.flicker;
      const alpha = Math.max(0, s.alpha + flicker);
      staticBufferCtx.beginPath();
      staticBufferCtx.fillStyle = `rgba(255,255,255,${alpha})`;
      staticBufferCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      staticBufferCtx.fill();
    });

    staticCtx.clearRect(0, 0, width, height);
    staticCtx.drawImage(staticBuffer, 0, 0);
  };

  const render = (time = 0) => {
    const currentScroll = lenis?.scroll || window.scrollY;
    const scrollDelta = currentScroll - lastScroll;
    lastScroll = currentScroll;

    drawStatic(time);

    particleCtx.clearRect(0, 0, width, height);
    driftParticles.forEach((p) => {
      p.x += p.vx + pointer.x * 1.5;
      p.y += p.vy + pointer.y * 1.5 + scrollDelta * 0.04;
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;
      particleCtx.beginPath();
      particleCtx.fillStyle = `rgba(${p.tint},0.38)`;
      particleCtx.arc(p.x, p.y, p.size * dpi, 0, Math.PI * 2);
      particleCtx.fill();
    });

    starfieldCtx.clearRect(0, 0, width, height);
    fastStars.forEach((s) => {
      s.x -= (s.speed + scrollDelta * 0.4) * dpi;
      s.y += pointer.y * 5;
      if (s.x < 0) s.x = width;
      if (s.x > width) s.x = 0;
      if (s.y < 0) s.y = height;
      if (s.y > height) s.y = 0;
      starfieldCtx.beginPath();
      starfieldCtx.fillStyle = 'rgba(255,255,255,0.9)';
      starfieldCtx.arc(s.x, s.y, s.size * dpi, 0, Math.PI * 2);
      starfieldCtx.fill();
    });

    requestAnimationFrame(render);
  };

  document.addEventListener('pointermove', (event) => {
    pointer.x = (event.clientX / window.innerWidth - 0.5) * 0.08;
    pointer.y = (event.clientY / window.innerHeight - 0.5) * 0.08;
  });

  window.addEventListener('resize', resize);
  resize();
  render();
};

// Cursor-reactive parallax with scroll-driven offsets for layered depth.
const initParallaxLayers = () => {
  const hero = qs('.hero');
  if (!hero || prefersReducedMotion.matches) return;
  const heroLayers = qsa('[data-depth]', hero);
  const bgLayers = qsa('.cosmic-bg [data-depth]');
  let pointerX = 0;
  let pointerY = 0;
  let currentX = 0;
  let currentY = 0;

  document.addEventListener('pointermove', (event) => {
    pointerX = event.clientX / window.innerWidth - 0.5;
    pointerY = event.clientY / window.innerHeight - 0.5;
    const rect = hero.getBoundingClientRect();
    hero.style.setProperty('--cursor-x', `${event.clientX - rect.left}px`);
    hero.style.setProperty('--cursor-y', `${event.clientY - rect.top}px`);
  });

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray(heroLayers).forEach((layer) => {
      const depth = Number(layer.dataset.depth || 0);
      gsap.to(layer, {
        y: () => depth * -80,
        ease: 'none',
        force3D: true,
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
          toggleActions: 'play none none none',
        },
      });
    });

    bgLayers.forEach((layer) => {
      const depth = Number(layer.dataset.depth || 0.03);
      gsap.to(layer, {
        y: () => depth * -120,
        ease: 'none',
        force3D: true,
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
          toggleActions: 'play none none none',
        },
      });
    });
  }

  const render = () => {
    currentX += (pointerX - currentX) * 0.06;
    currentY += (pointerY - currentY) * 0.06;
    heroLayers.forEach((layer) => {
      const depth = Number(layer.dataset.depth || 0);
      layer.style.transform = `translate3d(${currentX * depth * 100}px, ${currentY * depth * 100}px, 0)`;
    });
    bgLayers.forEach((layer) => {
      const depth = Number(layer.dataset.depth || 0.04);
      layer.style.transform = `translate3d(${currentX * depth * 130}px, ${currentY * depth * 120}px, 0)`;
    });
    requestAnimationFrame(render);
  };

  render();
};


// Masked headline + CTA entrance on load.
const initHeroReveal = () => {
  if (prefersReducedMotion.matches || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const heroTimeline = gsap.timeline({ defaults: { ease: 'expo.out' } });
  heroTimeline
    .from('.nav', { y: -20, autoAlpha: 0, duration: 0.8 }, 0)
    .from('[data-animate="mask"] span', { yPercent: 120, autoAlpha: 0, stagger: 0.08, duration: 1.2, force3D: true }, 0.1)
    .from('.lede', { y: 24, autoAlpha: 0, duration: 0.9, force3D: true }, 0.3)
    .from('.hero-cta .button', { y: 14, autoAlpha: 0, stagger: 0.1, duration: 0.7, force3D: true }, 0.45)
    .from('.stat', { y: 16, autoAlpha: 0, stagger: 0.08, duration: 0.8, force3D: true }, 0.5);

  gsap.to('.hero-orb', { y: '+=26', duration: 8, yoyo: true, repeat: -1, ease: 'sine.inOut' });
};

// Scroll-triggered reveals for sections, cards, and grids.
const initScrollAnimations = () => {
  if (prefersReducedMotion.matches || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const maskTitles = qsa('.section-title[data-animate="mask"] span');
  maskTitles.forEach((title) => {
    gsap.from(title, {
      yPercent: 120,
      autoAlpha: 0,
      duration: 1,
      ease: 'expo.out',
      force3D: true,
      immediateRender: false,
      scrollTrigger: {
        trigger: title.closest('.section'),
        start: 'top 80%',
        toggleActions: 'play none none none',
        once: true,
        onEnter: flashWarp,
      },
    });
  });

  qsa('.timeline-card').forEach((card, index) => {
    const direction = card.dataset.side === 'left' ? -1 : 1;
    gsap.from(card, {
      x: direction * 120,
      autoAlpha: 0,
      duration: 1,
      ease: 'power3.out',
      force3D: true,
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none none',
        once: true,
      },
    });
  });

  gsap.from('.projects-grid', {
    y: 60,
    autoAlpha: 0,
    duration: 1,
    ease: 'power2.out',
    force3D: true,
    scrollTrigger: {
      trigger: '#projects',
      start: 'top 70%',
      toggleActions: 'play none none none',
      once: true,
      onEnter: flashWarp,
    },
  });

  gsap.from('.project-card', {
    y: 30,
    scale: 0.96,
    autoAlpha: 0,
    stagger: 0.08,
    duration: 0.9,
    ease: 'power2.out',
    force3D: true,
    scrollTrigger: {
      trigger: '.projects-grid',
      start: 'top 75%',
      toggleActions: 'play none none none',
      once: true,
    },
  });

  gsap.from('.stack-card', {
    y: 28,
    autoAlpha: 0,
    stagger: 0.1,
    duration: 0.85,
    ease: 'power2.out',
    force3D: true,
    scrollTrigger: {
      trigger: '#stack',
      start: 'top 70%',
      toggleActions: 'play none none none',
      once: true,
      onEnter: flashWarp,
    },
  });

  gsap.from('.about .panel', {
    y: 30,
    autoAlpha: 0,
    stagger: 0.12,
    duration: 0.8,
    ease: 'power2.out',
    force3D: true,
    scrollTrigger: {
      trigger: '#about',
      start: 'top 75%',
      toggleActions: 'play none none none',
      once: true,
      onEnter: flashWarp,
    },
  });

  gsap.from('.contact-card', {
    y: 26,
    autoAlpha: 0,
    duration: 0.85,
    ease: 'power2.out',
    force3D: true,
    scrollTrigger: {
      trigger: '#contact',
      start: 'top 80%',
      toggleActions: 'play none none none',
      once: true,
      onEnter: flashWarp,
    },
  });
};

const initHoverTilt = () => {
  if (prefersReducedMotion.matches || !window.gsap) return;
  qsa('.project-card, .stack-card, .timeline-card, .contact-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * -10;
      gsap.to(card, { rotateX: y, rotateY: x, duration: 0.4, ease: 'power3.out', transformPerspective: 900, boxShadow: '0 0 26px rgba(78, 164, 255, 0.28)' });
    });
    card.addEventListener('pointerleave', () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power3.out', boxShadow: '' });
    });
  });

  const navLinks = qsa('.nav-links a');
  navLinks.forEach((link) => {
    link.addEventListener('pointerenter', () => {
      gsap.to(link, { y: -2, scale: 1.04, duration: 0.22, ease: 'power2.out', textShadow: '0 0 12px rgba(78,164,255,0.6)' });
    });
    link.addEventListener('pointerleave', () => {
      gsap.to(link, { y: 0, scale: 1, duration: 0.26, ease: 'power2.out', textShadow: 'none' });
    });
  });
};

// Custom magnetic cursor: glowing dot that locks to interactive targets.
const initCustomCursor = () => {
  const pointerFine = window.matchMedia('(pointer: fine)').matches;
  const hoverCapable = window.matchMedia('(hover: hover)').matches;
  if (!pointerFine || !hoverCapable) return;

  const cursor = document.createElement('div');
  cursor.id = 'cursor';
  const particlePool = [];
  const poolSize = 10;
  for (let i = 0; i < poolSize; i += 1) {
    const p = document.createElement('div');
    p.className = 'cursor-particle';
    p.style.opacity = '0';
    document.body.appendChild(p);
    particlePool.push({
      el: p,
      active: false,
      life: 0,
      ttl: 0,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      size: 0,
      opacity: 0,
    });
  }

  document.body.appendChild(cursor);
  document.body.classList.add('cursor-hidden');

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let cursorX = targetX;
  let cursorY = targetY;
  let cursorScale = 1;
  let visible = false;
  let lastTime = performance.now();
  let frameGate = 0;

  const lerp = (start, end, amt) => start + (end - start) * amt;

  const setVisible = () => {
    if (visible) return;
    visible = true;
    cursor.style.opacity = '1';
  };

  const hide = () => {
    visible = false;
    cursor.style.opacity = '0';
  };

  const handleMove = (event) => {
    if (event.pointerType && event.pointerType !== 'mouse') return;
    const prevX = targetX;
    const prevY = targetY;
    targetX = event.clientX;
    targetY = event.clientY;
    cursorX = targetX;
    cursorY = targetY;

    const dx = targetX - prevX;
    const dy = targetY - prevY;
    const dist = Math.hypot(dx, dy);
    const particlesToSpawn = Math.min(poolSize, Math.max(1, Math.ceil(dist / 30)));
    for (let i = 0; i < particlesToSpawn; i += 1) {
      const p = particlePool.find((pt) => !pt.active) || particlePool[0];
      p.active = true;
      p.life = 1;
      p.ttl = 0.25 + Math.random() * 0.15;
      const angle = Math.random() * Math.PI * 2;
      const speed = 10 + Math.random() * 40;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed;
      p.size = 2 + Math.random() * 2;
      p.opacity = 0.4 + Math.random() * 0.2;
      // place particle slightly behind movement direction
      p.x = targetX - dx * 0.25 + (Math.random() - 0.5) * 6;
      p.y = targetY - dy * 0.25 + (Math.random() - 0.5) * 6;
      p.el.style.width = `${p.size}px`;
      p.el.style.height = `${p.size}px`;
      p.el.style.background = Math.random() < 0.5 ? 'rgba(255,255,255,0.6)' : 'rgba(78,164,255,0.5)';
      p.el.style.opacity = '1';
    }

    setVisible();
  };

  const animate = () => {
    const now = performance.now();
    const delta = Math.min(0.05, (now - lastTime) / 1000);
    frameGate += now - lastTime;
    lastTime = now;
    if (frameGate < 11) {
      requestAnimationFrame(animate);
      return;
    }
    frameGate = 0;

    cursorX = lerp(cursorX, targetX, 0.16);
    cursorY = lerp(cursorY, targetY, 0.16);

    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%) scale(${cursorScale})`;

    particlePool.forEach((p) => {
      if (!p.active) return;
      p.life -= delta / p.ttl;
      if (p.life <= 0) {
        p.active = false;
        p.el.style.opacity = '0';
        return;
      }
      p.x += p.vx * delta;
      p.y += p.vy * delta;
      const t = p.life;
      p.el.style.opacity = `${p.opacity * t}`;
      p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%) scale(${t})`;
    });

    requestAnimationFrame(animate);
  };

  document.addEventListener('pointermove', handleMove);
  // Keep cursor stable; only hide when the window blurs.
  window.addEventListener('blur', hide);

  const interactiveSelectors = ['a', 'button', '.button', '.cta', '[role="button"]'];
  interactiveSelectors.forEach((selector) => {
    qsa(selector).forEach((el) => {
      el.addEventListener('pointerenter', () => {
        cursorScale = 1.25;
        cursor.classList.add('cursor-hover');
      });

      el.addEventListener('pointerleave', () => {
        cursorScale = 1;
        cursor.classList.remove('cursor-hover');
      });
    });
  });

  requestAnimationFrame(animate);
};

const init = () => {
  renderHeroStats();
  renderExperience();
  renderProjects();
  renderStack();
  renderQuickFacts();
  renderContactLinks();

  const lenis = initLenis();
  handleAnchorScroll(lenis);

  if (!prefersReducedMotion.matches) {
    initCosmicCanvases(lenis);
    initParallaxLayers();
    initHeroReveal();
    initScrollAnimations();
    initHoverTilt();
    flashWarp();
  }

  initCustomCursor();

  const liquidItems = qsa('.liquid-glass');
  liquidItems.forEach((item) => {
    item.classList.add('liquid-glass--hover');
    const hoverAnim = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } });
    hoverAnim.to(item, { y: -4, duration: 0.24, boxShadow: '0 20px 54px rgba(0,0,0,0.48), 0 0 28px rgba(78,164,255,0.28)' });
    item.addEventListener('pointerenter', () => hoverAnim.play());
    item.addEventListener('pointerleave', () => hoverAnim.reverse());
  });
};

document.addEventListener('DOMContentLoaded', init);
