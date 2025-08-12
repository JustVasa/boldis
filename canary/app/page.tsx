"use client";

import Image from "next/image";
import Navbar from "./components/Navbar";
import Link from "next/link";
import BackToTop from "./components/BackToTop";
import { BsArrowRight } from "react-icons/bs";
import AgeImg from "../public/profile.jpeg";
import "./backToTop.css";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative">
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

        <h1 className="font-poppins text-white text-2xl sm:text-4xl md:text-6xl font-bold leading-snug mb-6 sm:mb-8 drop-shadow-[0_3px_8px_rgba(0,0,0,0.85)] whitespace-nowrap">
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
      <section className="promo-featured-wrapper section-padding bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 items-center">
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
      <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Naše kurzy
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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

      {/* Galerie – upravená pro PC */}
      <section className="relative py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Galerie</h2>
            <Link href="/gallery" className="text-[#57BDDB] font-semibold hover:underline">
              Zobrazit více
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
            {/* Velká fotka */}
            <div className="relative col-span-2 row-span-2">
              <div className="relative h-full min-h-[350px] lg:min-h-[400px] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/gallery/gal-1.jpg"
                  alt="Galerie 1"
                  fill
                  className="object-cover object-[50%_30%]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
            </div>

            {/* Ostatní fotky */}
            {[
              { src: "/gallery/gal-2.jpg", alt: "Galerie 2" },
              { src: "/gallery/gal-3.jpg", alt: "Galerie 3" },
              { src: "/gallery/gal-4.jpg", alt: "Galerie 4" },
              { src: "/gallery/gal-5.jpg", alt: "Galerie 5" }
            ].map((g, i) => (
              <div key={i} className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={g.src}
                  alt={g.alt}
                  fill
                  className="object-cover object-[50%_20%]"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/10"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="relative z-10 flex-grow bg-white bg-opacity-10"></div>
      <BackToTop />
    </div>
  );
}
