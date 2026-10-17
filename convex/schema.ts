import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  presence: defineTable({
    sessionId: v.string(),
    guest: v.number(),
    hue: v.number(),
    x: v.number(), // 0..1 of the live zone, so cursors line up across screen sizes
    y: v.number(),
    lastSeen: v.number(),
    wallet: v.optional(v.string()), // only ever set by the signature-verifying action
    ens: v.optional(v.string()),
  })
    .index("by_session", ["sessionId"])
    .index("by_lastSeen", ["lastSeen"]),
  reactions: defineTable({
    emoji: v.string(),
    x: v.number(),
    y: v.number(),
  }),
  messages: defineTable({
    sessionId: v.string(),
    author: v.string(),
    hue: v.number(),
    text: v.string(),
    x: v.number(),
    y: v.number(),
    expiresAt: v.number(), // 15 mins TTL
  }).index("by_expiresAt", ["expiresAt"]),
});
