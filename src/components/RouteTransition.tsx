"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";

type Ctx = {
  navigate: (href: string) => void;
  isTransitioning: boolean;
  durationMs: number;
};

const RouteTransitionContext = createContext<Ctx | null>(null);

export function useRouteTransition() {
  const ctx = useContext(RouteTransitionContext);
  if (!ctx)
    throw new Error("useRouteTransition must be used within <RouteTransitionProvider>");
  return ctx;
}

/**
 * Provider: supplies `navigate()` to Nav, but does NOT fade anything by itself.
 * Keep this above the header so the header doesn't animate.
 */
export function RouteTransitionProvider({
  children,
  durationMs = 350,
}: {
  children: React.ReactNode;
  durationMs?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [isTransitioning, setIsTransitioning] = useState(false);

  const navigate = (href: string) => {
    if (!href || href === pathname) return;
    setIsTransitioning(true);
    router.push(href);
  };

  useEffect(() => {
    setIsTransitioning(false);
  }, [pathname]);

  return (
    <RouteTransitionContext.Provider
      value={{ navigate, isTransitioning, durationMs }}
    >
      {children}
    </RouteTransitionContext.Provider>
  );
}

/**
 * Wrapper: fades ONLY the page content.
 * Place this around `{children}` (inside <main>), not around <Nav/>.
 */
export function RouteFade({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isTransitioning, durationMs } = useRouteTransition();

  const [opacity, setOpacity] = useState(0);

  // Fade out immediately on click (cosmetic only — navigation already in flight).
  useEffect(() => {
    if (isTransitioning) setOpacity(0);
  }, [isTransitioning]);

  // Fade in after route change.
  useEffect(() => {
    setOpacity(0);
    const raf = requestAnimationFrame(() => setOpacity(1));
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return (
    <div
      style={{ transitionDuration: `${durationMs}ms`, opacity }}
      className="transition-opacity ease-out"
    >
      {children}
    </div>
  );
}