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
    // použijeme NOVÝ název souboru (bez ?v=...)
    icon: [{ url: "/favicon-2025.ico" }],
    shortcut: [{ url: "/favicon-2025.ico" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <head>
        {/* tvrdý link do head + type pomáhá Chrome/Safari */}
        <link rel="icon" href="/favicon-2025.ico" sizes="any" />
        <link rel="shortcut icon" href="/favicon-2025.ico" />
      </head>
      <body className={poppins.variable}>
        {children}
        <ScrollManager />
      </body>
    </html>
  );
}
