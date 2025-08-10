"use client";

import { useEffect, useRef, useState } from "react";

export default function BackToTop() {
  const progressRef = useRef<SVGPathElement | null>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const path = progressRef.current;
    if (!path) return;

    const pathLength = path.getTotalLength();
    path.style.strokeDasharray = `${pathLength} ${pathLength}`;
    path.style.strokeDashoffset = `${pathLength}`;

    let ticking = false;
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        pathLength - (scrollTop * pathLength) / Math.max(scrollHeight, 1);
      path.style.strokeDashoffset = `${progress}`;
      setIsActive(scrollTop > 50);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateProgress();

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
      className={`progress-wrap ${isActive ? "active-progress" : ""}`}
      onClick={scrollToTop}
    >
      <svg
        className="progress-circle svg-content"
        width="100%"
        height="100%"
        viewBox="-1 -1 102 102"
        aria-hidden="true"
      >
        <path
          ref={progressRef}
          d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"
        />
      </svg>
    </button>
  );
}
