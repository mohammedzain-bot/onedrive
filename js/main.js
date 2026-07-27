/**
 * AutoRx Detailing Studio - Studio Supercar Hero, Scroll Rotation & Floating Motes
 */

document.addEventListener('DOMContentLoaded', () => {
  const PHONE_NUMBER = '919544672007';

  // ── Mobile Hamburger Menu ──
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navLinks = document.querySelector('.nav-links.desert-nav-links');

  if (hamburgerBtn && navLinks) {
    hamburgerBtn.addEventListener('click', () => {
      hamburgerBtn.classList.toggle('open');
      navLinks.classList.toggle('mobile-open');
      document.body.style.overflow = navLinks.classList.contains('mobile-open') ? 'hidden' : '';
    });

    // Close menu when any nav link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('open');
        navLinks.classList.remove('mobile-open');
        document.body.style.overflow = '';
      });
    });

    // Close on outside tap
    document.addEventListener('click', (e) => {
      if (!hamburgerBtn.contains(e.target) && !navLinks.contains(e.target)) {
        hamburgerBtn.classList.remove('open');
        navLinks.classList.remove('mobile-open');
        document.body.style.overflow = '';
      }
    });
  }

  // ── Sticky Header on Scroll ──
  const header = document.querySelector('.header.desert-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        header.style.background = 'rgba(10,10,10,0.92)';
        header.style.backdropFilter = 'blur(16px)';
        header.style.webkitBackdropFilter = 'blur(16px)';
        header.style.position = 'fixed';
        header.style.borderBottom = '1px solid rgba(255,255,255,0.06)';
      } else {
        header.style.background = 'transparent';
        header.style.backdropFilter = 'none';
        header.style.webkitBackdropFilter = 'none';
        header.style.position = 'absolute';
        header.style.borderBottom = 'none';
      }
    });
  }


  // ── ONE DRIVE Hero Title: Letter-by-Letter Drop Animation ──
  const brandTitle = document.getElementById('hero-brand-title');
  if (brandTitle) {
    const text = brandTitle.textContent;
    brandTitle.textContent = '';
    text.split('').forEach((char, i) => {
      const span = document.createElement('span');
      span.className = 'letter';
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.animationDelay = `${i * 0.07}s`;
      brandTitle.appendChild(span);
    });
  }

  // 1. Studio Hero Scroll-Based Car Rotation & Mouse Drift
  const heroSection = document.querySelector('.hero-desert-section');
  const desertHeroImg = document.getElementById('desert-hero-img');

  if (heroSection && desertHeroImg) {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let targetRotY = 0;
    let currentRotY = 0;

    // Track scroll position to rotate the car
    window.addEventListener('scroll', () => {
      // Rotates up to 35 degrees as you scroll down
      targetRotY = Math.min(window.scrollY * 0.08, 35);
    });

    // Track mouse movement for subtle 3D tilt
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      targetX = x * -20; // Panning background depth
      targetY = y * -12;
    });

    heroSection.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
    });

    function animateParallax() {
      // Lerp transition for extra smooth movement
      currentX += (targetX - currentX) * 0.07;
      currentY += (targetY - currentY) * 0.07;
      currentRotY += (targetRotY - currentRotY) * 0.07;

      if (desertHeroImg) {
        // CSS animation handles the car — JS parallax disabled to prevent conflict
        // desertHeroImg.style.transform = `...`;
      }

      requestAnimationFrame(animateParallax);
    }
    animateParallax();
  }

  // 2. Animated Studio Light Floating Motes (Canvas Particles)
  const canvas = document.getElementById('dust-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = 35;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4, // Gentle horizontal sway
        vy: -0.3 - Math.random() * 0.7, // Drifts upwards
        radius: 1.0 + Math.random() * 2.5,
        alpha: 0.08 + Math.random() * 0.25,
        decay: 0.0008 + Math.random() * 0.002
      });
    }

    function renderDust() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        // Reset particle when it fades out or goes off screen
        if (p.alpha <= 0 || p.y < 0 || p.x < 0 || p.x > width) {
          p.x = Math.random() * width;
          p.y = height + 10;
          p.vx = (Math.random() - 0.5) * 0.4;
          p.vy = -0.3 - Math.random() * 0.7;
          p.alpha = 0.08 + Math.random() * 0.25;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`; // Clean white/grey studio motes
        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.1)';
        ctx.fill();
      });

      requestAnimationFrame(renderDust);
    }
    renderDust();
  }

  // 3. Scroll Reveal Animations (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .service-card, .accessory-card, .info-item');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        if (!entry.target.classList.contains('reveal')) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach((el, index) => {
    if (el.classList.contains('service-card') || el.classList.contains('accessory-card')) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(40px)';
      el.style.transition = `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index % 3 * 0.15}s`;
    }
    revealObserver.observe(el);
  });

  // 4. WhatsApp Service Card Inquiry Handler
  const inquiryButtons = document.querySelectorAll('.btn-whatsapp-inquire');
  inquiryButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-service') || 'Automotive Service';
      const textMessage = `Hi ONE DRIVE, I am interested in inquiring about your *${serviceName}* service for my vehicle. Please share pricing and booking details. My location is near Malappuram.`;
      
      const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(textMessage)}`;
      window.open(whatsappUrl, '_blank');
    });
  });

  // 5. Quick Booking Form Handler
  const bookingForm = document.getElementById('quick-booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('booking-name').value.trim();
      const phone = document.getElementById('booking-phone').value.trim();
      const carModel = document.getElementById('booking-model').value.trim();
      const service = document.getElementById('booking-service').value;
      const message = document.getElementById('booking-message').value.trim();

      const text = `*NEW BOOKING / INQUIRY - ONE DRIVE*\n\n` +
                   `*Name:* ${name}\n` +
                   `*Phone:* ${phone}\n` +
                   `*Vehicle Model:* ${carModel}\n` +
                   `*Selected Service:* ${service}\n` +
                   `*Message:* ${message || 'N/A'}`;

      const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank');
    });
  }

  // 6. Interactive 3D Tilt Effect on Cards
  const cards = document.querySelectorAll('.service-card, .accessory-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

    card.style.transform = `perspective(1000px) rotateY(${x / 25}deg) rotateX(${-y / 25}deg) translateY(-10px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0px)';
  });
});

  // ============================================
  // Custom Animated Service Dropdown
  // ============================================
  const selectWrapper = document.getElementById('service-select-wrapper');
  const trigger = document.getElementById('service-trigger');
  const dropdown = document.getElementById('service-dropdown');
  const selectedText = document.getElementById('service-selected-text');
  const hiddenSelect = document.getElementById('booking-service');
  const options = dropdown ? dropdown.querySelectorAll('.custom-select-option') : [];

  if (trigger && dropdown) {
    // Toggle open/close
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      selectWrapper.classList.toggle('open');
    });

    // Option click handler
    options.forEach(option => {
      option.addEventListener('click', () => {
        const value = option.getAttribute('data-value');
        const label = option.textContent.trim();

        // Update displayed text
        selectedText.textContent = label;

        // Update hidden select
        if (hiddenSelect) {
          for (let opt of hiddenSelect.options) {
            if (opt.value === value) { opt.selected = true; break; }
          }
        }

        // Update selected style
        options.forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');

        // Close dropdown
        selectWrapper.classList.remove('open');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!selectWrapper.contains(e.target)) {
        selectWrapper.classList.remove('open');
      }
    });
  }

  // ── Mobile Service Slider ──
  function initMobileSlider() {
    const cards = Array.from(document.querySelectorAll('.services-grid .service-card'));
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    const dotsContainer = document.getElementById('sliderDots');

    if (!cards.length || !prevBtn || !nextBtn || !dotsContainer) return;

    let current = 0;

    // Build dots
    dotsContainer.innerHTML = '';
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to service ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    function goTo(index) {
      cards[current].classList.remove('slider-active');
      dotsContainer.children[current].classList.remove('active');
      current = (index + cards.length) % cards.length;
      cards[current].classList.add('slider-active');
      dotsContainer.children[current].classList.add('active');
    }

    // Activate first card
    cards[0].classList.add('slider-active');

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));

    // Touch / swipe support
    let touchStartX = 0;
    const grid = document.querySelector('.services-grid');
    if (grid) {
      grid.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
      grid.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 40) goTo(dx < 0 ? current + 1 : current - 1);
      });
    }
  }

  // Only run slider on mobile
  if (window.innerWidth <= 768) {
    initMobileSlider();
  }

});
