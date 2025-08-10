import Image from "next/image";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar />
      <div className="absolute top-0 left-0 w-full h-full">
        <Image
          src="/background4.png"
          alt="Cleaning service background"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
      </div>
      <div className="relative z-10 flex-grow bg-white bg-opacity-10">
        {/* Obsah stránky zde */}
      </div>
    </div>
  );
}
