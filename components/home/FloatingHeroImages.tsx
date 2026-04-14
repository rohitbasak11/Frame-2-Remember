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
  const [particles, setParticles] = useState<Particle[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const imageNodes = useRef<(HTMLDivElement | null)[]>([]);
  const mousePos = useRef({ x: -1000, y: -1000 });
  
  const repulsionRadius = 350; // Logo "magnetic" field
  const repulsionStrength = 0.08;
  const mouseRadius = 300;
  const mouseStrength = 0.15;

  useEffect(() => {
    // Generate initial particles
    const pool = [...clientWorkData, ...personalWorkData];
    const initialParticles: Particle[] = Array.from({ length: 12 }).map((_, i) => {
      const img = pool[Math.floor(Math.random() * pool.length)];
      return {
        id: i,
        img,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        size: Math.random() * 150 + 150,
        isGrayscale: Math.random() > 0.5,
        opacity: Math.random() * 0.2 + 0.1,
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 0.2
      };
    });

    setParticles(initialParticles);
    particlesRef.current = initialParticles;

    // Ticker Loop
    const tick = () => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      particlesRef.current = particlesRef.current.map((p, i) => {
        let { x, y, vx, vy, rotation, vr, size } = p;

        // 1. Constant Motion
        x += vx;
        y += vy;
        rotation += vr;

        // 2. Logo Repulsion (Steer away softly)
        const dx = x - centerX;
        const dy = y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < repulsionRadius) {
            const force = (repulsionRadius - dist) / repulsionRadius;
            const angle = Math.atan2(dy, dx);
            vx += Math.cos(angle) * force * repulsionStrength;
            vy += Math.sin(angle) * force * repulsionStrength;
            // Add air friction to velocities to prevent infinite acceleration
            vx *= 0.98;
            vy *= 0.98;
        }

        // 3. Mouse Repulsion
        const mdx = x - mousePos.current.x;
        const mdy = y - mousePos.current.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < mouseRadius) {
            const mforce = (mouseRadius - mdist) / mouseRadius;
            const mangle = Math.atan2(mdy, mdx);
            vx += Math.cos(mangle) * mforce * mouseStrength;
            vy += Math.sin(mangle) * mforce * mouseStrength;
        }

        // 4. Friction/Normalization
        const speed = Math.sqrt(vx * vx + vy * vy);
        if (speed > 3) { // Cap speed
            vx *= 0.95;
            vy *= 0.95;
        }
        if (speed < 0.3) { // Min speed drift
            vx += (Math.random() - 0.5) * 0.1;
            vy += (Math.random() - 0.5) * 0.1;
        }

        // 5. Bounds Recycling (Dreamy exit/entry)
        const margin = size + 50;
        if (x < -margin || x > window.innerWidth + margin || y < -margin || y > window.innerHeight + margin) {
            // Pick a random edge to reappear from
            const side = Math.floor(Math.random() * 4);
            const newImg = pool[Math.floor(Math.random() * pool.length)];
            p.img = newImg;
            p.isGrayscale = Math.random() > 0.5;
            
            if (side === 0) { // Left
                x = -margin + 10;
                y = Math.random() * window.innerHeight;
                vx = Math.random() * 0.5 + 0.2;
                vy = (Math.random() - 0.5) * 1;
            } else if (side === 1) { // Right
                x = window.innerWidth + margin - 10;
                y = Math.random() * window.innerHeight;
                vx = -(Math.random() * 0.5 + 0.2);
                vy = (Math.random() - 0.5) * 1;
            } else if (side === 2) { // Top
                y = -margin + 10;
                x = Math.random() * window.innerWidth;
                vy = Math.random() * 0.5 + 0.2;
                vx = (Math.random() - 0.5) * 1;
            } else { // Bottom
                y = window.innerHeight + margin - 10;
                x = Math.random() * window.innerWidth;
                vy = -(Math.random() * 0.5 + 0.2);
                vx = (Math.random() - 0.5) * 1;
            }
        }

        // 6. Update DOM
        const node = imageNodes.current[i];
        if (node) {
            node.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
        }

        return { ...p, x, y, vx, vy, rotation };
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
