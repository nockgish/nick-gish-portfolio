"use client";

import Image from "next/image";
import { useState } from "react";

export default function BioPhoto() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative overflow-hidden pic-of-me aspect-[3/4]">
      <Image
        src="/images/ng.jpg"
        alt="Image of Nick"
        fill
        className="object-cover object-top transition-opacity duration-700"
        style={{ opacity: loaded ? 1 : 0 }}
        sizes="(min-width: 200px) 50vw, 100vw"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
