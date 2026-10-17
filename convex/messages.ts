import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const FIFTEEN_MINS = 15 * 60 * 1000;

export const list = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const all = await ctx.db
      .query("messages")
      .withIndex("by_expiresAt", (q) => q.gt("expiresAt", now))
      .take(100);
    return all;
  },
});

export const send = mutation({
  args: {
    sessionId: v.string(),
    author: v.string(),
    hue: v.number(),
    text: v.string(),
    x: v.number(),
    y: v.number(),
  },
  handler: async (ctx, a) => {
    const cleanText = a.text.trim().slice(0, 200);
    if (!cleanText) return;
    const now = Date.now();
    await ctx.db.insert("messages", {
      sessionId: a.sessionId,
      author: a.author.slice(0, 32),
      hue: Math.abs(Math.floor(a.hue)) % 360,
      text: cleanText,
      x: Math.min(0.95, Math.max(0.05, a.x)),
      y: Math.min(0.95, Math.max(0.05, a.y)),
      expiresAt: now + FIFTEEN_MINS,
    });
  },
});
