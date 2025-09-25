import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserByClerkId } from "./_utils";

// Create a new group
export const createGroup = mutation({
  args: {
    name: v.string(),
    imageUrl: v.optional(v.string()),
  },
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
      throw new ConvexError("User not found");
    }

    const conversationId = await ctx.db.insert("conversations", {
      name: args.name,
      isGroup: true,
      imageUrl: args.imageUrl,
      adminId: currentUser._id,
    });

    await ctx.db.insert("conversationMembers", {
      memberId: currentUser._id,
      conversationId,
      role: "admin",
      status: "active",
    });

    return conversationId;
  },
});

// Add a member to a group
export const addMember = mutation({
  args: {
    conversationId: v.id("conversations"),
    userId: v.id("users"),
  },
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
      throw new ConvexError("User not found");
    }

    // Check if current user is an admin of the group
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation || !conversation.isGroup) {
      throw new ConvexError("Conversation is not a group");
    }

    if (conversation.adminId !== currentUser._id) {
      throw new ConvexError("Only group admins can add members");
    }

    // Check if user is already an active member
    const existingMembership = await ctx.db
      .query("conversationMembers")
      .withIndex("by_member_conversation", (q) =>
        q.eq("memberId", args.userId).eq("conversationId", args.conversationId)
      )
      .unique();

    if (existingMembership && existingMembership.status === "active") {
      throw new ConvexError("User is already a member of this group");
    }

    // Get the added user's details for the system message
    const addedUser = await ctx.db.get(args.userId);

    if (!addedUser) {
      throw new ConvexError("User not found");
    }

    // Check if user already has a membership record (e.g., they left or were removed before)
    if (existingMembership) {
      // Update existing membership to active
      await ctx.db.patch(existingMembership._id, {
        status: "active",
        role: "member",
      });
    } else {
      // Add the user to the group
      await ctx.db.insert("conversationMembers", {
        memberId: args.userId,
        conversationId: args.conversationId,
        role: "member",
        status: "active",
      });
    }

    // Create system message to notify all members about the new addition
    await ctx.db.insert("messages", {
      senderId: currentUser._id,
      conversationId: args.conversationId,
      type: "system",
      content: [
        `${currentUser.username} added ${addedUser.username} to the group`,
      ],
      readStatus: "sent",
      readBy: [currentUser._id],
    });

    return true;
  },
});

// Remove a member from a group
export const removeMember = mutation({
  args: {
    conversationId: v.id("conversations"),
    userId: v.id("users"),
  },
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
      throw new ConvexError("User not found");
    }

    // Check if current user is an admin of the group
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation || !conversation.isGroup) {
      throw new ConvexError("Conversation is not a group");
    }

    if (conversation.adminId !== currentUser._id) {
      throw new ConvexError("Only group admins can remove members");
    }

    // Check if user is a member
    const membership = await ctx.db
      .query("conversationMembers")
      .withIndex("by_member_conversation", (q) =>
        q.eq("memberId", args.userId).eq("conversationId", args.conversationId)
      )
      .unique();

    if (!membership) {
      throw new ConvexError("User is not a member of this group");
    }

    // Get the removed user's details for the system message
    const removedUser = await ctx.db.get(args.userId);

    if (!removedUser) {
      throw new ConvexError("User not found");
    }

    // Create system message
    await ctx.db.insert("messages", {
      senderId: currentUser._id,
      conversationId: args.conversationId,
      type: "system",
      content: [`${currentUser.username} removed ${removedUser.username}`],
      readStatus: "sent",
      readBy: [currentUser._id],
    });

    // Update the membership status to 'removed' instead of deleting it
    // This way the conversation history remains intact but the user can't send messages
    await ctx.db.patch(membership._id, {
      status: "removed",
    });

    return true;
  },
});

// Update group image
export const updateGroupImage = mutation({
  args: {
    conversationId: v.id("conversations"),
    imageUrl: v.string(),
  },
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
      throw new ConvexError("User not found");
    }

    // Check if current user is an admin of the group
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation || !conversation.isGroup) {
      throw new ConvexError("Conversation is not a group");
    }

    if (conversation.adminId !== currentUser._id) {
      throw new ConvexError("Only group admins can update group image");
    }

    // Update the group image
    await ctx.db.patch(args.conversationId, {
      imageUrl: args.imageUrl,
    });

    return true;
  },
});

// Send invitation to join a group
export const sendInvitation = mutation({
  args: {
    conversationId: v.id("conversations"),
    receiverEmail: v.string(),
  },
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
      throw new ConvexError("User not found");
    }

    // Check if current user is an admin of the group
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation || !conversation.isGroup) {
      throw new ConvexError("Conversation is not a group");
    }

    if (conversation.adminId !== currentUser._id) {
      throw new ConvexError("Only group admins can send invitations");
    }

    // Find the receiver by email
    const receiver = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.receiverEmail))
      .unique();

    if (!receiver) {
      throw new ConvexError("User with that email not found");
    }

    // Check if user is already an active member
    const existingMembership = await ctx.db
      .query("conversationMembers")
      .withIndex("by_member_conversation", (q) =>
        q.eq("memberId", receiver._id).eq("conversationId", args.conversationId)
      )
      .unique();

    if (existingMembership && existingMembership.status === "active") {
      throw new ConvexError("User is already a member of this group");
    }

    // Check if there's already a pending invitation
    const existingInvitation = await ctx.db
      .query("groupInvitations")
      .withIndex("by_receiver_group", (q) =>
        q.eq("receiverId", receiver._id).eq("groupId", args.conversationId)
      )
      .unique();

    if (existingInvitation && existingInvitation.status === "pending") {
      throw new ConvexError("Invitation already sent to this user");
    }

    // Send the invitation
    await ctx.db.insert("groupInvitations", {
      groupId: args.conversationId,
      senderId: currentUser._id,
      receiverId: receiver._id,
      status: "pending",
    });

    return true;
  },
});

// Accept a group invitation
export const acceptInvitation = mutation({
  args: {
    invitationId: v.id("groupInvitations"),
  },
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
      throw new ConvexError("User not found");
    }

    const invitation = await ctx.db.get(args.invitationId);
    if (!invitation) {
      throw new ConvexError("Invitation not found");
    }

    if (invitation.receiverId !== currentUser._id) {
      throw new ConvexError("This invitation is not for you");
    }

    if (invitation.status !== "pending") {
      throw new ConvexError("This invitation is no longer valid");
    }

    // Check if user already has a membership record (e.g., they left or were removed before)
    const existingMembership = await ctx.db
      .query("conversationMembers")
      .withIndex("by_member_conversation", (q) =>
        q
          .eq("memberId", currentUser._id)
          .eq("conversationId", invitation.groupId)
      )
      .unique();

    if (existingMembership) {
      // Update existing membership to active
      await ctx.db.patch(existingMembership._id, {
        status: "active",
        role: "member",
      });
    } else {
      // Add the user to the group
      await ctx.db.insert("conversationMembers", {
        memberId: currentUser._id,
        conversationId: invitation.groupId,
        role: "member",
        status: "active",
      });
    }

    // Create system message to notify all members that a new member joined
    await ctx.db.insert("messages", {
      senderId: currentUser._id,
      conversationId: invitation.groupId,
      type: "system",
      content: [`${currentUser.username} joined the group`],
      readStatus: "sent",
      readBy: [currentUser._id],
    });

    // Update the invitation status
    await ctx.db.patch(args.invitationId, {
      status: "accepted",
    });

    return true;
  },
});

// Reject a group invitation
export const rejectInvitation = mutation({
  args: {
    invitationId: v.id("groupInvitations"),
  },
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
      throw new ConvexError("User not found");
    }

    const invitation = await ctx.db.get(args.invitationId);
    if (!invitation) {
      throw new ConvexError("Invitation not found");
    }

    if (invitation.receiverId !== currentUser._id) {
      throw new ConvexError("This invitation is not for you");
    }

    if (invitation.status !== "pending") {
      throw new ConvexError("This invitation is no longer valid");
    }

    // Update the invitation status
    await ctx.db.patch(args.invitationId, {
      status: "rejected",
    });

    return true;
  },
});

// Get group members
export const getGroupMembers = query({
  args: {
    conversationId: v.id("conversations"),
  },
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
      throw new ConvexError("User not found");
    }

    // Check if conversation is a group
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation || !conversation.isGroup) {
      throw new ConvexError("Conversation is not a group");
    }

    // Check if user is a member of the group
    const membership = await ctx.db
      .query("conversationMembers")
      .withIndex("by_member_conversation", (q) =>
        q
          .eq("memberId", currentUser._id)
          .eq("conversationId", args.conversationId)
      )
      .unique();

    if (!membership) {
      throw new ConvexError("You are not a member of this group");
    }

    // Get all active members of the group
    const memberships = await ctx.db
      .query("conversationMembers")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .filter((q) =>
        q.or(
          q.eq(q.field("status"), "active"),
          q.eq(q.field("status"), undefined)
        )
      )
      .collect();

    const members = await Promise.all(
      memberships.map(async (membership) => {
        const user = await ctx.db.get(membership.memberId);
        if (!user) {
          throw new ConvexError("User not found");
        }
        return {
          ...user,
          role: membership.role,
        };
      })
    );

    return members;
  },
});

// Check if user is admin of a group
export const isGroupAdmin = query({
  args: {
    conversationId: v.id("conversations"),
  },
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
      throw new ConvexError("User not found");
    }

    // Check if conversation is a group
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation || !conversation.isGroup) {
      return false;
    }

    // Check if user is the admin of the group
    return conversation.adminId === currentUser._id;
  },
});

// Leave a group
export const leaveGroup = mutation({
  args: {
    conversationId: v.id("conversations"),
  },
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
      throw new ConvexError("User not found");
    }

    // Check if conversation is a group
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation || !conversation.isGroup) {
      throw new ConvexError("Conversation is not a group");
    }

    // Check if user is a member of the group
    const membership = await ctx.db
      .query("conversationMembers")
      .withIndex("by_member_conversation", (q) =>
        q
          .eq("memberId", currentUser._id)
          .eq("conversationId", args.conversationId)
      )
      .unique();

    if (!membership) {
      throw new ConvexError("You are not a member of this group");
    }

    // Check if user is the admin and not the only member
    if (conversation.adminId === currentUser._id) {
      const memberCount = await ctx.db
        .query("conversationMembers")
        .withIndex("by_conversationId", (q) =>
          q.eq("conversationId", args.conversationId)
        )
        .collect()
        .then((members) => members.length);

      if (memberCount > 1) {
        throw new ConvexError(
          "As the admin, you must transfer ownership before leaving the group"
        );
      }
    }

    // Create system message
    await ctx.db.insert("messages", {
      senderId: currentUser._id,
      conversationId: args.conversationId,
      type: "system",
      content: [`${currentUser.username} left the group`],
      readStatus: "sent",
      readBy: [currentUser._id],
    });

    // Update the membership status to 'left' instead of deleting it
    // This way the conversation history remains intact but the user can't send messages
    await ctx.db.patch(membership._id, {
      status: "left",
    });

    return true;
  },
});

// Get group invitations for a user
export const getGroupInvitations = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });

    if (!currentUser) {
      throw new ConvexError("User not found");
    }

    const invitations = await ctx.db
      .query("groupInvitations")
      .withIndex("by_receiver", (q) => q.eq("receiverId", currentUser._id))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .collect();

    const invitationsWithDetails = await Promise.all(
      invitations.map(async (invitation) => {
        const group = await ctx.db.get(invitation.groupId);
        const sender = await ctx.db.get(invitation.senderId);

        return {
          ...invitation,
          group,
          sender,
        };
      })
    );

    return invitationsWithDetails;
  },
});

// Delete a group (admin only)
export const deleteGroup = mutation({
  args: {
    conversationId: v.id("conversations"),
  },
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
      throw new ConvexError("User not found");
    }

    // Check if conversation is a group
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation || !conversation.isGroup) {
      throw new ConvexError("Conversation is not a group");
    }

    // Check if user is the admin of the group
    if (conversation.adminId !== currentUser._id) {
      throw new ConvexError("Only group admins can delete the group");
    }

    // Get all members of the group
    const memberships = await ctx.db
      .query("conversationMembers")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect();

    // Delete all memberships
    for (const membership of memberships) {
      await ctx.db.delete(membership._id);
    }

    // Delete all messages in the group
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect();

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    // Delete all group invitations
    const invitations = await ctx.db
      .query("groupInvitations")
      .withIndex("by_group", (q) => q.eq("groupId", args.conversationId))
      .collect();

    for (const invitation of invitations) {
      await ctx.db.delete(invitation._id);
    }

    // Delete the conversation
    await ctx.db.delete(args.conversationId);

    return true;
  },
});

// Count group invitations for a user
export const countGroupInvitations = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Not authenticated");
    }

    const currentUser = await getUserByClerkId({
      ctx,
      clerkId: identity.subject,
    });

    if (!currentUser) {
      throw new ConvexError("User not found");
    }

    const invitations = await ctx.db
      .query("groupInvitations")
      .withIndex("by_receiver", (q) => q.eq("receiverId", currentUser._id))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .collect();

    return invitations.length;
  },
});
