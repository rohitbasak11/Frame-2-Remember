"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";

export default function NavbarLogo({ isScrolled }: { isScrolled: boolean }) {
  const containerRef = useRef<HTMLButtonElement>(null);
  const meshLayerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  
  const [coords, setCoords] = useState("00.24.99");
  
  // Mask size state for hover/touch peak effect
  const maskSize = useRef({ value: 0 });
  const mousePos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  
  const isHomePage = pathname === "/";
  // Determine if it should be visible based on plan:
  // On home page, visible only when scrolled. On other pages, visible always.
  const isVisible = !isHomePage || isScrolled;

  const LogoSVG = useCallback(() => (
    <svg
      viewBox="0 0 400 300"
      className="w-full h-auto pointer-events-none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="200" cy="120" r="80" stroke="currentColor" className="mesh-stroke" strokeWidth="1" strokeDasharray="5 5" />
      <circle cx="200" cy="120" r="60" stroke="currentColor" className="mesh-stroke" strokeWidth="2" />
      <circle cx="200" cy="120" r="40" stroke="currentColor" className="mesh-stroke" strokeWidth="1" strokeDasharray="2 2" />
      <path d="M120 100 V160 M120 100 H150 M120 130 H140" stroke="currentColor" className="mesh-stroke" strokeWidth="3" strokeLinecap="round" />
      <path d="M190 105 C190 90, 210 90, 210 105 C210 120, 190 130, 190 145 H210" stroke="currentColor" className="mesh-stroke" strokeWidth="3" strokeLinecap="round" />
      <path d="M250 160 V100 H280 C290 100, 290 125, 280 125 H250 M265 125 L290 160" stroke="currentColor" className="mesh-stroke" strokeWidth="3" strokeLinecap="round" />
      <rect x="100" y="175" width="200" height="30" stroke="currentColor" className="mesh-stroke" strokeWidth="1" />
      <text x="200" y="195" fill="currentColor" fontSize="12" textAnchor="middle" letterSpacing="2" className="mesh-stroke opacity-80 font-mono uppercase">FRAME TO REMEMBER</text>
    </svg>
  ), []);

  useEffect(() => {
    // Mini animation loops for nav logo
    const strokeAnim = gsap.to(".nav-mesh-stroke", { strokeOpacity: 0.1, duration: 2, repeat: -1, yoyo: true, ease: "sine.inOut" });
    const recAnim = gsap.to(".nav-rec-dot", { opacity: 0, duration: 0.6, repeat: -1, yoyo: true, ease: "steps(1)" });
    
    return () => {
      strokeAnim.kill();
      recAnim.kill();
    };
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const xSetter = gsap.quickSetter(el, "--mask-x", "px");
    const ySetter = gsap.quickSetter(el, "--mask-y", "px");
    const sizeSetter = gsap.quickSetter(el, "--mask-size", "px");
    let rafId: number;

    const tick = () => {
      currentPos.current.x += (mousePos.current.x - currentPos.current.x) * 0.15;
      currentPos.current.y += (mousePos.current.y - currentPos.current.y) * 0.15;

      xSetter(currentPos.current.x);
      ySetter(currentPos.current.y);
      sizeSetter(maskSize.current.value);

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const updateMousePos = (clientX: number, clientY: number) => {
      const rect = el.getBoundingClientRect();
      mousePos.current = {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
      if (Math.random() > 0.95) {
        setCoords(`${Math.floor(mousePos.current.x / 5).toString().padStart(2, '0')}.${Math.floor(mousePos.current.y / 5).toString().padStart(2, '0')}`);
      }
    };

    const handleMouseMove = (e: MouseEvent) => updateMousePos(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) updateMousePos(e.touches[0].clientX, e.touches[0].clientY);
    };

    const handleEnter = () => {
      gsap.to(maskSize.current, { value: 70, duration: 0.4, ease: "back.out(1.5)" });
    };

    const handleLeave = () => {
      gsap.to(maskSize.current, { value: 0, duration: 0.6, ease: "power2.in" });
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseenter", handleEnter);
    el.addEventListener("mouseleave", handleLeave);
    el.addEventListener("touchstart", handleEnter, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: true });
    el.addEventListener("touchend", handleLeave, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseenter", handleEnter);
      el.removeEventListener("mouseleave", handleLeave);
      el.removeEventListener("touchstart", handleEnter);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleLeave);
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isHomePage) {
      if (window.lenisInstance) {
        window.lenisInstance.scrollTo(0, { duration: 1.5, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      router.push("/");
      // Once routed, the layout is re-rendered, and index uses lenis naturally on mount if saved.
    }
  };

  return (
    <button
      ref={containerRef}
      onClick={handleClick}
      className={`relative flex-shrink-0 transition-all duration-600 overflow-hidden flex items-center justify-center group ${
        isVisible ? "w-[120px] md:w-[160px] opacity-100" : "w-0 opacity-0 pointer-events-none"
      }`}
      style={{ touchAction: 'pan-y' }}
      aria-label="Home"
    >
      {/* Solid Image */}
      <div className="relative w-full aspect-[4/3]">
        <Image 
            src="/Logo-1.png"
            alt="Frame 2 Remember"
            fill
            className="object-contain"
          />
      </div>

      {/* Mesh Layer */}
      <div 
        ref={meshLayerRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          clipPath: `circle(var(--mask-size, 0px) at var(--mask-x, 0px) var(--mask-y, 0px))`,
          WebkitClipPath: `circle(var(--mask-size, 0px) at var(--mask-x, 0px) var(--mask-y, 0px))`,
        }}
      >
        <div className="relative flex items-center justify-center">
          <LogoSVG />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-2 left-2 flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-red-600 nav-rec-dot shadow-[0_0_6px_rgba(220,38,38,0.8)]" />
              <span className="text-[8px] font-black tracking-widest uppercase text-color-text">REC</span>
            </div>
            <div className="absolute bottom-2 right-2 text-color-text">
              <span className="text-[8px] font-mono opacity-50 tabular-nums tracking-tighter">{coords}</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .nav-mesh-stroke {
          stroke: var(--color-text);
          stroke-opacity: 0.3;
        }
        button::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          background: radial-gradient(
            circle var(--mask-size) at var(--mask-x, 0px) var(--mask-y, 0px),
            rgba(255,255,255,0.1) 0%,
            transparent 100%
          );
        }
      `}</style>
    </button>
  );
}
