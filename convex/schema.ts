import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // This is a table of all users in the system.
  users: defineTable({
    username: v.string(),
    imageUrl: v.string(),
    clerkId: v.string(),
    email: v.string(),
    onlineStatus: v.optional(v.string()),
    lastSeen: v.optional(v.number()),
  })
    .index("by_email", ["email"])
    .index("by_clerkId", ["clerkId"]),

  // This is a table for friend requests between users.
  requests: defineTable({
    sender: v.id("users"),
    receiver: v.id("users"),
  })
    .index("by_receiver", ["receiver"])
    .index("by_receiver_sender", ["receiver", "sender"]),

  // This is a table for friendships between users.
  friends: defineTable({
    user1: v.id("users"),
    user2: v.id("users"),
    conversationId: v.id("conversations"),
  })
    .index("by_user1", ["user1"])
    .index("by_user2", ["user2"])
    .index("by_conversationId", ["conversationId"]),

  // This is a table for conversations between users.
  conversations: defineTable({
    name: v.optional(v.string()),
    isGroup: v.boolean(),
    lastMessageId: v.optional(v.id("messages")),
    imageUrl: v.optional(v.string()),
    adminId: v.optional(v.id("users")),
  }),

  // This table is for mapping members
  conversationMembers: defineTable({
    memberId: v.id("users"),
    conversationId: v.id("conversations"),
    lastSeenMessage: v.optional(v.id("messages")),
    role: v.optional(v.string()), // "admin" or "member"
    status: v.optional(v.string()), // "active", "removed", or "left"
  })
    .index("by_memberId", ["memberId"])
    .index("by_conversationId", ["conversationId"])
    .index("by_member_conversation", ["memberId", "conversationId"]),

  // This is a table for messages in conversations.
  messages: defineTable({
    senderId: v.id("users"),
    conversationId: v.id("conversations"),
    type: v.string(),
    content: v.array(v.string()),
    readStatus: v.optional(v.string()),
    readBy: v.optional(v.array(v.id("users"))),
  }).index("by_conversationId", ["conversationId"]),

  // This is a table for blocked users.
  blockedUsers: defineTable({
    blockerId: v.id("users"),
    blockedId: v.id("users"),
  })
    .index("by_blockerId", ["blockerId"])
    .index("by_blockedId", ["blockedId"])
    .index("by_blocker_blocked", ["blockerId", "blockedId"]),

  // This is a table for group invitations
  groupInvitations: defineTable({
    groupId: v.id("conversations"),
    senderId: v.id("users"),
    receiverId: v.id("users"),
    status: v.string(), // "pending", "accepted", "rejected"
  })
    .index("by_receiver", ["receiverId"])
    .index("by_group", ["groupId"])
    .index("by_receiver_group", ["receiverId", "groupId"]),
});
