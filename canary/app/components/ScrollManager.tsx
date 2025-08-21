"use client";

import { useEffect } from "react";

export default function ScrollManager() {
  useEffect(() => {
    // 1) Vypnout automatickou obnovu scrolu prohlížeče
    let prev: ScrollRestoration | undefined;
    if ("scrollRestoration" in history) {
      prev = history.scrollRestoration;
      history.scrollRestoration = "manual";
    }

    // 2) PŘI PRVNÍM NAČTENÍ/REFRESHI:
    //    - pokud je v URL hash (/#something), ihned ho odstraň
    //    - vždy skoč úplně nahoru
    if (window.location.hash) {
      const cleanUrl = window.location.pathname + window.location.search;
      history.replaceState(null, "", cleanUrl);
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    // 3) Plynulý scroll při změně hashe (klik v menu)
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
