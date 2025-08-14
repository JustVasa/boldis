import Image from "next/image";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Contact() {
  return (
    <section id="contact" className="relative py-32 bg-gray-50 scroll-mt-24">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          {/* Form card */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <Image src="/contact1.jpg" alt="" fill className="object-cover" priority />
            <div className="absolute inset-0 z-0 bg-black/40 backdrop-blur-xl" />
            <div className="relative z-10 p-8 text-white bg-white/10 border border-white/20">
              <h3 className="text-3xl font-bold mb-6">Kontaktujte nás</h3>
              <form className="space-y-5">
                <input
                  type="text"
                  placeholder="Jméno a příjmení"
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-[#57BDDB]"
                />
                <input
                  type="tel"
                  placeholder="Telefon"
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-[#57BDDB]"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-[#57BDDB]"
                />
                <textarea
                  placeholder="Zpráva"
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-[#57BDDB]"
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-[#57BDDB] text-white font-semibold rounded-lg hover:bg-[#3BA7C7] transition-all"
                >
                  Odeslat
                </button>
              </form>
            </div>
          </div>

          {/* Info card */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl min-h-[420px] lg:min-h-[500px]">
            <Image src="/contact.jpg" alt="" fill className="object-cover" priority />
            <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-xl" />
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="w-full h-full p-8 text-white bg-white/10 border border-white/20 flex flex-col justify-center">
                <h3 className="text-3xl font-bold mb-8">Taneční centrum Mirror</h3>
                <ul className="space-y-6 text-lg">
                  <li className="flex items-center">
                    <FaMapMarkerAlt className="text-white text-2xl mr-4" />
                    Moravská Třebová, Česká republika
                  </li>
                  <li className="flex items-center">
                    <FaPhoneAlt className="text-white text-2xl mr-4" />
                    <a href="tel:+420123456789" className="hover:underline">+420 123 456 789</a>
                  </li>
                  <li className="flex items-center">
                    <FaEnvelope className="text-white text-2xl mr-4" />
                    <a href="mailto:info@mirror.cz" className="hover:underline">info@mirror.cz</a>
                  </li>
                </ul>

                <div className="flex space-x-4 mt-8">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition-colors">
                    <FaFacebook className="text-white text-2xl" />
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition-colors">
                    <FaInstagram className="text-white text-2xl" />
                  </a>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition-colors">
                    <FaYoutube className="text-white text-2xl" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
