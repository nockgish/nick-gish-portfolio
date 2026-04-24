
import Image from "next/image";
import TransitionLink from "@/components/TransitionLink";
import FeaturedWorks from "@/components/FeaturedWorks";
import FadeIn from "@/components/FadeIn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faItunesNote } from "@fortawesome/free-brands-svg-icons";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";

export default function HomePage() {
  return (
    <div className="grid gap-8">
      <section className="intro_box pl-0 pr-2 py-8 lg:py-20">
        <div className="flex flex-col sm:flex-row sm:items-start sm:gap-4 lg:gap-16 lg:max-w-7xl lg:mx-auto">
          <div className="flex-1 text-center sm:text-left">
            <FadeIn>
              <p className="mt-3 max-w-2xl lg:max-w-none text-3xl lg:text-5xl text-white" style={{ fontFamily: "var(--font-paracopy)" }}>
                I am composer of many types of music, with a current focus on acoustic concert music.
              </p>
              <div className="mt-10 flex flex-wrap gap-3 justify-center sm:justify-start">
                <TransitionLink className="rounded-xl bg-black px-4 py-3 text-sm lg:text-lg lg:px-6 lg:py-4 font-medium text-white inline-flex items-center gap-2" href="/works">
                  Browse Works
                  <FontAwesomeIcon icon={faItunesNote} style={{ fontSize: "1.25rem" }} />
                </TransitionLink>
                <TransitionLink className="rounded-xl border px-4 py-3 text-sm lg:text-lg lg:px-6 lg:py-4 font-medium inline-flex items-center gap-2" href="/bio">
                  Read bio
                  <FontAwesomeIcon icon={faBookOpen} style={{ fontSize: "1.25rem" }} />
                </TransitionLink>
              </div>
            </FadeIn>
            <FadeIn delay={150}>
              <p className="mt-8 max-w-2xl lg:max-w-none text-white lg:text-lg" style={{ fontFamily: "var(--font-paracopy)" }}>
                I draw my inspiration from sources like various weather/natural phenomena to ancient Irish Mythology and Astrology to modern Astronomy. I have a deep and abiding
                interest in depths of human creativity spanning back as far as our known history as a species.
              </p>
            </FadeIn>
          </div>
          <FadeIn delay={200}>
            <div className="mt-10 sm:mt-3 w-64 sm:w-80 lg:w-96 shrink-0 rounded-md shadow-md mx-auto sm:mx-0">
              <div className="overflow-hidden rounded-md">
                <Image
                  src="/images/nick3.png"
                  alt="Photo of Nick Gish"
                  width={320}
                  height={427}
                  className="object-cover w-full"
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <FeaturedWorks />
    </div>
  );
}

/* feature pieces on the homepage */