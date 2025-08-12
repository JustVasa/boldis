"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const LINKS = [
  { href: "/", label: "O NÁS" },
  { href: "/services", label: "NABÍZÍME" },
  { href: "/courses", label: "TANEČNÍ KURZY" },
  { href: "/apply", label: "GALERIE" },
  { href: "/contact", label: "KONTAKTY" },
];

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

  // Lock page scroll when menu is open + close on Escape
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

  return (
    <nav
      className={`fixed top-0 left-0 w-full px-4 py-4 z-50 transition-colors duration-300 ${
        isScrolled
          ? "bg-[rgba(0,0,0,0.7)] text-white shadow-md py-2"
          : "bg-transparent text-white"
      }`}
      role="navigation"
      aria-label="Hlavní navigace"
    >
      {/* řádek s logem a ovládacími prvky */}
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center sm:ml-0 ml-[-20px]">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={isScrolled ? 200 : 270}
            height={isScrolled ? 110 : 150}
            className="mr-2 transition-all duration-300"
            priority
          />
        </Link>

        {/* Desktop Menu (viditelné od lg) */}
        <div
          className={`hidden lg:flex items-center text-lg space-x-6 font-poppins transition-all duration-300 mr-2`}
        >
          {LINKS.map((item) => (
            <Link key={item.href} href={item.href} className="hover:opacity-70">
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button (burger) */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((v) => !v)}
          className="lg:hidden focus:outline-none z-50 flex items-center justify-center h-10 w-10 relative"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMenuOpen ? "Zavřít menu" : "Otevřít menu"}
        >
          {/* 3 čárky */}
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
            onClick={() => setIsMenuOpen(false)}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
