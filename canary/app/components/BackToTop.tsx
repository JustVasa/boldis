"use client";

import { useEffect, useRef, useState } from "react";

export default function BackToTop() {
  const progressRef = useRef<SVGPathElement | null>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const path = progressRef.current;
    if (!path) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length} ${length}`;
    path.style.strokeDashoffset = `${length}`;

    let ticking = false;
    const update = () => {
      const scrollTop = window.scrollY;
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        length - (scrollTop * length) / Math.max(scrollHeight, 1);
      path.style.strokeDashoffset = `${progress}`;
      setIsActive(scrollTop > 50);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      aria-label="Zpět nahoru"
      onClick={scrollToTop}
      className={[
        "fixed bottom-6 right-6 z-[1000]",
        "h-12 w-12 rounded-full",
        "bg-black/50 backdrop-blur-sm",
        "shadow-lg ring-1 ring-white/10 hover:bg-black/60",
        "transition-opacity duration-300",
        isActive ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        "touch-manipulation"
      ].join(" ")}
    >
      {/* Kruh s progresbarem */}
      <svg
        className="block h-12 w-12"
        viewBox="-1 -1 102 102"
        aria-hidden="true"
      >
        <path
          ref={progressRef}
          d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"
          fill="none"
          stroke="currentColor"
          strokeWidth={4}
          className="text-white/90"
        />
      </svg>

      {/* Ikona šipky nahoru */}
      <span
        className="pointer-events-none absolute inset-0 grid place-items-center"
        aria-hidden="true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </span>
    </button>
  );
}
