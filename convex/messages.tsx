import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

export const get = query({
  args: {
    id: v.id("conversations"),
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
      throw new ConvexError("User not found");
    }

    const membership = await ctx.db
      .query("conversationMembers")
      .withIndex("by_member_conversation", (q) =>
        q.eq("memberId", currentUser._id).eq("conversationId", args.id)
      )
      .unique();

    if (!membership) {
      throw new ConvexError("Not a member of this conversation");
    }

    // For regular conversations or active group members, get all messages
    let messages = await ctx.db
      .query("messages")
      .withIndex("by_conversationId", (q) => q.eq("conversationId", args.id))
      .order("desc")
      .collect();

    // For group conversations, check if user has been removed or left
    const conversation = await ctx.db.get(args.id);
    if (conversation && conversation.isGroup && membership.status) {
      const isInactive =
        membership.status === "removed" || membership.status === "left";

      if (isInactive) {
        // Find the most recent system message about this user leaving or being removed
        const exitMessages = messages.filter(
          (message) =>
            message.type === "system" &&
            (message.content[0].includes(
              `${currentUser.username} left the group`
            ) ||
              message.content[0].includes(`removed ${currentUser.username}`))
        );

        // If we found such a message, filter messages to only show those before that point
        if (exitMessages.length > 0) {
          // Sort to find the most recent exit message
          const mostRecentExitMessage = exitMessages.reduce(
            (latest, current) =>
              current._creationTime > latest._creationTime ? current : latest
          );

          // Filter messages to only include those created before or at the exit time
          messages = messages.filter(
            (message) =>
              message._creationTime <= mostRecentExitMessage._creationTime
          );
        } else {
          // If no exit message found, don't show any messages for inactive users
          messages = [];
        }
      }
    }

    // Process messages with user information
    const messagesWithUsers = await Promise.all(
      messages.map(async (message) => {
        const sender = await ctx.db.get(message.senderId);
        if (!sender) {
          throw new ConvexError("Sender not found");
        }

        return {
          message,
          senderImage: sender.imageUrl,
          senderName: sender.username,
          isCurrentUser: sender._id === currentUser._id,
          readStatus: message.readStatus || "sent",
          readBy: message.readBy || [],
        };
      })
    );

    return messagesWithUsers.filter(Boolean);
  },
});
