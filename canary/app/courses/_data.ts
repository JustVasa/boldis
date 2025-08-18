// app/courses/_data.ts
export type Course = {
  slug: string;
  title: string;
  img: string;
  short: string;
  long?: string;
  bullets?: string[];
};

export const COURSES: Course[] = [
  {
    slug: "tanecni-pro-dospele",
    title: "Taneční pro dospělé",
    img: "/kurzy/dospele.jpg",
    short:
      "Kurz pro všechny věkové kategorie dospělých, od začátečníků po pokročilé.",
    long:
      "V přátelské atmosféře se naučíte či zopakujete standardní i latinskoamerické tance. Kurz je vhodný pro páry i samostatné jednotlivce – vždy vám pomůžeme najít parťáka/parťačku.",
    bullets: [
      "Základy i pokročilejší figury",
      "Skvělý způsob, jak se hýbat a odreagovat",
      "Možnost navázat individuální lekce",
    ],
  },
  {
    slug: "tanecni-pro-mladez",
    title: "Taneční pro mládež",
    img: "/kurzy/mladez.jpg",
    short: "Pro mladé tanečníky plné energie a nadšení.",
    long:
      "Důraz na techniku, rytmus a týmového ducha. Skvělá příprava pro soutěžní scénu i pro radost z tance.",
    bullets: ["Moderní přístup", "Rozvoj kondice a koordinace", "Možnost soutěží"],
  },
  {
    slug: "latino-ladies",
    title: "Latino Ladies",
    img: "/kurzy/latino.jpg",
    short:
      "Smyslné latino tance pro ženy všech věkových kategorií.",
    long:
      "Získejte sebevědomí, ladnost i kondici. Salsa, cha-cha, rumba a další – bez partnera, s důrazem na ženský projev.",
    bullets: ["Bez partnera", "Důraz na držení těla", "Skvělé na kondici"],
  },
  {
    slug: "tanecni-krouzky-pro-deti",
    title: "Taneční kroužky pro děti",
    img: "/kurzy/deti.jpg",
    short:
      "Hravá a zábavná forma tance pro nejmenší.",
    long:
      "Rozvoj motoriky, rytmu a týmové spolupráce. Bezpečné prostředí, kde si děti zamilují pohyb.",
    bullets: ["Hravý přístup", "Základy rytmu", "Podpora sebevědomí"],
  },
  {
    slug: "svatebni-lekce",
    title: "Svatební lekce",
    img: "/kurzy/svatebni.jpg",
    short:
      "Naučíme vás dokonalý svatební tanec.",
    long:
      "Společně připravíme choreografii na vaši oblíbenou píseň. Jednoduché, elegantní a zvládnutelné i pro úplné začátečníky.",
    bullets: ["Individuální choreografie", "Přizpůsobeno času a prostoru", "Možnost tréninku ve svatebních botách"],
  },
  {
    slug: "individualni-lekce",
    title: "Individuální lekce",
    img: "/kurzy/individual.jpg",
    short:
      "Přizpůsobené lekce přesně vašim potřebám.",
    long:
      "Osobní tempo, konkrétní cíle, rychlý progres. Ideální pro přípravu na soutěže i pro rychlé zvládnutí základů.",
    bullets: ["1:1 přístup", "Rychlý posun", "Flexibilní termíny"],
  },
  {
    slug: "krouzek-baletu",
    title: "Kroužek baletu",
    img: "/kurzy/balet.jpg",
    short:
      "Základy i pokročilé prvky baletu pro děti a dospělé.",
    long:
      "Technika, držení těla a elegance. Skvělý doplněk pro všechny taneční styly.",
    bullets: ["Držení těla", "Flexibilita a síla", "Základ pro další styly"],
  },
];

export const getCourse = (slug: string) =>
  COURSES.find((c) => c.slug === slug);
