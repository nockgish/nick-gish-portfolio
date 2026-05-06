"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

type BgConfig = {
  image: string;
  overlay?: string;
};

function pickBackground(pathname: string): BgConfig {
  if (pathname.startsWith("/bio")) return { image: "/images/back2.jpg" };
  if (pathname.startsWith("/works")) return { image: "/images/back1.jpg" };
  if (pathname.startsWith("/admin")) return { image: "/images/greens.jpg" };
  return { image: "/images/back1.jpg" };
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

  const [a, setA] = useState<BgConfig>(next);
  const [b, setB] = useState<BgConfig | null>(null);
  const [showB, setShowB] = useState(false);
  const [aLoaded, setALoaded] = useState(false);
  const [bgUrl, setBgUrl] = useState<string | null>(null);

  const [progress, setProgress] = useState(0);
  const [showLoader, setShowLoader] = useState(true);
  const [loaderFading, setLoaderFading] = useState(false);

  // Track overall page load + image download progress
  useEffect(() => {
    let objectUrl: string | null = null;

    // DOM phases: loading→30%, interactive→55%, complete→70%, image→100%
    function domProgress() {
      if (document.readyState === "complete") return 70;
      if (document.readyState === "interactive") return 55;
      return 30;
    }

    setProgress(domProgress());

    const onReadyState = () => setProgress(p => Math.max(p, domProgress()));
    document.addEventListener("readystatechange", onReadyState);

    async function loadImage() {
      try {
        const res = await fetch(next.image);
        const contentLength = res.headers.get("Content-Length");
        const total = contentLength ? parseInt(contentLength, 10) : 0;
        if (!res.body) throw new Error("no body");

        const reader = res.body.getReader();
        const chunks: Uint8Array[] = [];
        let received = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          received += value.length;
          if (total > 0) {
            // Image download fills the remaining 70→99% slice
            const imageSlice = Math.floor((received / total) * 29);
            setProgress(p => Math.max(p, 70 + imageSlice));
          }
        }

        objectUrl = URL.createObjectURL(new Blob(chunks, { type: "image/jpeg" }));
        setBgUrl(objectUrl);
        setProgress(100);
        setLoaderFading(true);                              // 1. fade loader out
        setTimeout(() => {
          window.dispatchEvent(new Event("siteready"));    // 2. signal content
          setALoaded(true);                                 // 3. fade bg in
          setTimeout(() => setShowLoader(false), durationMs); // 4. unmount loader
        }, 700);
      } catch {
        const img = new Image();
        img.src = next.image;
        img.onload = () => {
          setProgress(100);
          setLoaderFading(true);
          setTimeout(() => {
            window.dispatchEvent(new Event("siteready"));
            setALoaded(true);
            setTimeout(() => setShowLoader(false), durationMs);
          }, 700);
        };
      }
    }

    loadImage();

    return () => {
      document.removeEventListener("readystatechange", onReadyState);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  useEffect(() => {
    if (next.image === a.image) return;
    let cancelled = false;

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

    return () => { cancelled = true; };
  }, [next, a.image, durationMs]);

  const transition = `opacity ${durationMs}ms ease`;

  return (
    <>
      {showLoader && (
        <div
          className="pointer-events-none fixed inset-0 z-50 flex flex-col items-center justify-center gap-4"
          style={{ opacity: loaderFading ? 0 : 1, transition: "opacity 700ms ease" }}
        >
          <span style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 700,
            fontSize: "0.85rem",
            color: "rgba(255,255,255,0.7)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}>
            Loading
            <span className="loading-dots">
              <span>.</span><span>.</span><span>.</span>
            </span>
          </span>

          {/* Progress bar */}
          <div style={{
            width: "160px",
            height: "2px",
            background: "rgba(255,255,255,0.15)",
            borderRadius: "999px",
            overflow: "hidden",
          }}>
            <div style={{
              height: "100%",
              width: `${progress}%`,
              background: "rgba(255,255,255,0.7)",
              borderRadius: "999px",
              transition: "width 150ms ease-out",
            }} />
          </div>
        </div>
      )}

      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10" style={{ bottom: "-100px" }}>
        {/* Layer A */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${bgUrl ?? a.image})`,
            opacity: aLoaded ? 1 : 0,
            transition: `opacity ${durationMs}ms ease`,
          }}
        />
        {a.overlay && (
          <div className={`absolute inset-0 ${a.overlay}`} style={{ backdropFilter: `blur(${blurPx}px)` }} />
        )}

        {/* Layer B (incoming route transition) */}
        {b && (
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
            {b.overlay && (
              <div
                className={`absolute inset-0 ${b.overlay}`}
                style={{ opacity: showB ? 1 : 0, transition, backdropFilter: `blur(${blurPx}px)` }}
              />
            )}
          </>
        )}
      </div>
    </>
  );
}
