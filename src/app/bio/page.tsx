import Image from "next/image";
import PageFade from "@/components/PageFade";

export default function BioPage() {
  return (
    
    <article className="bio-text prose max-w-none h-auto min-h-0">
      <PageFade className="prose max-w-none">
      <h1>Bio</h1>
     
      <div className="grid md:grid-cols-2 gap-10 items-stretch mb-8 mt-10">
      <div className="relative overflow-hidden self-stretch pic-of-me">
      <Image
      src="/images/nick.jpg"
      alt="Image of Nick"
      fill
      className="object-cover"
      sizes="(min-width: 200px) 50vw, 100vw"
      />
      </div>
      <div className="space-y-8">
         <p className="first-big">
         This journey begins <b>in media res</b>...
         </p>
         <p className="leading-relaxed">
         It was 2017. I had a work called <b>Democracy</b> premiere at St. James Cathedral in Brooklyn, NY on baroque instruments by an ensemble of expert players. Hearing my work played, my ideas transformed into sound waves hitting me wave after wave ignited something new in me. 
      </p>
     
      <p>Turning the pages back even further, I had worked as a web developer and designer for nearly a decade and a half. I had written countless lines of code. But, hearing this new work engendered something in me which I can't fully describe. I can say it lit a fire under my butt. I could say it sparked something in me I had been missing: The will to create.</p>
      </div>
       </div>
 <p>Earlier that year, my maternal grandfather had just passed away. He had been an architecture professor at the university in the town where I grew up. He was a <i>professor</i> in the deep and literal sense of the word. He professed the gospel of reason and logic. He taught me how to think. So, with his passing, something greatly changed in me: I had to be my own grandfather. I had to keep alive, from him, what was most vital to me: my creativity, my sense of wanting to construct.</p>
      {/* <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
      <Image 
          src="/images/sq2.jpg"
          alt="Image of a score"
          className="score-image"
          width={300}
          height={500}
       /> */}
        <Image 
          src="/images/aanda.jpg"
          alt="Image of a score"
          className="score-image long-score"
          width={800}
          height={500}
       />
      {/* <Image 
          src="/images/scoreimage2.jpg"
          alt="Image of a score"
          className="score-image"
          width={300}
          height={500}
       /> */}


      {/* </div> */}
     
      <p className="first-big now-text">Now...</p>

      <p>I had spent the early 2000's trying to be a composer. I got a degree in music composition, wrote music, I got some performances. But ultimately, I feel like I had to be practical. So I choose a career in computers, writing code for other people's business and organizations. Along the way, I worked for a library system, a magazine conglomerate, small businesses, startups, and financial institutions. I learned a fair amount about a lot of topics that were alien to my interest which always lived under the hood. The engine of music within me, always kept going no matter what direction in which the car drove.</p> 
      <p>I just had an operating system which said "hey you can't be a composer, you've got to do X or Y or Z instead." But, that fateful day in the spring of 2017 started something new brewing. In 2021, I moved from New York back to my native Louisiana, after 8 years in the city. I pressed reset on my life, booted up <b>a new OS</b> and started over.</p>
      <p className="first-big which-brings">Which brings us to the present day...</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-10">
      <Image 
          src="/images/scoreimage.jpg"
          alt="Image of a score"
          className="score-image"
          width={300}
          height={500}
       />
        <Image 
          src="/images/scoreimage3.jpg"
          alt="Image of a score"
          className="score-image middle-score"
          width={300}
          height={500}
       />
      <Image 
          src="/images/scoreimage2.jpg"
          alt="Image of a score"
          className="score-image"
          width={300}
          height={500}
       />


      </div>
      <p>There is nothing that I enjoy more than writing music, building structures out of sound. Writing music for me has a strong resonance with the mythic past. It connects me by drawing a line directly from me to my ancestors who lived on the land. They walked on the ground, bare-footed. It is the story of these places and people that finds a home in my work.</p>

      <p>I hold a Bachelors in Music Composition, with a minor in German Language and Literature, and Masters in Information Science, both from Louisiana State University. I will be pursuing a Masters in Music Composition at Louisiana State University in the Fall of 2026.</p>
      </PageFade>
    </article>
    
  );
}