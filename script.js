
(function() {
  'use strict';

  const navToggle = document.getElementById('navToggle'); // your hamburger button
  const mainNav = document.getElementById('mainNav');     // your <nav> element
  const navLinks = mainNav ? mainNav.querySelectorAll('a') : [];

  if (!navToggle || !mainNav) return; // exit if elements missing

  // Open/close function
  function toggleNav(forceState) {
    const isOpen = forceState !== undefined ? forceState : mainNav.classList.toggle('open');
    const expanded = isOpen ? 'true' : 'false';
    navToggle.setAttribute('aria-expanded', expanded);
    // Change icon (if using Font Awesome)
    const icon = navToggle.querySelector('i');
    if (icon) {
      icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
    }
    // Prevent body scroll when menu open (optional)
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return isOpen;
  }

  // Click toggle
  navToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    toggleNav();
  });

  // Close on link click
  navLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      if (mainNav.classList.contains('open')) {
        toggleNav(false);
      }
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mainNav.classList.contains('open')) {
      toggleNav(false);
      navToggle.focus();
    }
  });

  // Close on outside click (optional)
  document.addEventListener('click', function(e) {
    if (mainNav.classList.contains('open') && !mainNav.contains(e.target) && e.target !== navToggle) {
      toggleNav(false);
    }
  });

  // Ensure aria-expanded is initially correct
  navToggle.setAttribute('aria-expanded', 'false');
})();

    // ----- CONTACT FORM (using Formspree or similar) -----
    const form = document.getElementById('contactForm');
    const feedback = document.getElementById('formFeedback');

    if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // simple validation
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !message) {
        feedback.textContent = 'Please fill in all required fields.';
        feedback.style.color = '#f87171';
        return;
        }

        // disable button and show loading
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        feedback.textContent = '';

        // Use Formspree (replace action URL)
        fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: {
            'Accept': 'application/json'
            }
        })
        .then(function(response) {
            if (response.ok) {
            feedback.textContent = 'Message sent successfully! I\'ll get back to you soon.';
            feedback.style.color = '#86efac';
            form.reset();
            } else {
            throw new Error('Server error');
            }
        })
        .catch(function(error) {
            feedback.textContent = 'Oops! Something went wrong. Please try again or email me directly.';
            feedback.style.color = '#f87171';
        })
        .finally(function() {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        });
    });
    }

    // ----- ACTIVE NAV LINK (on scroll) -----
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('nav a');

    function updateActiveNav() {
    let current = '';
    sections.forEach(function(section) {
        const top = section.offsetTop - 120;
        if (window.scrollY >= top) {
        current = section.getAttribute('id');
        }
    });

    navAnchors.forEach(function(anchor) {
        anchor.removeAttribute('aria-current');
        if (anchor.getAttribute('href') === '#' + current) {
        anchor.setAttribute('aria-current', 'page');
        }
    });
    }

    // throttle scroll
    let ticking = false;
    window.addEventListener('scroll', function() {
    if (!ticking) {
        window.requestAnimationFrame(function() {
        updateActiveNav();
        ticking = false;
        });
        ticking = true;
    }
    });

    // initial
    updateActiveNav();

})();
