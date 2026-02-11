"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
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
  const pendingHref = useRef<string | null>(null);
  const timerRef = useRef<number | null>(null);

  function clearTimer() {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  const navigate = (href: string) => {
    if (!href || href === pathname) return;

    // If a transition is already in-flight, just update the destination.
    pendingHref.current = href;
    setIsTransitioning(true);

    clearTimer();
    timerRef.current = window.setTimeout(() => {
      const dest = pendingHref.current;
      pendingHref.current = null;
      if (dest) router.push(dest);
    }, durationMs);
  };

  // After the route changes, clear transitioning state.
  useEffect(() => {
    clearTimer();
    setIsTransitioning(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => () => clearTimer(), []);

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

  const [opacity, setOpacity] = useState(1);

  // Fade out when Nav triggers a transition.
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