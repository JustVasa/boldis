// app/layout.tsx
import "./globals.css";
import { Poppins } from "next/font/google";
import ScrollManager from "./components/ScrollManager";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-poppins",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body className={poppins.variable}>
        {children}
        <ScrollManager />
      </body>
    </html>
  );
}
