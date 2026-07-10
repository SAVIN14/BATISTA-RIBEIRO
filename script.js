document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     CUSTOM CURSOR SMOOTHING & LERP
     ========================================================================== */
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  let isMoving = false;

  // Track mouse coordinates
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Instant positioning for core cursor
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
    
    if (!isMoving) {
      isMoving = true;
      cursor.style.opacity = '1';
      ring.style.opacity = '0.5';
    }
  });

  // Smooth lerp interpolation for the outer ring
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover states scale effects
  const interactiveSelector = 'a, button, .btn, .area-card, .lawyer-card, input, select, textarea, #menu-toggle';
  document.querySelectorAll(interactiveSelector).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(2)';
      cursor.style.backgroundColor = 'var(--gold-light)';
      ring.style.width = '56px';
      ring.style.height = '56px';
      ring.style.borderColor = 'var(--gold-light)';
      ring.style.opacity = '0.25';
    });
    
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.backgroundColor = 'var(--gold-light)';
      ring.style.width = '36px';
      ring.style.height = '36px';
      ring.style.borderColor = 'var(--gold)';
      ring.style.opacity = '0.5';
    });
  });

  // Hide cursor on leaving the document window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    ring.style.opacity = '0';
    isMoving = false;
  });

  /* ==========================================================================
     MOBILE NAVIGATION DRAWER
     ========================================================================== */
  const menuToggle = document.getElementById('menu-toggle');
  const menuClose = document.getElementById('menu-close');
  const navMobile = document.getElementById('nav-mobile');
  const menuOverlay = document.getElementById('menu-overlay');
  const mobileLinks = document.querySelectorAll('.nav-mobile-links a');

  function openMobileMenu() {
    navMobile.classList.add('open');
    menuOverlay.classList.add('open');
    menuToggle.classList.add('open');
    document.body.style.overflow = 'hidden'; // Lock background scrolling
  }

  function closeMobileMenu() {
    navMobile.classList.remove('open');
    menuOverlay.classList.remove('open');
    menuToggle.classList.remove('open');
    document.body.style.overflow = ''; // Unlock background scrolling
  }

  // Event Listeners
  menuToggle.addEventListener('click', () => {
    if (navMobile.classList.contains('open')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  menuClose.addEventListener('click', closeMobileMenu);
  menuOverlay.addEventListener('click', closeMobileMenu);
  
  // Close menu when selecting an option
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  /* ==========================================================================
     SCROLL EVENTS: PROGRESS BAR & HEADER STYLE
     ========================================================================== */
  const progressBar = document.getElementById('progress-bar');
  const header = document.getElementById('header');
  
  // Throttle helper to optimize scroll performance
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScrollUpdates();
        ticking = false;
      });
      ticking = true;
    }
  });

  function handleScrollUpdates() {
    const scrollY = window.scrollY;
    
    // 1. Update Scroll Progress Bar
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0) {
      const scrollPercent = (scrollY / docHeight) * 100;
      progressBar.style.width = `${scrollPercent}%`;
    }
    
    // 2. Add class when header is scrolled past threshold
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  /* ==========================================================================
     HERO BACKGROUND PARALLAX
     ========================================================================== */
  const heroBg = document.getElementById('hero-bg-img');
  
  if (heroBg) {
    window.addEventListener('scroll', () => {
      // Offset translation for smooth parallax depth
      const scrollPosition = window.scrollY;
      // Only run parallax if Hero section is within view
      if (scrollPosition <= window.innerHeight) {
        heroBg.style.transform = `translateY(${scrollPosition * 0.3}px)`;
      }
    });
  }

  /* ==========================================================================
     INTERSECTION OBSERVER FOR REVEAL ANIMATIONS
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal, .area-card, .lawyer-card, .contact-detail, .contact-form');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, {
    threshold: 0.1, // Trigger when 10% of the element is visible
    rootMargin: '0px 0px -50px 0px' // Offset to trigger slightly before element reaches view
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  /* ==========================================================================
     WHATSAPP FORM SUBMISSION
     ========================================================================== */
  const contactForm = document.getElementById('consultaForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const nome     = document.getElementById('nome').value.trim();
      const telefone = document.getElementById('telefone').value.trim();
      const cidade   = document.getElementById('cidade').value.trim();
      const area     = document.getElementById('area').value;
      const processo = document.getElementById('processo').value;
      const origem   = document.getElementById('origem').value;
      const mensagem = document.getElementById('mensagem').value.trim();

      const textMessage = `Olá, gostaria de agendar uma consulta jurídica.

Nome: ${nome}
Telefone: ${telefone}
Cidade: ${cidade}
Área Jurídica: ${area}
Processo em andamento: ${processo}
Como conheceu o escritório: ${origem}

Motivo da consulta:
${mensagem}`;

      const encodedText = encodeURIComponent(textMessage);
      const whatsappURL = `https://wa.me/5589988052976?text=${encodedText}`;

      window.open(whatsappURL, '_blank');
    });
  }
});
