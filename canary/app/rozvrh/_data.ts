
export type Lesson = {
  title: string;
  start: string;
  end: string;
  color?: string;
  slug?: string; // ⬅️ NOVÉ – když je, řádek je klikací
};

export type DaySchedule = {
  day: string;
  venue?: string;
  lessons: Lesson[];
};

export const WEEK: DaySchedule[] = [
  {
    day: "Úterý",
    venue: "Adresa: Městečko Trnávka 85, 569 41 Městečko Trnávka",
    lessons: [
      { title: "Konzultační hodina",      start: "14:00", end: "15:00", color: "bg-sky-500" }, // bez odkazu
      { title: "Děti - první stupeň",  start: "15:00", end: "16:00", color: "bg-red-400",  slug: "tanecni-krouzky-pro-deti" },
      { title: "Balet",                    start: "16:00", end: "16:45", color: "bg-rose-300", slug: "krouzek-baletu" },
      { title: "Děti - druhý stupeň", start: "16:45", end: "17:45", color: "bg-amber-400", slug: "tanecni-krouzky-pro-deti" },
      { title: "Latino Ladies",            start: "18:00", end: "19:00", color: "bg-red-500",  slug: "latino-ladies" },
      { title: "Kurzy pro mládež",         start: "19:15", end: "20:45", color: "bg-indigo-500", slug: "tanecni-pro-mladez" },
    ],
  },
  {
    day: "Čtvrtek",
    venue: "Adresa: Křenov 63, 569 22 Křenov",
    lessons: [
      { title: "Konzultační hodina",      start: "14:00", end: "15:00", color: "bg-sky-500" }, // bez odkazu
      { title: "Děti - první stupeň",  start: "15:00", end: "16:00", color: "bg-red-400",  slug: "tanecni-krouzky-pro-deti" },
      { title: "Balet",                    start: "16:00", end: "16:45", color: "bg-rose-300", slug: "krouzek-baletu" },
      { title: "Děti - druhý stupeň", start: "16:45", end: "17:45", color: "bg-amber-400", slug: "tanecni-krouzky-pro-deti" },
      { title: "Latino Ladies",            start: "18:00", end: "19:00", color: "bg-red-500",  slug: "latino-ladies" },
      { title: "Kurzy pro dospělé",        start: "19:15", end: "20:45", color: "bg-indigo-500", slug: "tanecni-pro-dospele" },
    ],
  },
];
