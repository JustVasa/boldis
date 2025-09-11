// app/layout.tsx
import "./globals.css";
import { Poppins } from "next/font/google";
import type { Metadata } from "next";
import ScrollManager from "./components/ScrollManager";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Taneční centrum - Mirror",
  description: "Kurzy tance v Mirror centru",
  themeColor: "#57BDDB",
  icons: {
    // verze v query stringu spolehlivě prorazí cache
    icon: [{ url: "/favicon.ico?v=2" }],
    shortcut: [{ url: "/favicon.ico?v=2" }],
    // apple ikonku nech jen pokud soubor opravdu existuje v /public
    // apple: [{ url: "/apple-touch-icon.png?v=2", sizes: "180x180" }],
  },
};

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
