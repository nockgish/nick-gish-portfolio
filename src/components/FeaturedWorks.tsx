import { supabaseServer } from "@/lib/supabaseServer";
import { Work } from "@/components/WorkCard";
import WorkCard from "@/components/WorkCard";
import TransitionLink from "@/components/TransitionLink";

const CATEGORIES: { key: Work["category"]; label: string }[] = [
  { key: "solo", label: "Solo" },
  { key: "chamber", label: "Chamber" },
  { key: "large_ensemble", label: "Large Ensemble" },
  { key: "chorus", label: "Choral" },
];

export default async function FeaturedWorks() {
  const results = await Promise.all(
    CATEGORIES.map(({ key }) =>
      supabaseServer
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

  const works = results
    .map((r) => r.data as Work | null)
    .filter(Boolean) as Work[];

  if (!works.length) return null;

  return (
    <section className="grid gap-4">
      <div className="featured-header flex items-baseline justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Recent Works</h2>
        <TransitionLink href="/works" className="view_signal group inline-flex items-center gap-1">
          View all
          <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1">→</span>
        </TransitionLink>
      </div>
      <div className="grid gap-6 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4">
        {works.map((w, i) => (
          <WorkCard key={w.id} work={w} index={i} eager />
        ))}
      </div>
    </section>
  );
}
