import { useRef } from "react";
import { Button } from "@/components/ui/button";

interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
}

export default function HighlightedMagneticButton({ children, href }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.07}px, ${y * 0.07}px)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = `translate(0, 0)`;
  };

  const content = (
    <Button
      size="lg"
      className="rounded-lg bg-accent text-accent-foreground hover:brightness-110 transition-all"
    >
      {children}
    </Button>
  );

  return href ? (
    <a href={href} className="inline-block relative" onMouseMove={onMove} onMouseLeave={onLeave}>
      <div ref={ref} className="transition-transform duration-150 will-change-transform">{content}</div>
    </a>
  ) : (
    <div className="inline-block relative" onMouseMove={onMove} onMouseLeave={onLeave}>
      <div ref={ref} className="transition-transform duration-150 will-change-transform">{content}</div>
    </div>
  );
}