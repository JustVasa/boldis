// app/courses/page.tsx
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import BackToTop from "../components/BackToTop";
import { COURSES } from "./_data";

export const metadata = {
  title: "Kurzy | Taneční centrum Mirror",
};

export default function CoursesPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gray-50">
      <Navbar />

      {/* Hero pruh */}
      <section className="relative isolate">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/background.png"
            alt="Pozadí kurzů"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        </div>
        <div className="container mx-auto px-6 pt-32 pb-20 sm:pt-40 sm:pb-24 text-center">
          <h1 className="text-white text-4xl sm:text-6xl font-extrabold tracking-tight drop-shadow-lg">
            Kurzy
          </h1>
          <p className="mt-5 text-white/90 max-w-2xl mx-auto">
            Vyberte si kurz, který vás chytne – od prvních kroků po soutěžní úroveň.
          </p>
        </div>
      </section>

      {/* Grid kurzů */}
      <main className="container mx-auto px-6 py-14 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {COURSES.map((course) => (
            <Link
              key={course.slug}
              href={`/courses/${course.slug}`}
              className="group block rounded-2xl overflow-hidden shadow-lg ring-1 ring-gray-200 bg-white hover:-translate-y-1 hover:shadow-xl transition"
            >
              <div className="relative h-48">
                <Image
                  src={course.img}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition" />
              </div>
              <div className="p-5">
                <h3 className="text-lg text-gray-700 font-bold">{course.title}</h3>
                <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                  {course.short}
                </p>
                <span className="inline-flex items-center text-[#57BDDB] font-semibold mt-4">
                  Zjistit více <span className="ml-2">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className="bg-white text-gray-700 text-center py-8 border-t border-gray-200">
        <p className="text-lg font-medium">
          © {new Date().getFullYear()} Taneční centrum Mirror – Tomáš Boldiš
        </p>
      </footer>

      <BackToTop />
    </div>
  );
}
