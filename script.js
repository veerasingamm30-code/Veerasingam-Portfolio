/* =====================================================================
   VEERASINGAM M. — PORTFOLIO SCRIPT
   Sections:
   1. Theme toggle (dark/light + localStorage)
   2. Particle canvas background
   3. Custom cursor (desktop only)
   4. Typing animation (hero tagline)
   5. Navbar: scroll background + mobile menu
   6. Scroll-spy (highlight active nav link)
   7. Animated skill bars (IntersectionObserver)
   8. Education details + project details modal
   9. Footer year
   10. Live India clocks
   ===================================================================== */

// Run everything once the HTML is fully parsed
document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------------------------------------------------
     1. THEME TOGGLE
     We store the choice in localStorage under the key "theme" so the
     site remembers dark/light across visits.
  ------------------------------------------------------------------- */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const bodyEl = document.body;

  // On load: check localStorage first, otherwise fall back to the
  // visitor's OS-level preference.
  const savedTheme = localStorage.getItem('theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  if (savedTheme === 'light' || (!savedTheme && prefersLight)) {
    bodyEl.classList.add('light-mode');
  }

  themeToggleBtn.addEventListener('click', () => {
    bodyEl.classList.toggle('light-mode');
    const isLight = bodyEl.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });


  /* -------------------------------------------------------------------
     2. PARTICLE CANVAS BACKGROUND
     A lightweight field of dots that drift slowly and connect with
     thin lines when close together. Particle count scales down on
     small screens to keep things smooth on mobile.
  ------------------------------------------------------------------- */
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');

  let particles = [];
  let animationFrameId = null;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function getParticleCount() {
    // Fewer particles on narrow / mobile screens = better performance
    const area = window.innerWidth * window.innerHeight;
    const isMobile = window.innerWidth < 700;
    const base = isMobile ? 35 : 90;
    return Math.min(base, Math.floor(area / 14000));
  }

  function createParticles() {
    const count = getParticleCount();
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.6 + 0.6
    }));
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const isLight = bodyEl.classList.contains('light-mode');
    const dotColor = isLight ? 'rgba(90, 60, 180, 0.35)' : 'rgba(0, 212, 255, 0.55)';
    const lineColorBase = isLight ? '90, 60, 180' : '0, 212, 255';

    // Move + draw each particle
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges instead of bouncing (keeps motion feeling continuous)
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = dotColor;
      ctx.fill();
    });

    // Connect nearby particles with a faint line — capped distance
    // keeps this from becoming an O(n^2) performance problem visually
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const opacity = 1 - dist / maxDist;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${lineColorBase}, ${opacity * 0.25})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    animationFrameId = requestAnimationFrame(drawParticles);
  }

  // Pause the animation when the tab isn't visible — saves battery/CPU
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationFrameId);
    } else {
      drawParticles();
    }
  });

  resizeCanvas();
  createParticles();
  drawParticles();

  let resizeTimeout;
  window.addEventListener('resize', () => {
    // Debounce resize so we don't rebuild particles on every pixel change
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resizeCanvas();
      createParticles();
    }, 200);
  });


  /* -------------------------------------------------------------------
     3. CUSTOM CURSOR (desktop only)
     We detect a real mouse via the "pointer: fine" media query rather
     than just checking screen width, since that's a more accurate
     signal than viewport size alone.
  ------------------------------------------------------------------- */
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');

  if (hasFinePointer) {
    bodyEl.classList.add('cursor-active');

    // Ring follows with a slight delay for a smooth trailing feel;
    // dot follows instantly.
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    function animateRing() {
      // Ease the ring towards the mouse position each frame
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Grow the ring when hovering anything clickable
    const interactiveSelectors = 'a, button, input, textarea, .glass-card';
    document.querySelectorAll(interactiveSelectors).forEach(el => {
      el.addEventListener('mouseenter', () => bodyEl.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => bodyEl.classList.remove('cursor-hover'));
    });
  }


  /* -------------------------------------------------------------------
     4. TYPING ANIMATION — hero tagline
     Cycles through a short list of phrases, typing and deleting each
     one in turn.
  ------------------------------------------------------------------- */
  const typingEl = document.getElementById('typing-text');
  const phrases = [
    'Aspiring Full Stack Developer',
    'Frontend built with care',
    'Fresher, ready to ship'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeLoop() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    typingEl.textContent = currentPhrase.substring(0, charIndex);

    let delay = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentPhrase.length) {
      // Full phrase typed — pause, then start deleting
      delay = 1600;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Fully deleted — move to next phrase
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 300;
    }

    setTimeout(typeLoop, delay);
  }

  typeLoop();


  /* -------------------------------------------------------------------
     5. NAVBAR — background on scroll + mobile menu toggle
  ------------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    menuToggle.classList.toggle('open');
  });

  // Close the mobile menu whenever a nav link is tapped
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.classList.remove('open');
    });
  });


  /* -------------------------------------------------------------------
     6. SCROLL-SPY
     Watches each <section> and highlights the matching nav link when
     that section is the one most visible in the viewport.
  ------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinkEls.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, {
    // Counts a section as "active" once it crosses the middle of the screen
    rootMargin: '-45% 0px -45% 0px',
    threshold: 0
  });

  sections.forEach(section => spyObserver.observe(section));


  /* -------------------------------------------------------------------
     7. ANIMATED SKILL BARS
     Each .skill-bar has data-level="N" (0-100). When it scrolls into
     view for the first time, we animate its fill width and count the
     percentage text up to match.
  ------------------------------------------------------------------- */
  const skillBars = document.querySelectorAll('.skill-bar');

  const skillObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const bar = entry.target;
      const level = parseInt(bar.dataset.level, 10);
      const fillEl = bar.querySelector('.skill-fill');
      const percentEl = bar.querySelector('.skill-percent');

      // Animate the visual bar via CSS transition
      fillEl.style.width = `${level}%`;

      // Animate the number counting up, matched roughly to the same duration
      let current = 0;
      const duration = 1100;
      const stepTime = 16;
      const steps = duration / stepTime;
      const increment = level / steps;

      const countInterval = setInterval(() => {
        current += increment;
        if (current >= level) {
          current = level;
          clearInterval(countInterval);
        }
        percentEl.textContent = `${Math.round(current)}%`;
      }, stepTime);

      // Only animate once per bar
      observer.unobserve(bar);
    });
  }, { threshold: 0.4 });

  skillBars.forEach(bar => skillObserver.observe(bar));


  /* -------------------------------------------------------------------
     8. EDUCATION DETAILS + PROJECT DETAILS
  ------------------------------------------------------------------- */
  const educationToggle = document.querySelector('.education-details-toggle');
  const educationDetails = document.getElementById('education-more-details');
  if (educationToggle && educationDetails) {
    educationToggle.addEventListener('click', () => {
      const expanded = educationToggle.getAttribute('aria-expanded') === 'true';
      educationToggle.setAttribute('aria-expanded', String(!expanded));
      educationDetails.hidden = expanded;
      educationToggle.textContent = expanded ? 'More Details' : 'Hide Details';
    });
  }

  /* Project details modal.
     Everything shown is read from the clicked project card, so the modal can
     never show a different project's image, text, stack or links. Links appear
     only if the card really contains one. */
  const projectDialog = document.getElementById('project-details-dialog');
  if (projectDialog) {
    const $ = id => document.getElementById(id);
    const dlg = {
      figure: $('project-dialog-figure'), imgLink: $('project-dialog-imglink'), img: $('project-dialog-img'),
      missing: $('project-dialog-missing'), category: $('project-dialog-category'), title: $('project-dialog-title'),
      desc: $('project-dialog-desc'), featuresWrap: $('project-dialog-features-wrap'), features: $('project-dialog-features'),
      tech: $('project-dialog-tech'), links: $('project-dialog-links')
    };
    let lastTrigger = null;

    const showMissingPreview = () => { dlg.figure.hidden = true; dlg.missing.hidden = false; };
    dlg.img.addEventListener('error', showMissingPreview);

    function fillProjectDialog(card) {
      const text = sel => { const el = card.querySelector(sel); return el ? el.textContent.trim() : ''; };
      dlg.title.textContent = text('.project-title');
      dlg.category.textContent = text('.project-category');
      dlg.desc.textContent = text('.project-desc');

      // Preview image (the card's own screenshot)
      const shot = card.querySelector('.project-shot');
      dlg.figure.hidden = false;
      dlg.missing.hidden = true;
      if (shot && shot.getAttribute('src')) {
        const src = shot.getAttribute('src');
        dlg.img.src = src;
        dlg.img.alt = shot.getAttribute('alt') || ('Screenshot of ' + dlg.title.textContent);
        if (shot.width) dlg.img.width = shot.getAttribute('width');
        if (shot.height) dlg.img.height = shot.getAttribute('height');
        dlg.imgLink.href = src;
      } else {
        dlg.img.removeAttribute('src');
        showMissingPreview();
      }

      // Features (only those already listed on the card)
      dlg.features.replaceChildren();
      const items = card.querySelectorAll('.project-features li');
      items.forEach(li => {
        const item = document.createElement('li');
        item.textContent = li.textContent.trim();
        dlg.features.appendChild(item);
      });
      dlg.featuresWrap.hidden = items.length === 0;

      // Technology groups (cloned from the card, so labels stay accurate)
      dlg.tech.replaceChildren();
      const groups = card.querySelector('.project-tech-groups');
      if (groups) dlg.tech.appendChild(groups.cloneNode(true));

      // Real links only (the card's own http(s) anchors)
      dlg.links.replaceChildren();
      card.querySelectorAll('.project-links a[href^="http"]').forEach(link => {
        const a = document.createElement('a');
        a.href = link.href;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.className = 'btn btn-ghost btn-sm';
        a.textContent = link.textContent.trim() + ' ↗';
        dlg.links.appendChild(a);
      });
      dlg.links.hidden = dlg.links.children.length === 0;
    }

    document.querySelectorAll('[data-project-details]').forEach(button => {
      button.addEventListener('click', () => {
        const card = button.closest('.project-card');
        if (!card) return;
        lastTrigger = button;
        fillProjectDialog(card);
        if (typeof projectDialog.showModal === 'function') projectDialog.showModal();
        else projectDialog.setAttribute('open', '');
        const scroller = projectDialog.querySelector('.project-dialog-content');
        if (scroller) scroller.scrollTop = 0;
        bodyEl.classList.add('modal-open');
      });
    });

    const closeProjectDialog = projectDialog.querySelector('.dialog-close');
    const closeModal = () => { if (typeof projectDialog.close === 'function') projectDialog.close(); else projectDialog.removeAttribute('open'); };
    if (closeProjectDialog) closeProjectDialog.addEventListener('click', closeModal);

    // Click on the dimmed backdrop closes the dialog
    projectDialog.addEventListener('click', event => { if (event.target === projectDialog) closeModal(); });

    // Escape is handled natively by <dialog>; this runs for every way of closing
    projectDialog.addEventListener('close', () => {
      bodyEl.classList.remove('modal-open');
      if (lastTrigger && document.contains(lastTrigger)) lastTrigger.focus();
    });
  }


  /* -------------------------------------------------------------------
     Email actions.
     mailto: links do nothing on computers with no default mail app, so on
     desktop the Email card opens Gmail's compose window (new tab) instead.
     On phones the normal mailto: link is kept, because the phone's mail app
     handles it. "Open in mail app" and "Copy address" are always available.
     Nothing is sent automatically: the visitor presses Send in their mail.
  ------------------------------------------------------------------- */
  const emailCard = document.querySelector('[data-email-card]');
  if (emailCard) {
    const isPhone = /Android|iPhone|iPad|iPod|Mobi/i.test(navigator.userAgent) ||
      (navigator.maxTouchPoints > 1 && window.matchMedia('(pointer: coarse)').matches);
    emailCard.addEventListener('click', event => {
      if (isPhone) return; // let the browser follow the mailto: link
      event.preventDefault();
      const params = new URLSearchParams({
        view: 'cm', fs: '1',
        to: emailCard.dataset.emailTo,
        su: emailCard.dataset.emailSubject || ''
      });
      window.open('https://mail.google.com/mail/?' + params.toString(), '_blank', 'noopener,noreferrer');
    });
  }

  const copyEmailBtn = document.querySelector('[data-copy-email]');
  const copyStatus = document.querySelector('[data-copy-status]');
  if (copyEmailBtn && copyStatus) {
    let statusTimer;
    const say = message => {
      copyStatus.textContent = message;
      clearTimeout(statusTimer);
      statusTimer = setTimeout(() => { copyStatus.textContent = ''; }, 2500);
    };
    copyEmailBtn.addEventListener('click', async () => {
      const address = copyEmailBtn.dataset.copyEmail;
      try {
        await navigator.clipboard.writeText(address);
        say('Copied!');
      } catch (err) {
        try {
          const temp = document.createElement('textarea');
          temp.value = address;
          temp.setAttribute('readonly', '');
          temp.style.cssText = 'position:fixed;opacity:0;';
          document.body.appendChild(temp);
          temp.select();
          const done = document.execCommand('copy');
          temp.remove();
          say(done ? 'Copied!' : 'Could not copy. Please type it: ' + address);
        } catch (e2) {
          say('Could not copy. Please type it: ' + address);
        }
      }
    });
  }

  /* -------------------------------------------------------------------
     9. FOOTER YEAR
  ------------------------------------------------------------------- */
  document.getElementById('footer-year').textContent = new Date().getFullYear();


  /* Project card micro-interaction: disabled for touch and reduced-motion users. */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  if (!reduceMotion && finePointer) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const rotateY = (x - 0.5) * 4;
        const rotateX = (0.5 - y) * 4;
        card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }



  /* -------------------------------------------------------------------
     10. LIVE INDIA CLOCKS (exactly two: Home + Contact)
     All visible clocks are marked with [data-ist-clock] and driven by ONE timer,
     so intervals can never stack up. The time zone is forced to
     Asia/Kolkata, so it is correct whatever the visitor's device says.
     The timer re-aligns to the next whole second (no drift) and is
     cleared on pagehide.
  ------------------------------------------------------------------- */
  const istClocks = document.querySelectorAll('[data-ist-clock]');

  if (istClocks.length) {
    let timeFmt, dateFmt;
    try {
      timeFmt = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
      });
      dateFmt = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata', weekday: 'short', day: '2-digit', month: 'short', year: 'numeric'
      });
    } catch (err) {
      timeFmt = dateFmt = null; // very old browser without time zone support
    }

    const part = (parts, type) => (parts.find(p => p.type === type) || {}).value || '';
    let clockTimer = null;

    function tickClocks() {
      if (!timeFmt) {
        istClocks.forEach(c => { c.querySelector('[data-ist-date]').textContent = 'Time unavailable'; });
        return;
      }
      const now = new Date();
      const t = timeFmt.formatToParts(now);
      const d = dateFmt.formatToParts(now);
      const timeText = `${part(t, 'hour')}:${part(t, 'minute')}:${part(t, 'second')} ${part(t, 'dayPeriod').toUpperCase()}`;
      const dateText = `${part(d, 'weekday')}, ${part(d, 'day')} ${part(d, 'month')} ${part(d, 'year')}`;

      istClocks.forEach(clock => {
        const timeEl = clock.querySelector('[data-ist-time]');
        const dateEl = clock.querySelector('[data-ist-date]');
        if (timeEl.textContent !== timeText) timeEl.textContent = timeText;
        if (dateEl.textContent !== dateText) dateEl.textContent = dateText;
      });
    }

    function scheduleClockTick() {
      clearTimeout(clockTimer);          // never more than one pending timer
      tickClocks();
      clockTimer = setTimeout(scheduleClockTick, 1000 - (Date.now() % 1000) + 5);
    }

    scheduleClockTick();

    // Stop while the tab is hidden, resync instantly when it comes back
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { clearTimeout(clockTimer); } else { scheduleClockTick(); }
    });
    window.addEventListener('pagehide', () => clearTimeout(clockTimer));
  }

});
