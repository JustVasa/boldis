"use client";

import Image from "next/image";
import Navbar from "./components/Navbar";
import Link from "next/link";
import BackToTop from "./components/BackToTop";
import "./backtotop.css";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar />

      {/* Background Image */}
      <div className="absolute top-0 left-0 w-full h-[100svh]">
        <Image
          src="/background.png"
          alt="Cleaning service background"
          fill
          priority
          className="object-cover object-[65%_center] md:object-center"
        />
        {/* Dark blur overlay */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      </div>

      {/* Centered Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 min-h-screen">
        <h1 className="font-poppins text-white text-3xl sm:text-4xl md:text-5xl font-semibold drop-shadow-lg">
          NAUČÍME TANČIT I VÁS
        </h1>
        <p className="mt-4 max-w-2xl text-white/90 text-lg sm:text-xl font-poppins drop-shadow-md">
          Vítejte v našem tanečním studiu TSC Kučera v Ostravě, kde vášeň pro tanec a snaha o dokonalost tvoří základ naší filozofie.
        </p>
      </div>

      {/* Sekce "Co nabízíme" */}
      <div className="relative z-10 bg-white py-16 text-center">
        <h2 className="text-4xl font-bold text-gray-600 font-poppins">Co nabízíme</h2>
        <p className="text-lg text-gray-600 font-poppins mt-2">
          Spolehliví a prověření pracovníci pečlivě uklidí podle vašich představ.
        </p>

        {/* Tři boxy s ikonami a popisky */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-6 md:px-24">
          {/* Box 1 */}
          <div className="flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-md">
            <div className="hover:scale-110 transition-transform duration-300 ease-in-out">
              <Image src="/office.svg" alt="Office Cleaning" width={80} height={80} />
            </div>
            <h3 className="text-l text-gray-800 font-poppins mt-4">Úklid administrativních prostor</h3>
            <Link href="/services" passHref legacyBehavior>
              <a className="mt-4 font-semibold px-4 py-2 text-sm text-gray-600 bg-white/80 border rounded-lg hover:bg-white/60 transition-all font-poppins">
                Detaily
              </a>
            </Link>
          </div>

          {/* Box 2 */}
          <div className="flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-md">
            <div className="hover:scale-110 transition-transform duration-300 ease-in-out">
              <Image src="/flat.svg" alt="Apartment Cleaning" width={80} height={80} />
            </div>
            <h3 className="text-l text-gray-800 font-poppins mt-4">Úklid bytových domů</h3>
            <Link href="/services" passHref legacyBehavior>
              <a className="mt-4 font-semibold px-4 py-2 text-sm text-gray-600 bg-white/80 border rounded-lg hover:bg-white/60 transition-all font-poppins">
                Detaily
              </a>
            </Link>
          </div>

          {/* Box 3 */}
          <div className="flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-md">
            <div className="hover:scale-110 transition-transform duration-300 ease-in-out">
              <Image src="/house.svg" alt="Home Cleaning" width={80} height={80} />
            </div>
            <h3 className="text-l text-gray-800 font-poppins mt-4">Úklid domácností</h3>
            <Link href="/services" passHref legacyBehavior>
              <a className="mt-4 font-semibold px-4 py-2 text-sm text-gray-600 bg-white/80 border rounded-lg hover:bg-white/60 transition-all font-poppins">
                Detaily
              </a>
            </Link>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex-grow bg-white bg-opacity-10"></div>
      <BackToTop />
    </div>
  );
}
