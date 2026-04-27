import { supabaseServer } from "@/lib/supabaseServer";
import { Work } from "@/components/WorkCard";
import WorkCard from "@/components/WorkCard";
import TransitionLink from "@/components/TransitionLink";

export default async function FeaturedWorks() {
  const { data } = await supabaseServer
    .from("works")
    .select("*")
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("sort_order", { ascending: true });

  const works = (data ?? []) as Work[];

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
