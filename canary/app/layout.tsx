// canary/app/layout.tsx
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
    // explicitně s verzí kvůli cache
    icon: [{ url: "/favicon.ico?v=3" }],
    shortcut: [{ url: "/favicon.ico?v=3" }],
    // pokud nemáš apple-touch-icon.png v canary/public, NEch prázdné
    // apple: [{ url: "/apple-touch-icon.png?v=3", sizes: "180x180" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      {/* tvrdý link do <head> pro jistotu (přebije cacheované/neviditelné odkazy) */}
      <head>
        <link rel="icon" href="/favicon.ico?v=3" />
      </head>
      <body className={poppins.variable}>
        {children}
        <ScrollManager />
      </body>
    </html>
  );
}
