'use strict';

// ---------------------------------------------------------------------------
// 1. Navigation & Mobile Menu
// ---------------------------------------------------------------------------
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');

function closeMenu() {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}

menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMenu();
});

// ---------------------------------------------------------------------------
// 2. React Bits: Spotlight Cursor Engine
// ---------------------------------------------------------------------------
const spotlightCards = document.querySelectorAll('.spotlight-card');
spotlightCards.forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});

// ---------------------------------------------------------------------------
// 3. 21st.dev: Animated Stat Numbers Counter
// ---------------------------------------------------------------------------
const counterElements = document.querySelectorAll('[data-count]');
let hasCounted = false;

function startCounters() {
  if (hasCounted) return;
  hasCounted = true;
  counterElements.forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    const isPercent = el.textContent.includes('%');
    const duration = 1500;
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Cubic ease-out
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(ease * target);
      el.textContent = isPercent ? `${current}%` : current;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = isPercent ? `${target}%` : target;
      }
    }
    requestAnimationFrame(step);
  });
}

// ---------------------------------------------------------------------------
// 4. Country Network Selector
// ---------------------------------------------------------------------------
const countryData = {
  liberia: {
    code: 'LR',
    role: 'ORGANIZATIONAL HEADQUARTERS',
    name: 'Monrovia, Liberia',
    description: 'AYGIO’s official meeting letterhead identifies Monrovia, Liberia, as its headquarters.',
    url: '#contact',
    link: 'Contact AYGIO ↗'
  },
  ghana: {
    code: 'GH',
    role: 'GHANA COUNTRY REPRESENTATIVE',
    name: 'Nana Konadu Agyeman',
    description: 'Introduced by AYGIO as its country representative for Ghana, contributing a local voice to the organization’s youth-focused network.',
    url: 'https://www.linkedin.com/posts/ay-gio-b789783bb_aygio-ghana-countryrepresentative-activity-7471669816341233665-bWAS',
    link: 'Read the announcement ↗'
  },
  sierra: {
    code: 'SL',
    role: 'SIERRA LEONE COUNTRY REPRESENTATIVE',
    name: 'Ibrahim Morison Kamara',
    description: 'Publicly announced as AYGIO’s representative for Sierra Leone, with an acknowledgement on his own LinkedIn profile.',
    url: 'https://sl.linkedin.com/in/ibrahim-morison-kamara-511792251',
    link: 'View the public profile ↗'
  },
  gambia: {
    code: 'GM',
    role: 'THE GAMBIA COUNTRY REPRESENTATIVE',
    name: 'Dawda Manneh',
    description: 'His appointment as AYGIO’s representative for The Gambia was shared publicly by Young African Climate Activists.',
    url: 'https://www.linkedin.com/posts/youngafricanclimateactivists_great-news-to-start-the-week-we-are-happy-activity-7472373729658822656-zTfA',
    link: 'Read the announcement ↗'
  }
};

const tabs = [...document.querySelectorAll('[data-country]')];
const mapNodes = [...document.querySelectorAll('.map-node')];

function selectCountry(tab) {
  const countryKey = tab.dataset.country;
  const c = countryData[countryKey];
  
  // Update Tabs
  tabs.forEach(t => {
    const isSelected = t === tab;
    t.setAttribute('aria-selected', String(isSelected));
    t.tabIndex = isSelected ? 0 : -1;
  });

  // Update SVG Map Nodes
  mapNodes.forEach(node => {
    const isNodeActive = node.dataset.targetCountry === countryKey;
    node.classList.toggle('active', isNodeActive);
  });

  document.querySelector('#country-panel').setAttribute('aria-labelledby', tab.id);
  for (const field of ['code', 'role', 'name', 'description']) {
    document.querySelector('#country-' + field).textContent = c[field];
  }
  const link = document.querySelector('#country-source');
  link.href = c.url;
  link.textContent = c.link;
  if (c.url.startsWith('https:')) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  } else {
    link.removeAttribute('target');
    link.removeAttribute('rel');
  }
}

// Map Node Click Listeners
mapNodes.forEach(node => {
  node.addEventListener('click', () => {
    const targetKey = node.dataset.targetCountry;
    const matchingTab = tabs.find(t => t.dataset.country === targetKey);
    if (matchingTab) selectCountry(matchingTab);
  });
});

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectCountry(tab));
  tab.addEventListener('keydown', e => {
    let next;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (index + 1) % tabs.length;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (index + tabs.length - 1) % tabs.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = tabs.length - 1;
    if (next !== undefined) {
      e.preventDefault();
      tabs[next].focus();
      selectCountry(tabs[next]);
    }
  });
});

// ---------------------------------------------------------------------------
// 5. Interactive Dialogs & Modals
// ---------------------------------------------------------------------------
const dialog = document.querySelector('#detail-dialog');
const content = {
  programme: {
    label: 'PROGRAMME SPOTLIGHT',
    title: 'Digital confidence, built through learning.',
    body: '<p><strong>Mastering Digital Literacy in the Age of AI — Cohort 1</strong> is described in public accounts by AYGIO facilitators.</p><p>Caroline Nyaga reflects on facilitating a digital literacy session and the completion of the cohort. Esther N.’s public training post includes a practical Canva class in the Liberia context.</p><ul><li>Digital literacy and technology awareness</li><li>Artificial intelligence as a learning topic</li><li>Practical use of creative digital tools</li></ul><p>Future cohort dates, eligibility and application arrangements have not been confirmed for this draft.</p><p><a href="https://www.linkedin.com/posts/esther-nwani_ai-liberia-activity-7473298485161816064-nMJZ" target="_blank" rel="noopener noreferrer">Watch the facilitator’s original training post ↗</a></p><button class="button navy" data-interest="Learning opportunities">Ask about future learning ↗</button>'
  },
  summit: {
    label: 'GHANA / 2027 / PROPOSED',
    title: 'The first international summit.',
    body: '<p>The official meeting agenda dated 30 September 2026 includes discussion and preliminary coordination for AYGIO’s first international summit in Ghana in 2027.</p><p>This is a planning-stage initiative. The agenda does not confirm a date, venue, speakers, ticket prices or registration process.</p><p>Interested in contributing or learning more? Prepare an enquiry for the organization.</p><button class="button navy" data-interest="Ghana 2027 summit">Ask about the summit ↗</button>'
  },
  review: {
    label: 'PRIVATE DESIGN REVIEW',
    title: 'A draft grounded in AYGIO.',
    body: '<p>This website is a design concept prepared for review, not an official public launch. Copy is based on the supplied AYGIO meeting agenda and public organizational and facilitator posts.</p><p><strong>Brand:</strong> the original emblem is displayed from the supplied letterhead. Navy, green and gold follow that artwork.</p><p><strong>Photography:</strong> the hero is illustrative stock photography by Kampus Production, and the student group is by Monstera Production, both from Pexels. These people are not presented as AYGIO participants. The programme thumbnail comes from Esther N.’s public training post.</p><p><a href="https://www.pexels.com/photo/5940713/" target="_blank" rel="noopener noreferrer">Hero photograph</a> · <a href="https://www.pexels.com/photo/6238027/" target="_blank" rel="noopener noreferrer">Student group photograph</a></p><p><strong>Before launch:</strong> AYGIO should approve the copy, representative details, programme status and image permissions; supply original participant photography; and confirm contact channels.</p><p><strong>Privacy:</strong> the enquiry tool only prepares an email on your device. This website does not send or store form entries and has no donation processing or analytics. External links and your email provider have their own policies.</p>'
  }
};

let lastTrigger = null;

function showDetail(key, trigger) {
  const c = content[key];
  if (!c) return;
  lastTrigger = trigger;
  document.querySelector('#dialog-label').textContent = c.label;
  document.querySelector('#dialog-title').textContent = c.title;
  document.querySelector('#dialog-content').innerHTML = c.body;
  dialog.showModal();
}

const interestDialog = document.querySelector('#interest-dialog');

function openInterest(value, trigger) {
  if (!dialog.contains(trigger)) lastTrigger = trigger;
  if (dialog.open) dialog.close();
  document.querySelector('#interest').value = value;
  document.querySelector('#form-status').textContent = '';
  document.querySelector('#email-draft').hidden = true;
  document.querySelector('#copy-draft').hidden = true;
  interestDialog.showModal();
}

document.addEventListener('click', e => {
  const detail = e.target.closest('[data-modal]');
  if (detail) showDetail(detail.dataset.modal, detail);
  const interest = e.target.closest('[data-interest]');
  if (interest) openInterest(interest.dataset.interest, interest);
});

document.querySelectorAll('dialog').forEach(d => {
  d.querySelector('.dialog-close').addEventListener('click', () => d.close());
  d.addEventListener('click', e => {
    if (e.target === d) {
      const r = d.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) {
        d.close();
      }
    }
  });
  d.addEventListener('close', () => {
    if (lastTrigger && document.contains(lastTrigger) && !document.querySelector('dialog[open]')) {
      lastTrigger.focus();
    }
  });
});

// ---------------------------------------------------------------------------
// 6. Contact Form Email Drafter
// ---------------------------------------------------------------------------
let draftMessage = '';
document.querySelector('#interest-form').addEventListener('submit', e => {
  e.preventDefault();
  const topic = document.querySelector('#interest').value;
  const name = document.querySelector('#name').value.trim();
  const message = document.querySelector('#message').value.trim();
  if (!name || !message) {
    document.querySelector('#form-status').textContent = 'Please enter your name and a message.';
    return;
  }
  draftMessage = `Hello AYGIO team,\n\nI am interested in ${topic.toLowerCase()}.\n\n${message}\n\nKind regards,\n${name}`;
  const a = document.querySelector('#email-draft');
  a.href = `mailto:info@aygio.org?subject=${encodeURIComponent('AYGIO enquiry: ' + topic)}&body=${encodeURIComponent(draftMessage)}`;
  a.hidden = false;
  document.querySelector('#copy-draft').hidden = false;
  document.querySelector('#form-status').textContent = 'Your message is ready. Open your email app below to review and send it, or copy the message. Nothing has been sent.';
  a.focus();
});

document.querySelector('#copy-draft').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(draftMessage);
    document.querySelector('#form-status').textContent = 'Message copied. Paste it into your preferred email app.';
  } catch {
    document.querySelector('#form-status').textContent = 'Copy is unavailable in this browser. Use the email link above.';
  }
});

// ---------------------------------------------------------------------------
// 7. Motion Toggle & Prefers Reduced Motion
// ---------------------------------------------------------------------------
const motionButton = document.querySelector('#motion-toggle');
const media = matchMedia('(prefers-reduced-motion: reduce)');
let reduced = media.matches;

function applyMotion() {
  document.body.classList.toggle('reduced-motion', reduced);
  motionButton.setAttribute('aria-pressed', String(reduced));
  motionButton.textContent = reduced ? 'Motion reduced' : 'Reduce motion';
}

motionButton.addEventListener('click', () => {
  reduced = !reduced;
  applyMotion();
});
applyMotion();

// ---------------------------------------------------------------------------
// 8. Motion Sites: Cinematic Staggered Intersection Observer
// ---------------------------------------------------------------------------
if ('IntersectionObserver' in window) {
  // Counters trigger
  const statsBar = document.querySelector('.hero-stats');
  if (statsBar) {
    const statsObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    statsObserver.observe(statsBar);
  }

  // Staggered reveal animations
  const revealElements = document.querySelectorAll(
    '.about-bento, .bento-card, .section-heading, .featured-programme, .focus-areas details, .summit-box, .news-item, .involvement-card'
  );
  revealElements.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  revealElements.forEach(el => io.observe(el));
  document.body.classList.add('js-motion');
}
