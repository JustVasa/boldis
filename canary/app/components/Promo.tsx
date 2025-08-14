import Image from "next/image";
import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";
import AgeImg from "../../public/profile.jpeg";

export default function Promo() {
  return (
    <section
      id="services"
      className="promo-featured-wrapper section-padding bg-gray-50 py-20 scroll-mt-24"
    >
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-center xl:items-start text-center xl:text-left">
            <Image
              src={AgeImg}
              alt="Years of experience"
              width={400}
              height={300}
              className="rounded-lg object-cover"
              priority
            />
            <h5 className="mt-4 text-lg font-poppins text-gray-700">
              Head Coach <b>Tomáš Boldiš</b>
            </h5>
          </div>

          <div className="block-contents mt-5 xl:mt-0 xl:ml-5">
            <span className="text-[#57BDDB] uppercase text-sm font-semibold">KDO JSME</span>
            <h1 className="text-3xl sm:text-4xl font-bold mt-3 text-black">
              TANEČNÍ SPORTOVNÍ CENTRUM
            </h1>
            <h4 className="text-lg text-gray-700 mt-3">
              Jsme nově vzniklé taneční studio, které založil Tomáš Boldiš.
            </h4>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Chceme vytvořit příjemné místo, kde se lidé budou rádi potkávat a kde se budou učit
              tančit ať už na amatérské (hobby) úrovni nebo na profesionální (soutěžní) úrovni.
              Součástí Tanečního a sportovního centra je i taneční klub TSC Kučera dance team,
              jehož členové patří k absolutní české i světové špičce.
            </p>
            <Link
              href="/contact"
              className="theme-btn inline-flex items-center mt-6 px-6 py-3 bg-[#57BDDB] text-white font-semibold rounded-full shadow-lg hover:bg-[#3BA7C7] transition-all"
            >
              O NÁS
              <BsArrowRight className="ml-3 text-xl" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
