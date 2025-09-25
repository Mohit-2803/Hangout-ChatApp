import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

export const create = mutation({
  args: {
    conversationId: v.id("conversations"),
    type: v.string(),
    content: v.array(v.string()),
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

    const membership = await ctx.db
      .query("conversationMembers")
      .withIndex("by_member_conversation", (q) =>
        q
          .eq("memberId", currentUser._id)
          .eq("conversationId", args.conversationId)
      )
      .unique();

    if (!membership) {
      throw new ConvexError("Not a member of this conversation");
    }

    // Check if user is an active member (for groups)
    const conversation = await ctx.db.get(args.conversationId);
    if (
      conversation &&
      conversation.isGroup &&
      membership.status !== "active"
    ) {
      throw new ConvexError("You are no longer an active member of this group");
    }

    const message = await ctx.db.insert("messages", {
      senderId: currentUser._id,
      ...args,
      readStatus: "sent", // Initialize as sent
      readBy: [currentUser._id], // Sender has read the message
    });

    await ctx.db.patch(args.conversationId, { lastMessageId: message });

    return message;
  },
});

// Mutation to mark a message as delivered
export const markAsDelivered = mutation({
  args: {
    messageId: v.id("messages"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.messageId);
    if (!message) {
      throw new Error("Message not found");
    }

    // Only update if the message is not already delivered or read
    if (message.readStatus !== "delivered" && message.readStatus !== "read") {
      await ctx.db.patch(args.messageId, {
        readStatus: "delivered",
      });
    }

    return message;
  },
});

// Mutation to mark a message as read
export const markAsRead = mutation({
  args: {
    messageId: v.id("messages"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.messageId);
    if (!message) {
      throw new Error("Message not found");
    }

    // Don't mark your own messages as read
    if (message.senderId === args.userId) {
      return message;
    }

    // Update read status
    await ctx.db.patch(args.messageId, {
      readStatus: "read",
    });

    // Add user to readBy array if not already there
    const readBy = message.readBy || [];
    if (!readBy.includes(args.userId)) {
      await ctx.db.patch(args.messageId, {
        readBy: [...readBy, args.userId],
      });
    }

    return message;
  },
});

// Mutation to mark all messages in a conversation as read
export const markAllAsRead = mutation({
  args: {
    conversationId: v.id("conversations"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect();

    // Mark all messages as read by this user
    for (const message of messages) {
      // Don't mark your own messages as read
      if (message.senderId === args.userId) continue;

      // Update read status
      await ctx.db.patch(message._id, {
        readStatus: "read",
      });

      // Add user to readBy array if not already there
      const readBy = message.readBy || [];
      if (!readBy.includes(args.userId)) {
        await ctx.db.patch(message._id, {
          readBy: [...readBy, args.userId],
        });
      }
    }

    return messages.length;
  },
});
