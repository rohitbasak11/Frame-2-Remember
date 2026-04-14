"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

export default function HeroLogo() {
  const logoRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const logo = logoRef.current;
    if (!logo) return;

    // Step 1: Initial centered state
    gsap.set(logo, {
      position: 'fixed',
      x: "50vw",
      y: "50vh",
      xPercent: -50,
      yPercent: -50,
      width: "min(35vw, 500px)",
      autoAlpha: 1,
      zIndex: 2005,
    });

    // Step 2: Scroll Animation to Nav
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "200px top",
        scrub: 1.2,
      }
    });

    tl.to(logo, {
        x: "50vw", // Center horizontally for now, update if nav placeholder is asymmetric
        y: "48px", // Nav center
        width: "160px",
        ease: "power2.inOut"
    });

    // Special blur effect for the background content during load
    gsap.fromTo("#smooth-wrapper", 
        { filter: 'blur(8px) grayscale(100%)', opacity: 0.3 }, 
        { filter: 'none', opacity: 1, duration: 2, ease: "power2.out", delay: 0.5 }
    );

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed top-0 left-0 z-[2005] pointer-events-none">
        <Image 
            ref={logoRef}
            src="/Logo-1.png"
            alt="Frame 2 Remember"
            width={500}
            height={200}
            priority
            className="object-contain"
        />
    </div>
  );
}
