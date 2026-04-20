
import TransitionLink from "@/components/TransitionLink";
import FeaturedWorks from "@/components/FeaturedWorks";
import ContactForm from "@/components/ContactForm";

export default function HomePage() {
  return (
    <div className="grid gap-8">
      <section className="grid gap-4 md:grid-cols-2">
        <div className="pl-0 pr-2 py-8 intro_box">
          {/* <h1 className="text-3xl font-semibold tracking-tight">Nick Gish</h1> */}
          <p className="mt-3 max-w-2xl text-3xl text-white" style={{ fontFamily: "var(--font-paracopy)" }}>
          I am composer of all types of music, with a current focus on acoustic concert music. 
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <TransitionLink className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white" href="/works">
              Search Works
            </TransitionLink>
            <TransitionLink className="rounded-xl border px-4 py-2 text-sm font-medium" href="/bio">
              Read bio
            </TransitionLink>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5">
          <h2 className="text-sm font-semibold">Contact Me</h2>
          <ContactForm />
        </div>
      </section>

      <FeaturedWorks />
    </div>
  );
}

/* feature pieces on the homepage */