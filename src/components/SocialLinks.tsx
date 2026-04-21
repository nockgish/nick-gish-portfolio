"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faYoutube, faSoundcloud } from "@fortawesome/free-brands-svg-icons";

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/skunkfish_and", icon: faInstagram },
  { label: "YouTube", href: "https://youtube.com/@nickgish7592", icon: faYoutube },
  { label: "SoundCloud", href: "https://soundcloud.com/nickgish", icon: faSoundcloud },
];

export default function SocialLinks() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {SOCIALS.map(({ label, href, icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          className="glass-panel flex items-center justify-center rounded-full w-14 h-14 text-white transition hover:scale-110"
        >
          <FontAwesomeIcon icon={icon} style={{ fontSize: "1.75rem" }} />
        </a>
      ))}
    </div>
  );
}
