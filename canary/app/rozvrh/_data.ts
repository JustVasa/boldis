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
    day: "Středa",
    venue: "Adresa: Křenov 63, 569 22 Křenov",
    lessons: [
      { title: "Latino Ladies (Začátečníci 1)", start: "16:00", end: "17:00", color: "bg-rose-400", slug: "latino-ladies" },
      { title: "Latino Ladies (Začátečníci 2)", start: "17:00", end: "18:00", color: "bg-rose-400", slug: "latino-ladies" },
      { title: "Latino Ladies (Pokročilí)",    start: "18:00", end: "19:00", color: "bg-red-500",  slug: "latino-ladies" },
      { title: "Kurzy pro dospělé",            start: "19:15", end: "20:30", color: "bg-indigo-500", slug: "tanecni-pro-dospele" },
    ],
  },
];
