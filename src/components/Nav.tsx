"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouteTransition } from "@/components/RouteTransition";
import { useAudio } from "@/components/AudioProvider";
import AudioVisualizer from "@/components/AudioVisualizer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faXmark, faVolumeHigh, faVolumeLow, faVolumeOff } from "@fortawesome/free-solid-svg-icons";

const nav = [
  { href: "/", label: "Home" },
  { href: "/bio", label: "Bio" },
  { href: "/works", label: "Works" },
  { href: "/contact", label: "Contact" },
];

function NavLink({
  href,
  label,
  pathname,
  navigate,
  isTransitioning,
}: {
  href: string;
  label: string;
  pathname: string;
  navigate: (href: string) => void;
  isTransitioning: boolean;
}) {
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
}

export default function Nav() {
  const pathname = usePathname();
  const { navigate, isTransitioning } = useRouteTransition();
  const audio = useAudio();
  const [open, setOpen] = useState(false);
  const [playerMounted, setPlayerMounted] = useState(false);
  const [playerVisible, setPlayerVisible] = useState(false);
  const [volumeOpen, setVolumeOpen] = useState(false);
  const [volumeRect, setVolumeRect] = useState<DOMRect | null>(null);
  const volumeBtnRef = useRef<HTMLButtonElement>(null);
  const volumeDropdownRef = useRef<HTMLDivElement>(null);
  const lastTrackRef = useRef(audio.currentTrack);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);

  // Keep --nav-height in sync with the actual rendered height
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      document.documentElement.style.setProperty("--nav-height", `${el.offsetHeight}px`);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Close volume dropdown on outside click
  useEffect(() => {
    if (!volumeOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!volumeBtnRef.current?.contains(t) && !volumeDropdownRef.current?.contains(t)) {
        setVolumeOpen(false);
      }
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [volumeOpen]);

  // Expand/collapse mini player
  useEffect(() => {
    if (audio.currentTrack) {
      lastTrackRef.current = audio.currentTrack;
      setPlayerMounted(true);
      const raf = requestAnimationFrame(() =>
        requestAnimationFrame(() => setPlayerVisible(true))
      );
      return () => cancelAnimationFrame(raf);
    } else {
      setPlayerVisible(false);
      const t = setTimeout(() => setPlayerMounted(false), 300);
      return () => clearTimeout(t);
    }
  }, [audio.currentTrack]);

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

  return (<>
    <header ref={headerRef} className="header-ribbon border-b bg-white/20 backdrop-blur">
      <div className="mx-auto flex max-w-[70rem] lg:max-w-[133.75rem] items-center justify-between px-4 py-4 transition-[max-width] duration-700 ease-in-out">
        {/* Brand (use RouteTransition for fade-out, but keep Link for prefetch) */}
        <div className="flex flex-col">
          <Link
            href="/"
            className={`site-title text-lg font-semibold tracking-tight ${
              isTransitioning ? "pointer-events-none opacity-60" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
          >
            NICK GISH<sup className="composer-bug">COMPOSER</sup>
          </Link>
          {playerMounted && (
            <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${playerVisible ? "[grid-template-rows:1fr] opacity-100" : "[grid-template-rows:0fr] opacity-0"}`}>
            <div className="overflow-hidden">
            <div className="mt-1.5 flex items-center gap-3 w-full">
            <div className="border border-white/20 rounded-lg px-3 py-1.5 bg-white/10 w-fit min-w-[220px] sm:min-w-[280px]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => audio.isPlaying ? audio.pause() : audio.play(lastTrackRef.current!)}
                  className="text-white/80 hover:text-white transition shrink-0"
                  aria-label={audio.isPlaying ? "Pause" : "Play"}
                >
                  <FontAwesomeIcon icon={audio.isPlaying ? faPause : faPlay} className="w-2.5 h-2.5" />
                </button>
                <div className="flex flex-col min-w-0 gap-1">
                  <span className="text-[9px] font-black uppercase tracking-widest leading-none" style={{ fontFamily: "var(--font-heading)", color: "#fff" }}>Now Playing</span>
                  <span className="text-xs font-semibold truncate leading-tight" style={{ fontFamily: "var(--font-heading)", color: "#fff" }}>{lastTrackRef.current?.title}</span>
                </div>
                <button
                  ref={volumeBtnRef}
                  onClick={() => {
                    if (!volumeOpen) setVolumeRect(volumeBtnRef.current?.getBoundingClientRect() ?? null);
                    setVolumeOpen((v) => !v);
                  }}
                  className="text-white/40 hover:text-white transition shrink-0 ml-auto"
                  aria-label="Volume"
                >
                  <FontAwesomeIcon
                    icon={audio.volume === 0 ? faVolumeOff : audio.volume < 0.5 ? faVolumeLow : faVolumeHigh}
                    className="w-2.5 h-2.5"
                  />
                </button>
                <button
                  onClick={() => audio.stop()}
                  className="text-white/40 hover:text-white transition shrink-0"
                  aria-label="Stop"
                >
                  <FontAwesomeIcon icon={faXmark} className="w-2.5 h-2.5" />
                </button>
              </div>
              <input
                type="range"
                min={0}
                max={audio.duration || 0}
                step={0.1}
                value={audio.currentTime}
                onChange={(e) => audio.seek(parseFloat(e.target.value))}
                className="w-full h-0.5 mt-1.5 accent-white cursor-pointer"
              />
            </div>
            <AudioVisualizer className="flex-1 self-end" />
            </div>
            </div>
            </div>
          )}
        </div>

        {/* Desktop nav */}
        <nav className="hidden sm:flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {nav.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} pathname={pathname} navigate={navigate} isTransitioning={isTransitioning} />
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          ref={buttonRef}
          type="button"
          className="sm:hidden inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <div className="grid gap-1">
            <span
              className={`block h-0.5 w-5 bg-white transition ${
                open ? "translate-y-1.5 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-white transition ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-0.5 w-5 bg-white transition ${
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
        <nav ref={panelRef} className="mx-auto max-w-[70rem] lg:max-w-[133.75rem] px-4 py-3">
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

    {volumeOpen && volumeRect && createPortal(
      <div
        ref={volumeDropdownRef}
        style={{
          position: "fixed",
          top: volumeRect.bottom + 8,
          left: volumeRect.left + volumeRect.width / 2,
          transform: "translateX(-50%)",
          zIndex: 9999,
        }}
        className="flex flex-col items-center rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm px-2.5 py-3"
      >
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={audio.volume}
          onChange={(e) => audio.setVolume(parseFloat(e.target.value))}
          className="accent-white cursor-pointer"
          style={{ writingMode: "vertical-lr", direction: "rtl", height: "80px" }}
        />
      </div>,
      document.body
    )}
  </>);
}