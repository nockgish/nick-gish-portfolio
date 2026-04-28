import "./globals.css";
import Nav from "@/components/Nav";
import { Lexend } from "next/font/google";
import { Oswald } from "next/font/google";
import { Red_Hat_Display } from "next/font/google";
import { Special_Gothic } from "next/font/google";
import BodyBackground from "@/components/BodyBackground";
import SocialLinks from "@/components/SocialLinks";
import { RouteFade, RouteTransitionProvider } from "@/components/RouteTransition";
import { AudioProvider } from "@/components/AudioProvider";


const headingFont = Red_Hat_Display({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-heading",
  display: "optional",
});

const oswaldFont = Oswald({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-oswald",
  display: "optional",
});

const bodyFont = Special_Gothic({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-paracopy",
  display: "optional",
})



export const metadata = {
  title: "Nick Gish — Composer",
  description: "Portfolio and catalog of works for composer Nick Gish",
};

export const viewport = {
  themeColor: "#1a2e25",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
     <body className={`${headingFont.variable} ${bodyFont.variable} ${oswaldFont.variable} min-h-svh flex flex-col`}>
        <BodyBackground />
<SocialLinks />
        <AudioProvider>
        <RouteTransitionProvider>
        <Nav />
        <main className="mx-auto w-full max-w-[70rem] lg:max-w-[133.75rem] px-4 py-6 sm:py-10 transition-[max-width] duration-700 ease-in-out flex-1"><RouteFade>{children}</RouteFade>
        </main>
        
<footer className="border-t">
  <div className="mx-auto flex max-w-[70rem] lg:max-w-[133.75rem] items-center justify-between px-4 py-8 text-sm text-black/60">
    <span>© {new Date().getFullYear()} Nick Gish</span>

    <a
      href="/admin"
      className="admin_link hover:text-black"
    >
      {/* &#8874; */}
      &#9715;
    </a>
  </div>
</footer>
</RouteTransitionProvider>
        </AudioProvider>
      </body>
    </html>
  );
}