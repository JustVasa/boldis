"use client";

import { useEffect } from "react";

export default function ScrollManager() {
  useEffect(() => {
    // Vypnout nativní obnovu pozice a po prvním mountu JEN nahoru (ignoruj hash)
    let prev: ScrollRestoration | undefined;
    if ("scrollRestoration" in history) {
      prev = history.scrollRestoration;
      history.scrollRestoration = "manual";
    }

    // vždy po reloadu/otevření -> úplně nahoru
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    // handler na změnu hashe (klik v menu, ruční změna apod.)
    const onHashChange = () => {
      const id = window.location.hash.replace("#", "");
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;

      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      el.scrollIntoView({
        behavior: "smooth",
        block: isMobile ? "start" : "center",
      });
    };

    window.addEventListener("hashchange", onHashChange);

    return () => {
      window.removeEventListener("hashchange", onHashChange);
      if ("scrollRestoration" in history && prev) {
        history.scrollRestoration = prev;
      }
    };
  }, []);

  return null;
}
