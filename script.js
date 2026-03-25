// ========================================
// QIRA — Site Interactions
// ========================================

document.addEventListener('DOMContentLoaded', () => {

    // ---- Scroll Progress Bar ----
    const scrollProgress = document.getElementById('scroll-progress');

    // ---- Navigation scroll effect + progress ----
    const nav = document.getElementById('nav');
    const backToTop = document.getElementById('back-to-top');

    const handleScroll = () => {
        const scrollY = window.scrollY;
        nav.classList.toggle('scrolled', scrollY > 50);

        // Scroll progress
        const docHeight = document.body.scrollHeight - window.innerHeight;
        if (docHeight > 0) {
            scrollProgress.style.width = (scrollY / docHeight) * 100 + '%';
        }

        // Back-to-top visibility
        backToTop.classList.toggle('visible', scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Back-to-top click
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ---- Mobile menu toggle + backdrop ----
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');
    const backdrop = document.getElementById('nav-backdrop');

    const closeMenu = () => {
        links.classList.remove('open');
        toggle.classList.remove('active');
        backdrop.classList.remove('active');
    };

    toggle.addEventListener('click', () => {
        const isOpen = links.classList.toggle('open');
        toggle.classList.toggle('active', isOpen);
        backdrop.classList.toggle('active', isOpen);
    });

    backdrop.addEventListener('click', closeMenu);

    // Close mobile menu on link click
    links.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // ---- Smooth scroll for anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ---- Scroll reveal animations ----
    const revealElements = document.querySelectorAll(
        '.section-label, .section-title, .section-subtitle, ' +
        '.focus-card, .research-area, .project-card, .blog-card, ' +
        '.value, .infra-item, .team-card, .team-note, ' +
        '.intro-text, .intro-stats, .about-main, .about-values, ' +
        '.infra-content, .infra-capabilities, .contact-content, .contact-form-wrap, ' +
        '.current-banner, .research-publications'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => observer.observe(el));

    // ---- Hero canvas (subtle particle network) ----
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height, particles;

        const resize = () => {
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
        };

        const createParticles = () => {
            const count = Math.min(Math.floor((width * height) / 15000), 80);
            particles = Array.from({ length: count }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                radius: Math.random() * 1.5 + 0.5,
            }));
        };

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 * (1 - dist / 150)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(99, 102, 241, 0.5)';
                ctx.fill();

                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;
            });

            requestAnimationFrame(draw);
        };

        resize();
        createParticles();
        draw();

        window.addEventListener('resize', () => {
            resize();
            createParticles();
        });
    }

    // ---- Reactive Buttons (magnetic + glow tracking) ----
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const xPercent = (x / rect.width) * 100;
            const yPercent = (y / rect.height) * 100;

            btn.style.setProperty('--x', xPercent + '%');
            btn.style.setProperty('--y', yPercent + '%');

            // Subtle magnetic displacement (max 3px)
            const dx = (x - rect.width / 2) / rect.width * 6;
            const dy = (y - rect.height / 2) / rect.height * 4;
            btn.style.transform = `translate(${dx}px, ${dy}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
            btn.style.setProperty('--x', '50%');
            btn.style.setProperty('--y', '50%');
        });
    });

    // ---- Cursor Glow Follower ----
    const cursorGlow = document.getElementById('cursor-glow');
    const hasHover = window.matchMedia('(hover: hover)').matches;

    if (hasHover && cursorGlow) {
        let mouseX = 0, mouseY = 0;
        let glowX = 0, glowY = 0;
        let rafId;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!cursorGlow.classList.contains('active')) {
                cursorGlow.classList.add('active');
            }
        });

        document.addEventListener('mouseleave', () => {
            cursorGlow.classList.remove('active');
        });

        const animateGlow = () => {
            // Smooth lerp for buttery movement
            glowX += (mouseX - glowX) * 0.1;
            glowY += (mouseY - glowY) * 0.1;
            cursorGlow.style.left = glowX + 'px';
            cursorGlow.style.top = glowY + 'px';
            rafId = requestAnimationFrame(animateGlow);
        };
        animateGlow();
    }

    // ---- Card Cursor-Tracking Glow ----
    const glowCards = document.querySelectorAll('.focus-card, .project-card, .blog-card, .value');

    document.addEventListener('mousemove', (e) => {
        glowCards.forEach(card => {
            const rect = card.getBoundingClientRect();
            // Only update if mouse is near the card (with some margin)
            if (
                e.clientX >= rect.left - 100 &&
                e.clientX <= rect.right + 100 &&
                e.clientY >= rect.top - 100 &&
                e.clientY <= rect.bottom + 100
            ) {
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--mouse-x', x + 'px');
                card.style.setProperty('--mouse-y', y + 'px');
            }
        });
    });

    // ---- Form Inline Validation ----
    const form = document.getElementById('contact-form');
    if (form) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const validateField = (input) => {
            const group = input.closest('.form-group');
            if (!group) return true;

            let isValid = true;

            if (input.required && !input.value.trim()) {
                isValid = false;
            } else if (input.type === 'email' && input.value.trim() && !emailRegex.test(input.value.trim())) {
                isValid = false;
            }

            group.classList.toggle('error', !isValid);
            group.classList.toggle('success', isValid && input.value.trim().length > 0);
            return isValid;
        };

        // Validate on blur
        form.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            // Remove error on typing
            input.addEventListener('input', () => {
                const group = input.closest('.form-group');
                if (group && group.classList.contains('error')) {
                    validateField(input);
                }
            });
        });

        // Form submit
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const fields = form.querySelectorAll('input[required], textarea[required]');
            let allValid = true;
            let firstInvalid = null;

            fields.forEach(field => {
                if (!validateField(field)) {
                    allValid = false;
                    if (!firstInvalid) firstInvalid = field;
                }
            });

            if (!allValid) {
                firstInvalid.focus();
                return;
            }

            // Construct mailto link with form data
            const name = form.querySelector('input[name="name"]')?.value || '';
            const email = form.querySelector('input[name="email"]')?.value || '';
            const interest = form.querySelector('select[name="interest"]')?.value || form.querySelector('input[name="interest"]')?.value || 'General Inquiry';
            const message = form.querySelector('textarea[name="message"]')?.value || '';

            const subject = encodeURIComponent('QIRA Contact: ' + interest);
            const body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message);
            const mailtoLink = 'mailto:contact@qira.org?subject=' + subject + '&body=' + body;

            window.location.href = mailtoLink;

            const btn = form.querySelector('button[type="submit"]');
            btn.textContent = 'Opening your email client...';
            btn.style.background = 'var(--color-success)';
            btn.disabled = true;

            setTimeout(() => {
                btn.textContent = 'Send Message';
                btn.style.background = '';
                btn.disabled = false;
                form.reset();
                form.querySelectorAll('.form-group').forEach(g => {
                    g.classList.remove('success', 'error');
                });
            }, 3000);
        });
    }

    // ---- Active nav link on scroll ----
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const updateActiveLink = () => {
        const scrollPos = window.scrollY + 100;
        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < bottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', updateActiveLink, { passive: true });
});
