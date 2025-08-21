// app/courses/[slug]/page.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import { use } from "react";

// ✅ Bereme data RELATIVNĚ ze stejné složky (app/courses/_data.ts)
import { COURSES, getCourse } from "../_data";
import type { Course } from "../_data";

export default function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Next.js canary: params je Promise → rozbalíme přes React.use()
  const { slug } = use(params);

  // Přesně typované: Course | undefined
  const course: Course | undefined = getCourse(slug);

  if (!course) {
    return (
      <div className="relative min-h-screen overflow-x-hidden bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-6 py-16">
          <h1 className="text-2xl font-semibold text-gray-900">Kurz nebyl nalezen</h1>
          <p className="mt-2 text-gray-600">
            Zkuste se vrátit na{" "}
            <Link className="text-[#57BDDB] underline" href="/#courses">
              přehled kurzů
            </Link>
            .
          </p>
        </main>
      </div>
    );
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Děkujeme! Registrace bude dokončena po napojení plateb.");
  };

  const desc = course.desc?.trim() ?? "";

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gray-50">
      <Navbar />

      {/* HERO s pozadím a názvem kurzu */}
      <section className="relative isolate">
        <div className="absolute inset-0 -z-10">
          <Image
            src={course.img}
            alt={course.title}
            fill
            priority
            className="object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-black/70 backdrop-blur-[6px]" />

        <div className="container mx-auto px-6 pt-36 pb-28 sm:pt-44 sm:pb-36">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-white text-3xl sm:text-5xl font-extrabold tracking-tight drop-shadow-lg">
              {course.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Obsah kurzu */}
      <main className="container mx-auto px-6 py-12 sm:py-16">
        {/* Popis kurzu */}
        <article className="bg-white rounded-2xl shadow-lg ring-1 ring-gray-200 p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">O kurzu</h2>

          {desc ? (
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {desc}
            </p>
          ) : (
            <p className="text-gray-500 italic">Popis kurzu bude doplněn.</p>
          )}
        </article>

        {/* Info a formulář vedle sebe */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
          {/* Info buňka */}
          <div className="bg-white rounded-2xl shadow-lg ring-1 ring-gray-200 p-6 h-full">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Informace o kurzu
            </h3>

            <dl className="space-y-4 text-gray-700">
              <div>
                <dt className="font-medium text-gray-900"><b>Cena</b></dt>
                <dd className="mt-1">{course.price ?? "—"}</dd>
              </div>

              <div>
                <dt className="font-medium text-gray-900"><b>Lektor</b></dt>
                <dd className="mt-1">{course.instructor ?? "—"}</dd>
              </div>

              <div>
                <dt className="font-medium text-gray-900"><b>Adresa</b></dt>
                <dd className="mt-1">{course.address ?? "—"}</dd>
              </div>

              <div>
                <dt className="font-medium text-gray-900"><b>Čas</b></dt>
                <dd className="mt-1">{course.schedule ?? "—"}</dd>
              </div>
            </dl>
          </div>

          {/* Registrační formulář */}
          <div className="bg-white rounded-2xl shadow-lg ring-1 ring-gray-200 p-6 h-full">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Registrační formulář
            </h3>
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#57BDDB]"
                  placeholder="Jméno"
                  name="firstName"
                />
                <input
                  type="text"
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#57BDDB]"
                  placeholder="Příjmení"
                  name="lastName"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="email"
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#57BDDB]"
                  placeholder="Email"
                  name="email"
                />
                <input
                  type="tel"
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#57BDDB]"
                  placeholder="Tel. číslo"
                  name="phone"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-[#57BDDB] px-4 py-3 text-white font-semibold shadow hover:bg-[#3BA7C7] transition"
              >
                Registrovat a zaplatit
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Odesláním souhlasíte se zpracováním osobních údajů pro účely
                registrace.
              </p>
            </form>
          </div>
        </div>

        {/* Další kurzy */}
        <section className="mt-14 sm:mt-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">
            Další kurzy v MIRROR centru
          </h2>
          <p className="mt-2 text-center text-gray-600">
            Prozkoumejte i další možnosti – od společenských tanců po latino a
            balet.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {COURSES.filter((c) => c.slug !== slug)
              .slice(0, 4)
              .map((c) => (
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
                      className="object-cover object-[50%_20%] group-hover:scale-105 transition-transform duration-300"
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

          <div className="mt-8 text-center">
            <Link
              href="/#courses"
              className="inline-flex items-center rounded-full border border-gray-300 px-5 py-2.5 text-gray-700 hover:bg-gray-50 transition"
            >
              Zpět na přehled kurzů
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-white text-gray-700 text-center py-8 border-t border-gray-200">
        <p className="text-lg font-medium">
          © {new Date().getFullYear()} Taneční centrum Mirror – Tomáš Boldiš
        </p>
      </footer>
    </div>
  );
}
