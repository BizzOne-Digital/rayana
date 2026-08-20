export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function getMotionDuration(defaultMs: number, reducedMs = 0): number {
  return prefersReducedMotion() ? reducedMs : defaultMs;
}

export function shouldEnableSmoothScroll(): boolean {
  if (typeof window === "undefined") return false;
  return !prefersReducedMotion();
}
