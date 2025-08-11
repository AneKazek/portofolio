import Spline from "@splinetool/react-spline";
import React, { Suspense, useEffect, useRef } from "react";
import HeroModel from "@/components/three/HeroModel";
import MagneticButton from "@/components/MagneticButton";
import gsap from "gsap";

export default function Hero() {
  const root = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-badge", { y: 16, opacity: 0, duration: 0.4 })
        .from(".hero-title", { y: 24, opacity: 0, duration: 0.5 }, "-=0.2")
        .from(".hero-subtitle", { y: 22, opacity: 0, duration: 0.45 }, "-=0.15")
        .from(".hero-desc", { y: 20, opacity: 0, duration: 0.45 }, "-=0.1")
        .from(".hero-cta > *", { y: 14, opacity: 0, stagger: 0.08, duration: 0.35 }, "-=0.1")
        .from(".hero-card", { y: 32, opacity: 0, scale: 0.96, duration: 0.6 }, "<")
        .from(".scroll-cue", { y: 12, opacity: 0, duration: 0.4 }, "-=0.2");

      // Gentle floating for the model card
      gsap.to(".hero-card", {
        y: -6,
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <header ref={root} className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Suspense fallback={null}>
          <Spline scene="https://my.spline.design/animatedbackgroundgradientforweb-2O8GlUM1tBoFFzLbnWPWlrvx/" />
        </Suspense>
      </div>
      <div className="container py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <span className="hero-badge inline-block text-sm tracking-widest uppercase text-muted-foreground">Portfolio</span>
            <h1 className="hero-title text-4xl md:text-6xl font-bold leading-tight">
              Muhammad Dzaky Haidar
            </h1>
            <p className="hero-subtitle text-lg md:text-xl text-muted-foreground">
              AI Engineer • Cybersecurity Analyst • Tech Leader
            </p>
            <p className="hero-desc max-w-xl text-muted-foreground">
              I craft intelligent systems and secure infrastructures that scale. Performance-focused, security-first, built to ship.
            </p>
            <div className="hero-cta flex items-center gap-4">
              <MagneticButton href="#contact">Contact Me</MagneticButton>
              <a href="#projects" className="story-link text-sm">View My Projects</a>
            </div>
          </div>
          <div className="hero-card rounded-xl border border-border/60 bg-card/30 backdrop-blur-md will-change-transform">
            {/* <HeroModel /> */}
          </div>
        </div>
      </div>
      {/* Scroll cue */}
      <div className="scroll-cue absolute inset-x-0 bottom-6 flex justify-center">
        <div className="h-8 w-5 rounded-full border border-border/70 flex items-start justify-center p-1">
          <span className="h-2 w-1 rounded-full bg-teal animate-fade-in" />
        </div>
      </div>
    </header>
  );
}
