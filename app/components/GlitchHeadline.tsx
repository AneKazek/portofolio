"use client";

import { useEffect, useState } from "react";

type Seg = [text: string, cls?: string];
type Line = { segs: Seg[]; size?: string };

interface Phrase {
  lines: Line[];
  baseSize: string;
}

const PHRASES: Phrase[] = [
  {
    lines: [
      {
        segs: [
          ["Muhammad "],
          ["Dzaky", "text-[#ff2e63]"],
          [" Haidar"],
          [".", "text-[#ff2e63]"],
        ],
      },
    ],
    baseSize: "text-[clamp(1.8rem,4.5vw,3.6rem)]",
  },
  {
    lines: [
      { segs: [["AI Engineering"]] },
      { segs: [["Student @ ITS"]], size: "text-[0.72em] text-white/80 font-normal mt-1" },
    ],
    baseSize: "text-[clamp(1.6rem,3.8vw,3rem)]",
  },
  {
    lines: [
      {
        segs: [
          ["AI & Flutter Developer | Cybersecurity and Web3 Enthusiast | Award-Winning Tech Innovator"],
        ],
      },
    ],
    baseSize: "text-[clamp(1.1rem,2.2vw,1.8rem)]",
  },
];

const GLYPHS = "!<>-_\\/[]{}=+*^?#01";
const TICK = 40; // ms
const STAGGER = 2; // ticks between letters
const SCRAMBLE = 8; // ticks a letter stays glitched before settling
const HOLD = 75; // ticks the finished phrase stays
const OUT = 10; // ticks of glitch-out at the end

export default function GlitchHeadline({ skip, onDone }: { skip: boolean; onDone: () => void }) {
  const last = PHRASES.length - 1;
  const [p, setP] = useState(0);
  const [tick, setTick] = useState(0);
  const [noise, setNoise] = useState("");

  useEffect(() => {
    const id = setInterval(() => {
      setNoise(Array.from({ length: 120 }, () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]).join(""));
      setTick((t) => t + 1);
    }, TICK);
    return () => clearInterval(id);
  }, []);

  const phrase = PHRASES[p];

  // Flatten chars across lines to keep sequential glitch timing
  let globalIndex = 0;
  const linesWithChars = phrase.lines.map((line) => {
    const chars = line.segs.flatMap(([text, cls]) =>
      [...text].map((ch) => ({ ch, cls, i: globalIndex++ }))
    );

    // Group chars into words
    const words: { ch: string; cls?: string; i: number }[][] = [[]];
    chars.forEach((c) => {
      if (c.ch === " ") words.push([]);
      else words[words.length - 1].push(c);
    });

    return { ...line, words, totalChars: chars.length };
  });

  const totalChars = globalIndex;
  const end = totalChars * STAGGER + SCRAMBLE + HOLD;

  // Notify parent once first full cycle reaches or skip is triggered
  useEffect(() => {
    if (skip || (p === last && tick > totalChars * STAGGER + SCRAMBLE + 10)) {
      onDone();
    }
  }, [skip, p, last, tick, totalChars, onDone]);

  // Seamlessly loop through phrases continuously without freezing
  useEffect(() => {
    if (tick > end) {
      setP((v) => (v + 1) % PHRASES.length);
      setTick(0);
    }
  }, [tick, end]);

  return (
    <h1
      className={`${phrase.baseSize} max-w-[28ch] font-semibold leading-[1.12] tracking-tight md:max-w-[36ch]`}
    >
      {linesWithChars.map((line, li) => (
        <div key={`${p}-line-${li}`} className={line.size || ""}>
          {line.words.map((word, wi) => (
            <span key={`${p}-${li}-${wi}`} aria-hidden className="inline-block whitespace-nowrap">
              {word.map(({ ch, cls, i }) => {
                const age = tick - i * STAGGER;
                const out = tick > end - OUT;
                const glitching = age >= 0 && (age < SCRAMBLE || out);
                return (
                  <span
                    key={i}
                    className={`glitch-char ${glitching ? "text-white/70" : (cls ?? "")}`}
                    style={{ animationDelay: `${i * STAGGER * TICK}ms`, opacity: age < 0 ? 0 : undefined }}
                  >
                    {glitching ? (noise[(i * 7 + tick) % noise.length] ?? ch) : ch}
                  </span>
                );
              })}
              {wi < line.words.length - 1 && "\u00a0"}
            </span>
          ))}
        </div>
      ))}
    </h1>
  );
}
