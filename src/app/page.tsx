
import TransitionLink from "@/components/TransitionLink";

export default function HomePage() {
  return (
    <div className="grid gap-8">
      <section className="rounded-3xl border bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight">Nick Gish</h1>
        <p className="mt-3 max-w-2xl text-base text-black/75">
          Composer. Music that favors weight, grain, and clarity—where complexity serves momentum.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <TransitionLink className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white" href="/works">
            View catalog
          </TransitionLink>
          <TransitionLink className="rounded-xl border px-4 py-2 text-sm font-medium" href="/bio">
            Read biography
          </TransitionLink>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold">Selected aesthetics</h2>
          <p className="mt-2 text-sm text-black/70">Dense harmony, tactile rhythm, and long-line form.</p>
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold">Collaboration</h2>
          <p className="mt-2 text-sm text-black/70">Open to ensembles, education projects, commissions.</p>
        </div>
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold">Contact</h2>
          <p className="mt-2 text-sm text-black/70">
            Add your email + socials here.
          </p>
        </div>
      </section>
    </div>
  );
}