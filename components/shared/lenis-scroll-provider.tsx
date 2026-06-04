"use client";

import { useLenisScroll } from "@/hooks/useLenisScroll";

export function LenisScrollProvider({ children }: { children: React.ReactNode }) {
  useLenisScroll();
  return children;
}
