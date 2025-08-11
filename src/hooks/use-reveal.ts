import { useEffect, useRef } from "react";

/**
 * useReveal
 * Adds reveal animation classes when an element enters the viewport.
 * Usage: add data-reveal to elements and optional data-reveal-delay (ms)
 */
export function useReveal() {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = containerRef.current ?? document.body;
    const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = Number(el.dataset.revealDelay || 0);
            setTimeout(() => {
              el.classList.add("animate-enter");
            }, delay);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12 }
    );

    nodes.forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, []);

  return { containerRef } as const;
}
