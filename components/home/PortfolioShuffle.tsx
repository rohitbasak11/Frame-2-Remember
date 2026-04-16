"use client";

import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import { clientWorkData, personalWorkData, PortfolioItem } from "@/constants/portfolio";

import { useUI } from "@/context/UIContext";

interface PortfolioColumnProps {
  title: string;
  eyebrow: string;
  description: string;
  items: PortfolioItem[];
  initialIndices: number[];
}

function PortfolioColumn({ title, eyebrow, description, items, initialIndices }: PortfolioColumnProps) {
  const [activeIndices, setActiveIndices] = useState(initialIndices);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const shuffleInterval = setInterval(() => {
      // Pick a random card slot to swap
      const slotToSwap = Math.floor(Math.random() * 3);
      
      // Find a new index from the full list that isn't currently shown
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * items.length);
      } while (activeIndices.includes(newIndex));

      const card = cardsRef.current[slotToSwap];
      if (card) {
        gsap.to(card, {
          opacity: 0,
          y: 10,
          duration: 0.4,
          ease: "power2.in",
          onComplete: () => {
            setActiveIndices(prev => {
              const next = [...prev];
              next[slotToSwap] = newIndex;
              return next;
            });
            gsap.to(card, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out"
            });
          }
        });
      }
    }, 4000); // Slower individual shuffle for more focus

    return () => clearInterval(shuffleInterval);
  }, [activeIndices, items]);

  const sizeClasses = ["tall", "mid", "wide"];

  return (
    <div className="flex flex-col gap-6">
      <div className="mb-4">
        <div className="text-xs uppercase tracking-widest text-color-text-muted mb-2">{eyebrow}</div>
        <h2 className="text-3xl font-heading mb-4">{title}</h2>
        <p className="text-color-text-muted max-w-md">{description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
        {activeIndices.map((idx, i) => (
          <div 
            key={`${idx}-${i}`}
            ref={el => { cardsRef.current[i] = el; }}
            className={`photo-card ${sizeClasses[i % 3]} group cursor-pointer overflow-hidden rounded-2xl relative aspect-[3/4] md:aspect-auto`}
          >
            <Image
              src={items[idx].src}
              alt={items[idx].title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
              <p className="text-white text-sm font-medium">{items[idx].title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PortfolioShuffle() {
  const { openPortfolioModal } = useUI();

  const allImages = [...clientWorkData, ...personalWorkData];

  return (
    <section id="portfolio" className="py-24 px-12 max-w-[1400px] mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-heading mb-6 tracking-tight">
          The <span className="text-pink">Work</span>
        </h1>
        <p className="text-lg md:text-xl text-color-text-muted max-w-2xl mx-auto">
          Every frame tells a story. Here is a curated selection of commissions and personal explorations — the moments that define this practice.
        </p>
        
        <div className="mt-16 flex justify-center relative w-[100vw] left-1/2 -translate-x-1/2 overflow-hidden py-16 group">
            {/* The infinite scrolling image strip */}
            <div 
              className="absolute inset-0 flex items-center opacity-30 group-hover:opacity-100 transition-opacity duration-700 cursor-pointer"
              onClick={openPortfolioModal}
            >
              <div className="flex shrink-0 min-w-max animate-marquee gap-4 px-2 group-hover:[animation-play-state:paused]">
                {[...allImages, ...allImages].map((img, i) => (
                  <div key={i} className="relative w-32 h-44 md:w-40 md:h-56 rounded-2xl overflow-hidden glass hover:scale-[1.15] hover:z-10 transition-transform duration-300 shadow-xl border border-white/20">
                    <Image src={img.src} alt={img.title} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" sizes="(max-width: 768px) 128px, 160px" />
                  </div>
                ))}
              </div>
            </div>

             <button 
                onClick={openPortfolioModal}
                className="relative z-10 px-8 py-4 bg-dark text-white rounded-full font-medium hover:bg-pink transition-colors duration-300 flex items-center gap-2 shadow-[0_10px_40px_rgba(0,0,0,0.5)] group-hover:bg-pink pointer-events-auto"
             >
                Discover Full Gallery &rarr;
             </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
        <PortfolioColumn 
          eyebrow="Commissions"
          title="Client Work"
          description="Weddings, celebrations and events — crafted for those who value the art of a well-told story."
          items={clientWorkData}
          initialIndices={[0, 1, 16]}
        />
        <PortfolioColumn 
          eyebrow="Fine Art"
          title="Personal Vision"
          description="Photographs made purely for the love of the craft — observations of the natural world and quiet, considered moments."
          items={personalWorkData}
          initialIndices={[0, 3, 7]}
        />
      </div>
    </section>
  );
}
