"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function PageFade({
  children,
  className = "",
  durationMs = 2050,
}: {
  children: React.ReactNode;
  className?: string;
  durationMs?: number;
}) {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(false);
    const raf = requestAnimationFrame(() => setShow(true));
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return (
    <div
      className={`transition-opacity ease-out ${
        show ? "opacity-100" : "opacity-0"
      } ${className}`}
      style={{ transitionDuration: `${durationMs}ms` }}
    >
      {children}
    </div>
  );
}

