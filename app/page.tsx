"use client";

import Image from "next/image";
import Navbar from "./components/Navbar";
import Link from "next/link";
import BackToTop from "./components/BackToTop";
import { BsArrowRight } from "react-icons/bs";
import AgeImg from "../public/profile.jpeg"; // přesunuto do /public pro Next.js
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

      {/* Promo sekce (hero1.jsx přizpůsobená pro Next.js) */}
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
              <h1 className="text-3xl sm:text-4xl font-bold mt-3 text-black">TANEČNÍ SPORTOVNÍ CENTRUM</h1>
              <h4 className="text-lg text-gray-700 mt-3">
                Jsme nově vzniklé taneční studio, které založil Tomáš Boldiš.
              </h4>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Chceme vytvořit příjemné místo, kde se lidé budou rádi potkávat a kde se budou učit tančit ať už na amatérské ( hobby ) úrovni nebo na profesionální ( soutěžní ) úrovni. Součástí Tanečního a sportovního centra je i taneční klub TSC Kučera dance team, jehož členové patří k absolutní české i světové špičce.
              </p>
              <Link href="/contact" className="theme-btn inline-flex items-center mt-6 px-6 py-3 bg-[#57BDDB] text-white font-semibold rounded-full shadow-lg hover:bg-[#3BA7C7] transition-all">
                O NÁS
                <BsArrowRight className="ml-3 text-xl" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 flex-grow bg-white bg-opacity-10"></div>
      <BackToTop />
    </div>
  );
}
