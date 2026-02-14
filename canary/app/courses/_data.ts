export type Course = {
  slug: string;
  title: string;
  img: string;
  short: string;
  desc: string;
  price?: string;
  address?: string;
  schedule?: string;
  instructor?: string;
};

export const COURSES: Course[] = [
  {
    slug: "tanecni-pro-dospele",
    title: "KURZY PRO DOSPĚLÉ",
    img: "/kurzy/dospele.jpg",
    short: "Základy i pokročilejší kroky společenských tanců – příprava na plesy, svatby i pro radost z pohybu.",
    desc: "Chcete se naučit tančit a zároveň si užít společné chvíle plné pohybu a zábavy? Naše kurzy pro dospělé jsou otevřené všem, kteří chtějí zvládnout základní i pokročilejší kroky společenských tanců. Pod vedením zkušeného profesionála Tomáše Boldiše vás naučíme standardní i latinskoamerické tance jako waltz, tango, valčík, cha-cha, rumba, jive a další. Lekce kladou důraz na správné držení těla, rytmus a spolupráci s partnerem. Kurz je vhodný pro všechny, kdo chtějí tanec zažít jako radostný a společenský zážitek – ať už pro plesy, svatby, nebo jen tak pro pohyb a odreagování.",
    price: "10 lekcí: 2500 Kč / osoba",
    address: "Křenov 63, 569 22 Křenov",
    schedule: "Středa 19:15–20:30",
    instructor: "Tomáš Boldiš",
  },
  {
    slug: "latino-ladies",
    title: "LATINO LADIES",
    img: "/kurzy/latino.jpg",
    short: "Salsa, bachata, merengue – energické lekce pro ženy. Výběr ze skupin pro začátečníky i pokročilé.",
    desc: "Kurz je určen všem ženám, které si chtějí zatancovat, užít pohyb a načerpat novou energii. Nabízíme oddělené lekce pro začátečníky a pokročilé. Naučíte se kroky latinskoamerických tanců jako salsa, bachata nebo merengue. Pod vedením zkušeného lektora Tomáše Boldiše si osvojíte techniku, rytmus i sebevědomí. Lekce jsou skvělou příležitostí, jak protančit stres a setkat se s dalšími ženami, které sdílejí vášeň pro tanec.",
    price: "10 lekcí: 2200 Kč / osoba",
    address: "Křenov 63, 569 22 Křenov",
    schedule: "Středa (více skupin 16–19h)",
    instructor: "Tomáš Boldiš",
  },
  {
    slug: "tanecni-krouzky-pro-deti",
    title: "TANEČNÍ KROUŽEK PRO DĚTI",
    img: "/kurzy/deti.jpg",
    short: "Hravé lekce, rozvoj koordinace a rytmu, podpora kreativity a sebevědomí.",
    desc: "Naše taneční kroužky jsou určeny všem dětem, které si chtějí zatancovat, rozvíjet pohybové dovednosti a užít si radost z tance. Pracujeme s několika věkovými skupinami, takže každý malý tanečník najde kurz přesně podle svých schopností a potřeb. Pod vedením Tomáše Boldiše probíhají lekce hravou formou, která podporuje správné držení těla, rytmus, koordinaci a spolupráci ve skupině. Děti se učí základní taneční kroky, rozvíjejí kreativitu a sebevědomí.",
    price: "Pololetí: 1590 Kč / dítě",
    address: "Křenov 63, 569 22 Křenov",
    schedule: "Dle dohody (Křenov)",
    instructor: "Tomáš Boldiš",
  },
  {
    slug: "krouzek-baletu",
    title: "KROUŽEK BALETU",
    img: "/kurzy/balet.jpg",
    short: "Základy klasického baletu hravou formou – držení těla, koordinace, cit pro hudbu.",
    desc: "Baletní kroužek je určen dětem, které chtějí rozvíjet jemnost pohybu, koordinaci a základní techniku klasického baletu. Lekce pod vedením Tomáše Boldiše probíhají přístupnou formou, která děti motivuje k pravidelnému pohybu a tvořivému vyjádření. Děti se naučí správnému držení těla, základním baletním pozicím a pohybům, rozvíjejí rytmus i koncentraci. Vhodné pro začátečníky i děti s předchozí zkušeností.",
    price: "Pololetí: 1690 Kč / dítě",
    address: "Křenov 63, 569 22 Křenov",
    schedule: "Dle dohody (Křenov)",
    instructor: "Tomáš Boldiš",
  },
  {
    slug: "svatebni-lekce",
    title: "SVATEBNÍ TANEC",
    img: "/kurzy/svatebni.jpg",
    short: "První tanec na míru – choreografie, hudba i trénink podle vašich přání.",
    desc: "Nabízíme přípravu svatebního tance na míru, která vašemu velkému dni dodá jedinečné kouzlo. Balíček zahrnuje 10 lekcí vedených Tomášem Boldišem, který vás krok za krokem provede technikou i choreografií dle vašich představ (lekce lze rozšířit). Pomůžeme s výběrem i úpravou hudby – od klasického valčíku po moderní mix. Ať už plánujete tradiční tanec nebo originální show, společně to vyladíme do detailu, abyste se na parketu cítili jistě.",
    price: "Balíček 10 lekcí + příprava hudby, show: 7500 Kč / pár",
    address: "Křenov 63, 569 22 Křenov",
    schedule: "Termíny dle dohody",
    instructor: "Tomáš Boldiš",
  },
  {
    slug: "individualni-lekce",
    title: "SOUKROMÉ LEKCE",
    img: "/kurzy/individual.jpg",
    short: "Tempo, styl i náplň přesně podle vás – nejrychlejší cesta k pokroku.",
    desc: "Nabízíme individuální lekce s Tomášem Boldišem pro jednotlivce i páry. Lekce probíhají formou 1:1 nebo ve dvojici, takže se trenér plně věnuje vašim potřebám. Můžete si vybrat jakýkoliv taneční styl – od společenských tanců přes latinskoamerické až po další styly dle přání. Díky individuálním lekcím často dosáhnete rychlejšího zlepšení, lepší techniky i větší jistoty na parketu.",
    price: "500 Kč / 45 min",
    address: "Křenov 63, 569 22 Křenov",
    schedule: "Dle dohody",
    instructor: "Tomáš Boldiš",
  },
];

export function getCourse(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug);
}
