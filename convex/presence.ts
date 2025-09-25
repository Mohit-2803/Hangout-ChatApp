import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Mutation to update user's online status
export const updatePresence = mutation({
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
      lastSeen: Date.now(),
    });

    return user._id;
  },
});

// Query to get user's online status
export const getPresence = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
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
