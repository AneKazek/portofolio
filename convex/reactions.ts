import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const EMOJIS = ["🔥", "🚀", "❤️"];

export const recent = query({
  args: {},
  handler: (ctx) => ctx.db.query("reactions").order("desc").take(30),
});

export const send = mutation({
  args: { emoji: v.string(), x: v.number(), y: v.number() },
  handler: async (ctx, a) => {
    if (!EMOJIS.includes(a.emoji)) throw new Error("bad emoji");
    await ctx.db.insert("reactions", {
      emoji: a.emoji,
      x: Math.min(1, Math.max(0, a.x)),
      y: Math.min(1, Math.max(0, a.y)),
    });
  },
});
