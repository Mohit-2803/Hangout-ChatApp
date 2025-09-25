import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getUserByClerkId } from "./_utils";
import { ConvexError } from "convex/values";

export const block = mutation({
  args: {
    blockedId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });

    if (!currentUser) {
      throw new Error("User not found");
    }

    // Check if the user is already blocked
    const existingBlock = await ctx.db
      .query("blockedUsers")
      .withIndex("by_blocker_blocked", (q) =>
        q.eq("blockerId", currentUser._id).eq("blockedId", args.blockedId)
      )
      .unique();

    if (existingBlock) {
      throw new ConvexError("User is already blocked");
    }

    // Check if the user is trying to block themselves
    if (currentUser._id === args.blockedId) {
      throw new ConvexError("You cannot block yourself");
    }

    // Create the block relationship
    const blockId = await ctx.db.insert("blockedUsers", {
      blockerId: currentUser._id,
      blockedId: args.blockedId,
    });

    return blockId;
  },
});

export const unblock = mutation({
  args: {
    blockedId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });

    if (!currentUser) {
      throw new Error("User not found");
    }

    // Find the existing block relationship
    const existingBlock = await ctx.db
      .query("blockedUsers")
      .withIndex("by_blocker_blocked", (q) =>
        q.eq("blockerId", currentUser._id).eq("blockedId", args.blockedId)
      )
      .unique();

    if (!existingBlock) {
      throw new ConvexError("User is not blocked");
    }

    // Remove the block relationship
    await ctx.db.delete(existingBlock._id);

    return { success: true };
  },
});

export const isBlocked = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return false;
    }

    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });

    if (!currentUser) {
      return false;
    }

    // Check if the current user has blocked the specified user
    const block = await ctx.db
      .query("blockedUsers")
      .withIndex("by_blocker_blocked", (q) =>
        q.eq("blockerId", currentUser._id).eq("blockedId", args.userId)
      )
      .unique();

    return !!block;
  },
});

export const getBlockedUsers = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });

    if (!currentUser) {
      return [];
    }

    // Get all users blocked by the current user
    const blockedUsers = await ctx.db
      .query("blockedUsers")
      .withIndex("by_blockerId", (q) => q.eq("blockerId", currentUser._id))
      .collect();

    // Get the user details for each blocked user
    const blockedUsersDetails = await Promise.all(
      blockedUsers.map(async (block) => {
        const blockedUser = await ctx.db.get(block.blockedId);
        return blockedUser;
      })
    );

    return blockedUsersDetails.filter(Boolean);
  },
});

export const isBlockedBy = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return false;
    }

    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });

    if (!currentUser) {
      return false;
    }

    // Check if the current user is blocked by the specified user
    const block = await ctx.db
      .query("blockedUsers")
      .withIndex("by_blocker_blocked", (q) =>
        q.eq("blockerId", args.userId).eq("blockedId", currentUser._id)
      )
      .unique();

    return !!block;
  },
});
