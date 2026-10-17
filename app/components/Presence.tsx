"use client";

import { useAction, useMutation, useQuery } from "convex/react";
import { useEffect, useRef, useState } from "react";
import { createWalletClient, custom, type EIP1193Provider } from "viem";
import { mainnet } from "viem/chains";
import { api } from "../../convex/_generated/api";

const EMOJIS = ["🔥", "🚀", "❤️"];
const short = (a: string) => `${a.slice(0, 5)}...${a.slice(-3)}`;

type Pop = { id: string; emoji: string; x: number; y: number };

function Zone({ sid }: { sid: string }) {
  const zone = useRef<HTMLElement>(null);
  const pos = useRef({ x: 0.5, y: 0.5 });
  const lastSent = useRef(0);
  const seen = useRef<Set<string> | null>(null);
  // session identity is derived from one random id; guest # and color are stable per tab
  const guest = (parseInt(sid.slice(0, 6), 16) % 900) + 100;
  const hue = parseInt(sid.slice(6, 9), 16) % 360;

  const people = useQuery(api.presence.list) ?? [];
  const reactions = useQuery(api.reactions.recent);
  const messages = useQuery(api.messages.list) ?? [];
  const update = useMutation(api.presence.update);
  const leave = useMutation(api.presence.leave);
  const send = useMutation(api.reactions.send);
  const sendMessage = useMutation(api.messages.send);
  const verify = useAction(api.presence.verifyWallet);

  const [pops, setPops] = useState<Pop[]>([]);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [composing, setComposing] = useState<{ x: number; y: number } | null>(null);
  const [chatInput, setChatInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const push = () => {
    lastSent.current = performance.now();
    update({ sessionId: sid, guest, hue, ...pos.current }).catch(() => {});
  };

  useEffect(() => {
    push();
    const beat = setInterval(push, 5000);
    const bye = () => leave({ sessionId: sid }).catch(() => {});
    window.addEventListener("pagehide", bye);
    return () => {
      clearInterval(beat);
      window.removeEventListener("pagehide", bye);
      bye();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 'C' key listener to open chat at current mouse position
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "c" || e.key === "C") {
        e.preventDefault();
        setComposing({ x: pos.current.x, y: pos.current.y });
        setChatInput("");
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // first snapshot only seeds "seen"; everything after pops on screen
  useEffect(() => {
    if (!reactions) return;
    if (!seen.current) {
      seen.current = new Set(reactions.map((r) => r._id));
      return;
    }
    const fresh = reactions.filter((r) => !seen.current!.has(r._id));
    if (!fresh.length) return;
    fresh.forEach((r) => seen.current!.add(r._id));
    setPops((p) => [...p, ...fresh.map((r) => ({ id: r._id, emoji: r.emoji, x: r.x, y: r.y }))]);
    fresh.forEach((r) => setTimeout(() => setPops((p) => p.filter((q) => q.id !== r._id)), 1800));
  }, [reactions]);

  const norm = (e: React.PointerEvent | React.MouseEvent) => {
    const r = zone.current!.getBoundingClientRect();
    return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
  };

  const flex = async () => {
    const eth = (window as unknown as { ethereum?: EIP1193Provider }).ethereum;
    if (!eth) return setErr("MetaMask not detected");
    setBusy(true);
    setErr("");
    try {
      const wc = createWalletClient({ chain: mainnet, transport: custom(eth) });
      const [address] = await wc.requestAddresses();
      const message = `Verify wallet for portfolio presence\nSession: ${sid}\nIssued: ${Date.now()}`;
      const signature = await wc.signMessage({ account: address, message });
      await verify({ sessionId: sid, address, message, signature });
    } catch (e) {
      setErr(e instanceof Error ? e.message.split("\n")[0].slice(0, 80) : "Verification failed");
    } finally {
      setBusy(false);
    }
  };

  const label = (p: { guest: number; wallet?: string; ens?: string }) => p.ens ?? (p.wallet ? short(p.wallet) : `Guest #${p.guest}`);
  const me = people.find((p) => p.sessionId === sid);

  return (
    <section
      id="live"
      ref={zone}
      onPointerMove={(e) => {
        pos.current = norm(e);
        if (performance.now() - lastSent.current > 60) push();
      }}
      onClick={(e) => {
        const { x, y } = norm(e);
        send({ emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)], x, y }).catch(() => {});
      }}
      onDoubleClick={(e) => {
        const { x, y } = norm(e);
        setComposing({ x, y });
        setChatInput("");
        setTimeout(() => inputRef.current?.focus(), 50);
      }}
      className="relative h-screen min-h-[600px] w-full snap-start overflow-hidden bg-black text-white [background-image:radial-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:24px_24px]"
    >
      {/* Top-left minimalist header & Web3 trigger */}
      <div className="absolute left-6 top-8 z-10 flex max-w-lg flex-col items-start gap-3 md:left-12 md:top-10">
        <div className="flex items-center gap-2 font-mono text-[11px] tracking-wider text-white/50">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span>{people.length} ONLINE</span>
          <span className="text-white/20">/</span>
          <span className="text-white/40">LIVE PRESENCE</span>
        </div>

        <h2 className="text-2xl font-light tracking-tight text-white md:text-3xl">
          Realtime <span className="font-semibold text-white">Cursors</span> &amp; <span className="font-semibold text-[#ff2e63]">Web3</span>
        </h2>

        <p className="text-xs font-light text-white/45">
          Click anywhere to react. Double click or press <kbd className="rounded border border-white/20 bg-white/10 px-1 py-0.5 font-mono text-[10px] text-white/80">C</kbd> to leave a message (lasts 15m).
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-2">
          {!me?.wallet ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                flex();
              }}
              disabled={busy}
              className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.04] px-3.5 py-1.5 text-xs text-white/90 backdrop-blur transition hover:border-[#ff2e63]/60 hover:bg-[#ff2e63]/10 hover:text-white disabled:opacity-50"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="text-[#ff2e63]">
                <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" fill="currentColor"/>
              </svg>
              <span>{busy ? "Signing…" : "Verify with MetaMask"}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="font-mono text-[11px]">{label(me)}</span>
            </div>
          )}
          {err && <span className="text-[11px] font-mono text-[#ff2e63]">{err}</span>}
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          document.getElementById("timeline")?.scrollIntoView({ behavior: "smooth" });
        }}
        className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/60 transition-colors hover:text-white"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll to Continue</span>
        <svg width="12" height="8" viewBox="0 0 12 8" className="animate-bounce" aria-hidden>
          <path d="M0 0h12L6 8z" fill="currentColor" />
        </svg>
      </button>

      {/* Persistent 15-minute chat bubbles */}
      {messages.map((m) => {
        const c = `hsl(${m.hue} 90% 62%)`;
        return (
          <div
            key={m._id}
            className="pointer-events-auto absolute z-20 flex max-w-xs -translate-x-1/2 flex-col gap-1 rounded-2xl border border-white/15 bg-black/75 px-3 py-2 text-xs shadow-2xl backdrop-blur-md transition-all animate-[pop-in_0.25s_cubic-bezier(0.16,1,0.3,1)]"
            style={{
              left: `${m.x * 100}%`,
              top: `${m.y * 100}%`,
              borderColor: `${c}40`,
            }}
          >
            <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-white/50">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: c }} />
              <span style={{ color: c }}>{m.author}</span>
            </div>
            <p className="break-words leading-relaxed text-white/90">{m.text}</p>
          </div>
        );
      })}

      {/* Active composing input bubble */}
      {composing && (
        <div
          className="pointer-events-auto absolute z-30 flex -translate-x-1/2 flex-col gap-1 rounded-2xl border border-[#ff2e63]/60 bg-black/90 p-2 shadow-[0_0_25px_rgba(255,46,99,0.3)] backdrop-blur-lg animate-[pop-in_0.2s_ease-out]"
          style={{
            left: `${composing.x * 100}%`,
            top: `${composing.y * 100}%`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (chatInput.trim()) {
                sendMessage({
                  sessionId: sid,
                  author: me ? label(me) : `Guest #${guest}`,
                  hue,
                  text: chatInput,
                  x: composing.x,
                  y: composing.y,
                }).catch(() => {});
              }
              setComposing(null);
            }}
            className="flex items-center gap-1.5"
          >
            <input
              ref={inputRef}
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Say something... (Enter)"
              maxLength={140}
              className="w-48 bg-transparent px-2 py-1 text-xs text-white placeholder-white/40 outline-none"
              onKeyDown={(e) => {
                if (e.key === "Escape") setComposing(null);
              }}
            />
            <button
              type="submit"
              className="rounded-lg bg-[#ff2e63] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#ff2e63]/90"
            >
              Send
            </button>
            <button
              type="button"
              onClick={() => setComposing(null)}
              className="px-1 text-xs text-white/40 hover:text-white"
            >
              ✕
            </button>
          </form>
          <span className="px-2 text-[9px] text-white/35">Press Enter to send · Esc to cancel</span>
        </div>
      )}

      {people
        .filter((p) => p.sessionId !== sid)
        .map((p) => {
          const c = `hsl(${p.hue} 90% 62%)`;
          const flexed = !!p.wallet;
          return (
            <div
              key={p._id}
              className="pointer-events-none absolute [transition:left_100ms_linear,top_100ms_linear]"
              style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%` }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" style={{ filter: flexed ? `drop-shadow(0 0 8px ${c})` : undefined }}>
                <path d="M1 1l6 15 2.2-6.2L16 8z" fill={c} stroke="#000" strokeWidth="1" />
              </svg>
              <span
                className="ml-3 mt-0.5 inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-medium text-black"
                style={{ background: c, boxShadow: flexed ? `0 0 14px ${c}` : undefined }}
              >
                {flexed && "✦ "}
                {label(p)}
              </span>
            </div>
          );
        })}

      {pops.map((p) => (
        <span key={p.id} className="react-pop pointer-events-none absolute text-3xl" style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%` }}>
          {p.emoji}
        </span>
      ))}

      <div className="absolute bottom-6 right-6 z-10 flex flex-col items-end gap-1.5 md:right-12">
        {me && (
          <span className="text-[11px] font-mono tracking-wider text-white/40">
            YOU · <span style={{ color: `hsl(${hue} 90% 62%)` }}>{label(me)}</span>
          </span>
        )}
      </div>
    </section>
  );
}

export default function Presence() {
  // crypto.randomUUID must run after mount, not during prerender
  const [sid, setSid] = useState('');
  useEffect(() => setSid(crypto.randomUUID()), []);
  return sid ? <Zone sid={sid} /> : <section id="live" className="h-screen min-h-[560px] w-full snap-start bg-black" />;
}
