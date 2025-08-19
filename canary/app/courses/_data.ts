export type Course = {
  slug: string;
  title: string;
  img: string;
  short: string; // krátký popis do mřížky
  desc: string;  // dlouhý popis na detail
};

export const COURSES: Course[] = [
  {
    slug: "tanecni-pro-dospele",
    title: "KURZY PRO DOSPĚLÉ",
    img: "/kurzy/dospele.jpg",
    short:
      "Základy i pokročilejší kroky společenských tanců – příprava na plesy, svatby i pro radost z pohybu.",
    desc:
      "Chcete se naučit tančit a zároveň si užít společné chvíle plné pohybu a zábavy? Naše kurzy pro dospělé jsou otevřené všem, kteří chtějí zvládnout základní i pokročilejší kroky společenských tanců. Pod vedením zkušeného profesionála Tomáše Boldiše vás naučíme standardní i latinskoamerické tance jako waltz, tango, valčík, cha-cha, rumba, jive a další. Lekce kladou důraz na správné držení těla, rytmus a spolupráci s partnerem. Kurz je vhodný pro všechny, kdo chtějí tanec zažít jako radostný a společenský zážitek – ať už pro plesy, svatby, nebo jen tak pro pohyb a odreagování.",
  },
  {
    slug: "tanecni-pro-mladez",
    title: "TANEČNÍ KURZY PRO MLÁDEŽ",
    img: "/kurzy/mladez.jpg",
    short:
      "Styl, jistota na parketu a skvělá parta. Ideální i jako příprava na školní plesy a společenské akce.",
    desc:
      "Chceš se naučit tančit stylově a sebevědomě? Naše kurzy pro mládež jsou určené všem studentům, kteří chtějí získat pevné základy společenských tanců a zároveň si užít skvělou atmosféru s kamarády. Pod vedením Tomáše Boldiše zvládnete standardní i latinskoamerické tance (waltz, tango, cha-cha, jive…) a důležité dovednosti jako správné držení těla a rytmus. Kurz je ideální přípravou na školní plesy, společenské události nebo prostě jako skvělý způsob, jak se bavit a naučit něco nového.",
  },
  {
    slug: "latino-ladies",
    title: "LATINO LADIES",
    img: "/kurzy/latino.jpg",
    short:
      "Salsa, bachata, merengue – energické lekce pro ženy v přátelské atmosféře.",
    desc:
      "Kurz je určen všem ženám, které si chtějí zatancovat, užít pohyb a načerpat novou energii. Naučíte se základy i pokročilejší kroky latinskoamerických tanců jako salsa, bachata nebo merengue – a to vše v příjemné a podporující atmosféře. Pod vedením zkušeného lektora Tomáše Boldiše si osvojíte techniku, rytmus i sebevědomí, které vás podpoří nejen na tanečním parketu, ale i v každodenním životě. Lekce jsou skvělou příležitostí, jak protančit stres a setkat se s dalšími ženami, které sdílejí vášeň pro tanec.",
  },
  {
    slug: "tanecni-krouzky-pro-deti",
    title: "TANEČNÍ KROUŽEK PRO DĚTI",
    img: "/kurzy/deti.jpg",
    short:
      "Hravé lekce, rozvoj koordinace a rytmu, podpora kreativity a sebevědomí.",
    desc:
      "Naše taneční kroužky jsou určeny všem dětem, které si chtějí zatancovat, rozvíjet pohybové dovednosti a užít si radost z tance. Pracujeme s několika věkovými skupinami, takže každý malý tanečník najde kurz přesně podle svých schopností a potřeb. Pod vedením Tomáše Boldiše probíhají lekce hravou formou, která podporuje správné držení těla, rytmus, koordinaci a spolupráci ve skupině. Děti se učí základní taneční kroky, rozvíjejí kreativitu a sebevědomí. Kurz je vhodný pro začátečníky i děti s předchozími tanečními zkušenostmi.",
  },
  {
    slug: "krouzek-baletu",
    title: "KROUŽEK BALETU",
    img: "/kurzy/balet.jpg",
    short:
      "Základy klasického baletu hravou formou – držení těla, koordinace, cit pro hudbu.",
    desc:
      "Baletní kroužek je určen dětem, které chtějí rozvíjet jemnost pohybu, koordinaci a základní techniku klasického baletu. Lekce pod vedením Tomáše Boldiše probíhají přístupnou formou, která děti motivuje k pravidelnému pohybu a tvořivému vyjádření. Děti se naučí správnému držení těla, základním baletním pozicím a pohybům, rozvíjejí rytmus i koncentraci. Vhodné pro začátečníky i děti s předchozí zkušeností.",
  },
  {
    slug: "svatebni-lekce",
    title: "SVATEBNÍ LEKCE",
    img: "/kurzy/svatebni.jpg",
    short:
      "První tanec na míru – choreografie, hudba i trénink podle vašich přání.",
    desc:
      "Nabízíme přípravu svatebního tance na míru, která vašemu velkému dni dodá jedinečné kouzlo. Balíček zahrnuje 10 lekcí vedených Tomášem Boldišem, který vás krok za krokem provede technikou i choreografií dle vašich představ (lekce lze rozšířit). Pomůžeme s výběrem i úpravou hudby – od klasického valčíku po moderní mix. Ať už plánujete tradiční tanec nebo originální show, společně to vyladíme do detailu, abyste se na parketu cítili jistě.",
  },
  {
    slug: "individualni-lekce",
    title: "INDIVIDUÁLNÍ LEKCE",
    img: "/kurzy/individual.jpg",
    short:
      "Tempo, styl i náplň přesně podle vás – nejrychlejší cesta k pokroku.",
    desc:
      "Nabízíme individuální lekce s Tomášem Boldišem pro jednotlivce i páry. Lekce probíhají formou 1:1 nebo ve dvojici, takže se trenér plně věnuje vašim potřebám. Můžete si vybrat jakýkoliv taneční styl – od společenských tanců přes latinskoamerické až po další styly dle přání. Díky individuálním lekcím často dosáhnete rychlejšího zlepšení, lepší techniky i větší jistoty na parketu.",
  },
];

export function getCourse(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug);
}
