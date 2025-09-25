import { ConvexError } from "convex/values";
import { MutationCtx, query, QueryCtx } from "./_generated/server";
import { getUserByClerkId } from "./_utils";
import { Id } from "./_generated/dataModel";

export const get = query({
  args: {},
  handler: async (ctx) => {
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

    const conversationMemberships = await ctx.db
      .query("conversationMembers")
      .withIndex("by_memberId", (q) => q.eq("memberId", currentUser._id))
      .collect();

    const conversations = await Promise.all(
      conversationMemberships?.map(async (membership) => {
        const conversation = await ctx.db.get(membership.conversationId);
        if (!conversation) {
          throw new ConvexError("Conversation not found");
        }
        return conversation;
      })
    );

    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conversation) => {
        const allConversationMemberships = await ctx.db
          .query("conversationMembers")
          .withIndex("by_conversationId", (q) =>
            q.eq("conversationId", conversation?._id)
          )
          .collect();

        const lastMessage = await getLastMessageDetails({
          ctx,
          id: conversation?.lastMessageId,
        });

        if (conversation.isGroup) {
          // For group conversations, include all members except the current user
          const otherMembers = await Promise.all(
            allConversationMemberships
              .filter((membership) => membership.memberId !== currentUser._id)
              .map(async (membership) => await ctx.db.get(membership.memberId))
          );

          return { conversation, otherMembers, lastMessage };
        } else {
          const otherMembership = allConversationMemberships.filter(
            (membership) => membership.memberId !== currentUser._id
          );

          const otherMember = await ctx.db.get(otherMembership[0].memberId);

          return { conversation, otherMember, lastMessage };
        }
      })
    );

    return conversationsWithDetails;
  },
});

const getLastMessageDetails = async ({
  ctx,
  id,
}: {
  ctx: QueryCtx | MutationCtx;
  id: Id<"messages"> | undefined;
}) => {
  if (!id) return null;
  const message = await ctx.db.get(id);
  if (!message) return null;
  const sender = await ctx.db.get(message.senderId);
  if (!sender) return null;

  const content = getMessageContent(message.type, message.content);

  return {
    content,
    sender: sender.username,
  };
};

const getMessageContent = (type: string, content: string[]) => {
  switch (type) {
    case "text":
      return content.join("");

    default:
      return "[Non-text]";
  }
};
