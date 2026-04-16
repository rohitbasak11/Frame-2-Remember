"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { clientWorkData, personalWorkData, PortfolioItem } from "@/constants/portfolio";

interface Particle {
  id: number;
  img: PortfolioItem;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  isGrayscale: boolean;
  opacity: number;
  rotation: number;
  vr: number; // velocity rotation
}

export default function FloatingHeroImages() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles] = useState<Particle[]>(() => {
    const pool = [...clientWorkData, ...personalWorkData];
    return Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      img: pool[Math.floor(Math.random() * pool.length)],
      x: 0, // Will be randomized in useEffect or just here
      y: 0,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      size: Math.random() * 150 + 150,
      isGrayscale: Math.random() > 0.5,
      opacity: Math.random() * 0.2 + 0.1,
      rotation: Math.random() * 360,
      vr: (Math.random() - 0.5) * 0.2
    }));
  });
  
  const particlesRef = useRef<Particle[]>(particles);
  const imageNodes = useRef<(HTMLDivElement | null)[]>([]);
  const mousePos = useRef({ x: -1000, y: -1000 });
  
  const repulsionRadius = 350; // Logo "magnetic" field
  const repulsionStrength = 0.08;
  const mouseRadius = 300;
  const mouseStrength = 0.15;

  useEffect(() => {
    // Randomize initial positions after mount to ensure window is available
    particlesRef.current.forEach(p => {
      p.x = Math.random() * window.innerWidth;
      p.y = Math.random() * window.innerHeight;
    });

    const pool = [...clientWorkData, ...personalWorkData];

    // Ticker Loop
    const tick = () => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      particlesRef.current.forEach((p, i) => {
        // 1. Constant Motion
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vr;

        // 2. Logo Repulsion (Steer away softly)
        const dx = p.x - centerX;
        const dy = p.y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < repulsionRadius) {
            const force = (repulsionRadius - dist) / repulsionRadius;
            const angle = Math.atan2(dy, dx);
            p.vx += Math.cos(angle) * force * repulsionStrength;
            p.vy += Math.sin(angle) * force * repulsionStrength;
            // Add air friction to velocities to prevent infinite acceleration
            p.vx *= 0.98;
            p.vy *= 0.98;
        }

        // 3. Mouse Repulsion
        const mdx = p.x - mousePos.current.x;
        const mdy = p.y - mousePos.current.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < mouseRadius) {
            const mforce = (mouseRadius - mdist) / mouseRadius;
            const mangle = Math.atan2(mdy, mdx);
            p.vx += Math.cos(mangle) * mforce * mouseStrength;
            p.vy += Math.sin(mangle) * mforce * mouseStrength;
        }

        // 4. Friction/Normalization
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 3) { // Cap speed
            p.vx *= 0.95;
            p.vy *= 0.95;
        }
        if (speed < 0.3) { // Min speed drift
            p.vx += (Math.random() - 0.5) * 0.1;
            p.vy += (Math.random() - 0.5) * 0.1;
        }

        // 5. Bounds Recycling (Dreamy exit/entry)
        const margin = p.size + 50;
        if (p.x < -margin || p.x > window.innerWidth + margin || p.y < -margin || p.y > window.innerHeight + margin) {
            // Pick a random edge to reappear from
            const side = Math.floor(Math.random() * 4);
            const newImg = pool[Math.floor(Math.random() * pool.length)];
            p.img = newImg;
            p.isGrayscale = Math.random() > 0.5;
            
            if (side === 0) { // Left
                p.x = -margin + 10;
                p.y = Math.random() * window.innerHeight;
                p.vx = Math.random() * 0.5 + 0.2;
                p.vy = (Math.random() - 0.5) * 1;
            } else if (side === 1) { // Right
                p.x = window.innerWidth + margin - 10;
                p.y = Math.random() * window.innerHeight;
                p.vx = -(Math.random() * 0.5 + 0.2);
                p.vy = (Math.random() - 0.5) * 1;
            } else if (side === 2) { // Top
                p.y = -margin + 10;
                p.x = Math.random() * window.innerWidth;
                p.vy = Math.random() * 0.5 + 0.2;
                p.vx = (Math.random() - 0.5) * 1;
            } else { // Bottom
                p.y = window.innerHeight + margin - 10;
                p.x = Math.random() * window.innerWidth;
                p.vy = -(Math.random() * 0.5 + 0.2);
                p.vx = (Math.random() - 0.5) * 1;
            }
        }

        // 6. Update DOM
        const node = imageNodes.current[i];
        if (node) {
            node.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${p.rotation}deg)`;
        }
      });

      requestAnimationFrame(tick);
    };

    const animFrame = requestAnimationFrame(tick);

    const handleMouseMove = (e: MouseEvent) => {
        mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Scroll Fade
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "400px top",
      scrub: true,
      onUpdate: (self) => {
        if (containerRef.current) {
          containerRef.current.style.opacity = (1 - self.progress).toString();
          containerRef.current.style.filter = `blur(${self.progress * 20}px)`;
        }
      }
    });

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("mousemove", handleMouseMove);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-[1900] overflow-hidden">
      {particles.map((p, i) => (
        <div
          key={p.id}
          ref={(el) => { imageNodes.current[i] = el; }}
          className="absolute transition-opacity duration-1000"
          style={{
            left: 0,
            top: 0,
            width: `min(${p.size}px, 40vw)`,
            aspectRatio: "4/5",
            opacity: p.opacity,
            willChange: "transform",
          }}
        >
          <div className={`relative w-full h-full rounded-2xl md:rounded-[40px] overflow-hidden glass border-white/10 ${p.isGrayscale ? 'grayscale' : ''}`}>
            <Image
              src={p.img.src}
              alt="Floating Work"
              fill
              className="object-cover opacity-80"
              sizes="400px"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
