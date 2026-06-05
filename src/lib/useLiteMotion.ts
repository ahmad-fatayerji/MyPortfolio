"use client";

import { useIsAppleMobileWebKit } from "@/lib/useIsAppleMobileWebKit";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

export function useLiteMotion() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isAppleMobileWebKit = useIsAppleMobileWebKit();

  return prefersReducedMotion || isAppleMobileWebKit;
}
