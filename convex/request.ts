import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

export const create = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    if (args.email === identity.email) {
      throw new ConvexError("Cannot send request to yourself");
    }

    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });

    if (!currentUser) {
      throw new ConvexError("Current user not found");
    }

    const receiver = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (!receiver) {
      throw new ConvexError("User with that email not found");
    }

    const existingRequest = await ctx.db
      .query("requests")
      .withIndex("by_receiver_sender", (q) =>
        q.eq("receiver", receiver._id).eq("sender", currentUser._id)
      )
      .unique();

    if (existingRequest) {
      throw new ConvexError("Request already sent to this user");
    }

    const requestAlreadyReceived = await ctx.db
      .query("requests")
      .withIndex("by_receiver_sender", (q) =>
        q.eq("receiver", currentUser._id).eq("sender", receiver._id)
      )
      .unique();

    if (requestAlreadyReceived) {
      throw new ConvexError("This user has already sent you a request");
    }

    const friends1 = await ctx.db
      .query("friends")
      .withIndex("by_user1", (q) => q.eq("user1", currentUser._id))
      .collect();

    const friends2 = await ctx.db
      .query("friends")
      .withIndex("by_user2", (q) => q.eq("user2", currentUser._id))
      .collect();

    if (
      friends1.some((f) => f.user2 === receiver._id) ||
      friends2.some((f) => f.user1 === receiver._id)
    ) {
      throw new ConvexError("You are already friends with this user");
    }

    const request = await ctx.db.insert("requests", {
      sender: currentUser._id,
      receiver: receiver._id,
    });

    return request;
  },
});

export const accept = mutation({
  args: { id: v.id("requests") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });

    if (!currentUser) {
      throw new ConvexError("Current user not found");
    }

    const request = await ctx.db.get(args.id);

    if (!request) {
      throw new ConvexError("Request not found");
    }

    if (request.receiver !== currentUser._id) {
      throw new ConvexError("Unauthorized: This request is not for you");
    }

    const conversationId = await ctx.db.insert("conversations", {
      isGroup: false,
    });

    await ctx.db.insert("friends", {
      user1: currentUser._id,
      user2: request.sender,
      conversationId,
    });

    await ctx.db.insert("conversationMembers", {
      memberId: currentUser._id,
      conversationId,
    });

    await ctx.db.insert("conversationMembers", {
      memberId: request.sender,
      conversationId,
    });

    // Delete the request to accept it
    await ctx.db.delete(args.id);
  },
});

export const deny = mutation({
  args: { id: v.id("requests") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });

    if (!currentUser) {
      throw new ConvexError("Current user not found");
    }

    const request = await ctx.db.get(args.id);

    if (!request) {
      throw new ConvexError("Request not found");
    }

    if (request.receiver !== currentUser._id) {
      throw new ConvexError("Unauthorized: This request is not for you");
    }

    // Delete the request to deny it
    await ctx.db.delete(args.id);

    return true;
  },
});
