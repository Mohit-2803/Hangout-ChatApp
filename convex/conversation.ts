import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

export const get = query({
  args: { id: v.id("conversations") },
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

    const conversation = await ctx.db.get(args.id);

    if (!conversation) {
      throw new ConvexError("Conversation not found");
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

    const allConversationMemberships = await ctx.db
      .query("conversationMembers")
      .withIndex("by_conversationId", (q) => q.eq("conversationId", args.id))
      .collect();

    if (!conversation.isGroup) {
      const otherMembership = allConversationMemberships.filter(
        (membership) => membership.memberId !== currentUser._id
      );

      const otherMemberDetails = await ctx.db.get(otherMembership[0].memberId);

      if (!otherMemberDetails) {
        throw new ConvexError("Other member not found");
      }

      // Get the current user's membership details
      const currentMembership = allConversationMemberships.find(
        (membership) => membership.memberId === currentUser._id
      );

      // For direct messages, the status is always active
      return {
        ...conversation,
        otherMember: {
          ...otherMemberDetails,
          lastSeenMessage: otherMembership[0].lastSeenMessage,
          onlineStatus: otherMemberDetails.onlineStatus || "offline",
          lastSeen: otherMemberDetails.lastSeen || null,
        },
        currentMember: {
          ...currentUser,
          lastSeenMessage: currentMembership?.lastSeenMessage,
          status: "active", // Direct messages always have active status
          isMemberActive: true,
        },
        otherMembers: null,
      };
    } else {
      const otherMemberships = allConversationMemberships.filter(
        (membership) => membership.memberId !== currentUser._id
      );

      const otherMembers = await Promise.all(
        otherMemberships.map(async (membership) => {
          const memberDetails = await ctx.db.get(membership.memberId);

          if (!memberDetails) {
            throw new ConvexError("Member not found");
          }

          return {
            ...memberDetails,
            lastSeenMessage: membership.lastSeenMessage,
            onlineStatus: memberDetails.onlineStatus || "offline",
            lastSeen: memberDetails.lastSeen || null,
          };
        })
      );

      // Get the current user's membership details
      const currentMembership = allConversationMemberships.find(
        (membership) => membership.memberId === currentUser._id
      );

      // Check if the user is still an active member or has left/been removed
      const isMemberActive =
        !currentMembership?.status || currentMembership.status === "active";

      return {
        ...conversation,
        otherMember: null,
        otherMembers,
        currentMember: {
          ...currentUser,
          lastSeenMessage: currentMembership?.lastSeenMessage,
          status: currentMembership?.status || "active",
          isMemberActive,
        },
      };
    }
  },
});
