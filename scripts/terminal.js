// Terminal Theme v2 — Matrix Background + GSAP 3D Scroll Animations + Boot Sequence + Sound
import { experience, projects, techStack, quickFacts, heroStats, contactLinks } from './data/content.js';

const qs = (selector) => document.querySelector(selector);
const qsa = (selector) => Array.from(document.querySelectorAll(selector));

// ===================== AMBIENT SOUND SYSTEM =====================
const SoundSystem = {
  enabled: true,
  audioContext: null,
  isPlaying: false,
  nodes: [],
  masterGain: null,
  
  init() {
    if (this.audioContext) return; // Already initialized
    
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.audioContext.createGain();
    this.masterGain.connect(this.audioContext.destination);
    this.masterGain.gain.value = 0;
    
    // Check saved preference
    const saved = localStorage.getItem('soundEnabled');
    if (saved !== null) {
      this.enabled = saved === 'true';
    }
    
    const btn = qs('#sound-toggle');
    if (btn) {
      btn.classList.toggle('muted', !this.enabled);
      btn.addEventListener('click', () => this.toggle());
    }
    
    // Start the ambient sound
    if (this.enabled) {
      this.startAmbient();
    }
  },
  
  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('soundEnabled', this.enabled);
    const btn = qs('#sound-toggle');
    if (btn) btn.classList.toggle('muted', !this.enabled);
    
    if (this.enabled) {
      this.startAmbient();
    } else {
      this.stopAmbient();
    }
  },
  
  startAmbient() {
    if (this.isPlaying || !this.audioContext) return;
    this.isPlaying = true;
    
    // Resume context if suspended
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    
    // Fade in master volume
    this.masterGain.gain.cancelScheduledValues(this.audioContext.currentTime);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.audioContext.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(1, this.audioContext.currentTime + 2);
    
    // ========== LAYER 1: Deep Sub Bass Drone ==========
    const subBass = this.audioContext.createOscillator();
    const subBassGain = this.audioContext.createGain();
    const subBassFilter = this.audioContext.createBiquadFilter();
    
    subBass.type = 'sine';
    subBass.frequency.value = 40;
    subBassFilter.type = 'lowpass';
    subBassFilter.frequency.value = 80;
    subBassGain.gain.value = 0.15;
    
    subBass.connect(subBassFilter);
    subBassFilter.connect(subBassGain);
    subBassGain.connect(this.masterGain);
    subBass.start();
    this.nodes.push(subBass);
    
    // Slowly modulate the sub bass
    const subLFO = this.audioContext.createOscillator();
    const subLFOGain = this.audioContext.createGain();
    subLFO.type = 'sine';
    subLFO.frequency.value = 0.05;
    subLFOGain.gain.value = 5;
    subLFO.connect(subLFOGain);
    subLFOGain.connect(subBass.frequency);
    subLFO.start();
    this.nodes.push(subLFO);
    
    // ========== LAYER 2: Mysterious Pad (Dark Chord) ==========
    const padFreqs = [65.41, 98.00, 130.81, 196.00]; // C2, G2, C3, G3 - open fifths
    padFreqs.forEach((freq, i) => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      const filter = this.audioContext.createBiquadFilter();
      
      osc.type = 'sawtooth';
      osc.frequency.value = freq;
      
      filter.type = 'lowpass';
      filter.frequency.value = 400 + i * 100;
      filter.Q.value = 2;
      
      gain.gain.value = 0.03;
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      this.nodes.push(osc);
      
      // Slow detune for movement
      const lfo = this.audioContext.createOscillator();
      const lfoGain = this.audioContext.createGain();
      lfo.type = 'sine';
      lfo.frequency.value = 0.1 + i * 0.02;
      lfoGain.gain.value = freq * 0.003;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();
      this.nodes.push(lfo);
    });
    
    // ========== LAYER 3: High Ethereal Shimmer ==========
    const shimmerFreqs = [523.25, 783.99, 1046.50]; // C5, G5, C6
    shimmerFreqs.forEach((freq, i) => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      const filter = this.audioContext.createBiquadFilter();
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      filter.type = 'highpass';
      filter.frequency.value = 400;
      
      gain.gain.value = 0.008;
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      this.nodes.push(osc);
      
      // Tremolo effect
      const tremolo = this.audioContext.createOscillator();
      const tremoloGain = this.audioContext.createGain();
      tremolo.type = 'sine';
      tremolo.frequency.value = 0.3 + i * 0.1;
      tremoloGain.gain.value = 0.004;
      tremolo.connect(tremoloGain);
      tremoloGain.connect(gain.gain);
      tremolo.start();
      this.nodes.push(tremolo);
    });
    
    // ========== LAYER 4: Noise Texture (Wind/Static) ==========
    const noiseBuffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 2, this.audioContext.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseData.length; i++) {
      noiseData[i] = Math.random() * 2 - 1;
    }
    
    const noise = this.audioContext.createBufferSource();
    const noiseGain = this.audioContext.createGain();
    const noiseFilter = this.audioContext.createBiquadFilter();
    const noiseFilter2 = this.audioContext.createBiquadFilter();
    
    noise.buffer = noiseBuffer;
    noise.loop = true;
    
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 800;
    noiseFilter.Q.value = 0.5;
    
    noiseFilter2.type = 'lowpass';
    noiseFilter2.frequency.value = 2000;
    
    noiseGain.gain.value = 0.02;
    
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseFilter2);
    noiseFilter2.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noise.start();
    this.nodes.push(noise);
    
    // Modulate the noise filter for movement
    const noiseLFO = this.audioContext.createOscillator();
    const noiseLFOGain = this.audioContext.createGain();
    noiseLFO.type = 'sine';
    noiseLFO.frequency.value = 0.08;
    noiseLFOGain.gain.value = 600;
    noiseLFO.connect(noiseLFOGain);
    noiseLFOGain.connect(noiseFilter.frequency);
    noiseLFO.start();
    this.nodes.push(noiseLFO);
    
    // ========== LAYER 5: Pulsing Low Tone ==========
    const pulse = this.audioContext.createOscillator();
    const pulseGain = this.audioContext.createGain();
    const pulseFilter = this.audioContext.createBiquadFilter();
    
    pulse.type = 'triangle';
    pulse.frequency.value = 55; // A1
    
    pulseFilter.type = 'lowpass';
    pulseFilter.frequency.value = 200;
    
    pulseGain.gain.value = 0.06;
    
    pulse.connect(pulseFilter);
    pulseFilter.connect(pulseGain);
    pulseGain.connect(this.masterGain);
    pulse.start();
    this.nodes.push(pulse);
    
    // Pulse the gain for heartbeat effect
    const pulseLFO = this.audioContext.createOscillator();
    const pulseLFOGain = this.audioContext.createGain();
    pulseLFO.type = 'sine';
    pulseLFO.frequency.value = 0.5; // Slow pulse
    pulseLFOGain.gain.value = 0.03;
    pulseLFO.connect(pulseLFOGain);
    pulseLFOGain.connect(pulseGain.gain);
    pulseLFO.start();
    this.nodes.push(pulseLFO);
  },
  
  stopAmbient() {
    if (!this.isPlaying || !this.audioContext) return;
    
    // Fade out
    this.masterGain.gain.cancelScheduledValues(this.audioContext.currentTime);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.audioContext.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 1);
    
    // Stop all nodes after fade
    setTimeout(() => {
      this.nodes.forEach(node => {
        try { node.stop(); } catch(e) {}
      });
      this.nodes = [];
      this.isPlaying = false;
    }, 1100);
  },
  
  // Click sound - sharp digital blip
  playClick() {
    if (!this.enabled || !this.audioContext) return;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(1200, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.08);
    
    gain.gain.setValueAtTime(0.15, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.1);
  },
  
  // Hover sound - soft subtle tick
  playHover() {
    if (!this.enabled || !this.audioContext) return;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = 'sine';
    osc.frequency.value = 800;
    
    gain.gain.setValueAtTime(0.06, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.05);
    
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    
    osc.start();
    osc.stop(this.audioContext.currentTime + 0.05);
  },
  
  // Keep these empty - no need for scroll/boot/decrypt sounds
  playScroll() {},
  playBoot() {},
  playSuccess() {},
  playDecrypt() {}
};

// ===================== BOOT SEQUENCE =====================
const initBootSequence = () => {
  const bootScreen = qs('#boot-screen');
  const bootLines = qsa('.boot-line');
  const progressFill = qs('.boot-progress-fill');
  const percentText = qs('.boot-percent');
  
  if (!bootScreen) return Promise.resolve();
  
  return new Promise((resolve) => {
    let progress = 0;
    const totalDuration = 3000;
    const startTime = Date.now();
    
    // Show boot lines sequentially
    bootLines.forEach((line, i) => {
      const delay = parseInt(line.dataset.delay) || i * 250;
      setTimeout(() => {
        line.classList.add('visible');
        SoundSystem.playBoot();
      }, delay);
    });
    
    // Animate progress bar
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      progress = Math.min((elapsed / totalDuration) * 100, 100);
      
      progressFill.style.width = `${progress}%`;
      percentText.textContent = `${Math.floor(progress)}%`;
      
      if (progress < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        // Boot complete
        setTimeout(() => {
          SoundSystem.playSuccess();
          bootScreen.classList.add('hidden');
          document.body.classList.remove('loading');
          resolve();
        }, 500);
      }
    };
    
    updateProgress();
    
    // Skip on any key press or click
    const skip = () => {
      progress = 100;
      progressFill.style.width = '100%';
      percentText.textContent = '100%';
      bootLines.forEach(line => line.classList.add('visible'));
      
      setTimeout(() => {
        SoundSystem.playSuccess();
        bootScreen.classList.add('hidden');
        document.body.classList.remove('loading');
        resolve();
      }, 300);
      
      document.removeEventListener('keydown', skip);
      document.removeEventListener('click', skip);
    };
    
    document.addEventListener('keydown', skip, { once: true });
    document.addEventListener('click', skip, { once: true });
  });
};

// ===================== SCROLL PROGRESS BAR =====================
const initScrollProgress = () => {
  const progressFill = qs('.scroll-bar-fill');
  const percentText = qs('.scroll-percent');
  const filenameEl = qs('.scroll-filename');
  
  if (!progressFill) return;
  
  let lastScroll = 0;
  let ticking = false;
  
  const filenames = [
    'init_varun.exe',
    'experience.log',
    'projects.bin',
    'stack.json',
    'about.md',
    'contact.sh'
  ];
  
  const updateProgress = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100) || 0;
    
    progressFill.style.width = `${scrollPercent}%`;
    percentText.textContent = `${scrollPercent}%`;
    
    // Update filename based on scroll position
    const sectionIndex = Math.min(Math.floor(scrollPercent / 17), filenames.length - 1);
    if (filenameEl) filenameEl.textContent = filenames[sectionIndex];
    
    // Play subtle scroll sound occasionally
    if (Math.abs(scrollPercent - lastScroll) > 3) {
      SoundSystem.playScroll();
      lastScroll = scrollPercent;
    }
    
    ticking = false;
  };
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateProgress);
      ticking = true;
    }
  });
  
  updateProgress();
};

// ===================== DECRYPT ANIMATION =====================
const initDecryptEffect = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*';
  
  const scrambleText = (element, originalText, duration = 500) => {
    const length = originalText.length;
    const interval = duration / 10;
    let iteration = 0;
    
    const scramble = setInterval(() => {
      element.textContent = originalText
        .split('')
        .map((char, i) => {
          if (i < iteration) return originalText[i];
          if (char === ' ') return ' ';
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');
      
      iteration += length / 10;
      
      if (iteration >= length) {
        element.textContent = originalText;
        clearInterval(scramble);
      }
    }, interval);
  };
  
  // Add decrypt effect to project cards
  qsa('.project-card').forEach((card) => {
    const title = card.querySelector('h3');
    const description = card.querySelector('.body-text');
    
    if (!title || !description) return;
    
    const originalTitle = title.textContent;
    const originalDesc = description.textContent;
    let hasPlayed = false;
    
    card.addEventListener('mouseenter', () => {
      if (hasPlayed) return;
      hasPlayed = true;
      
      SoundSystem.playDecrypt();
      card.classList.add('decrypting');
      
      scrambleText(title, originalTitle, 400);
      scrambleText(description, originalDesc, 600);
      
      setTimeout(() => {
        card.classList.remove('decrypting');
      }, 600);
    });
  });
};

// ===================== MATRIX RAIN BACKGROUND =====================
const initMatrixRain = () => {
  const canvas = qs('#matrix-bg');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);
  
  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]|/\\+=_-*&^%$#@!';
  const charArray = chars.split('');
  const fontSize = 14;
  const columns = Math.floor(canvas.width / fontSize);
  const drops = Array(columns).fill(1);
  
  const draw = () => {
    ctx.fillStyle = 'rgba(5, 5, 5, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.font = `${fontSize}px JetBrains Mono, monospace`;
    
    for (let i = 0; i < drops.length; i++) {
      const char = charArray[Math.floor(Math.random() * charArray.length)];
      const opacity = Math.random() * 0.5 + 0.1;
      ctx.fillStyle = `rgba(0, 255, 65, ${opacity})`;
      ctx.fillText(char, i * fontSize, drops[i] * fontSize);
      
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  };
  
  setInterval(draw, 50);
};

// ===================== RENDER FUNCTIONS =====================
const renderHeroStats = () => {
  const container = qs('#hero-stats');
  if (!container) return;
  heroStats.forEach((stat) => {
    const div = document.createElement('div');
    div.className = 'stat';
    div.innerHTML = `<strong>${stat.value}</strong><p>${stat.label}</p>`;
    container.appendChild(div);
  });
};

// ===================== TAGLINE TYPEWRITER =====================
const initTaglineAnimation = () => {
  const taglineText = qs('.tagline-text');
  const taglineAccent = qs('.tagline-accent');
  
  if (!taglineText || !taglineAccent) return;
  
  const text1 = taglineText.textContent;
  const text2 = taglineAccent.textContent;
  
  taglineText.textContent = '';
  taglineAccent.textContent = '';
  taglineText.style.opacity = '1';
  taglineAccent.style.opacity = '1';
  
  // Add blinking cursor
  const cursor = document.createElement('span');
  cursor.className = 'tagline-cursor';
  cursor.textContent = '|';
  taglineText.appendChild(cursor);
  
  let i = 0;
  let j = 0;
  const speed = 35;
  
  const typeText1 = () => {
    if (i < text1.length) {
      taglineText.insertBefore(document.createTextNode(text1.charAt(i)), cursor);
      i++;
      setTimeout(typeText1, speed);
    } else {
      // Move cursor to accent
      taglineAccent.appendChild(cursor);
      setTimeout(typeText2, 200);
    }
  };
  
  const typeText2 = () => {
    if (j < text2.length) {
      taglineAccent.insertBefore(document.createTextNode(text2.charAt(j)), cursor);
      j++;
      setTimeout(typeText2, speed);
    } else {
      // Fade out cursor after typing completes
      setTimeout(() => {
        cursor.classList.add('fade-out');
        setTimeout(() => cursor.remove(), 500);
      }, 1000);
    }
  };
  
  // Start typing after boot sequence
  setTimeout(typeText1, 800);
};

const renderExperience = () => {
  const timeline = qs('#experience-timeline');
  if (!timeline) return;
  experience.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'timeline-card';
    const cleanSummary = item.summary.replace(/<br>/g, ' ').replace(/•/g, '→');
    card.innerHTML = `
      <p class="timeframe">${item.timeframe}</p>
      <h3>${item.role}</h3>
      <p class="org">${item.org}</p>
      <p class="body-text">${cleanSummary}</p>
      <div class="tags">${item.stack.slice(0, 5).map((tech) => `<span class="tag">${tech}</span>`).join('')}</div>
    `;
    timeline.appendChild(card);
  });
};

const renderProjects = () => {
  const grid = qs('#projects-grid');
  if (!grid) return;
  projects.forEach((proj) => {
    const card = document.createElement('article');
    card.className = 'project-card';
    const parts = proj.blurb.split('<br>');
    const category = parts[0] || 'Project';
    const description = parts[1] || proj.blurb;
    card.innerHTML = `
      <p class="eyebrow">${category}</p>
      <h3>${proj.name}</h3>
      <p class="body-text">${description}</p>
      <p class="highlight">${proj.highlight}</p>
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
      <p class="eyebrow">${group}</p>
      <h3>${group}</h3>
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
    a.textContent = link.label.toLowerCase();
    a.target = link.href.startsWith('http') ? '_blank' : '_self';
    if (a.target === '_blank') a.rel = 'noreferrer noopener';
    container.appendChild(a);
  });
};

// ===================== GSAP SCROLL ANIMATIONS =====================
const initGSAPAnimations = () => {
  gsap.registerPlugin(ScrollTrigger);
  
  // Refresh ScrollTrigger after boot
  ScrollTrigger.refresh();
  
  gsap.utils.toArray('.section-title').forEach((title) => {
    gsap.from(title, {
      scrollTrigger: {
        trigger: title,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      x: -50,
      duration: 0.8,
      ease: 'power3.out'
    });
  });
  
  gsap.utils.toArray('.timeline-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 60,
      rotateX: 10,
      transformPerspective: 1000,
      duration: 0.8,
      delay: i * 0.1,
      ease: 'power3.out'
    });
  });
  
  gsap.utils.toArray('.project-card').forEach((card, i) => {
    const direction = i % 2 === 0 ? -1 : 1;
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 80,
      x: 30 * direction,
      rotateY: 5 * direction,
      rotateX: 8,
      scale: 0.95,
      transformPerspective: 1200,
      duration: 0.9,
      delay: i * 0.08,
      ease: 'power4.out'
    });
  });
  
  gsap.utils.toArray('.stack-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 50,
      rotateX: 15,
      scale: 0.9,
      transformPerspective: 800,
      duration: 0.6,
      delay: i * 0.05,
      ease: 'back.out(1.2)'
    });
  });
  
  gsap.utils.toArray('.panel').forEach((panel, i) => {
    gsap.from(panel, {
      scrollTrigger: {
        trigger: panel,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 60,
      rotateX: 8,
      transformPerspective: 1000,
      duration: 0.8,
      delay: i * 0.15,
      ease: 'power3.out'
    });
  });
  
  const contactCard = qs('.contact-card');
  if (contactCard) {
    gsap.from(contactCard, {
      scrollTrigger: {
        trigger: contactCard,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 80,
      scale: 0.95,
      duration: 1,
      ease: 'power4.out'
    });
  }
  
  gsap.utils.toArray('.orb').forEach((orb, i) => {
    gsap.to(orb, {
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1
      },
      y: (i + 1) * -150,
      ease: 'none'
    });
  });
};

// ===================== 3D TILT EFFECT =====================
const init3DTilt = () => {
  const cards = qsa('.project-card, .timeline-card, .stack-card, .panel');
  
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
    });
  });
};

// ===================== CUSTOM CURSOR =====================
const initCursor = () => {
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;
  if (!isFinePointer) return;

  const cursor = document.createElement('div');
  cursor.id = 'cursor';
  document.body.appendChild(cursor);
  document.body.classList.add('cursor-hidden');

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });

  const animate = () => {
    cursorX += (mouseX - cursorX) * 0.12;
    cursorY += (mouseY - cursorY) * 0.12;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(animate);
  };
  animate();

  // Hover effect with sounds
  const addHoverListeners = () => {
    qsa('a, button, .project-card, .timeline-card, .stack-card').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-hover');
        SoundSystem.playHover();
      });
      el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
    });
  };
  
  setTimeout(addHoverListeners, 100);
};

// ===================== ACTIVE NAV =====================
const initActiveNav = () => {
  const sections = qsa('section[id]');
  const navLinks = qsa('.nav-links a');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.3, rootMargin: '-100px 0px -50% 0px' }
  );

  sections.forEach((section) => observer.observe(section));
};

// ===================== SMOOTH SCROLL =====================
const initSmoothScroll = () => {
  qsa('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = qs(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        SoundSystem.playClick();
        const offsetTop = target.offsetTop - 100;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
};

// ===================== MAGNETIC BUTTONS =====================
const initMagneticButtons = () => {
  qsa('.button').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
    
    btn.addEventListener('click', () => {
      SoundSystem.playClick();
    });
  });
};

// ===================== INIT =====================
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize sound system (needs user interaction for AudioContext)
  document.addEventListener('click', () => SoundSystem.init(), { once: true });
  document.addEventListener('keydown', () => SoundSystem.init(), { once: true });
  
  // Try to init sound early
  try {
    SoundSystem.init();
  } catch (e) {
    // Will init on first interaction
  }
  
  // Run boot sequence
  await initBootSequence();
  
  // Render content
  renderHeroStats();
  renderExperience();
  renderProjects();
  renderStack();
  renderQuickFacts();
  renderContactLinks();
  
  // Initialize effects
  initMatrixRain();
  initScrollProgress();
  initCursor();
  initActiveNav();
  initSmoothScroll();
  initMagneticButtons();
  initTaglineAnimation();
  initHeroImageGlitch();
  
  // GSAP animations (wait for content to be in DOM)
  setTimeout(() => {
    initGSAPAnimations();
    init3DTilt();
    initDecryptEffect();
  }, 100);
});

// ===================== HERO IMAGE GLITCH =====================
const initHeroImageGlitch = () => {
  const imageGlitch = qs('.hero-image-glitch');
  if (!imageGlitch) return;
  
  let hasGlitched = false;
  
  imageGlitch.addEventListener('mouseenter', () => {
    if (hasGlitched) return;
    hasGlitched = true;
    
    // Add glitching class to trigger animation
    imageGlitch.classList.add('glitching');
    SoundSystem.playClick();
    
    // Remove class after animation completes (0.45s = 0.15s × 3 iterations)
    setTimeout(() => {
      imageGlitch.classList.remove('glitching');
    }, 500);
  });
};
