import Link from "next/link";

const COURSES = [
  { title: "Taneční pro dospělé", img: "/kurzy/dospele.jpg", desc: "Kurz pro všechny věkové kategorie dospělých, od začátečníků po pokročilé." },
  { title: "Taneční pro mládež", img: "/kurzy/mladez.jpg", desc: "Pro mladé tanečníky plné energie a nadšení." },
  { title: "Latino Ladies", img: "/kurzy/latino.jpg", desc: "Smyslné latino tance pro ženy všech věkových kategorií." },
  { title: "Taneční kroužky pro děti", img: "/kurzy/deti.jpg", desc: "Hravá a zábavná forma tance pro nejmenší." },
  { title: "Svatební lekce", img: "/kurzy/svatebni.jpg", desc: "Naučíme vás dokonalý svatební tanec." },
  { title: "Individuální lekce", img: "/kurzy/individual.jpg", desc: "Přizpůsobené lekce přesně vašim potřebám." },
  { title: "Pro - Am", img: "/kurzy/proam.jpg", desc: "Tanečník amatér a profesionál na jedné vlně." },
  { title: "Kroužek baletu", img: "/kurzy/balet.jpg", desc: "Základy i pokročilé prvky baletu pro děti a dospělé." },
];

export default function Courses() {
  return (
    <section id="courses" className="bg-gray-50 py-28 scroll-mt-24">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-16 text-gray-800">Naše kurzy</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {COURSES.map((course, index) => (
            <div
              key={index}
              className="relative h-64 rounded-lg overflow-hidden shadow-lg group"
              style={{
                backgroundImage: `url(${course.img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-all" />
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-4">
                <h3 className="text-lg font-bold mb-2">{course.title}</h3>
                <p className="text-sm mb-4">{course.desc}</p>
                <Link
                  href="/courses"
                  className="bg-[#57BDDB] text-white text-sm px-4 py-2 rounded-full shadow hover:bg-[#3BA7C7] transition"
                >
                  Zjistit více
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
