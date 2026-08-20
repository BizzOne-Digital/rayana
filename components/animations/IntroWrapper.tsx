"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/motion/prefs";

const INTRO_KEY = "rayana-intro-seen";
const INTRO_DURATION_MS = 3800;
const EXIT_DURATION_MS = 900;
const ENTER_DURATION_MS = 700;

type IntroWrapperProps = {
  enabled?: boolean;
  brandName?: string;
  children: React.ReactNode;
};

type IntroPhase = "checking" | "enter" | "visible" | "exit" | "done";

export function IntroWrapper({
  enabled = true,
  brandName = "Rayana De Silva — Heart Matters",
  children,
}: IntroWrapperProps) {
  const [phase, setPhase] = useState<IntroPhase>("checking");
  const timersRef = useRef<number[]>([]);
  const phaseRef = useRef<IntroPhase>("checking");

  phaseRef.current = phase;

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const schedule = useCallback((fn: () => void, delay: number) => {
    const id = window.setTimeout(fn, delay);
    timersRef.current.push(id);
  }, []);

  const finishIntro = useCallback(() => {
    if (phaseRef.current === "done" || phaseRef.current === "exit") return;

    clearTimers();
    setPhase("exit");
    schedule(() => {
      sessionStorage.setItem(INTRO_KEY, "1");
      setPhase("done");
    }, EXIT_DURATION_MS);
  }, [clearTimers, schedule]);

  useEffect(() => {
    clearTimers();

    if (!enabled || prefersReducedMotion()) {
      setPhase("done");
      return;
    }

    if (sessionStorage.getItem(INTRO_KEY)) {
      setPhase("done");
      return;
    }

    setPhase("enter");
    schedule(() => setPhase("visible"), 40);
    schedule(() => finishIntro(), INTRO_DURATION_MS);

    return clearTimers;
  }, [enabled, clearTimers, schedule, finishIntro]);

  useEffect(() => {
    if (phase === "checking" || phase === "done") return;

    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = previous;
    };
  }, [phase]);

  const showOverlay = phase === "enter" || phase === "visible" || phase === "exit";
  const isVisible = phase === "visible";
  const isExiting = phase === "exit";

  if (phase === "checking") {
    return <div className="fixed inset-0 z-[100] bg-velvet-night" aria-hidden />;
  }

  if (phase === "done") {
    return <div className="intro-content-enter">{children}</div>;
  }

  return (
    <>
      <div
        className={cn(
          "intro-overlay fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-velvet-night text-warm-ivory",
          "transition-[opacity,transform] ease-[cubic-bezier(0.22,1,0.36,1)]",
          showOverlay && !isExiting && (isVisible || phase === "enter")
            ? isVisible
              ? "scale-100 opacity-100"
              : "scale-[1.02] opacity-0"
            : isExiting
              ? "pointer-events-none scale-[0.98] opacity-0"
              : "opacity-0",
        )}
        style={{
          transitionDuration: isExiting
            ? `${EXIT_DURATION_MS}ms`
            : `${ENTER_DURATION_MS}ms`,
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Site introduction"
      >
        <div className="intro-overlay-bg texture-velvet texture-grain absolute inset-0" />

        <div
          className={cn(
            "absolute top-[42%] right-0 left-0 h-px bg-gradient-to-r from-transparent via-champagne-gold/70 to-transparent",
            "transition-all duration-1000 ease-out",
            isVisible ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0",
          )}
        />

        <div
          className={cn(
            "relative z-10 flex max-w-lg flex-col items-center px-6 text-center",
            "transition-all ease-[cubic-bezier(0.22,1,0.36,1)]",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
          )}
          style={{ transitionDuration: `${ENTER_DURATION_MS + 200}ms` }}
        >
          <div
            className={cn(
              "relative mb-8 h-28 w-28 overflow-hidden rounded-full sm:h-32 sm:w-32",
              "border border-champagne-gold/35 shadow-[0_0_48px_-8px_rgba(214,182,110,0.45)]",
              "transition-all delay-150 duration-700",
              isVisible ? "scale-100 opacity-100" : "scale-90 opacity-0",
            )}
          >
            <Image
              src="/brand/rayana-logo.png"
              alt=""
              fill
              sizes="128px"
              className="object-cover object-[center_18%]"
              priority
            />
          </div>

          <p
            className={cn(
              "mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-soft-rose",
              "transition-all delay-200 duration-700",
              isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
            )}
          >
            Welcome
          </p>

          <h1
            className={cn(
              "font-display text-2xl text-champagne-gold sm:text-3xl md:text-4xl",
              "transition-all delay-300 duration-700",
              isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
            )}
          >
            {brandName}
          </h1>

          <p
            className={cn(
              "mt-4 max-w-sm text-sm leading-relaxed text-rose-mist/85",
              "transition-all delay-[420ms] duration-700",
              isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
            )}
          >
            A deeper way of seeing into what matters
          </p>

          <button
            type="button"
            onClick={finishIntro}
            className={cn(
              "btn btn-hero-secondary mt-10 min-w-[9rem]",
              "transition-all delay-500 duration-700",
              isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
            )}
          >
            Enter
          </button>

          <button
            type="button"
            onClick={finishIntro}
            className={cn(
              "mt-4 text-[0.65rem] uppercase tracking-[0.24em] text-rose-mist/70 hover:text-warm-ivory",
              "transition-all delay-[560ms] duration-700",
              isVisible ? "opacity-100" : "opacity-0",
            )}
          >
            Skip intro
          </button>
        </div>
      </div>

      <div className="invisible h-0 overflow-hidden" aria-hidden>
        {children}
      </div>
    </>
  );
}
