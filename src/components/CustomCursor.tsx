"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;

    const move = (e: MouseEvent) => {
      el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };

    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");
      if (link?.href?.endsWith(".pdf")) setHovering(true);
    };

    const out = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");
      if (link?.href?.endsWith(".pdf")) setHovering(false);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mouseout", out);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mouseout", out);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="custom-cursor pointer-events-none fixed left-0 top-0 z-[9999]"
      style={{ willChange: "transform" }}
    >
      <svg
        width="72"
        height="72"
        viewBox="0 0 24 24"
        fill="none"
        overflow="visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="cursor-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="1" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.5" />
          </filter>
          <linearGradient id="cursor-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f0853a" />
            <stop offset="100%" stopColor="#a63d10" />
          </linearGradient>
        </defs>

        {/* Triangle */}
        <path
          d="M4.1,3.0 Q3,2 3,3.5 L3,18.5 Q3,20 4.4,19.4 L15.6,14.6 Q17,14 15.9,13.0 L4.1,3.0 Z"
          fill="url(#cursor-gradient)"
          filter="url(#cursor-shadow)"
          style={{
            transform: hovering ? "rotate(45deg)" : "rotate(0deg)",
            transformOrigin: "10px 11px",
            transition: "transform 150ms ease",
          }}
        />
      </svg>
    </div>
  );
}
