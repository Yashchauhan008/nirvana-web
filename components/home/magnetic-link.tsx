"use client";

import Link from "next/link";

import { useMagnetic } from "@/hooks/use-magnetic";
import { cn } from "@/lib/utils";

type MagneticLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  strength?: number;
};

export function MagneticLink({
  href,
  children,
  className,
  strength = 0.28,
}: MagneticLinkProps) {
  const mag = useMagnetic<HTMLAnchorElement>({ strength });

  return (
    <Link
      href={href}
      ref={mag.ref}
      onMouseMove={mag.onMove}
      onMouseLeave={mag.onLeave}
      className={cn("magnetic-el inline-block transition-transform duration-300", className)}
    >
      {children}
    </Link>
  );
}
