import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Promo from "./components/Promo";
import Courses from "./components/Courses";
import Gallery from "./components/Gallery";
import Contact from "./components/Contact";
import BackToTop from "./components/BackToTop";
import SiteFooter from "./components/SiteFooter";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden">
      <Navbar />
      <Hero />
      <Promo />
      <Courses />
      <Gallery />
      <Contact />
      <BackToTop />
      <SiteFooter />
    </div>
  );
}
