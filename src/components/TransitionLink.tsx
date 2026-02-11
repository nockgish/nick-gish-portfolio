"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouteTransition } from "@/components/RouteTransition";

type Props = {
  href: string;
  className?: string;
  children: React.ReactNode;
  title?: string;
  // If true, bypass the fade transition and navigate immediately.
  immediate?: boolean;
};

function isModifiedClick(e: React.MouseEvent) {
  return e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;
}

export default function TransitionLink({
  href,
  children,
  className,
  title,
  immediate,
}: Props) {
  const pathname = usePathname();
  const { navigate, isTransitioning } = useRouteTransition();

  const isExternal = href.startsWith("http://") || href.startsWith("https://");
  const isHash = href.startsWith("#") || href.startsWith(`${pathname}#`);

  // External links + hash links should behave normally.
  if (isExternal || isHash) {
    return (
      <a href={href} className={className} title={title}>
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={className}
      title={title}
      onClick={(e) => {
        if (immediate) return;
        if (isModifiedClick(e)) return; // allow cmd/ctrl click new tab, etc.
        e.preventDefault();
        if (!isTransitioning) navigate(href);
      }}
    >
      {children}
    </Link>
  );
}