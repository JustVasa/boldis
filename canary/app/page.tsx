"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import Navbar from "./components/Navbar";
import Link from "next/link";
import BackToTop from "./components/BackToTop";
import { BsArrowRight } from "react-icons/bs";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import AgeImg from "../public/profile.jpeg";
import "./backToTop.css";

type GalleryImage = { src: string; alt: string };

export default function Home() {
  /** ---------- Fullscreen galerie stav ---------- */
  const images: GalleryImage[] = [
    { src: "/gallery/gal-1.jpg", alt: "Galerie 1" },
    { src: "/gallery/gal-2.jpg", alt: "Galerie 2" },
    { src: "/gallery/gal-3.jpg", alt: "Galerie 3" },
    { src: "/gallery/gal-4.jpg", alt: "Galerie 4" },
    { src: "/gallery/gal-5.jpg", alt: "Galerie 5" },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const open = (i: number) => {
    setIdx(i);
    setIsOpen(true);
  };
  const close = () => setIsOpen(false);

  const prev = useCallback(() => {
    setIdx((p) => (p - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback(() => {
    setIdx((p) => (p + 1) % images.length);
  }, [images.length]);

  // Klávesy: Esc, ←, →
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

  // Zamknout scroll v pozadí, když je overlay otevřený
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // 🔧 Oprava: po refreshi i při navigaci vždy začít nahoře
  useEffect(() => {
    if ("scrollRestoration" in history) {
      const prev = history.scrollRestoration;
      history.scrollRestoration = "manual";
      // Po prvním mountu skoč nahoru
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return () => {
        history.scrollRestoration = prev;
      };
    }
  }, []);

  // Při změně cesty / query (App Router) skoč nahoru
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, searchParams]);

  // Swipe na mobilu
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
    <div className="flex flex-col min-h-screen relative overflow-x-hidden">
      <Navbar />

      {/* Background Image */}
      <div className="absolute top-0 left-0 w-full h-[100svh]">
        <Image
          src="/background.png"
          alt="Taneční centrum Mirror background"
          fill
          priority
          className="object-cover object-[65%_center] md:object-center"
        />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-4 sm:bottom-6 z-20 flex justify-center w-full pointer-events-none">
          <div className="animate-bounce">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 sm:h-8 sm:w-8 text-white/80 drop-shadow-md"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 min-h-screen">
        <p className="font-poppins text-[#57BDDB] uppercase text-xs sm:text-sm md:text-base tracking-[0.25em] mb-5 sm:mb-6 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
          Taneční centrum - Moravská Třebová
        </p>

        <h1 className="font-poppins text-white text-2xl sm:text-4xl md:text-6xl font-bold leading-snug mb-6 sm:mb-8 drop-shadow-[0_3px_8px_rgba(0,0,0,0.85)] whitespace-normal md:whitespace-nowrap">
          Kde se vášeň mění v dokonalost
        </h1>

        <p className="mt-0 max-w-xl sm:max-w-2xl text-white/90 text-base sm:text-lg md:text-xl font-poppins font-light mb-8 sm:mb-10 drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">
          Od prvního kroku až po mistrovský výkon.<br className="hidden sm:block" />
          Kurzy pro děti, dospělé i seniory v srdci Moravské Třebové.
        </p>

        <Link href="/courses">
          <button className="mt-0 px-6 sm:px-8 py-2.5 sm:py-3 bg-[#57BDDB] text-white font-poppins font-semibold text-sm sm:text-lg rounded-full shadow-lg hover:bg-[#3BA7C7] transition-all">
            Zjistit více
          </button>
        </Link>
      </div>

      {/* Promo sekce */}
      <section className="promo-featured-wrapper section-padding bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-center xl:items-start text-center xl:text-left">
              <Image
                src={AgeImg}
                alt="Years of experience"
                width={400}
                height={300}
                className="rounded-lg object-cover"
              />
              <h5 className="mt-4 text-lg font-poppins text-gray-700">
                Head Coach <b>Tomáš Boldiš</b>
              </h5>
            </div>
            <div className="block-contents mt-5 xl:mt-0 xl:ml-5">
              <span className="text-[#57BDDB] uppercase text-sm font-semibold">KDO JSME</span>
              <h1 className="text-3xl sm:text-4xl font-bold mt-3 text-black">
                TANEČNÍ SPORTOVNÍ CENTRUM
              </h1>
              <h4 className="text-lg text-gray-700 mt-3">
                Jsme nově vzniklé taneční studio, které založil Tomáš Boldiš.
              </h4>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Chceme vytvořit příjemné místo, kde se lidé budou rádi potkávat
                a kde se budou učit tančit ať už na amatérské (hobby) úrovni nebo
                na profesionální (soutěžní) úrovni. Součástí Tanečního a sportovního
                centra je i taneční klub TSC Kučera dance team, jehož členové patří
                k absolutní české i světové špičce.
              </p>
              <Link
                href="/contact"
                className="theme-btn inline-flex items-center mt-6 px-6 py-3 bg-[#57BDDB] text-white font-semibold rounded-full shadow-lg hover:bg-[#3BA7C7] transition-all"
              >
                O NÁS
                <BsArrowRight className="ml-3 text-xl" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Kurzy sekce */}
      <section className="bg-gray-50 py-28">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-800">
            Naše kurzy
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { title: "Taneční pro dospělé", img: "/kurzy/dospele.jpg", desc: "Kurz pro všechny věkové kategorie dospělých, od začátečníků po pokročilé." },
              { title: "Taneční pro mládež", img: "/kurzy/mladez.jpg", desc: "Pro mladé tanečníky plné energie a nadšení." },
              { title: "Latino Ladies", img: "/kurzy/latino.jpg", desc: "Smyslné latino tance pro ženy všech věkových kategorií." },
              { title: "Taneční kroužky pro děti", img: "/kurzy/deti.jpg", desc: "Hravá a zábavná forma tance pro nejmenší." },
              { title: "Svatební lekce", img: "/kurzy/svatebni.jpg", desc: "Naučíme vás dokonalý svatební tanec." },
              { title: "Individuální lekce", img: "/kurzy/individual.jpg", desc: "Přizpůsobené lekce přesně vašim potřebám." },
              { title: "Pro - Am", img: "/kurzy/proam.jpg", desc: "Tanečník amatér a profesionál na jedné vlně." },
              { title: "Kroužek baletu", img: "/kurzy/balet.jpg", desc: "Základy i pokročilé prvky baletu pro děti a dospělé." }
            ].map((course, index) => (
              <div
                key={index}
                className="relative h-64 rounded-lg overflow-hidden shadow-lg group"
                style={{
                  backgroundImage: `url(${course.img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              >
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-all"></div>
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-4">
                  <h3 className="text-lg font-bold mb-2">{course.title}</h3>
                  <p className="text-sm mb-4">{course.desc}</p>
                  <Link
                    href="/courses"
                    className="bg-[#57BDDB] text-white text-sm px-4 py-2 rounded-full shadow hover:bg-[#3BA7C7] transition"
                  >
                    Zjistit více
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galerie – zachovaný vzhled mřížky + klik na fullscreen */}
      <section className="relative py-32 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <h2 className="text-3xl font-bold text-gray-800">Galerie</h2>
            <Link href="/gallery" className="text-[#57BDDB] font-semibold hover:underline">
              Zobrazit více
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
            {/* Velká dlaždice (index 0) */}
            <button
              type="button"
              onClick={() => open(0)}
              className="relative col-span-2 row-span-2 rounded-2xl overflow-hidden shadow-xl group focus:outline-none focus:ring-2 focus:ring-[#57BDDB]"
              aria-label={`Otevřít ${images[0].alt}`}
            >
              <div className="relative h-full min-h-[350px] lg:min-h-[400px]">
                <Image
                  src={images[0].src}
                  alt={images[0].alt}
                  fill
                  className="object-cover object-[50%_30%] transition-transform group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>
            </button>

            {/* Ostatní 4 fotky (index 1..4) */}
            {images.slice(1).map((g, i) => {
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
                  <div className="absolute inset-0 bg-black/10"></div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Kontakt sekce */}
      <section className="relative py-32 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">


            {/* Form – contact.jpg */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              {/* Pozadí */}
              <Image
                src="/contact.jpg"
                alt=""
                fill
                className="object-cover "
                priority
              />
              {/* Celoplošný overlay: ztmavení + blur (pod obsahem) */}
              <div className="absolute inset-0 z-0 bg-black/40 backdrop-blur-xl" />
              {/* Obsah (už není absolute → karta roste podle obsahu) */}
              <div className="relative z-10 p-8 text-white bg-white/10 border border-white/20">
                <h3 className="text-3xl font-bold mb-6">Kontaktujte nás</h3>
                <form className="space-y-5">
                  <input
                    type="text"
                    placeholder="Jméno a příjmení"
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-[#57BDDB]"
                  />
                  <input
                    type="tel"
                    placeholder="Telefon"
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-[#57BDDB]"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-[#57BDDB]"
                  />
                  <textarea
                    placeholder="Zpráva"
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-[#57BDDB]"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#57BDDB] text-white font-semibold rounded-lg hover:bg-[#3BA7C7] transition-all"
                  >
                    Odeslat
                  </button>
                </form>
              </div>
            </div>

             {/* Info – contact1.jpg */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl min-h-[420px] lg:min-h-[500px]">
              {/* Background */}
              <Image
                src="/contact1.jpg"
                alt=""
                fill
                className="object-cover"
                priority
              />
              {/* Full overlay: blur + darken */}
              <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-xl" />
              {/* Content layer fills entire card (center vertically for info) */}
              <div className="absolute inset-0 z-20 flex items-center">
                <div className="w-full h-full p-8 text-white bg-white/10 border border-white/20 flex flex-col justify-center">
                  <h3 className="text-3xl font-bold mb-8">Taneční centrum Mirror</h3>
                  <ul className="space-y-6 text-lg">
                    <li className="flex items-center">
                      <FaMapMarkerAlt className="text-white text-2xl mr-4" />
                      Moravská Třebová, Česká republika
                    </li>
                    <li className="flex items-center">
                      <FaPhoneAlt className="text-white text-2xl mr-4" />
                      <a href="tel:+420123456789" className="hover:underline">
                        +420 123 456 789
                      </a>
                    </li>
                    <li className="flex items-center">
                      <FaEnvelope className="text-white text-2xl mr-4" />
                      <a href="mailto:info@mirror.cz" className="hover:underline">
                        info@mirror.cz
                      </a>
                    </li>
                  </ul>

                  {/* Social icons */}
                  <div className="flex space-x-4 mt-8">
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition-colors"
                    >
                      <FaFacebook className="text-white text-2xl" />
                    </a>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition-colors"
                    >
                      <FaInstagram className="text-white text-2xl" />
                    </a>
                    <a
                      href="https://youtube.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition-colors"
                    >
                      <FaYoutube className="text-white text-2xl" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>




      <BackToTop />

      {/* Footer */}
      <footer className="bg-white text-gray-700 text-center py-8 mt-auto border-t border-gray-200">
        <p className="text-lg font-medium">
          © 2024 Taneční centrum Mirror - Tomáš Boldiš
        </p>
      </footer>

      {/* ---------- FULLSCREEN OVERLAY PRO GRAFIKU ---------- */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center p-4"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          {/* Zavřít */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); close(); }}
            className="absolute z-20 right-4 sm:right-6 text-white text-3xl p-3 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
            style={{
              top: "max(1rem, env(safe-area-inset-top))",
              WebkitTapHighlightColor: "transparent",
              touchAction: "manipulation",
            }}
            aria-label="Zavřít galerii"
          >
            <FaTimes />
          </button>

          {/* Šipky */}
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

          {/* Obrázek (stopPropagation, swipe) */}
          <div
            className="relative z-10 w-full max-w-6xl h-[80vh] transition-opacity duration-300"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <Image
              key={idx}
              src={images[idx].src}
              alt={images[idx].alt}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          {/* Indikátor pořadí */}
          <div className="absolute z-20 bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm">
            {idx + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}
