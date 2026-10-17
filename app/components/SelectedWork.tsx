"use client";

import Image from "next/image";

interface Project {
  stage: string;
  category: string;
  score?: string;
  title: string;
  description: string;
  year: string;
  client: string;
  link: string;
  image: string;
  tags: string[];
}

const PROJECTS: Project[] = [
  {
    stage: "STAGE 01",
    category: "Best Implementation",
    title: "GARDEN BUNGA",
    description:
      "An efficient hybrid sequence modeling system for Indonesian speech synthesis using multilingual knowledge transfer.",
    year: "2025",
    client: "Laboratory of Intelligent Computing and Vision",
    link: "https://masterzaff.github.io/gardenbunga/",
    image: "/images/GardenBunga.webp",
    tags: ["Speech Synthesis", "Hybrid Sequence", "Multilingual Transfer", "PyTorch"],
  },
  {
    stage: "STAGE 02",
    category: "COMPUTER VISION",
    score: "Third Place",
    title: "SiLaju - Sistem Pelaporan Jalan Umum",
    description:
      "A ResNet-based road damage classification system combined with a Graph Neural Network to prioritize efficient road maintenance.",
    year: "2026",
    client: "DINACOM 11.0",
    link: "https://github.com/orgs/SILAJU-Hackathon/repositories",
    image: "/images/SiLaju.webp",
    tags: ["Computer Vision", "ResNet", "Graph Neural Network", "Road Maintenance"],
  },
  {
    stage: "STAGE 03",
    category: "DISASTER AI",
    score: "Second Place",
    title: "POST-DISASTER SEGMENTATION",
    description:
      "A Siamese self-supervised learning model for segmenting damaged areas after disasters, evaluated against the xBD paper baseline.",
    year: "2026",
    client: "Unity #14",
    link: "https://github.com/alfiwillianz/buildings/tree/main",
    image: "/images/DisasterSegmentation.webp",
    tags: ["Disaster AI", "Siamese Network", "Self-Supervised", "xBD Dataset"],
  },
  {
    stage: "STAGE 04",
    category: "GENERATIVE AI",
    score: "Third Place",
    title: "SiTukang - Sistem Pemesanan Tukang",
    description:
      "A low-latency Retrieval-Augmented Generation pipeline integrated into a mobile application to support customer-worker peer-to-peer interactions.",
    year: "2026",
    client: "GUNADARMA CODE WEEK 2.0",
    link: "https://github.com/orgs/UCGW-Hackathon/repositories",
    image: "/images/SiTukang.webp",
    tags: ["Generative AI", "RAG Pipeline", "Mobile Systems", "P2P Architecture"],
  },
];

export default function SelectedWork() {
  return (
    <section
      id="work"
      className="relative w-full min-h-screen bg-black text-white py-16 md:py-24 px-6 md:px-12 border-t border-white/[0.08]"
    >
      {/* Subtle minimalist background matrix & glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="pointer-events-none absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#ff2e63]/[0.02] rounded-full blur-[120px]" />
      <div className="pointer-events-none absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[120px]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        {/* Section Header: Uniform with Hero, Timeline & About */}
        <header className="mb-14 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] tracking-[0.25em] text-[#ff2e63] uppercase">
                04 / Selected Work
              </span>
              <span className="text-[10px] text-white/30">•</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                Engineering &amp; Research Case Studies
              </span>
            </div>
            <h2 className="mt-3 text-2xl font-light tracking-tight text-white md:text-4xl">
              Engineered <span className="font-semibold text-white">Breakthroughs</span>
            </h2>
          </div>

          <p className="max-w-md text-xs text-white/50 leading-relaxed font-mono">
            Highlighted machine learning systems, computer vision models, and applied AI pipelines
            recognized in national competitions and research labs.
          </p>
        </header>

        {/* Project Showcase List */}
        <div className="flex flex-col gap-12 md:gap-20">
          {PROJECTS.map((proj, idx) => (
            <article
              key={proj.stage}
              className="group relative rounded-2xl border border-white/[0.08] bg-white/[0.015] p-5 md:p-8 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/[0.03]"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Content Side (5 cols) */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                  {/* Stage and Badges */}
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] font-bold tracking-widest text-white/90">
                        {proj.stage}
                      </span>
                      <span className="text-white/25">•</span>
                      <span className="font-mono text-[10.5px] uppercase tracking-wider text-white/70">
                        {proj.category}
                      </span>
                      {proj.score && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-[#ff2e63]/30 bg-[#ff2e63]/10 px-2.5 py-0.5 font-mono text-[9.5px] font-semibold uppercase tracking-wider text-[#ff2e63]">
                          SCORE: {proj.score}
                        </span>
                      )}
                    </div>

                    {/* Project Title */}
                    <h3 className="mt-3 text-xl md:text-2xl font-bold tracking-tight text-white group-hover:text-white/95">
                      {proj.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-3 text-xs md:text-sm leading-relaxed text-white/60">
                      {proj.description}
                    </p>
                  </div>

                  {/* Metadata and Link */}
                  <div className="pt-4 border-t border-white/[0.06] space-y-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-[9.5px] uppercase tracking-widest text-white/35">
                        Year / Client
                      </span>
                      <span className="font-mono text-xs text-white/80">
                        {proj.year} <span className="text-white/30">•</span> {proj.client}
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proj.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded border border-white/5 bg-white/[0.02] px-2 py-0.5 font-mono text-[9.5px] text-white/40"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* CTA Link */}
                    <div className="pt-2">
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.05] px-4 py-2 font-mono text-xs font-medium text-white transition-all duration-200 hover:border-white/40 hover:bg-white/10 group-hover:border-[#ff2e63]/40"
                      >
                        <span>View case</span>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-[#ff2e63] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Media Side (7 cols) */}
                <div className="lg:col-span-7">
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block aspect-[16/10] w-full overflow-hidden rounded-xl border border-white/10 bg-black/40 shadow-2xl group/img"
                  >
                    <Image
                      src={proj.image}
                      alt={proj.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="object-cover object-center filter grayscale contrast-110 brightness-90 transition-all duration-500 ease-out group-hover/img:scale-[1.02] group-hover/img:filter-none"
                      priority={idx === 0}
                    />

                    {/* Subtle inner vignette */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Hover indicator banner */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/70 px-3 py-1 backdrop-blur-md opacity-80 group-hover/img:opacity-100 transition">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-white/80">
                        Open External Case
                      </span>
                      <span className="text-[#ff2e63] text-xs">↗</span>
                    </div>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* More Projects Button in bottom center */}
        <div className="mt-16 flex justify-center">
          <a
            href="https://project.kazek.qzz.io"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/[0.04] px-7 py-3.5 font-mono text-xs font-semibold uppercase tracking-widest text-white transition-all duration-300 hover:border-white/50 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(255,46,99,0.25)]"
          >
            <span>More Project</span>
            <span className="text-[#ff2e63] transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
