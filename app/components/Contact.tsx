"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface GitHubStats {
  publicRepos: number;
  followers: number;
  totalContributions: number;
  contributions2025: number;
  contributions2026: number;
  avatarUrl: string;
}

export default function Contact() {
  const [stats, setStats] = useState<GitHubStats>({
    publicRepos: 37,
    followers: 22,
    totalContributions: 553,
    contributions2025: 384,
    contributions2026: 160,
    avatarUrl: "https://avatars.githubusercontent.com/u/136723608?v=4",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGitHubData() {
      try {
        const [userRes, contribRes] = await Promise.allSettled([
          fetch("https://api.github.com/users/AneKazek"),
          fetch("https://github-contributions-api.jogruber.de/v4/AneKazek"),
        ]);

        let repos = 37;
        let followers = 22;
        let avatar = "https://avatars.githubusercontent.com/u/136723608?v=4";
        let total = 553;
        let c25 = 384;
        let c26 = 160;

        if (userRes.status === "fulfilled" && userRes.value.ok) {
          const userData = await userRes.value.json();
          repos = userData.public_repos ?? repos;
          followers = userData.followers ?? followers;
          avatar = userData.avatar_url ?? avatar;
        }

        if (contribRes.status === "fulfilled" && contribRes.value.ok) {
          const contribData = await contribRes.value.json();
          if (contribData?.total) {
            c25 = contribData.total["2025"] ?? c25;
            c26 = contribData.total["2026"] ?? c26;
            total = Object.values(contribData.total as Record<string, number>).reduce(
              (acc, v) => acc + (typeof v === "number" ? v : 0),
              0
            );
          }
        }

        setStats({
          publicRepos: repos,
          followers: followers,
          totalContributions: total,
          contributions2025: c25,
          contributions2026: c26,
          avatarUrl: avatar,
        });
      } catch (err) {
        console.warn("Using cached GitHub metrics:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchGitHubData();
  }, []);

  return (
    <section
      id="contact"
      className="relative w-full min-h-screen bg-black text-white py-16 md:py-24 px-6 md:px-12 border-t border-white/[0.08] flex flex-col justify-between"
    >
      {/* Background Matrix & Subtle Gradient Mesh */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="pointer-events-none absolute bottom-1/3 right-1/4 w-[600px] h-[400px] bg-[#ff2e63]/[0.02] rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute top-1/4 left-1/4 w-[500px] h-[300px] bg-white/[0.02] rounded-full blur-[120px]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        {/* Section Header */}
        <header className="mb-14 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] tracking-[0.25em] text-[#ff2e63] uppercase">
                06 / Contact &amp; Connect
              </span>
              <span className="text-[10px] text-white/30">•</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                Get In Touch
              </span>
            </div>
            <h2 className="mt-3 text-2xl font-light tracking-tight text-white md:text-4xl">
              Let&apos;s Build <span className="font-semibold text-white">Something Impactful</span>
            </h2>
          </div>

          <p className="max-w-md text-xs text-white/50 leading-relaxed font-mono">
            Open for collaborations in AI Engineering, Penetration Testing, Systems Architecture, and applied research initiatives.
          </p>
        </header>

        {/* Main Grid: GitHub Realtime Telemetry + Direct Contact Channels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: GitHub Live Real-Time Activity Card (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl border border-white/[0.08] bg-white/[0.015] p-6 md:p-8 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-5">
              <div className="flex items-center gap-3">
                <div className="relative h-11 w-11 overflow-hidden rounded-full border border-white/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={stats.avatarUrl}
                    alt="Dzaky GitHub Avatar"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-white">AneKazek</span>
                    <span className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-mono text-emerald-400">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                      Live Feed
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-white/45">
                    github.com/AneKazek
                  </span>
                </div>
              </div>

              <a
                href="https://github.com/AneKazek"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-xs text-white transition hover:border-white/30 hover:bg-white/10"
              >
                <span>View Profile</span>
                <span className="text-[#ff2e63]">↗</span>
              </a>
            </div>

            {/* Metrics Counters Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-6">
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                  Total Repos
                </span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="font-mono text-2xl md:text-3xl font-bold text-white">
                    {stats.publicRepos}
                  </span>
                  <span className="font-mono text-xs text-[#ff2e63] font-semibold">Public</span>
                </div>
                <span className="mt-1 block font-mono text-[9px] text-white/30">Active repositories</span>
              </div>

              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                  Total Contributions
                </span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="font-mono text-2xl md:text-3xl font-bold text-white">
                    {stats.totalContributions.toLocaleString()}
                  </span>
                  <span className="font-mono text-xs text-emerald-400 font-semibold">+</span>
                </div>
                <span className="mt-1 block font-mono text-[9px] text-white/30">Commits &amp; PRs tracked</span>
              </div>

              <div className="col-span-2 sm:col-span-1 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                  Current Velocity
                </span>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="font-mono text-2xl md:text-3xl font-bold text-white">
                    {stats.contributions2026}
                  </span>
                  <span className="font-mono text-xs text-white/50">in 2026</span>
                </div>
                <span className="mt-1 block font-mono text-[9px] text-white/30">{stats.contributions2025} contributions in 2025</span>
              </div>
            </div>

            {/* Telemetry Indicator Status */}
            <div className="rounded-xl border border-white/[0.06] bg-black/40 p-3.5 flex items-center justify-between text-xs font-mono text-white/50">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>API Status: Connected &amp; Synced</span>
              </div>
              <span className="text-[10px] text-white/35">Updated realtime</span>
            </div>
          </div>

          {/* RIGHT: Direct Outreach & Official Channels (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* LinkedIn Card */}
            <a
              href="https://www.linkedin.com/in/zakiyhdr/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.015] p-6 backdrop-blur-sm transition-all duration-300 hover:border-[#38bdf8]/40 hover:bg-white/[0.04]"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white group-hover:border-[#38bdf8]/50 group-hover:text-[#38bdf8] transition">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.65 1.65 0 1 0 0 3.3 1.65 1.65 0 0 0 0-3.3Z" />
                  </svg>
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                    Professional Network
                  </span>
                  <h3 className="text-base font-bold text-white group-hover:text-[#38bdf8] transition">
                    LinkedIn
                  </h3>
                  <p className="font-mono text-xs text-white/50">
                    linkedin.com/in/zakiyhdr
                  </p>
                </div>
              </div>

              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-white/60 transition-all duration-200 group-hover:border-[#38bdf8]/40 group-hover:bg-[#38bdf8]/10 group-hover:text-white">
                ↗
              </div>
            </a>

            {/* GitHub Card */}
            <a
              href="https://github.com/AneKazek"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.015] p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:bg-white/[0.04]"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white group-hover:border-white/30 transition">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z"
                    />
                  </svg>
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                    Source Code &amp; Repos
                  </span>
                  <h3 className="text-base font-bold text-white group-hover:text-[#ff2e63] transition">
                    GitHub Profile
                  </h3>
                  <p className="font-mono text-xs text-white/50">
                    github.com/AneKazek
                  </p>
                </div>
              </div>

              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-white/60 transition-all duration-200 group-hover:border-[#ff2e63]/40 group-hover:bg-[#ff2e63]/10 group-hover:text-white">
                ↗
              </div>
            </a>

            {/* Email Direct Contact */}
            <a
              href="mailto:kazekiye@wearehackerone"
              className="group relative flex items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.015] p-6 backdrop-blur-sm transition-all duration-300 hover:border-[#ff2e63]/40 hover:bg-white/[0.04]"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white group-hover:border-[#ff2e63]/50 group-hover:text-[#ff2e63] transition">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                    Direct Inquiries
                  </span>
                  <h3 className="text-base font-bold text-white group-hover:text-[#ff2e63] transition">
                    Email Dzaky
                  </h3>
                  <p className="font-mono text-xs text-white/50">
                    kazekiye@wearehackerone.com
                  </p>
                </div>
              </div>

              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-white/60 transition-all duration-200 group-hover:border-[#ff2e63]/40 group-hover:bg-[#ff2e63]/10 group-hover:text-white">
                ✉
              </div>
            </a>
          </div>
        </div>

        {/* Global Footer */}
        <footer className="mt-24 pt-8 border-t border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-white/40">
          <div>
            <span>© 2026 MUHAMMAD DZAKY HAIDAR</span>
            <span className="mx-2">•</span>
            <span>AI Systems &amp; Security Engineering</span>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-1.5 text-white/60 hover:text-white transition"
          >
            <span>Back to Top</span>
            <span>↑</span>
          </button>
        </footer>
      </div>
    </section>
  );
}
