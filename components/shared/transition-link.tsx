"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useTransitionContext } from "@/contexts/TransitionContext";

type TransitionLinkProps = ComponentProps<typeof Link>;

function hrefToPath(href: TransitionLinkProps["href"]): string {
  if (typeof href === "string") return href;
  const pathname = href.pathname ?? "/";
  const search = typeof href.search === "string" ? href.search : "";
  const hash = href.hash ?? "";
  return `${pathname}${search}${hash}`;
}

/** Internal route links that use the site-wide SVG cover/uncover transition. */
export function TransitionLink({
  href,
  onClick,
  children,
  ...rest
}: TransitionLinkProps) {
  const { navigateWithTransition } = useTransitionContext();
  const path = hrefToPath(href);

  return (
    <Link
      href={href}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        e.preventDefault();
        void navigateWithTransition(path);
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}
