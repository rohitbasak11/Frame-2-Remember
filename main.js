import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/* =====================================================
   SMOOTH SCROLL (Lenis)
   ===================================================== */
const lenis = new Lenis({
    duration: 1.1,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
});
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(time => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

/* =====================================================
   CUSTOM CURSOR
   ===================================================== */
const cursorDot  = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-follower');

// Merge all mousemove work into one listener
let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
let orbX = mouseX, orbY = mouseY;
let rx = mouseX, ry = mouseY;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursorDot) gsap.set(cursorDot, { x: mouseX, y: mouseY });
});

// Pointer orb smooth follow
const pointerOrb = document.getElementById('gradient-pointer');
if (pointerOrb) {
    (function updateOrb() {
        orbX += (mouseX - orbX) * 0.06;
        orbY += (mouseY - orbY) * 0.06;
        pointerOrb.style.transform = `translate(calc(${orbX}px - 50%), calc(${orbY}px - 50%))`;
        requestAnimationFrame(updateOrb);
    })();
}

// Cursor ring smooth follow
if (cursorDot && cursorRing) {
    (function animateCursor() {
        rx += (mouseX - rx) * 0.12;
        ry += (mouseY - ry) * 0.12;
        gsap.set(cursorRing, { x: rx, y: ry });
        requestAnimationFrame(animateCursor);
    })();

    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => gsap.to(cursorRing, { scale: 2, duration: 0.3, ease: 'power2.out' }));
        el.addEventListener('mouseleave', () => gsap.to(cursorRing, { scale: 1, duration: 0.3, ease: 'power2.out' }));
    });
}

/* =====================================================
   DETECT PAGE TYPE
   ===================================================== */
const isHome = ['/', '/index.html'].includes(window.location.pathname) ||
               window.location.pathname === '' ||
               window.location.pathname.endsWith('/index.html');

/* =====================================================
   NAVBAR — SCROLL STATE
   ===================================================== */
const navbar = document.querySelector('.navbar');

// Interior pages: always show scrolled state
if (navbar && !isHome) {
    navbar.classList.add('scrolled');
    navbar.classList.remove('at-top');
}

/* =====================================================
   LOGO ANIMATION
   ===================================================== */
const logoEl        = document.getElementById('main-logo');
const logoContainer = document.getElementById('logo-main-container');
const placeholder   = document.getElementById('nav-logo-placeholder');

// Dynamic dimensions for the navbar logo based on breakpoint
function getNavLogoDims() {
    const isSmall = window.innerWidth <= 920;
    return {
        w: isSmall ? 120 : 250,
        h: isSmall ? 40 : 86
    };
}

/**
 * Get the center coords of the placeholder AFTER the navbar has transitioned
 * to its scrolled state (placeholder width = NAV_LOGO_W).
 * We force the scrolled class temporarily to measure, then revert.
 */
function getPlaceholderCenter() {
    if (!placeholder) return { x: window.innerWidth / 2, y: 36 };
    const rect = placeholder.getBoundingClientRect();
    
    // Fixed Y based on current navbar state
    const isSmall = window.innerWidth <= 920;
    // Mobile: 14px top + 40px placeholder + 14px bottom = 68px. Center = 34.
    // Desktop: 14px top + 65px placeholder + 14px bottom = 93px. Center ~ 48.
    const NAV_CENTER_Y = isSmall ? 34 : 48;

    if (rect.width < 10) {
        return { x: window.innerWidth / 2, y: NAV_CENTER_Y };
    }
    return {
        x: rect.left + rect.width / 2,
        y: NAV_CENTER_Y,
    };
}

if (logoEl && logoContainer && isHome) {
    // ── HOME PAGE ──────────────────────────────────────────
    let heroTl;
    let mm = gsap.matchMedia();

    mm.add("(min-width: 0px)", () => {
        // Step 1: Initial large centered state
        gsap.set(logoEl, {
            position: 'absolute',
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            xPercent: -50,
            yPercent: -50,
            width: window.innerWidth < 480 ? 280 : 460,
            autoAlpha: 1,
        });

        gsap.set('#smooth-wrapper', { filter: 'blur(8px) grayscale(100%) sepia(40%)', opacity: 0.3 });
        gsap.set('#smooth-content', { autoAlpha: 0 });
        navbar?.classList.add('at-top');
        navbar?.classList.remove('scrolled');

        // Step 2: Build the Timeline
        heroTl = gsap.timeline({
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: '+=60%',
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true,
                onUpdate(self) {
                    if (self.progress > 0.04 && navbar) {
                        navbar.classList.add('scrolled');
                        navbar.classList.remove('at-top');
                    } else if (navbar) {
                        navbar.classList.remove('scrolled');
                        navbar.classList.add('at-top');
                    }
                },
                onLeave() {
                    gsap.to('#smooth-content', { autoAlpha: 1, duration: 0.6 });
                },
                onEnterBack() {
                    gsap.to('#smooth-content', { autoAlpha: 0, duration: 0.2 });
                },
            },
        });

        // 0.0 – 0.6: Logo moves to navbar
        heroTl.to(logoEl, {
            x: () => getPlaceholderCenter().x,
            y: () => getPlaceholderCenter().y,
            width: () => getNavLogoDims().w,
            height: () => getNavLogoDims().h,
            ease: 'power2.inOut',
            duration: 0.6,
        }, 0);

        // One-time Entrance Animation for Hero Content (so it doesn't replay on scroll up)
        gsap.timeline({
            scrollTrigger: {
                trigger: '.hero-content',
                start: 'top 85%',
                toggleActions: "play none none none",
                once: true
            }
        })
        .fromTo('.hero-content h1',
            { autoAlpha: 0, scale: 0.88, zIndex: 10 },
            { autoAlpha: 1, scale: 1, ease: 'power2.out', duration: 1.2 }
        )
        .fromTo('.hero-glass-card',
            { autoAlpha: 0, y: 30, zIndex: 10 },
            { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 1.2 },
            '-=0.8'
        );

        return () => {
            // Clean up when media changes or refresh happens
            if (heroTl) heroTl.kill();
        };
    });

    // Independent Scroll Indicator logic (fixes "sometimes shows" issue)
    ScrollTrigger.create({
        trigger: '.hero',
        start: 'top top',
        onUpdate: (self) => {
            // Fades out linearly as you scroll down
            const op = Math.max(0, 1 - self.progress * 8);
            gsap.set('.hero-scroll-indicator', { 
                autoAlpha: op,
                y: self.progress * 40
            });
        }
    });

} else if (logoEl && logoContainer) {
    // ── INTERIOR PAGES ────────────────────────────────────
    gsap.set('#smooth-wrapper', { filter: 'none', opacity: 1 });
    gsap.set('#smooth-content', { autoAlpha: 1 });
    gsap.set(logoEl, { autoAlpha: 0 });

    const posInteriorLogo = () => {
        const c = getPlaceholderCenter();
        const dims = getNavLogoDims();
        gsap.set(logoEl, {
            x: c.x,
            y: c.y,
            xPercent: -50,
            yPercent: -50,
            width: dims.w,
            height: dims.h,
        });
    };

    requestAnimationFrame(() => {
        posInteriorLogo();
        gsap.to(logoEl, { autoAlpha: 1, duration: 0.35, ease: 'power2.out', delay: 0.05 });
    });

    window.addEventListener('resize', posInteriorLogo);
}

// Global Resize Hardening
let lastWidth = window.innerWidth;
window.addEventListener('resize', () => {
    if (Math.abs(window.innerWidth - lastWidth) > 5) {
        lastWidth = window.innerWidth;
        ScrollTrigger.refresh();
    }
});

/* =====================================================
   PAGE LOAD — DEVELOPING PHOTO EFFECT
   ===================================================== */
window.addEventListener('load', () => {
    gsap.timeline()
        .set('#transition-overlay', { autoAlpha: 0.9 })
        .to('#transition-overlay', { autoAlpha: 0, duration: 1.5, ease: 'power2.inOut' })
        .to('#smooth-wrapper', {
            filter: 'blur(0px) grayscale(0%) sepia(0%)',
            opacity: 1,
            duration: 1.8,
            ease: 'power2.out',
        }, '-=1.1');
});

// Fallback: Ensure unblur happens even if load event is late
setTimeout(() => {
    gsap.to('#smooth-wrapper', {
        filter: 'blur(0px) grayscale(0%) sepia(0%)',
        opacity: 1,
        duration: 1,
        overwrite: 'auto'
    });
    gsap.to('#transition-overlay', { autoAlpha: 0, duration: 0.5, overwrite: 'auto' });
}, 2500);

/* =====================================================
   SCROLL REVEAL — GSAP ScrollTrigger (Reliable)
   ===================================================== */
document.querySelectorAll('.reveal, .reveal-text').forEach(el => {
    ScrollTrigger.create({
        trigger: el,
        start: 'top 92%', // Trigger earlier for better feel
        onEnter: () => el.classList.add('visible'),
        once: true
    });
});

/* =====================================================
   GALLERY — 3D TILT ON HOVER (desktop only)
   ===================================================== */
if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('mousemove', e => {
            const r = item.getBoundingClientRect();
            const x = ((e.clientX - r.left) / r.width  - 0.5) * 2;
            const y = ((e.clientY - r.top)  / r.height - 0.5) * 2;
            gsap.to(item, {
                rotateY: x * 10,
                rotateX: -y * 7,
                scale: 1.03,
                duration: 0.45,
                ease: 'power2.out',
                transformPerspective: 900,
            });
        });
        item.addEventListener('mouseleave', () => {
            gsap.to(item, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.7, ease: 'elastic.out(1, 0.55)' });
        });
    });
}

/* =====================================================
   CAMERA FLASH — PAGE TRANSITIONS
   ===================================================== */
const flash   = document.getElementById('camera-flash');
const overlay = document.getElementById('transition-overlay');

document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('mailto') || href.startsWith('http') || link.target === '_blank' || link.classList.contains('glightbox')) return;
        
        // Handle internal deep links
        if (href.startsWith('#') || href.includes('/#')) {
            const targetId = href.split('#')[1];
            const targetEl = document.getElementById(targetId);
            if (targetEl && isHome) {
                e.preventDefault();
                // Close mobile menu if open
                const mobileMenu = document.querySelector('.mobile-menu');
                const menuToggle = document.querySelector('.menu-toggle');
                if (mobileMenu && menuToggle) {
                    mobileMenu.classList.remove('open');
                    menuToggle.classList.remove('open');
                    document.body.style.overflow = '';
                }
                lenis.scrollTo(targetEl, { offset: -80 });
            }
            return; // Exit here, let native or Lenis handle it, do NOT do the flash transition
        }
        
        if (href === window.location.pathname || href === window.location.href || (href === '/' && isHome)) {
            e.preventDefault();
            // Close mobile menu if open
            const mobileMenu = document.querySelector('.mobile-menu');
            const menuToggle = document.querySelector('.menu-toggle');
            if (mobileMenu && menuToggle) {
                mobileMenu.classList.remove('open');
                menuToggle.classList.remove('open');
                document.body.style.overflow = '';
            }
            if (typeof lenis !== 'undefined') lenis.scrollTo(0);
            return; 
        } // same page — scroll to top
        e.preventDefault();
        // Quick snappy transition — flash then navigate
        gsap.timeline({ onComplete: () => { window.location.href = href; } })
            .to(flash,   { autoAlpha: 1, duration: 0.05 })
            .to(flash,   { autoAlpha: 0, duration: 0.15 })
            .to(overlay, { autoAlpha: 1, duration: 0.25 }, '-=0.1');
    });
});

/* =====================================================
   MOBILE MENU TOGGLE
   ===================================================== */
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
        const open = mobileMenu.classList.toggle('open');
        menuToggle.classList.toggle('open', open);
        // Prevent body scroll while menu is open
        document.body.style.overflow = open ? 'hidden' : '';
        mobileMenu.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                menuToggle.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    });
}

// Touch support for nav dropdowns
document.querySelectorAll('.nav-dropdown > a').forEach(link => {
    link.addEventListener('click', (e) => {
        if (window.matchMedia('(hover: none)').matches) {
            e.preventDefault();
            e.currentTarget.closest('.nav-dropdown').classList.toggle('touch-open');
        }
    });
});

/* =====================================================
   SCROLL-DRIVEN GRADIENT MOVEMENT
   ===================================================== */
const gradientBg = document.getElementById('gradient-bg');
if (gradientBg) {
    // The background slowly rotates as you scroll down the page,
    // which exponentially increases the visual movement of the orbs.
    gsap.to(gradientBg, {
        rotation: 45,
        scale: 1.25,
        ease: "none",
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 1
        }
    });
}

/* =====================================================
   GALLERY ALBUM MODAL LOGIC (Fix for filter bugs)
   ===================================================== */
let activeLightbox = null;

document.addEventListener('DOMContentLoaded', () => {
    const albumModal = document.getElementById('album-modal');
    if (!albumModal) return;

    const modalTitle = document.getElementById('modal-album-title');
    const modalDesc = document.getElementById('modal-album-desc');
    const modalThumbs = document.getElementById('modal-thumbnails');
    const closeBtn = albumModal.querySelector('.album-close-btn');
    const bgOverlay = albumModal.querySelector('.modal-bg-overlay');

    const openAlbum = (item) => {
        const title = item.dataset.title;
        const desc = item.dataset.desc;
        const albumType = item.dataset.albumType;
        const links = item.querySelectorAll('.hidden-album-data a');

        // Populate Content
        modalTitle.textContent = title;
        modalDesc.textContent = desc;
        modalThumbs.innerHTML = '';

        links.forEach((link, i) => {
            const href = link.getAttribute('href');
            const tClass = `t${(i % 8) + 1}`;

            const thumbA = document.createElement('a');
            thumbA.href = href;
            thumbA.className = `glightbox thumb ${tClass}`;
            thumbA.setAttribute('data-gallery', albumType);

            const img = document.createElement('img');
            img.src = href;
            img.alt = `${title} photo ${i + 1}`;
            img.setAttribute('loading', 'lazy');

            thumbA.appendChild(img);
            modalThumbs.appendChild(thumbA);

            // Add organic drift
            const driftY = 20 + Math.random() * 30;
            const driftX = 15 + Math.random() * 25;
            const rot = (Math.random() - 0.5) * 12;

            gsap.to(thumbA, {
                y: `+=${driftY}`,
                x: `+=${driftX}`,
                rotation: `+=${rot}`,
                duration: 4 + Math.random() * 2,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: i * 0.15
            });
        });

        // Show Modal
        albumModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Init lightbox after DOM flush to avoid race condition
        requestAnimationFrame(() => {
            if (activeLightbox) activeLightbox.destroy();
            activeLightbox = GLightbox({
                selector: '.glightbox',
                touchNavigation: true,
                loop: true,
                zoomable: true
            });
        });
    };

    const closeAlbum = () => {
        albumModal.classList.remove('active');
        document.body.style.overflow = '';
        modalThumbs.innerHTML = '';
        gsap.killTweensOf('.thumb');
    };

    // Attach Click and Keyboard Events to Cards
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => openAlbum(item));
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openAlbum(item);
            }
        });
    });

    // Close Triggers
    closeBtn.addEventListener('click', closeAlbum);
    bgOverlay.addEventListener('click', closeAlbum);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAlbum();
    });
});

/* =====================================================
   PORTFOLIO PAGE SPECIAL UX
   ===================================================== */
const isPortfolio = window.location.pathname.includes('portfolio.html');

if (isPortfolio) {
    // 1. Navbar Auto-collapse & Slim Headers on Scroll
    let lastScroll = 0;
    const scrollThreshold = 100;

    lenis.on('scroll', ({ scroll }) => {
        const isScrollingDown = scroll > lastScroll;
        const columnHeaders = document.querySelectorAll('.column-header');
        const mainLogo = document.getElementById('main-logo');

        if (scroll > scrollThreshold && isScrollingDown) {
            navbar?.classList.add('nav-hidden');
            mainLogo?.classList.add('nav-hidden');
            columnHeaders.forEach(h => h.classList.add('slim'));
        } else if (!isScrollingDown || scroll <= scrollThreshold) {
            navbar?.classList.remove('nav-hidden');
            mainLogo?.classList.remove('nav-hidden');
            columnHeaders.forEach(h => h.classList.remove('slim'));
        }
        lastScroll = scroll;
    });

    // 2. GLightbox Init (Ensuring it hooks correctly after DOM/JS ready)
    // Wait for the "developing" animation to finish before enabling lightbox clicks
    const initLightbox = () => {
        if (typeof GLightbox !== 'undefined') {
            GLightbox({
                selector: '.glightbox',
                touchNavigation: true,
                loop: true,
                zoomable: true,
                openEffect: 'zoom',
                closeEffect: 'zoom',
                slideEffect: 'fade'
            });
        }
    };

    window.addEventListener('load', initLightbox);
    // Extra safety: re-init if not ready
    setTimeout(initLightbox, 3000);
}

/* =====================================================
   DARK MODE LOGIC
   ===================================================== */
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'light';

// Initial check on load
if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
} else {
    document.documentElement.setAttribute('data-theme', 'light');
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme');
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        
        // Apply camera flash effect for smooth transition
        const flash = document.getElementById('camera-flash');
        if (flash) {
            gsap.to(flash, {
                opacity: 1, 
                duration: 0.2, 
                ease: 'power2.in',
                onComplete: () => {
                    document.documentElement.setAttribute('data-theme', newTheme);
                    localStorage.setItem('theme', newTheme);
                    gsap.to(flash, { 
                        opacity: 0, 
                        duration: 0.5, 
                        ease: 'power2.out',
                        delay: 0.1 
                    });
                }
            });
        } else {
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        }
    });
}

/* =====================================================
   SCROLL SPY / ACTIVE STATE LOGIC
   ===================================================== */
if (isHome) {
    const sections = document.querySelectorAll('section, div[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px', // Trigger when section passes the middle of viewport
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Determine target ID
                let id = entry.target.getAttribute('id');
                
                // If it's a section without an ID but is part of hero, consider it home
                if (!id && entry.target.classList.contains('hero')) {
                    id = ''; // Home
                }
                
                // Update nav links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    const linkHref = link.getAttribute('href');
                    
                    if (id === '') {
                        if (linkHref === '/' || linkHref === '/index.html' || linkHref === '') {
                            link.classList.add('active');
                        }
                    } else if (id && linkHref.includes(`#${id}`)) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}
