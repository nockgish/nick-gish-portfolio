"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const nav = [
  { href: "/", label: "Home" },
  { href: "/bio", label: "Biography" },
  { href: "/works", label: "Works" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile menu when navigating
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="header-ribbon border-b bg-white/20 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        {/* <img className="trefoil" src="/images/trefoil.svg" /> */}
        <Link href="/" className="site-title text-lg font-semibold tracking-tight">
         NICK GISH<sup className="composer-bug">COMPOSER</sup>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-2 py-1 transition hover:bg-black/5 ${
                  active ? "font-semibold" : "text-black/70"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="sm:hidden inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <div className="grid gap-1">
            <span className={`block h-0.5 w-5 bg-white transition ${open ? "translate-y-1.5 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-white transition ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-white transition ${open ? "-translate-y-1.5 -rotate-45" : ""}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu panel */}
      <div
        className={`sm:hidden overflow-hidden border-t bg-white/80 backdrop-blur transition-[max-height,opacity] duration-300 ${
          open ? "max-h-48.75 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="mx-auto max-w-5xl px-4 py-3">
          <div className="grid gap-1">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-xl px-3 py-2 text-sm transition hover:bg-black/5 ${
                    active ? "font-semibold" : "text-black/80"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
}