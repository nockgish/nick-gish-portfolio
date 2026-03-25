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
      className="pointer-events-none fixed left-0 top-0 z-[9999]"
      style={{ willChange: "transform" }}
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="cursor-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="1" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Triangle */}
        <path
          d="M4.1,3.0 Q3,2 3,3.5 L3,18.5 Q3,20 4.4,19.4 L15.6,14.6 Q17,14 15.9,13.0 L4.1,3.0 Z"
          fill="#d97040"
          filter="url(#cursor-shadow)"
          style={{
            opacity: hovering ? 0 : 1,
            transform: hovering ? "scale(0.5)" : "scale(1)",
            transformOrigin: "10px 11px",
            transition: "opacity 150ms ease, transform 150ms ease",
          }}
        />

        {/* Plus */}
        <path
          d="M10 3 L10 17 M3 10 L17 10"
          stroke="#d97040"
          strokeWidth="2.5"
          strokeLinecap="round"
          filter="url(#cursor-shadow)"
          style={{
            opacity: hovering ? 1 : 0,
            transform: hovering ? "scale(1)" : "scale(0.5)",
            transformOrigin: "10px 10px",
            transition: "opacity 150ms ease, transform 150ms ease",
          }}
        />
      </svg>
    </div>
  );
}
