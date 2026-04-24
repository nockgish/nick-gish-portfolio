"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useInView } from "@/hooks/useInView";

export type Work = {
  id: string;
  title: string;
  year: number | null;
  instrumentation: string | null;
  duration: string | null;
  description: string | null;
  premiere: string | null;
  pdf_url: string | null;
  audio_url: string | null;
  video_url: string | null;
  score_cover_url: string | null;
  category: "solo" | "chamber" | "large_ensemble" | "chorus";
  tags: string[] | null;
  sort_order: number | null;
  is_published: boolean;
};

function LinkRow({ label, href }: { label: string; href: string | null }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-sm underline underline-offset-4 hover:opacity-80 py-1"
    >
      {label}
    </a>
  );
}

function getEmbedUrl(url: string) {
  // YouTube
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const id = url.includes("youtu.be")
      ? url.split("youtu.be/")[1]?.split("?")[0]
      : new URL(url).searchParams.get("v");
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }

  // Vimeo
  if (url.includes("vimeo.com")) {
    const id = url.split("vimeo.com/")[1]?.split("?")[0];
    return id ? `https://player.vimeo.com/video/${id}` : null;
  }

  return null;
}

function ScoreCover({ work }: { work: Work }) {
  const [loaded, setLoaded] = useState(false);

  if (!work.score_cover_url) return null;

  const img = (
    <div className="relative aspect-[1/1.3] w-full">
      {/* placeholder */}
      <div
        className={`absolute inset-0 bg-black/5 transition-opacity duration-500 ${
          loaded ? "opacity-0" : "opacity-100"
        }`}
      />
      
      <Image
        src={work.score_cover_url}
        alt={`${work.title} — score cover`}
        fill
        sizes="(max-width: 780px) 100vw, 560px"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        onLoadingComplete={() => setLoaded(true)}
      />
      {/* <LinkRow label="Score (PDF)" href={work.pdf_url} /> */}
      <span className="score-tag">
        Score (PDF)
      </span>
    </div>
    
  );

  return work.pdf_url ? (
    <a
      href={work.pdf_url}
      target="_blank"
      rel="noreferrer"
      className="mt-4 block overflow-hidden rounded-xl border"
      title="Open score (PDF)"
    >
      {img}
    </a>
  ) : (
    <div className="mt-4 overflow-hidden rounded-xl border">{img}</div>
  );
}

export default function WorkCard({ work, index = 0, eager = false }: { work: Work; index?: number; eager?: boolean }) {
  const embedUrl = work.video_url ? getEmbedUrl(work.video_url) : null;
  const { ref, visible } = useInView<HTMLElement>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!eager) return;
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, [eager]);

  const show = eager ? mounted : visible;

  return (
    <article
      ref={ref}
      className="single-card rounded-2xl border bg-white p-4 sm:p-5 shadow-sm transition-[opacity,transform] duration-900 ease-out"
      style={{ opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(20px)', transitionDelay: `${index * 100}ms` }}
    >
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold leading-tight">{work.title}</h3>
        <div className="text-sm text-black/70">
          {[work.year ?? undefined, work.instrumentation ?? undefined, work.duration ?? undefined]
            .filter(Boolean)
            .join(" • ")}
        </div>
      </div>

      {work.audio_url?.startsWith("mp3s/") && (
        <div className="mt-3">
          <audio controls className="w-full" preload="none">
            <source src={work.audio_url} />
          </audio>
        </div>
      )}

      <ScoreCover work={work} />

      {work.description ? (
        <p className="mt-3 text-sm leading-relaxed text-black/80">
          {work.description}
        </p>
      ) : null}

      {work.premiere ? (
        <p className="mt-3 text-sm text-black/70">
          <span className="font-semibold text-black/80">Premiere:</span> {work.premiere}
        </p>
      ) : null}

      {embedUrl ? (
        <div className="mt-4 aspect-video w-full overflow-hidden rounded-xl border bg-black">
          <iframe
            src={embedUrl}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : null}


      {work.tags?.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {work.tags.map((t) => (
            <span
              key={t}
              className="a-tag rounded-full bg-black/5 px-2 py-1 text-xs text-black/70"
            >
              {t}
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}