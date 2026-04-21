"use client";

import { useEffect, useRef, useState } from "react";

// Module-level shared observer — one instance for the whole page.
let sharedObserver: IntersectionObserver | null = null;
const callbacks = new Map<Element, (visible: boolean) => void>();

function getObserver() {
  if (typeof window === "undefined") return null;
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            callbacks.get(entry.target)?.(true);
            // One-shot: stop watching once it has become visible.
            sharedObserver?.unobserve(entry.target);
            callbacks.delete(entry.target);
          }
        }
      },
      { threshold: 0.1 }
    );
  }
  return sharedObserver;
}

export function useInView<T extends Element>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    const observer = getObserver();
    if (!el || !observer) return;

    callbacks.set(el, setVisible);
    observer.observe(el);

    return () => {
      observer.unobserve(el);
      callbacks.delete(el);
    };
  }, []);

  return { ref, visible };
}
