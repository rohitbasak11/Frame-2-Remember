"use client";

import { useEffect, useRef } from "react";

export default function Background() {
  const orbRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const orbPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove);

    let frameId: number;
    const updateOrb = () => {
      orbPos.current.x += (mousePos.current.x - orbPos.current.x) * 0.06;
      orbPos.current.y += (mousePos.current.y - orbPos.current.y) * 0.06;

      if (orbRef.current) {
        orbRef.current.style.transform = `translate(calc(${orbPos.current.x}px - 50%), calc(${orbPos.current.y}px - 50%))`;
      }
      frameId = requestAnimationFrame(updateOrb);
    };

    updateOrb();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <>
      <div 
        id="gradient-bg" 
        className="fixed -top-[30vh] -left-[30vw] w-[160vw] h-[160vh] -z-20 overflow-hidden bg-[radial-gradient(circle_at_center,var(--bg-gradient-start)_0%,var(--bg-gradient-end)_100%)] transition-colors duration-800"
      >
        <div className="absolute w-[min(100vw,900px)] h-[min(100vw,900px)] rounded-full bg-[radial-gradient(circle,var(--orb-1-color)_0%,transparent_65%)] -top-[10vh] -left-[10vw] animate-orb1" />
        <div className="absolute w-[min(110vw,950px)] h-[min(110vw,950px)] rounded-full bg-[radial-gradient(circle,var(--orb-2-color)_0%,transparent_65%)] -bottom-[15vh] -right-[15vw] animate-orb2" />
      </div>
      
      <div 
        ref={orbRef}
        id="gradient-pointer" 
        className="fixed top-0 left-0 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,var(--orb-pointer-color)_0%,transparent_60%)] pointer-events-none -z-10 transition-opacity duration-400 touch-none hidden md:block"
      />
    </>
  );
}
