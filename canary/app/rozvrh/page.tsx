// app/rozvrh/page.tsx
import Image from "next/image";
import Link from "next/link"; // ⬅️ přidáno
import Navbar from "../components/Navbar";
import SiteFooter from "../components/SiteFooter";
import BackToTop from "../components/BackToTop";
import { WEEK } from "./_data";

export const metadata = { title: "Rozvrh | Taneční centrum Mirror" };

export default function RozvrhPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gray-50">
      <Navbar />

      {/* HERO minimal */}
      <section className="relative isolate">
        <div className="absolute inset-0 -z-10">
          <Image src="/background.png" alt="Pozadí rozvrhu" fill priority className="object-cover object-center" />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        </div>
        <div className="container mx-auto px-6 pt-32 pb-20 sm:pt-40 sm:pb-24 text-center">
          <h1 className="text-white text-4xl sm:text-6xl font-extrabold tracking-tight drop-shadow-lg">Rozvrh hodin</h1>
          <p className="mt-4 text-white/90 max-w-xl mx-auto">Týdenní plán lekcí v MIRROR centru.</p>
        </div>
      </section>

      {/* SIMPLE LIST */}
      <main className="container mx-auto px-6 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto space-y-8">
          {WEEK.map((day) => (
            <section key={day.day} className="rounded-2xl bg-white ring-1 ring-gray-200 shadow-sm" aria-label={`Rozvrh – ${day.day}`}>
              <header className="px-5 py-4 border-b border-gray-200 flex items-baseline justify-between">
                <h2 className="text-xl font-semibold text-gray-900">{day.day}</h2>
                {day.venue && <p className="text-sm text-gray-500">{day.venue}</p>}
              </header>

              <ul className="divide-y divide-gray-100">
                {day.lessons.map((l, i) => (
                  <li key={i} className="px-0">
                    {l.slug ? (
                      <Link
                        href={`/courses/${l.slug}`}
                        className="group flex items-center gap-4 px-5 py-4 rounded-xl -mx-1 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#57BDDB] transition"
                        aria-label={`${l.title} ${l.start}–${l.end}`}
                      >
                        <span className="shrink-0 inline-flex items-center justify-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm font-medium text-gray-700">
                          {l.start}–{l.end}
                        </span>
                        <span className="text-gray-900 font-medium group-hover:text-[#57BDDB]">
                          {l.title}
                        </span>
                        <span className="ml-auto text-gray-300 group-hover:text-[#57BDDB]" aria-hidden>
                          →
                        </span>
                      </Link>
                    ) : (
                      <div className="flex items-center gap-4 px-5 py-4">
                        <span className="shrink-0 inline-flex items-center justify-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm font-medium text-gray-700">
                          {l.start}–{l.end}
                        </span>
                        <span className="text-gray-900 font-medium">{l.title}</span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <p className="max-w-5xl mx-auto mt-6 text-sm text-gray-500">* Rozvrh se může výjimečně změnit (svátky, akce).</p>
      </main>

      <SiteFooter />
      <BackToTop />
    </div>
  );
}
