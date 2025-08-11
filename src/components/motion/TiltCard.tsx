import React from "react";
import { cn } from "@/lib/utils";

type TiltCardProps = React.HTMLAttributes<HTMLDivElement> & {
  intensity?: number; // tilt intensity in degrees
};

export default function TiltCard({
  className,
  intensity = 10,
  children,
  ...props
}: TiltCardProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1
    const rx = (py - 0.5) * -2 * intensity;
    const ry = (px - 0.5) * 2 * intensity;
    el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
  }

  function handleLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)";
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cn(
        "transition-transform duration-200 will-change-transform",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
