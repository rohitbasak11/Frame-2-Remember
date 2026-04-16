"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import "glightbox/dist/css/glightbox.min.css";
import { clientWorkData, personalWorkData } from "@/constants/portfolio";
import { useUI } from "@/context/UIContext";
import { gsap } from "gsap";

export default function PortfolioModal() {
  const { isPortfolioModalOpen, closePortfolioModal } = useUI();
  const allImages = [...clientWorkData, ...personalWorkData];
  const modalRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPortfolioModalOpen) {
      // Dynamic import to avoid SSR issues
      const initLightbox = async () => {
        const { default: GLightbox } = await import("glightbox");
        const lightbox = GLightbox({
          selector: '.modal-gallery-item',
          touchNavigation: true,
          loop: true,
        });
        return lightbox;
      };

      const lightboxPromise = initLightbox();
      
      // Animate in
      gsap.fromTo(modalRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(".modal-gallery-item", 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: 'power2.out', delay: 0.1 }
      );

      return () => {
        lightboxPromise.then(lb => lb.destroy());
      };
    }
  }, [isPortfolioModalOpen]);

  if (!isPortfolioModalOpen) return null;

  return (
    <div 
      ref={modalRef}
      className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-xl overflow-y-auto"
      data-lenis-prevent
    >
      <button 
        onClick={closePortfolioModal}
        className="fixed top-8 right-8 z-[10010] p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
      >
        <X size={32} />
      </button>

      <div className="max-w-[1600px] mx-auto py-32 px-12">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-heading text-white mb-4">Complete Portfolio</h2>
          <p className="text-white/60">A unified gallery of commissions and personal works.</p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allImages.map((img, i) => (
            <a 
              key={i}
              href={img.src}
              className="modal-gallery-item group relative aspect-[4/5] rounded-3xl overflow-hidden glass border-white/10"
              data-glightbox={`title: ${img.title}; description: ${img.title}`}
            >
              <Image 
                src={img.src}
                alt={img.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-white text-sm font-medium px-6 text-center">{img.title}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
