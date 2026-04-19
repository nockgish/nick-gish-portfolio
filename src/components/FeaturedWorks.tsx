"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import WorkCard, { Work } from "@/components/WorkCard";
import TransitionLink from "@/components/TransitionLink";

const CATEGORIES: { key: Work["category"]; label: string }[] = [
  { key: "solo", label: "Solo" },
  { key: "chamber", label: "Chamber" },
  { key: "large_ensemble", label: "Large Ensemble" },
  { key: "chorus", label: "Choral" },
];

export default function FeaturedWorks() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      const results = await Promise.all(
        CATEGORIES.map(({ key }) =>
          supabase
            .from("works")
            .select("*")
            .eq("is_published", true)
            .eq("category", key)
            .order("year", { ascending: false })
            .order("sort_order", { ascending: false })
            .order("created_at", { ascending: false })
            .limit(1)
            .single()
        )
      );

      if (!alive) return;

      const featured = results
        .map((r) => r.data as Work | null)
        .filter(Boolean) as Work[];

      setWorks(featured);
      setLoading(false);
    })();

    return () => { alive = false; };
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((_, i) => (
          <div key={i} className="h-44 animate-pulse rounded-2xl border bg-white/40 p-5 shadow-sm">
            <div className="h-4 w-1/3 rounded bg-black/10" />
            <div className="mt-3 h-5 w-2/3 rounded bg-black/10" />
            <div className="mt-2 h-4 w-1/2 rounded bg-black/10" />
          </div>
        ))}
      </div>
    );
  }

  if (!works.length) return null;

  return (
    <section className="grid gap-4">
      <div className="featured-header flex items-baseline justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Recent Works</h2>
        <TransitionLink href="/works" className="view_signal">
          View all →
        </TransitionLink>
      </div>
      <div className="grid gap-6 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4">
        {works.map((w, i) => (
          <WorkCard key={w.id} work={w} index={i} />
        ))}
      </div>
    </section>
  );
}
