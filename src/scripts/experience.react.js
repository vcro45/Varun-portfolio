import { experience } from '../data/content.js';

const createTag = (text) => {
  const span = document.createElement('span');
  span.className = 'tag';
  span.textContent = text;
  return span;
};

export const mountExperienceSection = () => {
  const container = document.getElementById('experience-list');
  if (!container) return null;

  let animationQueue = Promise.resolve();

  experience.forEach((item, index) => {
    const card = document.createElement('article');
    card.className = 'experience-card experience-reveal';
    card.dataset.index = index;
    card.style.opacity = '0';
    card.style.transform = index % 2 === 0 ? 'translateX(-60px) translateY(20px)' : 'translateX(60px) translateY(20px)';

    const header = document.createElement('header');
    const timeframe = document.createElement('p');
    timeframe.className = 'timeframe';
    timeframe.textContent = item.timeframe;

    const role = document.createElement('h3');
    role.textContent = item.role;

    const org = document.createElement('p');
    org.className = 'org';
    org.textContent = item.org;

    header.appendChild(timeframe);
    header.appendChild(role);
    header.appendChild(org);

    const summary = document.createElement('p');
    summary.className = 'summary';
    summary.textContent = item.summary;

    const tagsDiv = document.createElement('div');
    tagsDiv.className = 'tags';
    item.stack.forEach((tech) => {
      tagsDiv.appendChild(createTag(tech));
    });

    card.appendChild(header);
    card.appendChild(summary);
    card.appendChild(tagsDiv);
    container.appendChild(card);
  });

  // Set up intersection observer to trigger animations in sequence
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.classList.contains('in-view')) {
          const index = parseInt(entry.target.dataset.index, 10);

          // Queue the animation so it plays after the previous card finishes
          animationQueue = animationQueue.then(() => {
            return new Promise((resolve) => {
              entry.target.classList.add('in-view');
              // 0.75s animation duration, so wait that long before resolving
              setTimeout(resolve, 750);
            });
          });

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('.experience-reveal').forEach((el) => {
    observer.observe(el);
  });
};
