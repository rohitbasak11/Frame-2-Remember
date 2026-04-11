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
   LIVE GRADIENT POINTER ORB
   ===================================================== */
const pointerOrb = document.getElementById('gradient-pointer');
if (pointerOrb) {
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let orbX = mouseX, orbY = mouseY;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    (function updateOrb() {
        orbX += (mouseX - orbX) * 0.06;
        orbY += (mouseY - orbY) * 0.06;
        pointerOrb.style.transform = `translate(calc(${orbX}px - 50%), calc(${orbY}px - 50%))`;
        requestAnimationFrame(updateOrb);
    })();
}

/* =====================================================
   CUSTOM CURSOR
   ===================================================== */
const cursorDot  = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-follower');
if (cursorDot && cursorRing) {
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;

    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        gsap.set(cursorDot, { x: mx, y: my });
    });

    (function animateCursor() {
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
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

// The target width for the logo in the navbar (fixed, not from placeholder which starts at 0)
const NAV_LOGO_W = 140;

/**
 * Get the center coords of the placeholder AFTER the navbar has transitioned
 * to its scrolled state (placeholder width = NAV_LOGO_W).
 * We force the scrolled class temporarily to measure, then revert.
 */
function getPlaceholderCenter() {
    if (!placeholder) return { x: window.innerWidth / 2, y: 35 };
    const rect = placeholder.getBoundingClientRect();
    // If width is 0 (at-top state), compute where it WILL be when scrolled
    if (rect.width < 10) {
        // Navbar container is flex centered with gap:56px on each side of placeholder
        // Approximate: center of viewport horizontally, top of navbar
        const navH = navbar ? navbar.getBoundingClientRect().height : 70;
        return { x: window.innerWidth / 2, y: navH / 2 };
    }
    return {
        x: rect.left + rect.width / 2,
        y: rect.top  + rect.height / 2,
    };
}

if (logoEl && logoContainer && isHome) {
    // ── HOME PAGE ──────────────────────────────────────────
    // Step 1: Place logo centered in viewport, large
    gsap.set(logoEl, {
        position: 'absolute', // Let GSAP control all positioning via x/y
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        xPercent: -50,
        yPercent: -50,
        width: 460,
        autoAlpha: 1,
    });

    // Step 2: Make sure content starts hidden
    gsap.set('#smooth-content', { autoAlpha: 0 });

    // Step 3: Start at-top navbar state
    navbar?.classList.add('at-top');
    navbar?.classList.remove('scrolled');

    // Step 4: Build the pin + scrub timeline
    //
    // Layout of "virtual" scroll canvas:
    //   0%   – 100%  : logo moves to navbar + navbar splits + hero text zooms in
    //   100% – end   : pin releases, content visible
    //
    const heroTl = gsap.timeline({
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: '+=120%',          // 120vh of scroll travel
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate(self) {
                // Drive navbar state from scroll progress
                if (self.progress > 0.04 && navbar) {
                    navbar.classList.add('scrolled');
                    navbar.classList.remove('at-top');
                } else if (navbar) {
                    navbar.classList.remove('scrolled');
                    navbar.classList.add('at-top');
                }
            },
            onLeave() {
                // Pin is done — reveal main content
                gsap.to('#smooth-content', { autoAlpha: 1, duration: 0.6, ease: 'power2.out' });
            },
            onEnterBack() {
                gsap.to('#smooth-content', { autoAlpha: 0, duration: 0.3 });
            },
        },
    });

    // 0.0 – 0.1  scroll indicator fades out fast
    heroTl.to('.hero-scroll-indicator', { autoAlpha: 0, y: 10, duration: 0.1 }, 0);

    // 0.0 – 0.6  logo moves from center → navbar center
    heroTl.to(logoEl, {
        x: () => getPlaceholderCenter().x,
        y: () => getPlaceholderCenter().y,
        width: NAV_LOGO_W,
        ease: 'power2.inOut',
        duration: 0.6,
    }, 0);

    // 0.0 – 0.5  "Capturing Moments" smooth fade-in and zoom
    heroTl.fromTo('.hero-content h1',
        { opacity: 0, scale: 0.2 },
        { opacity: 1, scale: 1, ease: 'power2.out', duration: 0.6 },
    0);

    // 0.3 – 0.6  subtitle fades up much earlier
    heroTl.to('.hero-subtitle', { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.3 }, 0.3);

    // 0.4 – 0.7  CTA fades up earlier
    heroTl.to('.hero-cta', { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.3 }, 0.4);

    // Resize: re-center logo if it hasn't moved yet
    window.addEventListener('resize', () => {
        if (!ScrollTrigger.getById('heroPin')) return;
        const st = heroTl.scrollTrigger;
        if (st && st.progress < 0.02) {
            gsap.set(logoEl, {
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
                width: 460,
            });
        }
        ScrollTrigger.refresh();
    });

} else if (logoEl && logoContainer) {
    // ── INTERIOR PAGES ────────────────────────────────────
    // Content is always visible
    gsap.set('#smooth-content', { autoAlpha: 1 });

    // Place logo in navbar center after layout is ready
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            const c = getPlaceholderCenter();
            gsap.set(logoEl, {
                x: c.x,
                y: c.y,
                xPercent: -50,
                yPercent: -50,
                width: NAV_LOGO_W,
                autoAlpha: 1,
            });
        });
    });
}

/* =====================================================
   PAGE LOAD — DEVELOPING PHOTO EFFECT
   ===================================================== */
window.addEventListener('load', () => {
    gsap.timeline()
        .set('#transition-overlay', { autoAlpha: 0.9 })
        .to('#transition-overlay', { autoAlpha: 0, duration: 1.8, ease: 'power2.inOut' })
        .to('#smooth-wrapper', {
            filter: 'blur(0px) grayscale(0%) sepia(0%)',
            opacity: 1,
            duration: 2,
            ease: 'power2.out',
        }, '-=1.3');
});

/* =====================================================
   SCROLL REVEAL — IntersectionObserver
   ===================================================== */
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            observer.unobserve(e.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-text').forEach(el => observer.observe(el));

/* =====================================================
   GALLERY — 3D TILT ON HOVER
   ===================================================== */
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

/* =====================================================
   CAMERA FLASH — PAGE TRANSITIONS
   ===================================================== */
const flash   = document.getElementById('camera-flash');
const overlay = document.getElementById('transition-overlay');

document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('mailto') || link.target === '_blank') return;
        e.preventDefault();
        gsap.timeline({ onComplete: () => { window.location.href = href; } })
            .to(flash,   { autoAlpha: 1, duration: 0.05 })
            .to(flash,   { autoAlpha: 0, duration: 0.25 })
            .to(overlay, { autoAlpha: 1, duration: 0.5 }, '-=0.15');
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
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            menuToggle.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

console.log('Frame 2 Remember ✦ loaded');
