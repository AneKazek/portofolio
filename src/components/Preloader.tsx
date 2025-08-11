import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import gsap from "gsap";

interface PreloaderProps {
  visible: boolean;
  onFinish: () => void;
  className?: string;
}

export default function Preloader({ visible, onFinish, className }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!visible) return;

    const ctx = gsap.context(() => {
      gsap.set([logoRef.current, barRef.current], { opacity: 0 });

      // Logo pop-in
      gsap.fromTo(
        logoRef.current,
        { scale: 0.9, y: 10, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, ease: "power3.out", duration: 0.6 }
      );

      // Spinning ring
      gsap.to(ringRef.current, { rotate: 360, duration: 1.2, ease: "linear", repeat: -1 });

      // Progress bar
      gsap.fromTo(
        barRef.current,
        { width: "0%", opacity: 1 },
        { width: "100%", opacity: 1, duration: 1.2, ease: "power2.out", delay: 0.1 }
      );

      // Exit animation, then finish
      gsap.to(containerRef.current, {
        opacity: 0,
        pointerEvents: "none",
        duration: 0.4,
        ease: "power2.out",
        delay: 1.4,
        onComplete: onFinish,
      });
    }, containerRef);

    return () => ctx.revert();
  }, [visible, onFinish]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      role="status"
      aria-live="polite"
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-background text-foreground",
        "[--blur:20px] backdrop-blur-sm",
        className
      )}
    >
      <div className="flex flex-col items-center gap-6 px-6">
        {/* Logo / Name */}
        <div ref={logoRef} className="text-center">
          <div className="mx-auto mb-3 grid place-items-center">
            <div
              ref={ringRef}
              className="h-14 w-14 rounded-full border-2 border-primary/30 border-t-primary"
              aria-hidden
            />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Muhammad Dzaky Haidar</h1>
          <p className="text-sm text-muted-foreground">AI Engineer • Cybersecurity Analyst</p>
        </div>

        {/* Progress bar */}
        <div className="w-56 h-1.5 rounded-full bg-muted overflow-hidden">
          <div ref={barRef} className="h-full bg-primary" />
        </div>
      </div>
    </div>
  );
}
