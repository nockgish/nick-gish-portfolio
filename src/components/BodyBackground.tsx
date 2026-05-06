"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

type BgConfig = {
  image: string;      // /public path
  overlay?: string;   // optional overlay (e.g. "bg-white/80")
};

function pickBackground(pathname: string): BgConfig {
  if (pathname.startsWith("/bio")) {
    return { image: "/images/back2.jpg"};
  }
  if (pathname.startsWith("/works")) {
    return { image: "/images/back1.jpg" };
  }
  if (pathname.startsWith("/admin")) {
    return { image: "/images/greens.jpg" };
  }
  // home
  return { image: "/images/back1.jpg"};
}

export default function BodyBackground({
  durationMs = 800,
  blurPx = 2,
}: {
  durationMs?: number;
  blurPx?: number;
}) {
  const pathname = usePathname();

  const next = useMemo(() => pickBackground(pathname), [pathname]);

  // Two-layer crossfade: A (current) + B (incoming)
  const [a, setA] = useState<BgConfig>(next);
  const [b, setB] = useState<BgConfig | null>(null);
  const [showB, setShowB] = useState(false);
  const [aLoaded, setALoaded] = useState(false);

  const [showLoader, setShowLoader] = useState(true);

  // Preload the initial background and fade it in once ready
  useEffect(() => {
    const img = new Image();
    img.src = next.image;
    img.onload = () => {
      requestAnimationFrame(() => setALoaded(true));
      setTimeout(() => setShowLoader(false), 600);
    };
  }, []);

 useEffect(() => {
  if (next.image === a.image) return;

  let cancelled = false;

  // Preload the incoming image BEFORE fading
  const img = new Image();
  img.src = next.image;

  img.onload = () => {
    if (cancelled) return;

    setB(next);
    requestAnimationFrame(() => setShowB(true));

    const t = window.setTimeout(() => {
      setA(next);
      setB(null);
      setShowB(false);
    }, durationMs);

    return () => window.clearTimeout(t);
  };

  return () => {
    cancelled = true;
  };
}, [next, a.image, durationMs]);

  const transition = `opacity ${durationMs}ms ease`;

  return (
    <>
      {/* Loading indicator */}
      {showLoader && (
        <div
          className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
          style={{ opacity: aLoaded ? 0 : 1, transition: "opacity 600ms ease" }}
        >
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "1rem",
              color: "rgba(255,255,255,0.7)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Loading
            <span className="loading-dots">
              <span>.</span><span>.</span><span>.</span>
            </span>
          </span>
        </div>
      )}

      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10" style={{ bottom: '-100px' }}>
        {/* Layer A */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${a.image})`,
            opacity: aLoaded ? 1 : 0,
            transition: `opacity ${durationMs}ms ease`,
          }}
        />
        {a.overlay ? (
          <div
            className={`absolute inset-0 ${a.overlay}`}
            style={{ backdropFilter: `blur(${blurPx}px)` }}
          />
        ) : null}

        {/* Layer B (incoming) */}
        {b ? (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${b.image})`,
                opacity: showB ? 1 : 0,
                transition,
                transform: showB ? "scale(1)" : "scale(1.03)",
                filter: showB ? "blur(0px)" : "blur(10px)",
              }}
            />
            {b.overlay ? (
              <div
                className={`absolute inset-0 ${b.overlay}`}
                style={{
                  opacity: showB ? 1 : 0,
                  transition,
                  backdropFilter: `blur(${blurPx}px)`,
                }}
              />
            ) : null}
          </>
        ) : null}
      </div>
    </>
  );
}
