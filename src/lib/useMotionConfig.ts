"use client";

import { useReducedMotion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";

/**
 * Provides mobile-aware animation configuration.
 * Detects touch/coarse-pointer devices and prefers-reduced-motion,
 * then returns tuned durations, offsets, and stagger values so
 * Framer Motion animations stay smooth on low-powered devices.
 */
export function useMotionConfig() {
    const prefersReducedMotion = useReducedMotion();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(hover: none) and (pointer: coarse)");
        const update = () => setIsMobile(mq.matches);
        update();
        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
    }, []);

    const shouldReduceMotion = !!prefersReducedMotion;

    return useMemo(
        () => ({
            isMobile,
            shouldReduceMotion,

            /** Cap duration on mobile to keep things snappy */
            duration: (d: number) =>
                shouldReduceMotion ? 0 : isMobile ? Math.min(d, 0.3) : d,

            /** Eliminate stagger on mobile; keep it light on desktop */
            stagger: (index: number, base = 0.1) =>
                shouldReduceMotion ? 0 : isMobile ? index * 0.03 : index * base,

            /** Smaller entry offset on mobile for less perceived distance */
            yOffset: shouldReduceMotion ? 0 : isMobile ? 10 : 20,

            /** Common viewport trigger config */
            viewport: { once: true, margin: "-50px" as const },
        }),
        [isMobile, shouldReduceMotion],
    );
}
