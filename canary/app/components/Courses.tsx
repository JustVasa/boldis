import Link from "next/link";
import { COURSES } from "@/app/courses/_data";

export default function Courses() {
  return (
    <section id="courses" className="bg-gray-50 py-28 scroll-mt-24">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-16 text-gray-800">Naše kurzy</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {COURSES.map((course) => (
            <div
              key={course.slug}
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
                <p className="text-sm mb-4">{course.short}</p>
                <Link
                  href={`/courses/${course.slug}`}
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
