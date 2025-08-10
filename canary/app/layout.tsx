import "./globals.css";
import { Poppins } from "next/font/google";


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-poppins", // ✅ KLÍČOVÁ ČÁST
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body className={poppins.variable}>{children}</body>
    </html>
  );
}
