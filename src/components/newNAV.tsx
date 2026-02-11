"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useRouteTransition } from "@/components/RouteTransition";

const nav = [
  { href: "/", label: "Home" },
  { href: "/bio", label: "Biography" },
  { href: "/works", label: "Works" },
];

export default function Nav() {
  const pathname = usePathname();
  const { navigate, isTransitioning } = useRouteTransition();
  const [open, setOpen] = useState(false);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Close the mobile menu when navigating
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Close when clicking outside
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (buttonRef.current?.contains(target)) return;
      setOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Focus trap for mobile menu
  useEffect(() => {
    if (!open || !panelRef.current) return;

    const root = panelRef.current;
    const selector =
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

    const getFocusable = () =>
      Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(
        (el) => !el.hasAttribute("disabled") && el.tabIndex !== -1
      );

    const focusable = getFocusable();
    focusable[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const items = getFocusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    root.addEventListener("keydown", onKeyDown);
    return () => root.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const NavLink = ({ href, label }: { href: string; label: string }) => {
    const active = pathname === href;
    return (
      <a
        href={href}
        onClick={(e) => {
          e.preventDefault(); 
          navigate(href);
        }}
        className={`rounded-md px-2 py-1 transition hover:bg-black/5 ${
          active ? "font-semibold" : "text-black/70"
        } ${isTransitioning ? "pointer-events-none opacity-60" : ""}`}
      >
        {label}
      </a>
    );
  };

  return (
    <header className="header-ribbon border-b bg-white/20 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        {/* Brand (use RouteTransition for fade-out, but keep Link for prefetch) */}
        <Link
          href="/"
          className={`text-lg font-semibold tracking-tight ${
            isTransitioning ? "pointer-events-none opacity-60" : ""
          }`}
          onClick={(e) => {
            // Intercept to allow fade-out
            e.preventDefault();
            navigate("/");
          }}
        >
          NICK GISH<sup className="composer-bug">COMPOSER</sup>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {nav.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          ref={buttonRef}
          type="button"
          className="sm:hidden inline-flex items-center justify-center rounded-xl border bg-white px-3 py-2 text-sm"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <div className="grid gap-1">
            <span
              className={`block h-0.5 w-5 bg-black transition ${
                open ? "translate-y-1.5 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-black transition ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-0.5 w-5 bg-black transition ${
                open ? "-translate-y-1.5 -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu panel */}
      <div
        className={`sm:hidden overflow-hidden border-t bg-white/80 backdrop-blur transition-[max-height,opacity] duration-300 ${
          open ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
        aria-hidden={!open}
      >
        <nav ref={panelRef} className="mx-auto max-w-5xl px-4 py-3">
          <div className="grid gap-1">
            {nav.map((item) => {
              const active = pathname === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setOpen(false);
                    navigate(item.href);
                  }}
                  className={`rounded-xl px-3 py-2 text-sm transition hover:bg-black/5 ${
                    active ? "font-semibold" : "text-black/80"
                  } ${isTransitioning ? "pointer-events-none opacity-60" : ""}`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
}