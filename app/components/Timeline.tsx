"use client";

import { useEffect, useRef, useState } from "react";
import { timeline } from "../data/timeline";

const N = timeline.length;
const ys = timeline.map((_, i) => ((i + 0.5) / N) * 100); // node positions in %
const BRANCH_EXT = 12; // horizontal extension of neural synapse branch in %

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default function Timeline() {
  const section = useRef<HTMLElement>(null);
  const tree = useRef<HTMLDivElement>(null);
  const coreLine = useRef<SVGRectElement>(null);
  const branches = useRef<(SVGRectElement | null)[]>([]);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const nodes = useRef<(HTMLDivElement | null)[]>([]);
  const geo = useRef({ px: [] as number[], side: [] as number[], reach: BRANCH_EXT });
  const doneRef = useRef(false);
  const [done, setDone] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const q = window.matchMedia("(max-width: 767px)");
    const f = () => setMobile(q.matches);
    f();
    q.addEventListener("change", f);
    return () => q.removeEventListener("change", f);
  }, []);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const tr = tree.current;
      if (!tr) return;
      const vh = window.innerHeight;
      const r = tr.getBoundingClientRect();

      // Progress based on tree scroll through viewport - tuned for tighter spacing
      const t = clamp((vh * 0.85 - r.top) / r.height);
      coreLine.current?.setAttribute("height", String(t * 105));

      ys.forEach((y, i) => {
        const rv = clamp(((t - (y - 2) / 100) * r.height) / (vh * 0.18));
        const { px, side: sides, reach } = geo.current;
        const side = sides[i] ?? 1;
        const w = reach * rv;
        const br = branches.current[i];
        if (br) {
          br.setAttribute("x", String(side === 1 ? px[i] : px[i] - w));
          br.setAttribute("width", String(w));
        }
        const card = cards.current[i];
        if (card) {
          card.style.opacity = String(rv);
          const dx = window.innerWidth < 768 ? 1 : side;
          card.style.transform = `translate(${dx * (1 - rv) * 25}px, 0%) scale(${0.96 + 0.04 * rv})`;
        }
        const node = nodes.current[i];
        if (node) {
          node.style.opacity = String(rv);
          node.style.transform = `translate(-50%, -50%) scale(${rv})`;
        }
      });

      const fin = t >= 0.95;
      if (fin !== doneRef.current) {
        doneRef.current = fin;
        setDone(fin);
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const tx = mobile ? 8 : 50;
  const wob = mobile ? 0 : 1.2;
  const reach = mobile ? 8 : BRANCH_EXT;
  const px = ys.map((_, i) => tx + (i % 2 ? -wob : wob));
  const sideOf = (i: number) => (mobile ? 1 : i % 2 === 0 ? 1 : -1);
  const endX = (i: number) => px[i] + sideOf(i) * reach;

  // Modern organic neural synapse curve
  const pts: [number, number][] = [[tx, 0], ...ys.map((y, i) => [px[i], y] as [number, number]), [tx, 100]];
  const trunkD =
    `M${pts[0][0]} ${pts[0][1]} ` +
    pts
      .slice(1)
      .map(([x, y], i) => {
        const [, py] = pts[i];
        const my = (py + y) / 2;
        return `C${pts[i][0]} ${my} ${x} ${my} ${x} ${y}`;
      })
      .join(" ");

  const branchD = (i: number) => {
    const s = sideOf(i), x = px[i], y = ys[i];
    return `M${x} ${y} L${x + s * reach} ${y}`;
  };

  geo.current = { px, side: ys.map((_, i) => sideOf(i)), reach };

  return (
    <section
      ref={section}
      id="timeline"
      className="relative w-full snap-start overflow-hidden bg-black text-white"
    >
      {/* Background Video strictly confined within the Timeline section */}
      <div className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover opacity-50 blur-[1px] brightness-[0.7] saturate-[0.85]"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260813_092641_de52eb87-daf2-41db-92cb-7a56eae012a5.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Cinematic Vignette + Glassmorphism backdrop filter overlay strictly in Timeline */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-black/45 backdrop-blur-[6px]" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.85)_80%,#000000_100%)]" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:28px_28px]" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
        {/* Minimalist header in top right */}
        <header className="flex flex-col items-end justify-start pt-10 pb-6 text-right md:pt-14 md:pb-8">
          <span className="font-mono text-[11px] uppercase tracking-widest text-white/50">
            02 / Trajectory
          </span>

          <h2 className="mt-2 text-2xl font-light tracking-tight text-white md:text-3xl">
            Career &amp; <span className="font-semibold text-white">Technical Journey</span>
          </h2>

          <div className="mt-2.5 flex items-center gap-2 font-mono text-[10px] tracking-wider text-white/40">
            <span>SCROLL TO TRACE</span>
            <span className="animate-bounce text-[#ff2e63]">↓</span>
          </div>
        </header>

        {/* Neural Network / Synaptic Circuit Timeline Tree - Tighter spacing */}
        <div ref={tree} className="relative" style={{ height: `${N * 48}vh` }}>
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="cyber-gradient" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ff2e63" />
                <stop offset="45%" stopColor="#7c5cff" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>

              <clipPath id="cyber-trunk-clip">
                <rect ref={coreLine} x="-15" y="0" width="130" height="0" />
              </clipPath>

              {ys.map((_, i) => (
                <clipPath key={i} id={`cyber-branch-clip-${i}`}>
                  <rect
                    ref={(el) => void (branches.current[i] = el)}
                    x={px[i]}
                    y="0"
                    width="0"
                    height="100"
                  />
                </clipPath>
              ))}
            </defs>

            {/* Background faint guide circuit - trunk */}
            <path
              d={trunkD}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={2}
              strokeDasharray="4 4"
              vectorEffect="non-scaling-stroke"
            />

            {/* Background faint guide circuit - branches */}
            {ys.map((_, i) => (
              <path
                key={`guide-${i}`}
                d={branchD(i)}
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth={1.5}
                strokeDasharray="3 3"
                vectorEffect="non-scaling-stroke"
              />
            ))}

            {/* Glowing active neural data stream */}
            <path
              d={trunkD}
              clipPath="url(#cyber-trunk-clip)"
              fill="none"
              stroke="url(#cyber-gradient)"
              strokeWidth={3}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={{ filter: "drop-shadow(0 0 8px rgba(255,46,99,0.7))" }}
            />

            {/* Glowing active branch connectors */}
            {ys.map((_, i) => (
              <path
                key={i}
                d={branchD(i)}
                clipPath={`url(#cyber-branch-clip-${i})`}
                fill="none"
                stroke="url(#cyber-gradient)"
                strokeWidth={2.5}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                style={{ filter: "drop-shadow(0 0 6px rgba(124,92,255,0.7))" }}
              />
            ))}
          </svg>

          {timeline.map((it, i) => {
            const right = sideOf(i) === 1;
            const isAwards = it.category === "Awards";
            return (
              <div key={it.org + it.when}>
                {/* Glowing Synapse Terminal Node - HTML Layer with exact center */}
                <div
                  ref={(el) => void (nodes.current[i] = el)}
                  className="pointer-events-none absolute z-20 h-4 w-4 rounded-full bg-black ring-2 ring-[#ff2e63] shadow-[0_0_15px_#ff2e63]"
                  style={{
                    left: `${endX(i)}%`,
                    top: `${ys[i]}%`,
                    opacity: 0,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <span className="absolute inset-0 m-auto h-1.5 w-1.5 rounded-full bg-white" />
                </div>

                {/* Modern Glassmorphic Tech Card */}
                <div
                  ref={(el) => void (cards.current[i] = el)}
                  className={`group absolute rounded-2xl border p-5 shadow-2xl backdrop-blur-xl transition-all duration-300 will-change-transform ${
                    isAwards
                      ? "border-[#ff2e63]/40 bg-gradient-to-br from-[#ff2e63]/10 via-[#0d1017]/80 to-black/90 shadow-[0_0_35px_rgba(255,46,99,0.15)]"
                      : "border-white/10 bg-[#07090e]/75 hover:border-white/20 hover:bg-[#0c0f17]/85"
                  }`}
                  style={{
                    top: `calc(${ys[i]}% + 12px)`,
                    opacity: 0,
                    ...(mobile
                      ? { left: `${endX(i) + 4}%`, width: `${96 - endX(i) - 4}%` }
                      : right
                        ? { left: `${endX(i) + 2}%`, width: "38%" }
                        : { right: `${100 - endX(i) + 2}%`, width: "38%" }),
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] tracking-widest text-[#ff2e63] uppercase">
                      {it.when}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[9px] font-mono tracking-wider text-white/50 uppercase">
                      {it.category}
                    </span>
                  </div>

                  <h3 className="mt-2 text-base font-medium tracking-tight text-white group-hover:text-white md:text-lg">
                    {it.role}
                  </h3>

                  <p className="mt-0.5 font-mono text-xs text-white/50">{it.org}</p>

                  <p className="mt-2.5 text-xs font-light leading-relaxed text-white/65 md:text-[13px]">
                    {it.desc}
                  </p>

                  {/* Skills & Tech tags */}
                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    {it.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-white/5 bg-white/[0.03] px-2 py-0.5 font-mono text-[9px] text-white/50"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Outro & Scroll to Continue - positioned tightly after the final node */}
        <div className="mt-14 flex items-center justify-center pb-16">
          <button
            onClick={() => (document.getElementById("about") || document.getElementById("next"))?.scrollIntoView({ behavior: "smooth" })}
            className={`flex flex-col items-center gap-2 text-white/70 transition-all duration-500 hover:text-white ${
              done ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-2"
            }`}
          >
            <span className="text-[10px] uppercase tracking-[0.3em]">Scroll to Continue</span>
            <svg width="12" height="8" viewBox="0 0 12 8" className="animate-bounce" aria-hidden>
              <path d="M0 0h12L6 8z" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
