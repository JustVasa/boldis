"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

type GalleryImage = { src: string; alt: string };

const IMAGES: GalleryImage[] = [
  { src: "/gallery/gal-1.jpg", alt: "Galerie 1" },
  { src: "/gallery/gal-2.jpg", alt: "Galerie 2" },
  { src: "/gallery/gal-3.jpg", alt: "Galerie 3" },
  { src: "/gallery/gal-4.jpg", alt: "Galerie 4" },
  { src: "/gallery/gal-5.jpg", alt: "Galerie 5" },
];

export default function Gallery() {
  const [isOpen, setIsOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const open = (i: number) => { setIdx(i); setIsOpen(true); };
  const close = () => setIsOpen(false);

  const prev = useCallback(() => setIdx(p => (p - 1 + IMAGES.length) % IMAGES.length), []);
  const next = useCallback(() => setIdx(p => (p + 1) % IMAGES.length), []);

  // keyboard
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, prev, next]);

  // body scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx > 50) prev();
    if (dx < -50) next();
    touchStartX.current = null;
  };

  return (
    <section id="gallery" className="relative py-32 bg-gray-50 scroll-mt-24">
      <div className="container mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <h2 className="text-3xl font-bold text-gray-800">Galerie</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
          {/* Velká dlaždice */}
          <button
            type="button"
            onClick={() => open(0)}
            className="relative col-span-2 row-span-2 rounded-2xl overflow-hidden shadow-xl group focus:outline-none focus:ring-2 focus:ring-[#57BDDB]"
            aria-label={`Otevřít ${IMAGES[0].alt}`}
          >
            <div className="relative h-full min-h-[350px] lg:min-h-[400px]">
              <Image
                src={IMAGES[0].src}
                alt={IMAGES[0].alt}
                fill
                className="object-cover object-[50%_30%] transition-transform group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>
          </button>

          {/* Další fotky */}
          {IMAGES.slice(1).map((g, i) => {
            const realIndex = i + 1;
            return (
              <button
                key={g.src}
                type="button"
                onClick={() => open(realIndex)}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg group focus:outline-none focus:ring-2 focus:ring-[#57BDDB]"
                aria-label={`Otevřít ${g.alt}`}
              >
                <Image
                  src={g.src}
                  alt={g.alt}
                  fill
                  className="object-cover object-[50%_20%] transition-transform group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/10" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Fullscreen overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center p-4"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          {/* Close */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); close(); }}
            className="absolute z-20 right-4 sm:right-6 text-white text-3xl p-3 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
            style={{ top: "max(1rem, env(safe-area-inset-top))" }}
            aria-label="Zavřít galerii"
          >
            <FaTimes />
          </button>

          {/* Arrows */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute z-20 left-2 sm:left-6 text-gray-400 sm:text-white text-4xl p-3 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Předchozí fotografie"
          >
            <FaChevronLeft />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute z-20 right-2 sm:right-6 text-gray-400 sm:text-white text-4xl p-3 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Další fotografie"
          >
            <FaChevronRight />
          </button>

          {/* Image */}
          <div
            className="relative z-10 w-full max-w-6xl h-[80vh] transition-opacity duration-300"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <Image
              key={idx}
              src={IMAGES[idx].src}
              alt={IMAGES[idx].alt}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          {/* Counter */}
          <div className="absolute z-20 bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm">
            {idx + 1} / {IMAGES.length}
          </div>
        </div>
      )}
    </section>
  );
}
