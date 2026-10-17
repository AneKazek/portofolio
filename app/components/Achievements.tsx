"use client";

import Image from "next/image";

interface AchievementItem {
  id: string;
  rank: string;
  title: string;
  institution: string;
  year: string;
  description: string;
  image: string;
  colSpan?: string; // grid span for bento layout
}

const ACHIEVEMENTS: AchievementItem[] = [
  {
    id: "unity-14",
    rank: "2ND PLACE",
    title: "Data Mining Competition UNITY#14",
    institution: "YOGYAKARTA STATE UNIVERSITY",
    year: "2026",
    description:
      "Developed a Siamese self-supervised learning model for post-disaster damage segmentation, achieving a 6% average improvement over the xBD paper baseline.",
    image: "/images/unity.webp",
    colSpan: "lg:col-span-7",
  },
  {
    id: "dinacom-11",
    rank: "3RD PLACE",
    title: "Hackathon DINACOM 11.0",
    institution: "DIAN NUSWANTORO UNIVERSITY",
    year: "2026",
    description:
      "Built a ResNet-based road damage classifier with 97% accuracy and a Graph Neural Network to prioritize road maintenance.",
    image: "/images/dinacom.webp",
    colSpan: "lg:col-span-5",
  },
  {
    id: "gcw-2",
    rank: "3RD PLACE",
    title: "Gunadarma Code Week 2.0",
    institution: "GUNADARMA UNIVERSITY",
    year: "2026",
    description:
      "Integrated a low-latency Retrieval-Augmented Generation pipeline into a mobile application for customer-worker peer-to-peer support.",
    image: "/images/gcw.webp",
    colSpan: "lg:col-span-4",
  },
  {
    id: "bdc-uinic",
    rank: "FINALIST",
    title: "Big Data Challenge Statistic Explore",
    institution: "UNIVERSITAS SYIAH KUALA",
    year: "2025",
    description:
      "Ranked third in the qualifier stage with a 0.421838 private Macro-F1 score by addressing severe missing data and class imbalance.",
    image: "/images/uinic.webp",
    colSpan: "lg:col-span-4",
  },
  {
    id: "kcvanguard",
    rank: "BEST PROJECT",
    title: "KCVanguard Implementation Project",
    institution: "INTELLIGENT COMPUTING AND VISION LABORATORY",
    year: "2026",
    description:
      "Received the Best Implementation Project recognition for Garden Bunga, an efficient Indonesian speech synthesis system using multilingual knowledge transfer.",
    image: "/images/kcvanguard26.webp",
    colSpan: "lg:col-span-4",
  },
];

export default function Achievements() {
  return (
    <section
      id="achievements"
      className="relative w-full min-h-screen bg-black text-white py-16 md:py-24 px-6 md:px-12 border-t border-white/[0.08]"
    >
      {/* Background Matrix & Subtle Gradient Mesh */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#ff2e63]/[0.02] rounded-full blur-[140px]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        {/* Section Header */}
        <header className="mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] tracking-[0.25em] text-[#ff2e63] uppercase">
                05 / Achievements
              </span>
              <span className="text-[10px] text-white/30">•</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                Podiums &amp; Distinctions
              </span>
            </div>
            <h2 className="mt-3 text-2xl font-light tracking-tight text-white md:text-4xl">
              Competitive <span className="font-semibold text-white">Recognition</span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-xs text-white/70 backdrop-blur-sm">
              <span className="text-[#ff2e63] font-bold">5</span> Verified Podiums
            </div>
          </div>
        </header>

        {/* Bento Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
          {ACHIEVEMENTS.map((item) => (
            <div
              key={item.id}
              className={`group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.015] p-5 md:p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:bg-white/[0.03] flex flex-col justify-between ${
                item.colSpan || "lg:col-span-6"
              }`}
            >
              {/* Default State: Thumbnail preview */}
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-white/10 bg-black/60 mb-5">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover object-center filter grayscale contrast-105 brightness-95 transition-all duration-500 ease-out group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />

                {/* Rank Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="rounded-full border border-white/20 bg-black/80 px-3 py-1 font-mono text-[9.5px] font-bold uppercase tracking-widest text-white shadow-lg backdrop-blur-md">
                    {item.rank}
                  </span>
                </div>
              </div>

              {/* Default Text Info (No clipping, natural height) */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base md:text-lg font-bold tracking-tight text-white group-hover:text-white/95">
                    {item.title}
                  </h3>

                  <div className="mt-1.5 flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-wider text-white/45">
                    <span>{item.institution}</span>
                    <span>•</span>
                    <span className="text-white/70">{item.year}</span>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-white/60">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-white/35">
                  <span className="tracking-wider">HOVER TO EXPAND VIEW</span>
                  <span className="text-[#ff2e63] transition-transform duration-300 group-hover:translate-x-1">
                    ↗
                  </span>
                </div>
              </div>

              {/* FULL-COVER HOVER POP-UP OVERLAY (Menutupi seluruh area kartu) */}
              <div className="pointer-events-none absolute inset-0 z-30 flex flex-col justify-end overflow-hidden rounded-2xl bg-black/95 opacity-0 transition-all duration-300 ease-out group-hover:opacity-100">
                {/* Background Full Photo */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-center filter brightness-50 contrast-110 saturate-125 transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Dark gradient mask ensuring all text is perfectly legible */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/40" />
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:20px_20px]" />
                </div>

                {/* Pop-up Content Container */}
                <div className="relative z-10 flex flex-col justify-between h-full p-6 translate-y-3 transition-transform duration-300 ease-out group-hover:translate-y-0">
                  {/* Top Bar inside Pop-up */}
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-[#ff2e63]/40 bg-[#ff2e63]/15 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[#ff2e63] shadow-lg backdrop-blur-md">
                      {item.rank}
                    </span>
                    <span className="font-mono text-[10px] tracking-wider text-white/50">
                      {item.year}
                    </span>
                  </div>

                  {/* Bottom Expanded Info */}
                  <div className="space-y-3 mt-auto">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-white/50">
                        {item.institution}
                      </span>
                      <h4 className="mt-1 text-lg font-bold tracking-tight text-white leading-snug">
                        {item.title}
                      </h4>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/60 p-3.5 backdrop-blur-md">
                      <p className="text-xs leading-relaxed text-white/85">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1 font-mono text-[9.5px] text-white/40">
                      <span>VERIFIED COMPETITION RECORD</span>
                      <span className="text-[#ff2e63]">● ACTIVE</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
