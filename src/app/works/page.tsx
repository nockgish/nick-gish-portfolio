"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import WorkCard, { Work } from "@/components/WorkCard";

function Section({
  title,
  items,
}: {
  title: string;
  items: Work[];
}) {
  if (!items.length) return null;

  return (
    <section className="grid gap-4">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((w) => (
          <WorkCard key={w.id} work={w} />
        ))}
      </div>
    </section>
  );
}

function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-44 animate-pulse rounded-1xl border bg-white p-5 shadow-sm"
        >
          <div className="h-5 w-2/3 rounded bg-black/10" />
          <div className="mt-3 h-4 w-1/2 rounded bg-black/10" />
          <div className="mt-6 h-4 w-full rounded bg-black/10" />
          <div className="mt-2 h-4 w-5/6 rounded bg-black/10" />
        </div>
      ))}
    </div>
  );
}

export default function WorksPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");
  const [tag, setTag] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("works")
        .select("*")
        .eq("is_published", true)
        .order("sort_order", { ascending: false })
        .order("year", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) console.error("Supabase works query error:", error);

      if (!alive) return;
      setWorks((data as Work[]) ?? []);
      setLoading(false);
    })();

    return () => {
      alive = false;
    };
  }, []);

  const tags = useMemo(() => {
    const all = new Set<string>();
    works.forEach((w) => (w.tags ?? []).forEach((t) => all.add(t)));
    return Array.from(all).sort((a, b) => a.localeCompare(b));
  }, [works]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return works.filter((w) => {
      const hay = [
        w.title,
        w.instrumentation,
        w.description,
        w.premiere,
        (w.tags ?? []).join(" "),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesQuery = !query || hay.includes(query);
      const matchesTag = !tag || (w.tags ?? []).includes(tag);

      return matchesQuery && matchesTag;
    });
  }, [works, q, tag]);

  // Group in your requested order
  const grouped = useMemo(() => {
    return {
      solo: filtered.filter((w) => w.category === "solo"),
      chamber: filtered.filter((w) => w.category === "chamber"),
      large_ensemble: filtered.filter((w) => w.category === "large_ensemble"),
      chorus: filtered.filter((w) => w.category === "chorus"),
    };
  }, [filtered]);

  return (
    <div className="grid gap-6">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-5xl font-semibold tracking-loose">
            Works
          </h1>
          {/* <p className="mt-1 text-sm text-black/70">
            Browse scores, recordings, and instrumentation.
          </p> */}
        </div>

        <div className="search-box flex flex-col gap-2 md:flex-row md:items-center">
          <input
            className="w-full rounded-xl border bg-white px-3 py-2 text-sm md:w-72"
            placeholder="Search works…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <select
            className="tag-select rounded-xl border px-3 py-2 text-sm"
            value={tag ?? ""}
            onChange={(e) => setTag(e.target.value || null)}
          >
            <option value="">All tags</option>
            {tags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Loading state: show skeletons immediately */}
      {loading ? <SkeletonGrid count={6} /> : null}

      {/* Content: fades in once loaded */}
      <div
        className={`transition-opacity duration-2000 ease-in-out ${
          loading ? "opacity-0" : "opacity-100"
        }`}
      >
        {!loading && filtered.length === 0 ? (
          <p className="text-sm text-black/70">No works found.</p>
        ) : (
          <div className="grid gap-10">
            <Section title="Solo" items={grouped.solo} />
            <Section title="Chamber" items={grouped.chamber} />
            <Section title="Large Ensemble" items={grouped.large_ensemble} />
            <Section title="Choral" items={grouped.chorus} />
            
          </div>
        )}
      </div>
    </div>
  );
}
