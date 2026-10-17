"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import About from "./components/About";
import Achievements from "./components/Achievements";
import Contact from "./components/Contact";
import GlitchHeadline from "./components/GlitchHeadline";
import Presence from "./components/Presence";
import SelectedWork from "./components/SelectedWork";
import Timeline from "./components/Timeline";
import TopoCanvas from "./components/TopoCanvas";

const navItems = [
  { name: "Home", href: "#" },
  { name: "Trajectory", href: "#timeline" },
  { name: "Identity", href: "#about" },
  { name: "Work", href: "#work" },
  { name: "Awards", href: "#achievements" },
  { name: "Contact", href: "#contact" },
  { name: "Blog", href: "https://blog.kazek.qzz.io", external: true },
];

export default function Home() {
  const [skip, setSkip] = useState(false);
  const [ready, setReady] = useState(false);
  const attempts = useRef(0);
  const onDone = useCallback(() => setReady(true), []);

  // Scroll is locked until the prompt shows; two scroll attempts skip the intro straight to it.
  useEffect(() => {
    if (ready) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    const attempt = () => {
      if (++attempts.current >= 2) setSkip(true);
    };
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " "].includes(e.key)) attempt();
    };
    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => (touchY = e.touches[0].clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (touchY - e.touches[0].clientY > 30) {
        touchY = e.touches[0].clientY;
        attempt();
      }
    };
    const onWheel = (e: WheelEvent) => e.deltaY > 0 && attempt();
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      root.style.overflow = "";
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [ready]);

  return (
    <>
      <main className="relative h-screen min-h-[560px] w-full snap-start overflow-hidden bg-black text-white">
        <TopoCanvas />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.55)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

        <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-6 py-6 md:px-12">
          <div className="flex items-center gap-3 text-sm">
            <span className="font-bold tracking-tight">M/D</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/60">Portfolio &amp; Telemetry</span>
          </div>
          <nav className="hidden gap-8 text-xs md:flex">
            {navItems.map((item, i) => (
              <a
                key={item.name}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="group flex items-center gap-1.5 text-white/80 transition hover:text-white"
              >
                <span className="text-[9px] text-white/35">0{i + 1}</span>
                {item.name}
                {item.external && <span className="text-[9px] text-[#ff2e63]">↗</span>}
              </a>
            ))}
          </nav>
        </header>

        <section className="absolute bottom-0 left-0 z-10 w-full px-6 pb-10 md:px-12 md:pb-14">
          {/* fixed height so the paragraph below doesn't jump as phrases change */}
          <div className="flex min-h-[8.5rem] items-end md:min-h-[12rem]">
            <GlitchHeadline skip={skip} onDone={onDone} />
          </div>
          <div className="mt-8 flex items-end justify-between gap-6">
            <p className="max-w-sm text-xs leading-relaxed text-white/60 md:text-sm">
              Undergraduate Artificial Intelligence Engineer at Institut Teknologi Sepuluh Nopember (ITS), specializing in deep learning sequence modeling, practical penetration testing, and high-performance system architectures.
            </p>
            <a
              href="#work"
              className="hidden whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80 hover:text-white sm:block"
            >
              Explore Selected Work <span className="text-[#ff2e63]">▶</span>
            </a>
          </div>
        </section>

        <button
          onClick={() => document.getElementById("live")?.scrollIntoView({ behavior: "smooth" })}
          disabled={!ready}
          aria-hidden={!ready}
          className={`absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 transition-opacity duration-700 ${ready ? "opacity-100" : "pointer-events-none opacity-0"}`}
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/80">Scroll to Continue</span>
          <svg width="12" height="8" viewBox="0 0 12 8" className="animate-bounce" aria-hidden>
            <path d="M0 0h12L6 8z" fill="#fff" />
          </svg>
        </button>
      </main>

      <Presence />
      <Timeline />
      <About />
      <SelectedWork />
      <Achievements />
      <Contact />
    </>
  );
}
