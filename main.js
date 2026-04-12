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

// The target width for the logo in the navbar (fixed, not from placeholder which starts at 0)
const NAV_LOGO_W = 140;

/**
 * Get the center coords of the placeholder AFTER the navbar has transitioned
 * to its scrolled state (placeholder width = NAV_LOGO_W).
 * We force the scrolled class temporarily to measure, then revert.
 */
function getPlaceholderCenter() {
    if (!placeholder) return { x: window.innerWidth / 2, y: 36 };
    const rect = placeholder.getBoundingClientRect();
    // Fixed Y: always target the visual center of the scrolled navbar.
    // Scrolled navbar: 14px top padding + 45px placeholder height + 14px bottom = 73px total.
    // Center = 36.5px. We use a fixed value so the logo always lands in the same spot
    // regardless of when getBoundingClientRect() is called during the CSS transition.
    const NAV_CENTER_Y = 36;
    if (rect.width < 10) {
        // Placeholder not yet expanded — estimate X as viewport center
        return { x: window.innerWidth / 2, y: NAV_CENTER_Y };
    }
    return {
        x: rect.left + rect.width / 2,
        y: NAV_CENTER_Y,
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

    // Step 2: Apply developing-photo blur effect (home page only — CSS default is none)
    gsap.set('#smooth-wrapper', { filter: 'blur(8px) grayscale(100%) sepia(40%)', opacity: 0.3 });

    // Step 3: Make sure content starts hidden
    gsap.set('#smooth-content', { autoAlpha: 0 });

    // Step 4: Start at-top navbar state
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
                // Pin done — reveal main content
                gsap.to('#smooth-content', { autoAlpha: 1, duration: 0.6, ease: 'power2.out' });
            },
            onEnterBack() {
                // Hide page content
                gsap.to('#smooth-content', { autoAlpha: 0, duration: 0.2 });
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

    // 0.3 – 0.6  card block fades up much earlier
    heroTl.to('.hero-glass-card', { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.4 }, 0.3);

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
    // Make sure smooth-wrapper is never blurred on interior pages
    gsap.set('#smooth-wrapper', { filter: 'none', opacity: 1 });
    gsap.set('#smooth-content', { autoAlpha: 1 });
    // Start logo invisible to prevent jump-from-nowhere flash
    gsap.set(logoEl, { autoAlpha: 0 });

    // Position logo in navbar center THEN fade it in
    requestAnimationFrame(() => {
        const c = getPlaceholderCenter();
        gsap.set(logoEl, {
            x: c.x,
            y: c.y,
            xPercent: -50,
            yPercent: -50,
            width: NAV_LOGO_W,
        });
        // Gentle fade-in after position is locked
        gsap.to(logoEl, { autoAlpha: 1, duration: 0.35, ease: 'power2.out', delay: 0.05 });
    });
}

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
        if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('http') || link.target === '_blank' || link.classList.contains('glightbox')) return;
        if (href === window.location.pathname || href === window.location.href) return; // same page
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
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            menuToggle.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

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
