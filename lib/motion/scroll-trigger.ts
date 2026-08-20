import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function refreshScrollTriggers() {
  if (typeof window === "undefined") return;
  ScrollTrigger.refresh();
}

/** If the element is already on screen, finish the tween so content is never stuck hidden. */
export function ensureTweenVisible(
  el: Element | null | undefined,
  tween: gsap.core.Tween | null | undefined,
) {
  if (!el || !tween) return;
  const rect = el.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.95) {
    tween.progress(1);
  }
}

export function clearGsapInlineStyles(
  targets: gsap.TweenTarget | null | undefined,
) {
  if (!targets) return;
  gsap.set(targets, { clearProps: "opacity,transform,y,clipPath,scale,rotateX" });
}
