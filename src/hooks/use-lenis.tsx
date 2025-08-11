import Lenis from "@studio-freight/lenis";
import { useEffect, useRef } from "react";

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      // Options can be passed here
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    lenisRef.current = lenis;

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return lenisRef;
}
