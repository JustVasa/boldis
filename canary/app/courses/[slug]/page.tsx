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

/** 🗓️ Termín dětských skupin a baletu (informační text) */
const KIDS_TERM_LABEL = "14. 10. – 16. 12.";

/** 📅 Počet lekcí v kurzu (výchozí pro paušální ceny) */
const TOTAL_LESSONS = 10;

/** 💸 Ceník dětských kategorií (za 10 lekcí) */
const KIDS_PRICES: Record<"3-6" | "7-12", number> = {
  "3-6": 1800,
  "7-12": 2000,
};

/** 💸 Balet – pevná cena (za 10 lekcí) */
const BALLET_PRICE = 1500;

/** 📍 Adresy podle dne (Út / Čt) – pro děti, balet, latino */
const TUE_ADDRESS = "Městečko Trnávka 85, 569 41 Městečko Trnávka";
const THU_ADDRESS = "Křenov 63, 569 22 Křenov";
function placeForDay(day?: string | null): string | null {
  if (!day) return null;
  if (day === "ut") return TUE_ADDRESS;
  if (day === "ct") return THU_ADDRESS;
  return null;
}

/** ⏳ Delay zámek tlačítka proti dvojkliku */
const SUBMIT_DELAY_MS = 1500;

/** Utils */
function todayStart(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}
function weekdayFromSlugDay(day: "ut" | "ct"): number {
  return day === "ut" ? 2 : 4; // Út=2, Čt=4
}

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

/** Záložní parsování: největší číslo */
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

/** 🧩 Kód kurzu z názvu (iniciály slov bez diakritiky) */
function courseCodeFromTitle(title: string) {
  const clean = stripDiacritics(title).toUpperCase();
  return clean
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("");
}

/** Plná zpráva (kopírování/e-mail) – rozšířeno o `place` */
function buildFullMessage({
  courseTitle,
  firstName,
  lastName,
  email,
  phone,
  age,
  day,
  place,
}: {
  courseTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age?: string | null;    // "3-6" | "7-12" (děti)
  day?: string | null;    // "ut" | "ct"
  place?: string | null;  // adresa podle dne
}) {
  const parts = [
    `Kurz: ${courseTitle}`,
    `Jméno: ${firstName}`,
    `Příjmení: ${lastName}`,
    `Email: ${email}`,
    `Tel: ${phone}`,
    age ? `Věková kategorie: ${age}` : "",
    day ? `Den konání: ${day === "ut" ? "Úterý" : day === "ct" ? "Čtvrtek" : day}` : "",
    place ? `Místo: ${place}` : "",
  ].filter(Boolean);
  return parts.join(" | ");
}

/** QR zpráva do SPAYD: <KOD>(-<AGE>-<DAY>) | <email> | <telefon> */
function buildQrMessage({
  courseTitle,
  email,
  phone,
  age,
  day,
}: {
  courseTitle: string;
  email: string;
  phone: string;
  age?: string | null;
  day?: string | null;
}) {
  const code = courseCodeFromTitle(courseTitle);
  const ageTag = age ? (age === "3-6" ? "36" : age === "7-12" ? "712" : age) : null;
  const dayTag = day ?? null;
  const suffix = [ageTag, dayTag].filter(Boolean).join("-");
  const codeWithTags = suffix ? `${code}-${suffix}` : code;
  return `${codeWithTags} | ${email} | ${phone}`;
}

/** Rozsah období z labelu "14. 10. – 16. 12." (aktuální rok) */
function parseTermRange(label: string): { start: Date; end: Date } | null {
  const re = /(\d{1,2})\.\s*(\d{1,2})\.\s*[–-]\s*(\d{1,2})\.\s*(\d{1,2})\./;
  const m = label.match(re);
  if (!m) return null;
  const year = new Date().getFullYear();
  const s = new Date(year, Number(m[2]) - 1, Number(m[1]));
  const e = new Date(year, Number(m[4]) - 1, Number(m[3]));
  s.setHours(0, 0, 0, 0);
  e.setHours(23, 59, 59, 999);
  return { start: s, end: e };
}

/** Všechny termíny daného dne v týdnu mezi start/end */
function enumerateLessonDatesInRange(day: "ut" | "ct", start: Date, end: Date): Date[] {
  const wanted = weekdayFromSlugDay(day);
  const d = new Date(start);
  d.setHours(0, 0, 0, 0);
  while (d.getDay() !== wanted) d.setDate(d.getDate() + 1);
  const out: Date[] = [];
  while (d <= end) {
    out.push(new Date(d));
    d.setDate(d.getDate() + 7);
  }
  return out;
}

/** Zbývající a zpoplatněné lekce s uzávěrkou do půlnoci před lekcí a „první zdarma“ */
function computeRemainingAndPayable(day: "ut" | "ct", termLabel: string) {
  const parsed = parseTermRange(termLabel);
  const fallbackStart = todayStart();
  const fallbackEnd = new Date(fallbackStart);
  fallbackEnd.setDate(fallbackEnd.getDate() + 90);
  const range = parsed ?? { start: fallbackStart, end: fallbackEnd };
  const lessons = enumerateLessonDatesInRange(day, range.start, range.end);
  const nowCut = todayStart();
  const remaining = lessons.filter((d) => d.getTime() > nowCut.getTime()).length;
  const payable = Math.max(0, remaining - 1); // první zdarma
  return { remaining, payable };
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
  const [day, setDay] = useState<string>("");
  const [note, setNote] = useState<string>("");

  const [paymentMethod, setPaymentMethod] = useState<"bank" | "cash" | "">("");
  const [customRemaining, setCustomRemaining] = useState<number>(TOTAL_LESSONS);

  const [showQr, setShowQr] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [qrUrl, setQrUrl] = useState<string>("");
  const [fullMessage, setFullMessage] = useState<string>("");
  const [accountString, setAccountString] = useState<string>(RECEIVER_ACCOUNT);

  // 🧷 zámek tlačítka
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Základní cena vyčtená z popisku (fallback pro jiné kurzy)
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
  const hasDaySelect = isKidsCourse || isLatinoCourse || isBalletCourse;

  // Cena za 1 lekci
  const perLessonPrice = useMemo(() => {
    if (isKidsCourse) {
      if (age === "3-6") return KIDS_PRICES["3-6"] / TOTAL_LESSONS;
      if (age === "7-12") return KIDS_PRICES["7-12"] / TOTAL_LESSONS;
      return 0;
    }
    if (isBalletCourse) return BALLET_PRICE / TOTAL_LESSONS;
    const base = parsedPriceAmount ?? 0;
    return base > 0 ? base / TOTAL_LESSONS : 0;
  }, [isKidsCourse, isBalletCourse, age, parsedPriceAmount]);

  // Auto výpočet pro kurzy s dnem
  const autoInfo = useMemo(() => {
    if (!hasDaySelect || !day) return { remaining: 0, payable: 0 };
    return computeRemainingAndPayable(day as "ut" | "ct", KIDS_TERM_LABEL);
  }, [hasDaySelect, day]);

  // sjednocené proměnné
  const remainingAll = hasDaySelect
    ? autoInfo.remaining
    : Math.max(0, Math.floor(customRemaining));
  const payableAll = hasDaySelect
    ? autoInfo.payable
    : Math.max(0, remainingAll - 1);
  const amountAll = Number((perLessonPrice * payableAll).toFixed(2));

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

  // Odeslání potvrzovacího e-mailu (a notifikace majiteli) — univerzální
  const sendRegistrationEmails = async ({
    firstName,
    lastName,
    email,
    phone,
    courseTitle,
    age,
    day,
    place,
    note,
    paymentMethod,
    amount,
    qrUrl,
    remaining,
    payable,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    courseTitle: string;
    age?: string | null;
    day?: string | null;
    place?: string | null;
    note?: string | null;
    paymentMethod: "bank" | "cash";
    amount: number;
    qrUrl?: string | null;
    remaining: number;
    payable: number;
  }) => {
    const name = `${firstName} ${lastName}`.trim();

    const lines: string[] = [
      `Potvrzení registrace`,
      `Kurz: ${courseTitle}`,
      `Jméno: ${firstName} ${lastName}`,
      `Email: ${email}`,
      `Tel: ${phone}`,
      age ? `Věková kategorie: ${age}` : "",
      day ? `Den konání: ${day === "ut" ? "Úterý" : "Čtvrtek"}` : "",
      place ? `Místo: ${place}` : "",
      note ? `Poznámka: ${note}` : "",
      `Způsob platby: ${paymentMethod === "bank" ? "Převodem na účet" : "Hotově na místě"}`,
      `Zbývající lekce: ${remaining} (platí se ${payable}, první je zdarma)`,
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
        remaining,
        payable,
        age,
        day,
        place,
        note,
      },
    };

    if (paymentMethod === "bank" && qrUrl) {
      (payload as Record<string, unknown>).qrUrl = qrUrl; // server si podle ní stáhne PNG a pošle jako přílohu/inline
    }

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok || !json.ok) throw new Error(json.error || "Odeslání selhalo.");
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // zámek proti vícenásobnému kliku
    if (isSubmitting) return;
    setIsSubmitting(true);

    const data = new FormData(e.currentTarget);
    const firstName = String(data.get("firstName") || "").trim();
    const lastName = String(data.get("lastName") || "").trim();
    const email = String(data.get("email") || "").trim();
    const phone = String(data.get("phone") || "").trim();

    const selectedAge = isKidsCourse ? String(data.get("age") || "").trim() : "";
    const selectedDay = hasDaySelect ? String(data.get("day") || "").trim() : "";
    const selectedPlace = hasDaySelect ? placeForDay(selectedDay) : null;

    if (!paymentMethod) {
      alert("Vyberte prosím způsob platby (Převodem / Hotově).");
      setTimeout(() => setIsSubmitting(false), SUBMIT_DELAY_MS);
      return;
    }

    // Validace dle typu
    if (isKidsCourse) {
      if (!selectedAge) { alert("Vyberte prosím věkovou kategorii."); setTimeout(() => setIsSubmitting(false), SUBMIT_DELAY_MS); return; }
      if (!selectedDay) { alert("Vyberte prosím den konání (Úterý/Čtvrtek)."); setTimeout(() => setIsSubmitting(false), SUBMIT_DELAY_MS); return; }
      if (remainingAll <= 0) { alert("Pro zvolený den už v tomto období nezbývá žádná lekce k registraci."); setTimeout(() => setIsSubmitting(false), SUBMIT_DELAY_MS); return; }
    } else if (isBalletCourse || isLatinoCourse) {
      if (!selectedDay) { alert("Vyberte prosím den konání (Úterý/Čtvrtek)."); setTimeout(() => setIsSubmitting(false), SUBMIT_DELAY_MS); return; }
      if (remainingAll <= 0) { alert("Pro zvolený den už v tomto období nezbývá žádná lekce k registraci."); setTimeout(() => setIsSubmitting(false), SUBMIT_DELAY_MS); return; }
    } else {
      if (remainingAll <= 0) { alert("Zadejte prosím kladný počet zbývajících lekcí."); setTimeout(() => setIsSubmitting(false), SUBMIT_DELAY_MS); return; }
    }

    // účet → accountNumber + bankCode
    let accountNumber = "";
    let bankCode = "";
    try {
      const parts = splitCzAccount(RECEIVER_ACCOUNT);
      accountNumber = parts.accountNumber;
      bankCode = parts.bankCode;
    } catch {
      alert("Chyba v čísle účtu. Zkontroluj formát, např. 123456789/0100.");
      setTimeout(() => setIsSubmitting(false), SUBMIT_DELAY_MS);
      return;
    }

    // VS – z telefonu (číslice) nebo timestamp
    let vs = phone.replace(/\D/g, "").slice(0, 10);
    if (!vs) vs = String(Date.now()).slice(-10);

    // PLNÝ text (pro náhled/kopírování)
    const full = buildFullMessage({
      courseTitle: course.title,
      firstName,
      lastName,
      email,
      phone,
      age: isKidsCourse ? selectedAge : null,
      day: hasDaySelect ? selectedDay : null,
      place: selectedPlace,
    });

    // QR zpráva + částka
    const spaydMsg = buildQrMessage({
      courseTitle: course.title,
      email,
      phone,
      age: isKidsCourse ? selectedAge : null,
      day: hasDaySelect ? selectedDay : null,
    });

    const amount = amountAll;

    // QR URL jen pokud platba převodem
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

    // Napřed pošli e-maily (majiteli + uživateli)
    try {
      await sendRegistrationEmails({
        firstName,
        lastName,
        email,
        phone,
        courseTitle: course.title,
        age: isKidsCourse ? selectedAge : null,
        day: hasDaySelect ? selectedDay : null,
        place: selectedPlace,
        note: isIndividualCourse ? String(data.get("note") || "").trim() : null,
        paymentMethod: paymentMethod === "bank" ? "bank" : "cash",
        amount,
        qrUrl: paymentMethod === "bank" ? url : null,
        remaining: remainingAll,
        payable: payableAll,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Nepodařilo se odeslat potvrzení: ${msg}`);
      setTimeout(() => setIsSubmitting(false), SUBMIT_DELAY_MS);
      return;
    }

    // Stav pro modaly
    setFullMessage(full);
    setAccountString(RECEIVER_ACCOUNT);

    if (paymentMethod === "bank") {
      setQrUrl(url);
      setShowQr(true);
    } else {
      setShowSuccess(true);
    }

    // uvolníme zámek s malým zpožděním (ochrana proti spam kliku)
    setTimeout(() => setIsSubmitting(false), SUBMIT_DELAY_MS);
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
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{desc}</p>
          ) : (
            <p className="text-gray-500 italic">Popis kurzu bude doplněn.</p>
          )}
        </article>

        {/* praktické info (ponecháno) */}
        {(isKidsCourse || isLatinoCourse) && (
          <section className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            <div className="bg-white rounded-2xl shadow-lg ring-1 ring-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Praktické informace</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>
                  {isKidsCourse
                    ? "Kroužky probíhají v délce 60 minut pravidelně v úterý/čtvrtek (viz rozvrh)."
                    : "Kurz probíhá v délce 60 minut pravidelně v úterý/čtvrtek (viz rozvrh)."}
                </li>
                <li>Hodinu je možné si vyzkoušet kdykoli jednou ZDARMA.</li>
                <li>Přihlášku provedete vyplněním a odesláním formuláře níže.</li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl shadow-lg ring-1 ring-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Na lekci si vezměte</h3>
              {isKidsCourse ? (
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>Oblečení na tanec (pohodlné, nebarvící obuv).</li>
                  <li>Lahvičku s pitím.</li>
                  <li>A hlavně úsměv! 💃🕺</li>
                </ul>
              ) : (
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li>Pohodlné oblečení a nebarvící obuv.</li>
                  <li>Dobrou náladu! 💃🕺</li>
                </ul>
              )}
            </div>
          </section>
        )}

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
                      ? "1500 Kč / 10 lekcí"
                      : course.price ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900"><b>Lektor</b></dt>
                <dd className="mt-1">{course.instructor ?? "—"}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900"><b>Adresa</b></dt>
                <dd className="mt-1">
                  {hasDaySelect ? (
                    <div className="space-y-1">
                      <div><b>Úterý:</b> {TUE_ADDRESS}</div>
                      <div><b>Čtvrtek:</b> {THU_ADDRESS}</div>
                    </div>
                  ) : (
                    course.address ?? "—"
                  )}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900"><b>Čas</b></dt>
                <dd className="mt-1">
                  {hasDaySelect
                    ? "Den konání volíte ve formuláři (Úterý / Čtvrtek)"
                    : course.schedule ?? "—"}
                </dd>
              </div>
              {(isKidsCourse || isBalletCourse) && (
                <div>
                  <dt className="font-medium text-gray-900"><b>Období</b></dt>
                  <dd className="mt-1">{KIDS_TERM_LABEL}</dd>
                </div>
              )}
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

              {/* DĚTI: Věk + Den */}
              {isKidsCourse && (
                <>
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
                      className={`w-full rounded-lg border border-gray-300 bg-white px-3 py-2 appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-[#57BDDB] focus:border-[#57BDDB] ${age ? "text-gray-900" : "text-gray-400"}`}
                      aria-label="Věková kategorie"
                    >
                      <option value="" disabled>Vyberte věk…</option>
                      <option value="3-6">První stupeň</option>
                      <option value="7-12">Druhý stupeň</option>
                    </select>
                    <svg className="pointer-events-none absolute right-3 top-[38px] h-5 w-5 -translate-y-1/2 text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.18l3.71-2.95a.75.75 0 111.04 1.08l-4.24 3.37a.75.75 0 01-.94 0L5.21 8.31a.75.75 0 01.02-1.1z" clipRule="evenodd"/>
                    </svg>
                  </div>

                  <div className="relative">
                    <label htmlFor="day" className="block text sm font-medium text-gray-900 mb-1">
                      Den konání <span className="text-red-600">*</span>
                    </label>
                    <select
                      id="day"
                      name="day"
                      required
                      value={day}
                      onChange={(e) => setDay(e.target.value)}
                      className={`w-full rounded-lg border border-gray-300 bg-white px-3 py-2 appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-[#57BDDB] focus:border-[#57BDDB] ${day ? "text-gray-900" : "text-gray-400"}`}
                      aria-label="Den konání"
                    >
                      <option value="" disabled>Vyberte den…</option>
                      <option value="ut">Úterý</option>
                      <option value="ct">Čtvrtek</option>
                    </select>
                  </div>

                  {day && (
                    <div className="text-sm text-gray-700 space-y-1">
                      <p>Vybrané místo: {placeForDay(day)}</p>
                      <p>Zbývá <b>{remainingAll}</b> lekcí. První je <b>zdarma</b>, platíte <b>{payableAll}</b> lekcí.</p>
                      <p>
                        Cena: {perLessonPrice > 0 ? `${perLessonPrice.toFixed(0)} Kč / lekce` : "—"} ·
                        K úhradě: <b>{amountAll.toFixed(0)} Kč</b>
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* BALET + LATINO */}
              {(isBalletCourse || isLatinoCourse) && (
                <>
                  <div className="relative">
                    <label htmlFor="day" className="block text-sm font-medium text-gray-900 mb-1">
                      Den konání <span className="text-red-600">*</span>
                    </label>
                    <select
                      id="day"
                      name="day"
                      required
                      value={day}
                      onChange={(e) => setDay(e.target.value)}
                      className={`w-full rounded-lg border border-gray-300 bg-white px-3 py-2 appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-[#57BDDB] focus:border-[#57BDDB] ${day ? "text-gray-900" : "text-gray-400"}`}
                      aria-label="Den konání"
                    >
                      <option value="" disabled>Vyberte den…</option>
                      <option value="ut">Úterý</option>
                      <option value="ct">Čtvrtek</option>
                    </select>
                  </div>

                  {day && (
                    <div className="text-sm text-gray-700 space-y-1">
                      <p>Vybrané místo: {placeForDay(day)}</p>
                      <p>Zbývá <b>{remainingAll}</b> lekcí. První je <b>zdarma</b>, platíte <b>{payableAll}</b> lekcí.</p>
                      <p>
                        Cena: {perLessonPrice > 0 ? `${perLessonPrice.toFixed(0)} Kč / lekce` : "—"} ·
                        K úhradě: <b>{amountAll.toFixed(0)} Kč</b>
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Kurzy bez volby dne */}
              {!hasDaySelect && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-900">
                    Počet zbývajících lekcí do konce kurzu
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={TOTAL_LESSONS}
                    value={customRemaining}
                    onChange={(e) => setCustomRemaining(Number(e.target.value))}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900
                               focus:outline-none focus:ring-2 focus:ring-[#57BDDB] focus:border-[#57BDDB]"
                    placeholder={`${TOTAL_LESSONS}`}
                  />
                  <div className="text-sm text-gray-700 space-y-1">
                    <p>První lekce je vždy <b>zkušební zdarma</b>.</p>
                    <p>Zbývá <b>{remainingAll}</b> lekcí, platíte <b>{payableAll}</b> lekcí.</p>
                    <p>
                      Cena: {perLessonPrice > 0 ? `${perLessonPrice.toFixed(0)} Kč / lekce` : "—"} ·
                      K úhradě: <b>{amountAll.toFixed(0)} Kč</b>
                    </p>
                  </div>
                </div>
              )}

              {/* Individuál */}
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
                    placeholder="Napište, o jaké tance máte zájem a kdy vám vyhovují termíny."
                    className="mt-1 w-full min-h-[110px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#57BDDB] focus:border-[#57BDDB] resize-vertical"
                  />
                </div>
              )}

              {/* Způsob platby */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900">Způsob platby <span className="text-red-600">*</span></p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className={`flex items-center gap-3 rounded-lg text-gray-600 border px-3 py-2 cursor-pointer ${paymentMethod === "bank" ? "border-[#57BDDB] ring-2 ring-[#57BDDB]" : "border-gray-300"}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank"
                      checked={paymentMethod === "bank"}
                      onChange={() => setPaymentMethod("bank")}
                    />
                    <span>Převodem na účet</span>
                  </label>
                  <label className={`flex items-center gap-3 rounded-lg text-gray-600 border px-3 py-2 cursor-pointer ${paymentMethod === "cash" ? "border-[#57BDDB] ring-2 ring-[#57BDDB]" : "border-gray-300"}`}>
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
                disabled={isSubmitting}
                aria-disabled={isSubmitting}
                aria-busy={isSubmitting}
                className={`w-full rounded-lg px-4 py-3 text-white font-semibold shadow transition
                  ${isSubmitting ? "bg-[#3BA7C7] cursor-not-allowed opacity-80" : "bg-[#57BDDB] hover:bg-[#3BA7C7]"}`}
              >
                {isSubmitting ? "Odesílám…" : "Registrovat"}
              </button>
              <p className="text-xs text-gray-500 mt-2">
                První lekce je zkušební zdarma. Uzávěrka registrace je vždy do půlnoci před dnem lekce.
                Pokud zvolíte platbu převodem, po registraci se zobrazí QR kód a údaje k platbě (přijdou i e-mailem).
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
                    <h3 className="font-semibold text-gray-900 line-clamp-2">{c.title}</h3>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">{c.short}</p>
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

      {/* --- MODAL: QR pro převod --- */}
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

              <h4 className="text-lg font-semibold text-gray-900 mb-3 text-center">Údaje k platbě převodem</h4>

              <div className="flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrUrl} alt="QR kód pro platbu" className="h-72 w-72 rounded-md ring-1 ring-gray-200" />
              </div>

              <p className="text-xs text-gray-500 mt-4 text-center">
                Po načtení QR kódu vaše bankovní aplikace předvyplní všechny údaje včetně zprávy pro příjemce.
                První lekce je zkušební zdarma.
              </p>

              {/* Zpráva pro příjemce + účet */}
              <div className="mt-5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">Zpráva pro příjemce</span>
                  <button className="text-sm text-[#57BDDB] hover:underline" onClick={() => copy(fullMessage)}>
                    Kopírovat
                  </button>
                </div>
                <p className="text-sm font-mono break-words text-gray-800 bg-gray-50 p-2 rounded-md ring-1 ring-gray-200">
                  {fullMessage}
                </p>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">Číslo účtu</span>
                  <button className="text-sm text-[#57BDDB] hover:underline" onClick={() => copy(accountString)}>
                    Kopírovat
                  </button>
                </div>
                <p className="text-sm font-mono text-gray-800 bg-gray-50 p-2 rounded-md ring-1 ring-gray-200">
                  {accountString}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL: úspěch pro hotově --- */}
      {showSuccess && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowSuccess(false)} />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200 p-6 relative">
              <button
                onClick={() => setShowSuccess(false)}
                className="absolute right-3 top-3 rounded-full p-2 text-gray-900 hover:bg-gray-200"
                aria-label="Zavřít"
                title="Zavřít"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6l-12 12" />
                </svg>
              </button>

              <h4 className="text-lg font-semibold text-gray-900 mb-2 text-center">Registrace proběhla úspěšně</h4>
              <p className="text-sm text-gray-700 text-center">
                Informace byly zaslány na Váš e-mail. Platba proběhne <b>hotově na místě</b>. První lekce je zkušební zdarma.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
