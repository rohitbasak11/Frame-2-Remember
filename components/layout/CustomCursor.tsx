"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        gsap.set(dotRef.current, { x: e.clientX, y: e.clientY });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    let frameId: number;
    const updateRing = () => {
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.12;

      if (ringRef.current) {
        gsap.set(ringRef.current, { x: ringPos.current.x, y: ringPos.current.y });
      }
      frameId = requestAnimationFrame(updateRing);
    };

    updateRing();

    // Hover Scaling logic
    const handleMouseEnter = () => {
        gsap.to(ringRef.current, { scale: 1.6, borderColor: 'var(--color-blue)', backgroundColor: 'rgba(0,200,230,0.08)', duration: 0.3 });
    };
    const handleMouseLeave = () => {
        gsap.to(ringRef.current, { scale: 1, borderColor: 'rgba(232,93,154,0.5)', backgroundColor: 'transparent', duration: 0.3 });
    };

    const interactives = document.querySelectorAll('a, button');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(frameId);
      interactives.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <>
      <div 
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-pink rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 hidden md:block" 
      />
      <div 
        ref={ringRef}
        className="fixed top-0 left-0 w-11 h-11 border-2 border-pink/50 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-[border-color,background] duration-300 hidden md:block" 
      />
    </>
  );
}
