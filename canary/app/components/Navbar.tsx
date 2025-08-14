"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

type NavItem = { href: string; label: string };

const LINKS: NavItem[] = [
  { href: "/about",     label: "O NÁS" },      // otevře novou stránku
  { href: "/#services", label: "NABÍZÍME" },   // scroll na sekci
  { href: "/#courses",  label: "TANEČNÍ KURZY"},
  { href: "/#gallery",  label: "GALERIE" },
  { href: "/#contact",  label: "KONTAKTY" },
];

const NAV_HEIGHT = 80; // px – výška fixního navbaru (pro mobilní offset)

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Shrink on scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll při otevřeném menu + zavření na Escape
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isMenuOpen]);

  // Intercept kliků na anchor odkazy (/#sekce), pokud už jsme na homepage
  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (!href.startsWith("/#")) return; // normální link, neřešíme
    const onHome =
      window.location.pathname === "/" || window.location.pathname === "/home";
    if (!onHome) return; // nejsme na homepage → nechat proběhnout navigaci

    e.preventDefault();
    const id = href.split("#")[1];
    const el = document.getElementById(id);
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const currentY = window.scrollY;

    if (window.innerWidth > 1024) {
      // PC → střed sekce
      const target =
        rect.top + currentY - window.innerHeight / 2 + rect.height / 2;
      window.scrollTo({ top: target, behavior: "smooth" });
    } else {
      // Mobil/tablet → horní část s offsetem o navbar
      const target = rect.top + currentY - NAV_HEIGHT;
      window.scrollTo({ top: target, behavior: "smooth" });
    }

    // aktualizuj hash v URL bez dalšího skoku
    history.replaceState(null, "", `#${id}`);
    setIsMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full px-4 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[rgba(0,0,0,0.7)] text-white shadow-md py-1"
          : "bg-transparent text-white py-4"
      }`}
      role="navigation"
      aria-label="Hlavní navigace"
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center sm:ml-0 ml-[-20px]">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={isScrolled ? 150 : 270}
            height={isScrolled ? 90 : 150}
            className="mr-2 transition-all duration-300"
            priority
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center text-lg space-x-6 font-poppins transition-all duration-300 mr-2">
          {LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:opacity-70"
              onClick={(e) => handleAnchorClick(e, item.href)}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((v) => !v)}
          className="lg:hidden focus:outline-none z-50 flex items-center justify-center h-10 w-10 relative"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMenuOpen ? "Zavřít menu" : "Otevřít menu"}
        >
          <span
            className={`block w-7 h-0.5 bg-white absolute transition-transform duration-300 ${
              isMenuOpen ? "rotate-45 translate-y-0" : "-translate-y-2.5"
            }`}
          />
          <span
            className={`block w-7 h-0.5 bg-white absolute transition-opacity duration-300 ${
              isMenuOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`block w-7 h-0.5 bg-white absolute transition-transform duration-300 ${
              isMenuOpen ? "-rotate-45 translate-y-0" : "translate-y-2.5"
            }`}
          />
        </button>
      </div>

      {/* Mobile Fullscreen Menu */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 bg-[rgba(0,0,0,0.9)] text-white flex flex-col items-center justify-center space-y-7 text-2xl font-semibold transform transition-transform duration-500 lg:hidden ${
          isMenuOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        {LINKS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="hover:text-gray-300"
            onClick={(e) => {
              handleAnchorClick(e, item.href);
              setIsMenuOpen(false);
            }}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
