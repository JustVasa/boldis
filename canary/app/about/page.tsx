// app/about/page.tsx
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import BackToTop from "../components/BackToTop";

export default function AboutPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gray-50">
      <Navbar />

      {/* HERO */}
      <section className="relative isolate">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/gallery/gal-6.jpg"
            alt="Pozadí Taneční centrum Mirror"
            fill
            priority
            className="object-cover object-[65%_center] md:object-center"
          />
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 pt-36 pb-28 sm:pt-44 sm:pb-36">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-white text-5xl sm:text-7xl font-extrabold tracking-tight drop-shadow-lg">
              O&nbsp; NÁS
            </h1>
          </div>
        </div>
      </section>


      {/* OVERVIEW */}
      <section className="relative pb-0 pt-14 sm:pt-20">
        <div className="container mx-auto px-6">
          <div className="relative border-b-2 border-dashed border-gray-200 pb-10 sm:pb-14">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Left – Text */}
              <div className="text-center lg:text-left">
                <div className="pb-6">
                  <p className="uppercase tracking-widest text-[#57BDDB] font-semibold">
                    O NÁS
                  </p>
                  <h2 className="text-3xl sm:text-4xl font-extrabold mt-2 text-gray-600">
                    Taneční centrum <span className="text-[#57BDDB]">MIRROR</span>
                  </h2>
                  <div className="mt-4 space-y-4 text-gray-500 leading-relaxed text-lg">
                    <p>
                      Nově otevřený prostor pro tanec v Moravské Třebové, kde se
                      potkává radost z pohybu s profesionálním vedením.
                    </p>
                    <p>
                      Pod vedením Tomáše Boldiše nabízíme kurzy pro děti, dospělé,
                      seniory i studenty. U nás si zatančíte společenské tance,
                      salsu, tango, ale třeba i balet nebo se připravíte na svatební tanec.
                    </p>
                    <p>
                      Tančíme s úsměvem, v tempu, které vám sedne. Ať jste začátečník
                      nebo pokročilý – u nás jste doma na parketu.
                    </p>
                  </div>
                </div>

              </div>

              {/* Right – Image collage (jedna hlavní + dvě menší jak v původní ukázce) */}
              <div>
                <div className="grid grid-cols-2 gap-4 items-center">
                  <div className="space-y-4">
                    <div className="relative w-full rounded-2xl overflow-hidden shadow-lg">
                      <Image
                        src="/gallery/gal-1.jpg"
                        alt="Trénink v Mirror centru"
                        width={800}
                        height={1000}
                        className="h-64 sm:h-72 w-full object-cover"
                      />
                    </div>
                    <div className="relative w-full rounded-2xl overflow-hidden shadow-lg">
                      <Image
                        src="/gallery/gal-2.jpg"
                        alt="Společenské tance – lekce"
                        width={800}
                        height={1000}
                        className="h-48 sm:h-56 w-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="relative w-full rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src="/gallery/gal-3.jpg"
                      alt="Taneční vystoupení"
                      width={900}
                      height={1200}
                      className="h-full min-h-[22rem] sm:min-h-[26rem] w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* CONFERENCE (Why attend) → u nás „Proč právě MIRROR“ */}
      <section className="relative pt-24 sm:pt-28 pb-16 sm:pb-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Levý sloupec – původní „karty“, teď fotky ve stejném layoutu */}
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  {/* horní malá „karta“ → fotka */}
                  <div className="relative rounded-2xl overflow-hidden shadow-lg ring-1 ring-gray-200">
                    <Image
                      src="/gallery/gal-3.jpg"
                      alt="Skupinový trénink"
                      width={800}
                      height={600}
                      className="w-full h-64 sm:h-72 object-cover"
                      priority
                    />
                  </div>

                  {/* spodní malá „karta“ → fotka */}
                  <div className="relative rounded-2xl overflow-hidden shadow-lg ring-1 ring-gray-200">
                    <Image
                      src="/gallery/gal-2.jpg"
                      alt="Záběr z lekce"
                      width={800}
                      height={600}
                      className="w-full h-48 sm:h-56 object-cover"
                    />
                  </div>
                </div>

                {/* pravý vysoký box → fotka */}
                <div className="relative rounded-2xl overflow-hidden shadow-lg ring-1 ring-gray-200">
                  <Image
                    src="/gallery/gal-1.jpg"
                    alt="Taneční vystoupení"
                    width={900}
                    height={1200}
                    className="w-full h-full min-h-[22rem] sm:min-h-[26rem] object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Pravý sloupec – text beze změny */}
            <div className="order-1 lg:order-2">
              <p className="uppercase tracking-widest text-[#57BDDB] font-semibold">
                Proč právě Mirror
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold mt-2 text-gray-600">
                Co u nás objevíte
              </h2>
              <div className="mt-5 text-gray-500 space-y-4 leading-relaxed">
                <p>
                  Jmenuji se <b>Tomáš Boldiš</b> a tanci se věnuji od roku 2010.
                  Začínal jsem pod vedením Jana Ondera a prošel špičkovými školami v Praze a Ostravě.
                  Trénoval jsem také ve Francii s&nbsp;Fredericem a Sandrou Mosa a C.&nbsp;Meyerem.
                </p>
                <p>
                  K mým úspěchům patří titul mistra ČR (mládež) v latinskoamerických tancích, finále MS U21,
                  semifinále German Open Stuttgart nebo 3.&nbsp;místo na World Cup Rising Stars v Lyonu.
                  Reprezentoval jsem ČR i Francii a jsem vícenásobný mistr ČR družstev.
                </p>
                <p className="mb-0">
                  Dnes se vedle vlastní kariéry naplno věnuji budování centra MIRROR – místa,
                  kde se budete cítit dobře. Ať tančíte pro radost, zdraví, nebo s cílem soutěžit.
                </p>
              </div>

              <div className="mt-6">
                <Link
                  href="/#contact"
                  className="inline-flex items-center rounded-full bg-[#57BDDB] px-6 py-3 text-white font-semibold shadow hover:bg-[#3BA7C7] transition"
                >
                  Chci se přidat <span className="ml-3">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>


     

      {/* TICKETBOOK → CTA s pozadím fotkou + blur (blurujeme přímo obrázek) */}
      <section className="relative">
        {/* BG image + blur + dark */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/cta-bg.jpg"
            alt="CTA pozadí"
            fill
            className="object-cover blur-[2px] scale-[1.03]"
            priority
          />
          <div className="absolute inset-0 bg-black/55" />
        </div>

        <div className="container mx-auto px-6 py-16 sm:py-20">
          <div className="mx-auto text-center text-white max-w-3xl">
            <h5 className="uppercase tracking-widest text-white/80">
              Pojďme na to
            </h5>
            <h2 className="text-3xl sm:text-4xl font-extrabold mt-1 text-gray-600">
              Je čas vstoupit na parket. <span className="text-[#57BDDB]">Přidejte se</span>
            </h2>
            <p className="mt-4 text-gray-500">
              Ať začínáte, vracíte se k tanci, nebo chcete závodit – společně
              nastavíme plán, který vás posune dál.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/#contact"
                className="rounded-full bg-white px-6 py-3 text-[#57BDDB] font-semibold shadow hover:bg-gray-100 transition"
              >
                Napište nám
              </Link>
              <Link
                href="/#courses"
                className="rounded-full border border-gray-400 px-6 py-3 text-gray-600 hover:bg-white/10 transition"
              >
                Prohlédnout kurzy
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-gray-700 text-center py-8 border-t border-gray-200">
        <p className="text-lg font-medium">
          © {new Date().getFullYear()} Taneční centrum Mirror – Tomáš Boldiš
        </p>
      </footer>

      <BackToTop />
    </div>
  );
}
