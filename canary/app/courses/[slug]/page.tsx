// app/courses/[slug]/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import { use, useMemo, useState } from "react";

import { COURSES, getCourse } from "../_data";
import type { Course } from "../_data";

/** 🔧 NASTAVENÍ PŘÍJEMCE – formát "číslo/kód" (podporuje i prefix: "12-3456789012/0100") */
const RECEIVER_ACCOUNT = "3283694017/3030";
const CURRENCY = "CZK";

/** Rozparsuje "prefix-číslo/kód" → { accountNumber, bankCode } */
function splitCzAccount(acc: string): { accountNumber: string; bankCode: string } {
  const s = acc.trim();
  const slashIdx = s.lastIndexOf("/");
  if (slashIdx === -1) throw new Error("Účet musí být ve tvaru číslo/kód (např. 123456789/0100)");
  const left = s.slice(0, slashIdx);
  const bankCode = s.slice(slashIdx + 1).replace(/\s+/g, "");
  const accountNumber = left.replace(/\s+/g, "");
  if (!bankCode || !accountNumber) throw new Error("Chybné číslo účtu nebo kód banky");
  return { accountNumber, bankCode };
}

/** Primární parsování: číslo těsně před "Kč" nebo "CZK" (poslední výskyt) */
function parseAmountNearCurrency(price?: string): number | null {
  if (!price) return null;
  const s = price.replace(/\u00A0|\u202F/g, " "); // NBSP → mezera
  const re = /(\d{1,3}(?:[ .\u00A0\u202F]\d{3})*|\d+)(?:[.,]\d+)?(?=\s*(?:Kč|CZK))/gim;
  let match: RegExpExecArray | null = null;
  let last: string | null = null;
  while ((match = re.exec(s)) !== null) last = match[0];
  if (!last) return null;
  const raw = last.replace(/[ .\u00A0\u202F]/g, "").replace(",", ".");
  const val = Number(raw);
  return Number.isFinite(val) ? val : null;
}

/** Záložní parsování: největší číslo v textu (pro případ, že v ceně chybí "Kč") */
function parseFallbackAmount(price?: string): number | null {
  if (!price) return null;
  const s = price.replace(/\u00A0|\u202F/g, " ");
  const matches = s.match(/(\d{1,3}(?:[ .\u00A0\u202F]\d{3})*(?:[.,]\d+)?|\d+(?:[.,]\d+)?)/g);
  if (!matches) return null;
  let best: number | null = null;
  for (const m of matches) {
    const raw = m.replace(/[ .\u00A0\u202F]/g, "").replace(",", ".");
    const v = Number(raw);
    if (Number.isFinite(v) && (best === null || v > best)) best = v;
  }
  return best;
}

/** 🧼 Bez diakritiky */
function stripDiacritics(str: string) {
  return str.normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

/** 🧩 Kód kurzu z názvu (iniciály slov bez diakritiky), např. "TANEČNÍ KROUŽEK PRO DĚTI" → "TKPD" */
function courseCodeFromTitle(title: string) {
  const clean = stripDiacritics(title).toUpperCase();
  return clean
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("");
}

/** Plná zpráva (zobrazujeme ji pod QR pro kopírování, e-mailem apod.) */
function buildFullMessage({
  courseTitle,
  firstName,
  lastName,
  email,
  phone,
  category,
}: {
  courseTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  category?: string | null;
}) {
  const parts = [
    `Kurz: ${courseTitle}`,
    `Jméno: ${firstName}`,
    `Příjmení: ${lastName}`,
    `Email: ${email}`,
    `Tel: ${phone}`,
    category ? `Kategorie: ${category}` : "",
  ].filter(Boolean);
  return parts.join(" | ");
}

/** QR zpráva: <KOD_KURZU>(-<KAT>) | <email> | <telefon>  (bez "REG") */
function buildQrMessage({
  courseTitle,
  email,
  phone,
  category,
}: {
  courseTitle: string;
  email: string;
  phone: string;
  category?: string | null;
}) {
  const code = courseCodeFromTitle(courseTitle); // např. TKPD
  const codeWithCat = category ? `${code}-${category}` : code;
  return `${codeWithCat} | ${email} | ${phone}`;
}

/** Sestaví URL pro PNG QR (Paylibo) – vyžaduje accountNumber + bankCode */
function buildPayliboQrUrl({
  accountNumber,
  bankCode,
  amount,
  currency,
  message,
  vs,
  size = 640,
}: {
  accountNumber: string;
  bankCode: string;
  amount: number;
  currency: string;
  message: string;
  vs?: string | null;
  size?: number;
}) {
  const base = "https://api.paylibo.com/paylibo/generator/czech/image";
  const p = new URLSearchParams();
  p.set("accountNumber", accountNumber);
  p.set("bankCode", bankCode);
  p.set("amount", amount.toFixed(2)); // 1690.00
  p.set("currency", currency);
  if (vs) {
    const cleanVs = vs.replace(/\D/g, "").slice(0, 10);
    if (cleanVs) p.set("vs", cleanVs);
  }
  if (message) p.set("message", message);
  p.set("size", String(size));
  return `${base}?${p.toString()}`;
}

export default function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const course: Course | undefined = getCourse(slug);

  // ---------- 🧠 HOOKS MUSÍ BÝT NEPODMÍNĚNÉ (nahoře) ----------
  // Stav formuláře:
  const [category, setCategory] = useState<string>("");
  const [note, setNote] = useState<string>(""); // pro individuální lekce

  // Stav modalu/QR a pomocných textů:
  const [showQr, setShowQr] = useState(false);
  const [qrUrl, setQrUrl] = useState<string>("");
  const [fullMessage, setFullMessage] = useState<string>("");
  const [accountString, setAccountString] = useState<string>(RECEIVER_ACCOUNT);
  const [lastForm, setLastForm] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    category?: string | null;
    courseTitle: string;
    note?: string | null;
  } | null>(null);

  // Bezpečně zjistit cenu i když course zatím není:
  const priceAmount = useMemo(() => {
    const price = course?.price ?? undefined;
    const a = parseAmountNearCurrency(price);
    return a ?? parseFallbackAmount(price);
  }, [course?.price]);

  // Odvozené příznaky (bezpečné i bez course):
  const slugVal = course?.slug ?? "";
  const isKidsCourse = slugVal === "tanecni-krouzky-pro-deti";
  const isIndividualCourse = slugVal === "individualni-lekce";
  const isLatinoCourse = slugVal === "latino-ladies"; // 👈 NOVÉ

  // ---------- 🧠 HOOKS JSOU VŠECKY VÝŠE. TEPRVE TEĎ MŮŽE BÝT EARLY RETURN ----------
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

  const desc = course.desc?.trim() ?? "";

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Zkopírováno do schránky.");
    } catch {
      alert("Nepodařilo se zkopírovat.");
    }
  };

  // Odeslání emailu (hotově)
  const sendCashEmail = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    category?: string | null;
    courseTitle: string;
    note?: string | null;
  }) => {
    const name = `${data.firstName} ${data.lastName}`.trim();
    const messageLines = [
      `Registrace kurzu (platba hotově na místě)`,
      `Kurz: ${data.courseTitle}`,
      `Jméno: ${data.firstName}`,
      `Příjmení: ${data.lastName}`,
      `Email: ${data.email}`,
      `Tel: ${data.phone}`,
      isKidsCourse && data.category ? `Kategorie: ${data.category}` : "",
      isLatinoCourse && data.category ? `Kategorie: ${data.category}` : "", // 👈 NOVÉ
      isIndividualCourse && data.note ? `Zpráva klienta: ${data.note}` : "",
    ].filter(Boolean);
    const message = messageLines.join("\n");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone: data.phone,
          email: data.email,
          message,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error || "Odeslání selhalo.");
      alert("Registrace pro platbu hotově byla odeslána. Děkujeme!");
      setShowQr(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Nepodařilo se odeslat email: ${msg}`);
    }
  };

  // Odeslání zájmu u INDIVIDUÁLNÍ LEKCE (po submitu formuláře)
  const sendInterestEmail = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    note: string;
    courseTitle: string;
  }) => {
    const name = `${data.firstName} ${data.lastName}`.trim();
    const message = [
      `Zájem o individuální lekci`,
      `Kurz: ${data.courseTitle}`,
      `Jméno: ${data.firstName}`,
      `Příjmení: ${data.lastName}`,
      `Email: ${data.email}`,
      `Tel: ${data.phone}`,
      `Požadované tance / poznámka:`,
      data.note,
    ].join("\n");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone: data.phone,
        email: data.email,
        message,
      }),
    });
    const json = await res.json();
    if (!res.ok || !json.ok) throw new Error(json.error || "Odeslání selhalo.");
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const firstName = String(data.get("firstName") || "").trim();
    const lastName = String(data.get("lastName") || "").trim();
    const email = String(data.get("email") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const selectedCategory =
      (data.get("category") as string | null) && (isKidsCourse || isLatinoCourse)
        ? String(data.get("category"))
        : null;
    const noteText =
      (data.get("note") as string | null) && isIndividualCourse
        ? String(data.get("note")).trim()
        : "";

    // U individuálu pošli i informační e-mail lektorovi
    if (isIndividualCourse) {
      try {
        await sendInterestEmail({
          firstName,
          lastName,
          email,
          phone,
          note: noteText,
          courseTitle: course.title,
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        alert(`Nepodařilo se odeslat zprávu lektorovi: ${msg}`);
      }
    }

    // částka z ceníku
    const amount = priceAmount ?? 0;

    // účet → accountNumber + bankCode
    let accountNumber = "";
    let bankCode = "";
    try {
      const parts = splitCzAccount(RECEIVER_ACCOUNT);
      accountNumber = parts.accountNumber;
      bankCode = parts.bankCode;
    } catch {
      alert("Chyba v čísle účtu. Zkontroluj formát, např. 123456789/0100.");
      return;
    }

    // VS – z telefonu (číslice) nebo timestamp
    let vs = phone.replace(/\D/g, "").slice(0, 10);
    if (!vs) vs = String(Date.now()).slice(-10);

    // PLNÝ text pro zobrazení/zkopírování (na webu)
    const full = buildFullMessage({
      courseTitle: course.title,
      firstName,
      lastName,
      email,
      phone,
      category: (isKidsCourse || isLatinoCourse) ? selectedCategory : null,
    });

    // QR zpráva: <KOD>(-<KAT>) | email | telefon
    const spaydMsg = buildQrMessage({
      courseTitle: course.title,
      email,
      phone,
      category: (isKidsCourse || isLatinoCourse) ? selectedCategory : null,
    });

    // QR URL (PNG) přes Paylibo
    const url = buildPayliboQrUrl({
      accountNumber,
      bankCode,
      amount,
      currency: CURRENCY,
      message: spaydMsg,
      vs,
      size: 640,
    });

    setQrUrl(url);
    setFullMessage(full);
    setAccountString(RECEIVER_ACCOUNT);
    setLastForm({
      firstName,
      lastName,
      email,
      phone,
      category: (isKidsCourse || isLatinoCourse) ? selectedCategory : null,
      courseTitle: course.title,
      note: isIndividualCourse ? noteText : "",
    });
    setShowQr(true);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gray-50">
      <Navbar />

      {/* HERO */}
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
        {/* Popis */}
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

        {/* Info + formulář */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
          {/* Info */}
          <div className="bg-white rounded-2xl shadow-lg ring-1 ring-gray-200 p-6 h-full">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Informace o kurzu</h3>
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

          {/* Formulář */}
          <div className="bg-white rounded-2xl shadow-lg ring-1 ring-gray-200 p-6 h-full">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Registrační formulář</h3>
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  name="firstName"
                  placeholder="Jméno"
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#57BDDB] focus:border-[#57BDDB]"
                />
                <input
                  type="text"
                  required
                  name="lastName"
                  placeholder="Příjmení"
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#57BDDB] focus:border-[#57BDDB]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="email"
                  required
                  name="email"
                  placeholder="Email"
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#57BDDB] focus:border-[#57BDDB]"
                  autoComplete="email"
                />
                <input
                  type="tel"
                  required
                  name="phone"
                  placeholder="Tel. číslo"
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#57BDDB] focus:border-[#57BDDB]"
                  autoComplete="tel"
                />
              </div>

              {isKidsCourse && (
                <div className="relative">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-900 mb-1">
                    Kategorie <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`w-full rounded-lg border border-gray-300 bg-white px-3 py-2 appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-[#57BDDB] focus:border-[#57BDDB] ${
                      category ? "text-gray-900" : "text-gray-400"
                    }`}
                    aria-label="Věková kategorie"
                  >
                    <option value="" disabled>
                      Vyberte věkovou kategorii…
                    </option>
                    <option value="3-6-u">3–6 let (úterý)</option>
                    <option value="3-6-c">3–6 let (čtvrtek)</option>
                    <option value="7-12-u">7–12 let (úterý)</option>
                    <option value="7-12-c">7–12 let (čtvrtek)</option>
                  </select>
                  {/* šipka */}
                  <svg
                    className="pointer-events-none absolute right-3 top-[38px] h-5 w-5 -translate-y-1/2 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.18l3.71-2.95a.75.75 0 111.04 1.08l-4.24 3.37a.75.75 0 01-.94 0L5.21 8.31a.75.75 0 01.02-1.1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}

              {isLatinoCourse && (
                <div className="relative">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-900 mb-1">
                    Den konání <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`w-full rounded-lg border border-gray-300 bg-white px-3 py-2 appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-[#57BDDB] focus:border-[#57BDDB] ${
                      category ? "text-gray-900" : "text-gray-400"
                    }`}
                    aria-label="Den konání"
                  >
                    <option value="" disabled>
                      Vyberte den…
                    </option>
                    <option value="ut">Úterý</option>
                    <option value="ct">Čtvrtek</option>
                  </select>
                  {/* šipka */}
                  <svg
                    className="pointer-events-none absolute right-3 top={[38]}px h-5 w-5 -translate-y-1/2 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.18l3.71-2.95a.75.75 0 111.04 1.08l-4.24 3.37a.75.75 0 01-.94 0L5.21 8.31a.75.75 0 01.02-1.1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}

              {isIndividualCourse && (
                <div>
                  <label htmlFor="note" className="block text-sm font-medium text-gray-900 mb-1">
                    Zpráva pro lektora <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    id="note"
                    name="note"
                    required
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Napište, o jaké tance máte zájem (např. waltz, tango, salsa) a kdy vám vyhovují termíny."
                    className="mt-1 w-full min-h-[110px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#57BDDB] focus:border-[#57BDDB] resize-vertical"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-lg bg-[#57BDDB] px-4 py-3 text-white font-semibold shadow hover:bg-[#3BA7C7] transition"
              >
                Registrovat a zaplatit
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Po načtení QR kódu vaše bankovní aplikace předvyplní všechny údaje včetně zprávy pro příjemce. Zkontrolujte je a potvrďte platbu.
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
            Prozkoumejte i další možnosti – od společenských tanců po latino a balet.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {COURSES.filter((c) => c.slug !== slug)
              .slice(0, 4)
              .map((c) => (
                <Link
                  key={c.slug}
                  href={`/courses/${c.slug}`}
                  className="group overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200 shadow hover:shadow-lg transition"
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

      {/* QR modal – tmavý křížek, QR + kopírování zprávy a účtu + hotově */}
      {showQr && qrUrl && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowQr(false)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200 p-6 relative">
              <button
                onClick={() => setShowQr(false)}
                className="absolute right-3 top-3 rounded-full p-2 text-gray-900 hover:bg-gray-200"
                aria-label="Zavřít"
                title="Zavřít"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6l-12 12" />
                </svg>
              </button>

              <div className="flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrUrl}
                  alt="QR kód pro platbu"
                  className="h-72 w-72 rounded-md ring-1 ring-gray-200"
                />
              </div>

              <p className="text-xs text-gray-500 mt-4 text-center">
                Po načtení QR kódu vaše bankovní aplikace předvyplní všechny údaje včetně zprávy pro příjemce. Zkontrolujte je a potvrďte platbu.
              </p>

              {/* Úplná zpráva pro příjemce + kopírování */}
              <div className="mt-5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">Zpráva pro příjemce</span>
                  <button
                    className="text-sm text-[#57BDDB] hover:underline"
                    onClick={() => copy(fullMessage)}
                  >
                    Kopírovat
                  </button>
                </div>
                <p className="text-sm font-mono break-words text-gray-800 bg-gray-50 p-2 rounded-md ring-1 ring-gray-200">
                  {fullMessage}
                </p>
              </div>

              {/* Číslo účtu + kopírování */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">Číslo účtu</span>
                  <button
                    className="text-sm text-[#57BDDB] hover:underline"
                    onClick={() => copy(accountString)}
                  >
                    Kopírovat
                  </button>
                </div>
                <p className="text-sm font-mono text-gray-800 bg-gray-50 p-2 rounded-md ring-1 ring-gray-200">
                  {accountString}
                </p>
              </div>

              {/* Hotově na místě */}
              {lastForm && (
                <button
                  onClick={() => sendCashEmail(lastForm)}
                  className="mt-6 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 font-semibold hover:bg-gray-50 transition"
                >
                  Registrovat a zaplatit hotově na místě
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
