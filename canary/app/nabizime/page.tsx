"use client";

import Navbar from "../components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { COURSES } from "../courses/_data";

export default function NabizimePage() {
  return (
    <div className="relative min-h-screen bg-gray-50">
      <Navbar />

      {/* HERO sekce */}
      <section className="relative isolate">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/contact1.jpg"
            alt="Nabízíme"
            fill
            className="object-cover object-[80%_center] md:object-center"
            priority
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-black/55 backdrop-blur-[2px]" />
        <div className="container mx-auto px-6 pt-36 pb-28 sm:pt-44 sm:pb-36">
          <h1 className="text-white text-3xl sm:text-5xl font-extrabold text-center drop-shadow-lg">
            NABÍZÍME
          </h1>
        </div>
      </section>

      {/* Text o nabídce + fotka vpravo */}
      <main className="container mx-auto px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
          {/* Textová buňka */}
          <article className="bg-white rounded-2xl shadow-lg ring-1 ring-gray-200 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Show společenských tanců pro každou příležitost
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Nabízíme profesionální vystoupení společenských tanců na plesech,
              firemních večírcích, svatbách a dalších společenských událostech.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Program přizpůsobíme vašemu tématu a atmosféře akce – od
              elegantního waltzu až po energickou sambu.
            </p>
            <p className="text-gray-700 leading-relaxed font-medium">
              Cena dle dohody podle rozsahu vystoupení a vašich požadavků.
            </p>
          </article>

          {/* Obrázek vedle */}
          <div className="relative w-full h-72 lg:h-96 rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="/gallery/gal-2.jpg" // vlastní obrázek v /public
              alt="Ukázka show"
              fill
              className="object-cover object-[50%_20%]"
            />
          </div>
        </div>

        {/* Další kurzy */}
        <section className="mt-14 sm:mt-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">
            Naše kurzy
          </h2>
          <p className="mt-2 text-center text-gray-600">
            Objevte celou nabídku kurzů v MIRROR centru.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {COURSES.map((c) => (
              <Link
                key={c.slug}
                href={`/courses/${c.slug}`}
                className="group overflow-hidden rounded-xl bg-white ring-1 ring-gray-200 shadow hover:shadow-lg transition"
              >
                <div className="relative h-40 w-full">
                  <Image
                    src={c.img}
                    alt={c.title}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 line-clamp-2">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {c.short}
                  </p>
                  <span className="mt-3 inline-flex items-center text-[#57BDDB] font-medium">
                    Zjistit více <span className="ml-2">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white text-gray-700 text-center py-8 border-t border-gray-200 mt-16">
        <p className="text-lg font-medium">
          © {new Date().getFullYear()} Taneční centrum Mirror – Tomáš Boldiš
        </p>
      </footer>
    </div>
  );
}
