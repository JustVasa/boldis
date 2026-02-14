"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import { use, useEffect, useMemo, useState } from "react";

import { COURSES, getCourse } from "../_data";
import type { Course } from "../_data";

/** 🔧 NASTAVENÍ PŘÍJEMCE */
const RECEIVER_ACCOUNT = "3283694017/3030";
const CURRENCY = "CZK";

/** 📍 Jednotná adresa */
const KRENOV_ADDRESS = "Křenov 63, 569 22 Křenov";

/** 🗓️ Termín (informační text) */
const TERM_LABEL = "Sezóna 2025";

/** 📅 Počet lekcí v kurzu (výchozí pro paušální ceny) */
const TOTAL_LESSONS = 10;

/** 💸 Ceník dětských kategorií (za pololetí) */
const KIDS_PRICES: Record<"3-6" | "7-12", number> = {
  "3-6": 1800,
  "7-12": 2000,
};

/** 💸 Balet – pevná cena (za pololetí) */
const BALLET_PRICE = 1690;

/** 💸 Soukromé lekce – cena za 1 lekci (za osobu) */
const INDIVIDUAL_PER_LESSON = 500;

/** ⏱️ Cooldown proti dvojkliku */
const CASH_COOLDOWN_MS = 10_000; 
const CASH_COOLDOWN_KEY = "cashCooldownUntil";

/** Utils */
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

function parseAmountNearCurrency(price?: string): number | null {
  if (!price) return null;
  const s = price.replace(/\u00A0|\u202F/g, " ");
  const re = /(\d{1,3}(?:[ .\u00A0\u202F]\d{3})*|\d+)(?:[.,]\d+)?(?=\s*(?:Kč|CZK))/gim;
  let match: RegExpExecArray | null = null;
  let last: string | null = null;
  while ((match = re.exec(s)) !== null) last = match[0];
  if (!last) return null;
  const raw = last.replace(/[ .\u00A0\u202F]/g, "").replace(",", ".");
  const val = Number(raw);
  return Number.isFinite(val) ? val : null;
}

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

function stripDiacritics(str: string) {
  return str.normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

function courseCodeFromTitle(title: string) {
  const clean = stripDiacritics(title).toUpperCase();
  return clean
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("");
}

/** Plná zpráva (kopírování/e-mail) */
function buildFullMessage({
  courseTitle,
  firstName,
  lastName,
  email,
  phone,
  age,
  latinoSlot,
  place,
}: {
  courseTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age?: string | null;
  latinoSlot?: string | null;
  place?: string | null;
}) {
  const parts = [
    `Kurz: ${courseTitle}`,
    `Jméno: ${firstName}`,
    `Příjmení: ${lastName}`,
    `Email: ${email}`,
    `Tel: ${phone}`,
    age ? `Věková kategorie: ${age}` : "",
    latinoSlot ? `Skupina: ${latinoSlot}` : "",
    place ? `Místo: ${place}` : "",
  ].filter(Boolean);
  return parts.join(" | ");
}

/** QR zpráva do SPAYD */
function buildQrMessage({
  courseTitle,
  email,
  phone,
  age,
}: {
  courseTitle: string;
  email: string;
  phone: string;
  age?: string | null;
}) {
  const code = courseCodeFromTitle(courseTitle);
  const ageTag = age ? (age === "3-6" ? "36" : age === "7-12" ? "712" : age) : null;
  const suffix = [ageTag].filter(Boolean).join("-");
  const codeWithTags = suffix ? `${code}-${suffix}` : code;
  return `${codeWithTags} | ${email} | ${phone}`;
}

/** Paylibo QR URL (PNG) */
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
  p.set("amount", amount.toFixed(2));
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

  // ---------- 🧠 HOOKY ----------
  const [age, setAge] = useState<string>("");
  const [latinoSlot, setLatinoSlot] = useState<string>(""); 
  const [note, setNote] = useState<string>("");

  // druhý partner (Partnerka)
  const [partnerFirst, setPartnerFirst] = useState<string>("");
  const [partnerLast, setPartnerLast] = useState<string>("");

  const [paymentMethod, setPaymentMethod] = useState<"bank" | "cash" | "">("");

  // Soukromé lekce
  const [individualCount, setIndividualCount] = useState<number>(1);

  const [showQr, setShowQr] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [qrUrl, setQrUrl] = useState<string>("");
  const [fullMessage, setFullMessage] = useState<string>("");
  const [accountString, setAccountString] = useState<string>(RECEIVER_ACCOUNT);

  useEffect(() => {
    const tick = () => {
      const until = Number(localStorage.getItem(CASH_COOLDOWN_KEY) || "0");
      const leftMs = Math.max(0, until - Date.now());
      if (leftMs <= 0) localStorage.removeItem(CASH_COOLDOWN_KEY);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const parsedPriceAmount = useMemo(() => {
    const price = course?.price ?? undefined;
    const a = parseAmountNearCurrency(price);
    return a ?? parseFallbackAmount(price);
  }, [course?.price]);

  // Příznaky
  const slugVal = course?.slug ?? "";
  const isKidsCourse = slugVal === "tanecni-krouzky-pro-deti";
  const isIndividualCourse = slugVal === "individualni-lekce";
  const isLatinoCourse = slugVal === "latino-ladies";
  const isBalletCourse = slugVal === "krouzek-baletu";
  const isAdultCourse = slugVal === "tanecni-pro-dospele";
  const isWeddingCourse = slugVal === "svatebni-lekce";

  // Kurzy, kde se chodí v páru
  const isPairCourse = isAdultCourse;

  const perLessonPriceGroup = useMemo(() => {
    if (isKidsCourse) {
      if (age === "3-6") return KIDS_PRICES["3-6"] / TOTAL_LESSONS;
      if (age === "7-12") return KIDS_PRICES["7-12"] / TOTAL_LESSONS;
      return 0;
    }
    if (isBalletCourse) return BALLET_PRICE / TOTAL_LESSONS;
    const base = parsedPriceAmount ?? 0;
    return base > 0 ? base / TOTAL_LESSONS : 0;
  }, [isKidsCourse, isBalletCourse, age, parsedPriceAmount]);

  // Výpočet ceny
  const amountGroupPerPerson = Number((perLessonPriceGroup * TOTAL_LESSONS).toFixed(2));
  const amountAll =
    isIndividualCourse
      ? individualCount * INDIVIDUAL_PER_LESSON
      : amountGroupPerPerson * 1; 

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
            </Link>.
          </p>
        </main>
      </div>
    );
  }

  // ✅ alias pro TS
  const courseReq: Course = course;
  const desc = courseReq.desc?.trim() ?? "";

  // ❌ ZDE JSEM SMAZAL FUNKCI "copy", KTERÁ ZPŮSOBOVALA CHYBU

  // Odeslání potvrzovacího e-mailu
  async function sendRegistrationEmails(args: {
    firstName: string;
    lastName: string;
    partnerFirst?: string | null;
    partnerLast?: string | null;
    email: string;
    phone: string;
    courseTitle: string;
    age?: string | null;
    latinoSlot?: string | null;
    place?: string | null;
    note?: string | null;
    paymentMethod: "bank" | "cash";
    amount: number;
    qrUrl?: string | null;
    individualCount?: number;
    isPair: boolean;
  }) {
    const {
      firstName,
      lastName,
      partnerFirst,
      partnerLast,
      email,
      phone,
      courseTitle,
      age,
      latinoSlot,
      place,
      note,
      paymentMethod,
      amount,
      qrUrl,
      individualCount,
      isPair,
    } = args;

    const name = `${firstName} ${lastName}`.trim();

    const lines: string[] = [
      `Potvrzení registrace`,
      `Kurz: ${courseTitle}`,
      isPair ? `Partner: ${firstName} ${lastName}` : `Jméno: ${firstName} ${lastName}`,
      isPair ? `Partnerka: ${partnerFirst ?? ""} ${partnerLast ?? ""}`.trim() : "",
      `Email: ${email}`,
      `Tel: ${phone}`,
      age ? `Věková kategorie: ${age}` : "",
      latinoSlot ? `Vybraná skupina: ${latinoSlot}` : "",
      place ? `Místo: ${place}` : "",
      note ? `Poznámka: ${note}` : "",
      individualCount
        ? `Soukromé lekce: ${individualCount} × ${INDIVIDUAL_PER_LESSON} Kč`
        : "",
      isPair ? `Pozn.: registrace za pár (2 osoby)` : "",
      `Způsob platby: ${paymentMethod === "bank" ? "Převodem na účet" : "Hotově na místě"}`,
      `Částka k úhradě: ${amount.toFixed(0)} ${CURRENCY}`,
      paymentMethod === "bank" ? `QR pro platbu je přiložen v e-mailu.` : `Platba proběhne hotově na místě.`,
    ].filter(Boolean);

    const message = lines.join("\n");

    const payload: Record<string, unknown> = {
      name,
      phone,
      email,
      message,
      meta: {
        courseTitle,
        paymentMethod,
        amount,
        currency: CURRENCY,
        age,
        latinoSlot,
        place,
        note,
        partnerFirst,
        partnerLast,
        individualCount,
        pair: isPair,
      },
    };

    if (paymentMethod === "bank" && qrUrl) {
      payload.qrUrl = qrUrl;
    }

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json: { ok: boolean; error?: string } = await res.json();
    if (!res.ok || !json.ok) throw new Error(json.error || "Odeslání selhalo.");
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    const firstName = String(data.get("firstName") || "").trim();
    const lastName  = String(data.get("lastName") || "").trim();
    const email     = String(data.get("email") || "").trim();
    const phone     = String(data.get("phone") || "").trim();

    // Partnerka u párových kurzů
    const pFirst = isPairCourse ? String(data.get("partnerFirst") || "").trim() : "";
    const pLast  = isPairCourse ? String(data.get("partnerLast") || "").trim() : "";

    const selectedAge = isKidsCourse ? String(data.get("age") || "").trim() : "";
    const selectedLatinoSlot = isLatinoCourse ? String(data.get("latinoSlot") || "").trim() : "";

    if (!paymentMethod) {
      alert("Vyberte prosím způsob platby (Převodem / Hotově).");
      return;
    }

    // Validace dle typu
    if (isKidsCourse) {
      if (!selectedAge) { alert("Vyberte prosím věkovou kategorii."); return; }
    }
    
    if (isLatinoCourse) {
      if (!selectedLatinoSlot) { alert("Vyberte prosím skupinu (čas)."); return; }
    }

    if (isPairCourse) {
      if (!pFirst || !pLast) {
        alert("Doplňte prosím jméno a příjmení partnerky.");
        return;
      }
    }

    if (isIndividualCourse) {
      if (individualCount < 1 || individualCount > 10) {
        alert("Zvolte prosím počet soukromých lekcí v rozsahu 1–10.");
        return;
      }
    }

    // účet → accountNumber + bankCode
    let accountNumber = "";
    let bankCode = "";
    try {
      const parts = splitCzAccount(RECEIVER_ACCOUNT);
      accountNumber = parts.accountNumber;
      bankCode = parts.bankCode;
    } catch {
      alert("Chyba v čísle účtu.");
      return;
    }

    // VS – z telefonu (číslice) nebo timestamp
    let vs = phone.replace(/\D/g, "").slice(0, 10);
    if (!vs) vs = String(Date.now()).slice(-10);

    // PLNÝ text (pro náhled/kopírování)
    let full = buildFullMessage({
      courseTitle: courseReq.title,
      firstName,
      lastName,
      email,
      phone,
      age: isKidsCourse ? selectedAge : null,
      latinoSlot: isLatinoCourse ? selectedLatinoSlot : null,
      place: KRENOV_ADDRESS,
    });

    if (isPairCourse) {
      full += ` | Partnerka: ${pFirst} ${pLast}`;
    }

    // QR zpráva
    const spaydMsg = buildQrMessage({
      courseTitle: courseReq.title,
      email,
      phone,
      age: isKidsCourse ? selectedAge : null,
    });

    const amount = amountAll;

    const url =
      paymentMethod === "bank"
        ? buildPayliboQrUrl({
            accountNumber,
            bankCode,
            amount,
            currency: CURRENCY,
            message: spaydMsg,
            vs,
            size: 640,
          })
        : "";

    try {
      await sendRegistrationEmails({
        firstName,
        lastName,
        partnerFirst: isPairCourse ? pFirst : undefined,
        partnerLast: isPairCourse ? pLast : undefined,
        email,
        phone,
        courseTitle: courseReq.title,
        age: isKidsCourse ? selectedAge : null,
        latinoSlot: isLatinoCourse ? selectedLatinoSlot : null,
        place: KRENOV_ADDRESS,
        note: isIndividualCourse ? String(data.get("note") || "").trim() : null,
        paymentMethod: paymentMethod === "bank" ? "bank" : "cash",
        amount,
        qrUrl: paymentMethod === "bank" ? url : null,
        individualCount: isIndividualCourse ? individualCount : undefined,
        isPair: isPairCourse || isWeddingCourse,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Nepodařilo se odeslat potvrzení: ${msg}`);
      return;
    }

    setFullMessage(full);
    setAccountString(RECEIVER_ACCOUNT);

    if (paymentMethod === "bank") {
      setQrUrl(url);
      setShowQr(true);
    } else {
      const nextAllowed = Date.now() + CASH_COOLDOWN_MS;
      localStorage.setItem(CASH_COOLDOWN_KEY, String(nextAllowed));
      setShowSuccess(true);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gray-50">
      <Navbar />

      {/* HERO */}
      <section className="relative isolate">
        <div className="absolute inset-0 -z-10">
          <Image
            src={courseReq.img}
            alt={courseReq.title}
            fill
            priority
            className="object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-black/70 backdrop-blur-[6px]" />

        <div className="container mx-auto px-6 pt-36 pb-28 sm:pt-44 sm:pb-36">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-white text-3xl sm:text-5xl font-extrabold tracking-tight drop-shadow-lg">
              {courseReq.title}
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
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{desc}</p>
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
                <dd className="mt-1">
                  {isKidsCourse
                    ? "Cena dle výběru (viz formulář)"
                    : isBalletCourse
                      ? "1690 Kč / pololetí"
                      : courseReq.price ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900"><b>Lektor</b></dt>
                <dd className="mt-1">{courseReq.instructor ?? "—"}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900"><b>Adresa</b></dt>
                <dd className="mt-1">{KRENOV_ADDRESS}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900"><b>Čas</b></dt>
                <dd className="mt-1">
                  {courseReq.schedule ?? "—"}
                </dd>
              </div>
              {(isKidsCourse || isBalletCourse) && (
                <div>
                  <dt className="font-medium text-gray-900"><b>Období</b></dt>
                  <dd className="mt-1">{TERM_LABEL}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Formulář */}
          <div className="bg-white rounded-2xl shadow-lg ring-1 ring-gray-200 p-6 h-full">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Registrační formulář</h3>
            <form className="space-y-4" onSubmit={onSubmit}>

              {/* Párové kurzy: dva bloky – Partner a Partnerka */}
              {isPairCourse ? (
                <>
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">Partner</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        required
                        name="firstName"
                        placeholder="Jméno partnera"
                        className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#57BDDB]"
                      />
                      <input
                        type="text"
                        required
                        name="lastName"
                        placeholder="Příjmení partnera"
                        className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#57BDDB]"
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">Partnerka</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        required
                        name="partnerFirst"
                        value={partnerFirst}
                        onChange={(e) => setPartnerFirst(e.target.value)}
                        placeholder="Jméno partnerky"
                        className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#57BDDB]"
                      />
                      <input
                        type="text"
                        required
                        name="partnerLast"
                        value={partnerLast}
                        onChange={(e) => setPartnerLast(e.target.value)}
                        placeholder="Příjmení partnerky"
                        className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#57BDDB]"
                      />
                    </div>
                  </div>
                </>
              ) : (
                // Nepárové/ostatní: klasický žadatel (1 osoba)
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    name="firstName"
                    placeholder="Jméno"
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#57BDDB]"
                  />
                  <input
                    type="text"
                    required
                    name="lastName"
                    placeholder="Příjmení"
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#57BDDB]"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="email"
                  required
                  name="email"
                  placeholder="Email"
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#57BDDB]"
                  autoComplete="email"
                />
                <input
                  type="tel"
                  required
                  name="phone"
                  placeholder="Tel. číslo"
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#57BDDB]"
                  autoComplete="tel"
                />
              </div>

              {/* DĚTI: Věk */}
              {isKidsCourse && (
                <div className="relative">
                  <label htmlFor="age" className="block text-sm font-medium text-gray-900 mb-1">
                    Věková kategorie <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="age"
                    name="age"
                    required
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#57BDDB]"
                  >
                    <option value="" disabled>Vyberte věk…</option>
                    <option value="3-6">První stupeň</option>
                    <option value="7-12">Druhý stupeň</option>
                  </select>
                </div>
              )}

              {/* LATINO: Výběr času */}
              {isLatinoCourse && (
                <div className="relative">
                  <label htmlFor="latinoSlot" className="block text-sm font-medium text-gray-900 mb-1">
                    Výběr skupiny <span className="text-red-600">*</span>
                  </label>
                  <select
                    id="latinoSlot"
                    name="latinoSlot"
                    required
                    value={latinoSlot}
                    onChange={(e) => setLatinoSlot(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#57BDDB]"
                  >
                    <option value="" disabled>Vyberte čas…</option>
                    <option value="Středa 16:00–17:00 (Začátečníci 1)">Středa 16:00–17:00 (Začátečníci 1)</option>
                    <option value="Středa 17:00–18:00 (Začátečníci 2)">Středa 17:00–18:00 (Začátečníci 2)</option>
                    <option value="Středa 18:00–19:00 (Pokročilí)">Středa 18:00–19:00 (Pokročilí)</option>
                  </select>
                </div>
              )}

              {/* Cena (pokud to není individual) */}
              {!isIndividualCourse && (
                <div className="text-sm text-gray-700 space-y-1">
                  <p>
                    Cena:{" "}
                    {perLessonPriceGroup > 0
                      ? `${perLessonPriceGroup.toFixed(0)} Kč / lekce / osoba`
                      : "viz ceník"}{" "}
                    · K úhradě:{" "}
                    <b>
                      {amountGroupPerPerson.toFixed(0)} Kč
                    </b>
                  </p>
                </div>
              )}

              {/* SOUKROMÉ LEKCE */}
              {isIndividualCourse && (
                <>
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
                      placeholder="Napište, o jaké tance máte zájem a kdy vám vyhovují termíny."
                      className="mt-1 w-full min-h-[110px] rounded-lg border border-gray-300 bg-white px-3 py-2 resize-vertical focus:outline-none focus:ring-2 focus:ring-[#57BDDB]"
                    />
                  </div>

                  <div>
                    <label htmlFor="indCount" className="block text-sm font-medium text-gray-900 mb-1">
                      Počet soukromých lekcí (1–10)
                    </label>
                    <input
                      id="indCount"
                      type="number"
                      min={1}
                      max={10}
                      value={individualCount}
                      onChange={(e) => setIndividualCount(Math.min(10, Math.max(1, Number(e.target.value) || 1)))}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#57BDDB]"
                    />
                    <div className="text-sm text-gray-700 mt-2">
                      <p>K úhradě: <b>{(individualCount * INDIVIDUAL_PER_LESSON).toFixed(0)} Kč</b></p>
                    </div>
                  </div>
                </>
              )}

              {/* Způsob platby */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900">Způsob platby <span className="text-red-600">*</span></p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className={`flex items-center gap-3 text-gray-500 rounded-lg border px-3 py-2 cursor-pointer ${paymentMethod === "bank" ? "border-[#57BDDB] ring-2 ring-[#57BDDB]" : "border-gray-300"}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank"
                      checked={paymentMethod === "bank"}
                      onChange={() => setPaymentMethod("bank")}
                    />
                    <span>Převodem na účet</span>
                  </label>
                  <label className={`flex items-center gap-3 text-gray-500 rounded-lg border px-3 py-2 cursor-pointer ${paymentMethod === "cash" ? "border-[#57BDDB] ring-2 ring-[#57BDDB]" : "border-gray-300"}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === "cash"}
                      onChange={() => setPaymentMethod("cash")}
                    />
                    <span>Hotově na místě</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-[#57BDDB] px-4 py-3 text-white font-semibold shadow hover:bg-[#3BA7C7] transition"
              >
                Registrovat
              </button>
            </form>
          </div>
        </div>

        {/* Další kurzy */}
        <section className="mt-14 sm:mt-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">
            Další kurzy v MIRROR centru
          </h2>
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
                    <h3 className="font-semibold text-gray-900 line-clamp-2">{c.title}</h3>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">{c.short}</p>
                    <span className="mt-3 inline-flex items-center text-[#57BDDB] font-medium">
                      Zjistit více <span className="ml-2">→</span>
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        </section>
      </main>

      {/* --- MODAL: QR pro převod --- */}
      {showQr && qrUrl && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowQr(false)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200 p-6 relative">
              <button onClick={() => setShowQr(false)} className="absolute right-3 top-3 p-2 text-gray-900">✕</button>
              <h4 className="text-lg font-semibold text-center mb-3">Údaje k platbě převodem</h4>
              <div className="flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrUrl} alt="QR" className="h-64 w-64" />
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium">Zpráva pro příjemce</p>
                <p className="font-mono text-sm bg-gray-100 p-2 rounded">{fullMessage}</p>
              </div>
              <div className="mt-2">
                <p className="text-sm font-medium">Číslo účtu</p>
                <p className="font-mono text-sm bg-gray-100 p-2 rounded">{accountString}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: úspěch --- */}
      {showSuccess && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowSuccess(false)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200 p-6 relative">
              <button onClick={() => setShowSuccess(false)} className="absolute right-3 top-3 p-2 text-gray-900">✕</button>
              <h4 className="text-lg font-semibold text-center mb-2">Registrace úspěšná</h4>
              <p className="text-center text-gray-700">Potvrzení odesláno na email. Platba hotově na místě.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
