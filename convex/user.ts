import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

export const create = internalMutation({
  args: {
    username: v.string(),
    imageUrl: v.string(),
    clerkId: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("users", args);
  },
});

export const deleteUser = internalMutation({
  args: { id: v.id("users") },
  async handler(ctx, args) {
    await ctx.db.delete(args.id);
  },
});

export const get = internalQuery({
  args: { clerkId: v.string() },
  async handler(ctx, args) {
    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();
  },
});

// Mutation to update user online status
export const updateOnlineStatus = internalMutation({
  args: {
    clerkId: v.string(),
    onlineStatus: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      onlineStatus: args.onlineStatus,
      lastSeen: args.onlineStatus === "online" ? Date.now() : user.lastSeen,
    });

    return user._id;
  },
});

// Mutation to update user last seen timestamp
export const updateLastSeen = internalMutation({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      lastSeen: Date.now(),
    });

    return user._id;
  },
});

// Query to get user online status
export const getOnlineStatus = internalQuery({
  args: { clerkId: v.string() },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) {
      return null;
    }

    return {
      onlineStatus: user.onlineStatus || "offline",
      lastSeen: user.lastSeen || null,
    };
  },
});
