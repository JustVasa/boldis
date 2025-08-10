import Image from "next/image";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar />
      <div className="absolute top-0 left-0 w-full h-full">
      </div>
    </div>
  );
}
