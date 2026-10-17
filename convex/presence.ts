import { v } from "convex/values";
import { createPublicClient, http, isAddressEqual, recoverMessageAddress } from "viem";
import { mainnet } from "viem/chains";
import { internal } from "./_generated/api";
import { action, internalMutation, mutation, query } from "./_generated/server";

const STALE_MS = 20_000;
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export const list = query({
  args: {},
  handler: (ctx) => ctx.db.query("presence").take(100),
});

export const update = mutation({
  args: { sessionId: v.string(), guest: v.number(), hue: v.number(), x: v.number(), y: v.number() },
  handler: async (ctx, a) => {
    if (a.sessionId.length > 64) throw new Error("bad session");
    const row = await ctx.db
      .query("presence")
      .withIndex("by_session", (q) => q.eq("sessionId", a.sessionId))
      .unique();
    const pos = { x: clamp01(a.x), y: clamp01(a.y), lastSeen: Date.now() };
    if (row) return ctx.db.patch(row._id, pos);
    await ctx.db.insert("presence", {
      sessionId: a.sessionId,
      guest: Math.abs(Math.floor(a.guest)) % 1000,
      hue: Math.abs(Math.floor(a.hue)) % 360,
      ...pos,
    });
  },
});

export const leave = mutation({
  args: { sessionId: v.string() },
  handler: async (ctx, { sessionId }) => {
    const row = await ctx.db.query("presence").withIndex("by_session", (q) => q.eq("sessionId", sessionId)).unique();
    if (row) await ctx.db.delete(row._id);
  },
});

export const setWallet = internalMutation({
  args: { sessionId: v.string(), wallet: v.string(), ens: v.optional(v.string()) },
  handler: async (ctx, a) => {
    const row = await ctx.db.query("presence").withIndex("by_session", (q) => q.eq("sessionId", a.sessionId)).unique();
    if (!row) throw new Error("no presence for session");
    await ctx.db.patch(row._id, { wallet: a.wallet, ens: a.ens });
  },
});

// Free personal_sign proof of ownership; the message binds to this session and expires in 5 min (no replay).
export const verifyWallet = action({
  args: { sessionId: v.string(), address: v.string(), message: v.string(), signature: v.string() },
  handler: async (ctx, a) => {
    const m = /^Verify wallet for portfolio presence\nSession: (\S+)\nIssued: (\d+)$/.exec(a.message);
    if (!m || m[1] !== a.sessionId || Math.abs(Date.now() - Number(m[2])) > 5 * 60_000) {
      throw new Error("Invalid or expired message");
    }
    const recovered = await recoverMessageAddress({ message: a.message, signature: a.signature as `0x${string}` });
    if (!isAddressEqual(recovered, a.address as `0x${string}`)) throw new Error("Signature mismatch");

    let ens: string | undefined;
    try {
      // shortcut: default public RPC, may rate-limit; swap in an Alchemy/Infura URL for production
      ens = (await createPublicClient({ chain: mainnet, transport: http() }).getEnsName({ address: recovered })) ?? undefined;
    } catch {}
    await ctx.runMutation(internal.presence.setWallet, { sessionId: a.sessionId, wallet: recovered, ens });
  },
});

export const purge = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    for (const r of await ctx.db.query("presence").withIndex("by_lastSeen", (q) => q.lt("lastSeen", now - STALE_MS)).take(100)) {
      await ctx.db.delete(r._id);
    }
    for (const r of await ctx.db.query("reactions").withIndex("by_creation_time", (q) => q.lt("_creationTime", now - 15_000)).take(100)) {
      await ctx.db.delete(r._id);
    }
    for (const r of await ctx.db.query("messages").withIndex("by_expiresAt", (q) => q.lt("expiresAt", now)).take(100)) {
      await ctx.db.delete(r._id);
    }
  },
});
