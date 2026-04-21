
import TransitionLink from "@/components/TransitionLink";
import FeaturedWorks from "@/components/FeaturedWorks";
import FadeIn from "@/components/FadeIn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faItunesNote } from "@fortawesome/free-brands-svg-icons";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";

export default function HomePage() {
  return (
    <div className="grid gap-8">
      <section className="intro_box pl-0 pr-2 py-8">
        <FadeIn>
          <p className="mt-3 max-w-2xl text-3xl text-white" style={{ fontFamily: "var(--font-paracopy)" }}>
            I am composer of all types of music, with a current focus on acoustic concert music. 
          </p>
          <p className="mt-4 max-w-2xl text-white" style={{ fontFamily: "var(--font-paracopy)" }}>
            I draw my inspiration from sources like various weather/natural phenomena to ancient Irish Mythology and Astrology. I have a deep and abiding
            interest in depths of human creativity spanning back as far as our known history as a species. 
          </p>
        </FadeIn>
        <FadeIn delay={150}>
          <div className="mt-10 flex flex-wrap gap-3">
            <TransitionLink className="rounded-xl bg-black px-4 py-3 text-sm font-medium text-white inline-flex items-center gap-2" href="/works">
              Search Works
              <FontAwesomeIcon icon={faItunesNote} style={{ fontSize: "1.25rem" }} />
            </TransitionLink>
            <TransitionLink className="rounded-xl border px-4 py-3 text-sm font-medium inline-flex items-center gap-2" href="/bio">
              Read bio
              <FontAwesomeIcon icon={faBookOpen} style={{ fontSize: "1.25rem" }} />
            </TransitionLink>
          </div>
        </FadeIn>
      </section>

      <FadeIn delay={300}>
        <FeaturedWorks />
      </FadeIn>
    </div>
  );
}

/* feature pieces on the homepage */