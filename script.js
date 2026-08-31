// ============================================================
// script.js — Full JavaScript with Hamburger Menu Fix
// ============================================================

(function() {
    'use strict';

    // ----- NAVIGATION TOGGLE (mobile) -----
    const navToggle = document.getElementById('navToggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = mainNav ? mainNav.querySelectorAll('a') : [];

    // Exit if elements are missing
    if (!navToggle || !mainNav) {
        console.warn('Hamburger elements not found');
        // Still run other scripts
    } else {
        // Toggle function with body scroll lock and aria
        function toggleNav(forceState) {
            const isOpen = forceState !== undefined ? forceState : mainNav.classList.toggle('open');
            const expanded = isOpen ? 'true' : 'false';
            navToggle.setAttribute('aria-expanded', expanded);

            // Change icon
            const icon = navToggle.querySelector('i');
            if (icon) {
                icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
            }

            // Toggle body scroll lock
            document.body.classList.toggle('menu-open', isOpen);

            return isOpen;
        }

        // Click handler for toggle button
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleNav();
        });

        // Close when a link is clicked
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

        // Close on outside click
        document.addEventListener('click', function(e) {
            if (mainNav.classList.contains('open') &&
                !mainNav.contains(e.target) &&
                e.target !== navToggle) {
                toggleNav(false);
            }
        });

        // Set initial state
        navToggle.setAttribute('aria-expanded', 'false');
    }

    // ----- SCROLL REVEAL (IntersectionObserver) -----
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Optionally unobserve after reveal
                    // observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(function(el) {
            observer.observe(el);
        });
    } else {
        // fallback: show all
        revealElements.forEach(function(el) {
            el.classList.add('visible');
        });
    }

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
