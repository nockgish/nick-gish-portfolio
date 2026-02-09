import "./globals.css";
import Nav from "@/components/Nav";
import { Lexend } from "next/font/google";
import { Oswald } from "next/font/google";
import { Red_Hat_Display } from "next/font/google";
import { Special_Gothic } from "next/font/google";
import BodyBackground from "@/components/BodyBackground";


const headingFont = Red_Hat_Display({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-heading",
});

const oswaldFont = Oswald({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-oswald",
});

const bodyFont = Special_Gothic({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-paracopy",
})



export const metadata = {
  title: "Nick Gish — Composer",
  description: "Portfolio and catalog of works for composer Nick Gish",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
     <body className={`${headingFont.variable} ${bodyFont.variable} ${oswaldFont.variable} min-h-screen bg-zinc-50`}>
        <BodyBackground />
        <Nav />
        <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:py-10">{children}</main>
<footer className="border-t bg-white">
  <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-8 text-sm text-black/60">
    <span>© {new Date().getFullYear()} Nick Gish</span>

    <a
      href="/admin"
      className="admin_link hover:text-black"
    >
      {/* &#8874; */}
      &#9635;
    </a>
  </div>
</footer>
      </body>
    </html>
  );
}