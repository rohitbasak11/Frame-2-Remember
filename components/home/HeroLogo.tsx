"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

export default function HeroLogo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const solidLayerRef = useRef<HTMLDivElement>(null);
  const meshLayerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState("00.24.99");
  
  // Use a ref for values that need to be accessed in the RAF loop without triggering re-renders
  const mousePos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const maskSize = useRef({ value: 0 });

  const LogoSVG = useCallback(() => (
    <svg
      viewBox="0 0 400 300"
      className="w-[300px] h-[225px] md:w-[600px] md:h-[450px] lg:w-[800px] lg:h-[600px] pointer-events-none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="200" cy="120" r="80" stroke="currentColor" className="mesh-stroke" strokeWidth="0.5" strokeDasharray="5 5" />
      <circle cx="200" cy="120" r="60" stroke="currentColor" className="mesh-stroke" strokeWidth="1" />
      <circle cx="200" cy="120" r="40" stroke="currentColor" className="mesh-stroke" strokeWidth="0.5" strokeDasharray="2 2" />
      <path d="M120 100 V160 M120 100 H150 M120 130 H140" stroke="currentColor" className="mesh-stroke" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M190 105 C190 90, 210 90, 210 105 C210 120, 190 130, 190 145 H210" stroke="currentColor" className="mesh-stroke" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M250 160 V100 H280 C290 100, 290 125, 280 125 H250 M265 125 L290 160" stroke="currentColor" className="mesh-stroke" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="100" y="175" width="200" height="30" stroke="currentColor" className="mesh-stroke" strokeWidth="0.5" />
      <text x="200" y="195" fill="currentColor" fontSize="10" textAnchor="middle" letterSpacing="2" className="mesh-stroke opacity-60 font-mono uppercase">FRAME TO REMEMBER</text>
      <line x1="200" y1="0" x2="200" y2="300" stroke="currentColor" className="mesh-stroke opacity-20" strokeWidth="0.2" />
      <line x1="0" y1="120" x2="400" y2="120" stroke="currentColor" className="mesh-stroke opacity-20" strokeWidth="0.2" />
      <path d="M50 50 L350 250" stroke="currentColor" className="mesh-stroke opacity-10" strokeWidth="0.5" strokeDasharray="10 10" />
      <path d="M350 50 L50 250" stroke="currentColor" className="mesh-stroke opacity-10" strokeWidth="0.5" strokeDasharray="10 10" />
    </svg>
  ), []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Initial State
      gsap.set(containerRef.current, {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2005,
        touchAction: "none", // Prevent default touch actions like panning/zooming
      });

      // 2. Mesh Animations
      gsap.to(".mesh-stroke", { strokeOpacity: 0.05, duration: 2, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".rec-dot", { opacity: 0, duration: 0.6, repeat: -1, yoyo: true, ease: "steps(1)" });

      // 3. Scroll Animation
      ScrollTrigger.create({
        trigger: "body",
        start: "top top",
        end: "300px top",
        scrub: 1.2,
        animation: gsap.to(containerRef.current, {
          y: () => -(window.innerHeight * 0.5 - 48),
          scale: 0.15,
          autoAlpha: 1,
          ease: "power2.inOut",
        }),
      });

      // 4. Performance Driver (Unified Loop)
      const xSetter = gsap.quickSetter(containerRef.current, "--mask-x", "px");
      const ySetter = gsap.quickSetter(containerRef.current, "--mask-y", "px");
      const sizeSetter = gsap.quickSetter(containerRef.current, "--mask-size", "px");

      const tick = () => {
        // Smoothly interpolate current position toward mouse position (inertia)
        currentPos.current.x += (mousePos.current.x - currentPos.current.x) * 0.15;
        currentPos.current.y += (mousePos.current.y - currentPos.current.y) * 0.15;

        xSetter(currentPos.current.x);
        ySetter(currentPos.current.y);
        sizeSetter(maskSize.current.value);

        // Apply Parallax based on interpolated position
        const nx = (currentPos.current.x / window.innerWidth - 0.5) * 2;
        const ny = (currentPos.current.y / window.innerHeight - 0.5) * 2;
        
        gsap.set([solidLayerRef.current, meshLayerRef.current], {
          x: nx * 25,
          y: ny * 25,
        });

        requestAnimationFrame(tick);
      };

      const rafId = requestAnimationFrame(tick);

      // 5. Unified Event Handlers
      const onMove = (x: number, y: number) => {
        mousePos.current = { x, y };
        // Random coords update logic
        if (Math.random() > 0.98) {
          setCoords(`${Math.floor(x / 12).toString().padStart(2, '0')}.${Math.floor(y / 12).toString().padStart(2, '0')}.${Math.floor(Math.random() * 99).toString().padStart(2, '0')}`);
        }
      };

      const onEnter = () => {
        gsap.to(maskSize.current, {
          value: 180,
          duration: 0.5,
          ease: "back.out(1.7)",
        });
      };

      const onLeave = () => {
        gsap.to(maskSize.current, {
          value: 0,
          duration: 0.8,
          ease: "power2.in", // Smooth snap back
        });
      };

      // Mouse Listeners
      const handleMouseMove = (e: MouseEvent) => onMove(e.clientX, e.clientY);
      const handleMouseEnter = () => onEnter();
      const handleMouseLeave = () => onLeave();

      // Touch Listeners
      const handleTouchMove = (e: TouchEvent) => {
        if (e.touches[0]) {
          // IMPORTANT: preventDefault stops the page from scrolling while interacting
          if (e.cancelable) e.preventDefault();
          onMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      };
      
      const handleTouchStart = (e: TouchEvent) => {
        if (e.touches[0]) {
          onMove(e.touches[0].clientX, e.touches[0].clientY);
          // Set currentPos immediately to touch start to avoid jump
          currentPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
          onEnter();
        }
      };

      const handleTouchEnd = () => onLeave();

      const el = containerRef.current;
      if (el) {
        el.addEventListener("mousemove", handleMouseMove);
        el.addEventListener("mouseenter", handleMouseEnter);
        el.addEventListener("mouseleave", handleMouseLeave);
        
        // Use non-passive for touchmove to allow preventDefault
        el.addEventListener("touchstart", handleTouchStart, { passive: true });
        el.addEventListener("touchmove", handleTouchMove, { passive: false });
        el.addEventListener("touchend", handleTouchEnd, { passive: true });
        el.addEventListener("touchcancel", handleTouchEnd, { passive: true });
      }

      return () => {
        cancelAnimationFrame(rafId);
        if (el) {
          el.removeEventListener("mousemove", handleMouseMove);
          el.removeEventListener("mouseenter", handleMouseEnter);
          el.removeEventListener("mouseleave", handleMouseLeave);
          el.removeEventListener("touchstart", handleTouchStart);
          el.removeEventListener("touchmove", handleTouchMove);
          el.removeEventListener("touchend", handleTouchEnd);
          el.removeEventListener("touchcancel", handleTouchEnd);
        }
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
        ref={containerRef} 
        className="hero-logo-container select-none group pointer-events-auto"
    >
      {/* Base Layer: Solid Logo */}
      <div ref={solidLayerRef} className="absolute inset-0 flex flex-col items-center justify-center opacity-100 px-4">
        <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] flex items-center justify-center">
            <Image 
                src="/Logo-1.png"
                alt="Frame 2 Remember"
                fill
                priority
                className="object-contain"
            />
        </div>
      </div>

      {/* Top Layer: Mesh Reveal (X-Ray) */}
      <div 
        ref={meshLayerRef} 
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
            clipPath: `circle(var(--mask-size) at var(--mask-x, 0px) var(--mask-y, 0px))`,
            WebkitClipPath: `circle(var(--mask-size) at var(--mask-x, 0px) var(--mask-y, 0px))`,
        }}
      >
        <div className="relative flex flex-col items-center justify-center text-center">
            <LogoSVG />
            
            <div className="absolute w-[400px] h-[300px] md:w-[800px] md:h-[600px] pointer-events-none">
                <div className="absolute top-12 left-12 flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-600 rec-dot shadow-[0_0_12px_rgba(220,38,38,0.6)]" />
                    <span className="text-sm font-black tracking-[0.3em] opacity-90 uppercase text-color-text">REC</span>
                </div>
                
                <div className="absolute bottom-12 right-12 flex flex-col items-end text-color-text">
                    <span className="text-[10px] font-mono opacity-30 tracking-widest uppercase mb-1">Matrix Ref</span>
                    <span className="text-base font-mono opacity-50 tabular-nums tracking-tighter">{coords}</span>
                </div>

                <div className="absolute top-0 left-0 w-20 h-20 border-t border-l border-color-text/20" />
                <div className="absolute top-0 right-0 w-20 h-20 border-t border-r border-color-text/20" />
                <div className="absolute bottom-0 left-0 w-20 h-20 border-b border-l border-color-text/20" />
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b border-r border-color-text/20" />
            </div>
        </div>
      </div>

      <style jsx>{`
        .mesh-stroke {
          stroke: var(--color-text);
          stroke-opacity: 0.15;
          transition: stroke-opacity 0.8s ease;
        }

        .hero-logo-container::after {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          background: radial-gradient(
            circle var(--mask-size) at var(--mask-x, 0px) var(--mask-y, 0px),
            rgba(255,255,255,0.06) 0%,
            transparent 100%
          );
          z-index: 2006;
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
}
