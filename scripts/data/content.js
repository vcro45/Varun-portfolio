export const experience = [
  {
    role: 'Co-Founder & Head of Engineering',
    org: 'Lurnigo (EdTech Startup)',
    timeframe: 'Bay Area · July 2023 - Present',
    summary: `
      <ul style="list-style-type: none; padding-left: 0;">
        <li style="margin-bottom: 8px;"><b>> Engineered the "Probability Engine":</b> Architected a predictive acceptance model using Python and Pandas that ingested student activity logs and scores to calculate real-time admission probabilities with 85%+ accuracy.</li>
        <li style="margin-bottom: 8px;"><b>> Scaled Team Operations:</b> Orchestrated the product lifecycle for a 20-person cross-functional team, establishing CI/CD pipelines (GitHub Actions) that accelerated feature deployment frequency by 40%.</li>
        <li style="margin-bottom: 8px;"><b>> Monetization Infrastructure:</b> Built a custom content delivery system integrating Stripe for payments and the Notion API for dynamic "pay-as-you-go" learning tracks.</li>
        <li><b>> Data-Driven Iteration:</b> Implemented granular analytics to track student progress, using insights to refine the curriculum and increase user retention by ~25% MoM.</li>
      </ul>
    `,
    stack: ['React', 'Node.js', 'Python', 'Pandas', 'PostgreSQL', 'GitHub Actions', 'Stripe'],
  },
  {
    role: 'Software Engineering Intern',
    org: 'SpanIdea Systems',
    timeframe: 'Santa Clara · Summer 2025',
    summary: `
      <ul style="list-style-type: none; padding-left: 0;">
        <li style="margin-bottom: 8px;"><b>> Unified Cross-Platform Architecture:</b> Designed a "Write Once, Logic Everywhere" backend using FastAPI that served a unified API to Web (React), Android (Kotlin), and iOS (SwiftUI) clients.</li>
        <li style="margin-bottom: 8px;"><b>> Real-Time Token Streaming:</b> Solved LLM latency issues by implementing Server-Sent Events (SSE) instead of polling, allowing AI responses to stream character-by-character (<200ms latency).</li>
        <li style="margin-bottom: 8px;"><b>> Resilient "Offline Mode":</b> Engineered a local caching system that queues user messages during outages and automatically synchronizes conflicts upon reconnection.</li>
        <li><b>> Production-Grade Reliability:</b> Implemented aggressive rate-limiting using Redis (token bucket) to protect OpenAI keys and designed automatic failover systems for high-traffic spikes.</li>
      </ul>
    `,
    stack: ['React', 'Kotlin', 'SwiftUI', 'FastAPI', 'Redis', 'Docker', 'SSE'],
  },
  {
    role: 'Web Developer',
    org: 'Matellio',
    timeframe: '2023',
    summary: `
      <ul style="list-style-type: none; padding-left: 0;">
        <li style="margin-bottom: 8px;"><b>> Performance Optimization:</b> Transformed a legacy site into a high-performance web app, achieving a perfect 100/100 Google Lighthouse score through image optimization (WebP) and aggressive caching.</li>
        <li style="margin-bottom: 8px;"><b>> Lead Generation Pipeline:</b> Integrated telemetry to track user behavior and redesigned the "Call to Action" flow, directly resulting in a 30% increase in inbound client inquiries.</li>
        <li style="margin-bottom: 8px;"><b>> Headless CMS Architecture:</b> Decoupled the frontend from content management, enabling non-technical staff to update the site instantly without code changes.</li>
        <li><b>> SEO & Accessibility:</b> Re-architected semantic HTML to meet WCAG 2.1 AA standards, significantly improving search rankings for local keywords.</li>
      </ul>
    `,
    stack: ['HTML5', 'CSS3', 'JavaScript', 'Headless CMS', 'Google Analytics', 'SEO'],
  },
];

export const projects = [
  {
    name: 'MockMate',
    // We combine Category <br> Description just like the old code
    blurb:
      'AI + Realtime Systems<br>A voice-first interview coach that simulates a real recruiter. Built using OpenAI’s Realtime API and WebSockets for sub-200ms bi-directional audio streaming.',
    // We use 'highlight' (String) instead of 'stack' (Array)
    highlight: 'React · OpenAI Realtime API · WebSockets · Node.js',
  },
  {
    name: 'Authentication Platform',
    blurb:
      'Cybersecurity + Systems<br>A high-throughput identity microservice protecting AI endpoints. Engineered with Redis caching, JWT rotation, and RBAC to handle 1,000+ concurrent requests.',
    highlight: 'FastAPI · Redis · PostgreSQL · Docker · JWT · OWASP',
  },
  {
    name: 'Fake News Classifier',
    blurb:
      'NLP Research + ML<br>An end-to-end misinformation detection pipeline. Trained on 44k articles using DistilBERT transformers vs. TF-IDF baselines to achieve 98.8% accuracy.',
    highlight: 'Python · PyTorch · HuggingFace · Scikit-learn · Pandas',
  },
  {
    name: 'AggieClaim',
    blurb:
      'Computer Vision + Full-Stack<br>An intelligent lost-and-found matching engine. Matches "lost" items with "found" posts by analyzing semantic text embeddings and image similarity.',
    highlight: 'React · FastAPI · OpenCV · Vector Search · PostgreSQL',
  },
  {
    name: 'Portfolio Website',
    blurb:
      'Creative Engineering<br>A cinematic, terminal-themed developer experience. Crafted with Next.js and custom GSAP motion design to deliver fluid, high-performance animations.',
    highlight: 'Next.js · GSAP · Tailwind CSS · Framer Motion',
  },
];
export const techStack = {
  Languages: ['Python', 'C++', 'Java', 'TypeScript', 'SQL', 'Bash'],
  Frontend: ['React', 'Next.js', 'Tailwind CSS', 'GSAP', 'Framer Motion'],
  Backend: ['FastAPI', 'Node.js', 'Redis', 'WebSockets', 'PostgreSQL', 'AWS'],
  'AI/ML': ['OpenAI Realtime API', 'HuggingFace', 'RAG Pipelines', 'PyTorch', 'LangChain'],
  Mobile: ['Kotlin', 'SwiftUI', 'React Native'],
  DevOps: ['Docker', 'GitHub Actions', 'Linux', 'CI/CD'],
  Security: ['JWT / OAuth', 'RBAC', 'OWASP Security', 'Rate Limiting'],
};

export const quickFacts = [
  'Currently: Junior CS @ UC Davis (Class of 2027).',
  'Focus: Real-time Systems, Distributed AI, & High-Frequency Engineering.',
  'Currently Learning: Advanced C++ memory management & System Design patterns.',
  'Availability: Summer 2026 SWE Internships.',
];

export const heroStats = [
  { value: '0 → 1', label: 'Product Architect' },
  { value: 'O(1)', label: 'Problem Solving' },
  { value: '∞', label: 'Curiosity' },
];

export const contactLinks = [
  { label: 'Resume', href: './assets/VCRSME.pdf' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/varunc4545' },
  { label: 'Email', href: 'mailto:cvarun4545@gmail.com' },
];
