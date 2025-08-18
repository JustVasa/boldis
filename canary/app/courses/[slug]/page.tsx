"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import { use, useCallback, useMemo } from "react";

type Course = {
  slug: string;
  title: string;
  img: string;
  desc: string;
};

const COURSES: Course[] = [
  {
    slug: "tanecni-pro-dospele",
    title: "Taneční kurzy pro dospělé",
    img: "/kurzy/dospele.jpg",
    desc:
      "Chcete se naučit tančit a zároveň si užít společné chvíle plné pohybu a zábavy? Naše kurzy pro dospělé jsou otevřené všem, kteří chtějí zvládnout základní i pokročilejší kroky společenských tanců. Pod vedením zkušeného profesionála Tomáše Boldiše vás naučíme standardní i latinskoamerické tance jako waltz, tango, valčík, cha-cha, rumba, jive a další. Lekce kladou důraz na správné držení těla, rytmus a spolupráci s partnerem. Kurz je vhodný pro všechny, kdo chtějí tanec zažít jako radostný a společenský zážitek – ať už pro plesy, svatby, nebo jen tak pro pohyb a odreagování.",
  },
  {
    slug: "tanecni-pro-mladez",
    title: "Taneční kurzy pro mládež",
    img: "/kurzy/mladez.jpg",
    desc:
      "Chceš se naučit tančit stylově a sebevědomě? Kurzy pro mládež jsou určené všem studentům, kteří chtějí získat pevné základy společenských tanců a zároveň si užít skvělou atmosféru s kamarády. Pod vedením Tomáše Boldiše zvládnete standardní i latinskoamerické tance (waltz, tango, cha-cha, jive…) a důležité dovednosti jako správné držení těla a rytmus. Ideální příprava na školní plesy, společenské akce i jako zábavný způsob, jak se hýbat a naučit něco nového.",
  },
  {
    slug: "latino-ladies",
    title: "Latino Ladies",
    img: "/kurzy/latino.jpg",
    desc:
      "Kurz pro všechny ženy, které si chtějí zatancovat, načerpat energii a posílit ženský výraz. Naučíte se základy i pokročilejší kroky latinskoamerických tanců jako salsa, bachata nebo merengue – v příjemné a podporující atmosféře. Pod vedením Tomáše Boldiše si osvojíte techniku, rytmus i sebevědomí, které využijete na parketu i v běžném životě. Skvělá příležitost protančit stres a potkat nové kamarádky.",
  },
  {
    slug: "tanecni-krouzky-pro-deti",
    title: "Taneční kroužky pro děti",
    img: "/kurzy/deti.jpg",
    desc:
      "Pro všechny děti, které milují pohyb a hudbu! Lekce probíhají hravou formou a rozvíjejí správné držení těla, rytmus, koordinaci i spolupráci ve skupině. Pod vedením Tomáše Boldiše se děti naučí základní taneční kroky, posílí kreativitu a sebevědomí. Kroužky jsou vhodné pro začátečníky i pokročilejší – v různých věkových skupinách tak, aby si každý našel své tempo.",
  },
  {
    slug: "svatebni-lekce",
    title: "Svatební lekce",
    img: "/kurzy/svatebni.jpg",
    desc:
      "Připravíme s vámi první tanec na míru – abyste se cítili jistě a užili si nezapomenutelný okamžik. Balíček zahrnuje 10 lekcí s Tomášem Boldišem, který vás provede technikou i choreografií podle vašich přání (lze rozšířit o další hodiny). Pomůžeme s výběrem i úpravou hudby, od klasického valčíku po moderní mix. Ať už chcete něco tradičního, nebo originální show, společně to vyladíme do detailu.",
  },
  {
    slug: "individualni-lekce",
    title: "Individuální lekce",
    img: "/kurzy/individual.jpg",
    desc:
      "Maximální osobní přístup pro jednotlivce i páry. Na individuálních lekcích se trenér věnuje pouze vám – tempo, náplň i styl přizpůsobíme vašim cílům. Můžete si vybrat libovolný taneční styl od společenských po latinskoamerické. Individuálky jsou ideální pro rychlejší pokrok, doladění techniky i získání jistoty na parketu.",
  },
  {
    slug: "baletni-krouzek",
    title: "Kroužek baletu",
    img: "/kurzy/balet.jpg",
    desc:
      "Balet rozvíjí jemnost, koordinaci, flexibilitu a smysl pro hudbu. Lekce probíhají přístupnou a hravou formou, aby děti bavil pohyb i pravidelný trénink. Naučí se správnému držení těla, základním pozicím i pohybům klasického baletu. Balet podporuje koncentraci, trpělivost a sebedůvěru – vhodné pro začátečníky i děti s předchozí zkušeností.",
  },
];

function getCourse(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug);
}

export default function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Next.js 15: params je Promise → rozbalíme pomocí use()
  const { slug } = use(params);

  const course = getCourse(slug);
  if (!course) return notFound();

  const related = useMemo(
    () => COURSES.filter((c) => c.slug !== slug).slice(0, 4),
    [slug]
  );

  const onSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Děkujeme! Registrace bude dokončena po napojení plateb.");
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gray-50">
      {/* Navbar */}
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
          <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" />
        </div>

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-start">
          {/* Popis kurzu (v buňce) */}
          <article className="lg:col-span-2 bg-white rounded-2xl shadow-lg ring-1 ring-gray-200 p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">O kurzu</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {course.desc}
            </p>
          </article>

          {/* Pravý sloupec: Info buňka + Formulář pod ní (kompaktní výška) */}
          <aside className="flex flex-col gap-8 self-start">
            {/* Info buňka */}
            <div className="bg-white rounded-2xl shadow-lg ring-1 ring-gray-200 p-6 w-full">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Informace o kurzu
              </h3>

              <dl className="space-y-4 text-gray-700">
                <div>
                  <dt className="font-medium text-gray-900">
                    <b>Cena</b>
                  </dt>
                  <dd className="mt-1">
                    10 lekcí: <b>1990&nbsp;Kč / osoba</b>
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-900">
                    <b>Adresa</b>
                  </dt>
                  <dd className="mt-1">Ostrava - Junácká 127/33</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-900">
                    <b>Detaily</b>
                  </dt>
                  <dd className="mt-1">
                    Každý čtvrtek od <b>19:30 – 21:00</b>
                  </dd>
                </div>
              </dl>
            </div>

            {/* Registrační formulář */}
            <div className="bg-white rounded-2xl shadow-lg ring-1 ring-gray-200 p-6 w-full">
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
                  Odesláním souhlasíte se zpracováním osobních údajů pro účely registrace.
                </p>
              </form>
            </div>
          </aside>
        </div>

        {/* Další kurzy */}
        <section className="mt-14 sm:mt-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">
            Další kurzy v MIRROR centru
          </h2>
          <p className="mt-2 text-center text-gray-600">
            Prozkoumejte i další možnosti – od společenských tanců po latino a balet.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((c) => (
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
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 line-clamp-2">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {c.desc}
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

      {/* Patička */}
      <footer className="bg-white text-gray-700 text-center py-8 border-t border-gray-200">
        <p className="text-lg font-medium">
          © {new Date().getFullYear()} Taneční centrum Mirror – Tomáš Boldiš
        </p>
      </footer>
    </div>
  );
}
