
import TransitionLink from "@/components/TransitionLink";
import FeaturedWorks from "@/components/FeaturedWorks";
import FadeIn from "@/components/FadeIn";

export default function HomePage() {
  return (
    <div className="grid gap-8">
      <section className="intro_box pl-0 pr-2 py-8">
        <FadeIn>
          <p className="mt-3 max-w-2xl text-3xl text-white" style={{ fontFamily: "var(--font-paracopy)" }}>
            I am composer of all types of music, with a current focus on acoustic concert music.
          </p>
        </FadeIn>
        <FadeIn delay={150}>
          <div className="mt-6 flex flex-wrap gap-3">
            <TransitionLink className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white" href="/works">
              Search Works
            </TransitionLink>
            <TransitionLink className="rounded-xl border px-4 py-2 text-sm font-medium" href="/bio">
              Read bio
            </TransitionLink>
          </div>
        </FadeIn>
      </section>

      <FeaturedWorks />
    </div>
  );
}

/* feature pieces on the homepage */