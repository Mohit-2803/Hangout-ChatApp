"use client";

import ConversationContainer from "@/components/shared/conversation/ConversationContainer";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import React, { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Header from "./_components/Header";
import Body from "./_components/body/Body";
import ChatInput from "./_components/input/ChatInput";
import { useMessageReadReceipts } from "@/hooks/usePresence";
import { useAuth } from "@clerk/nextjs";

type Props = {
  params: { conversationId: Id<"conversations"> };
};

const ConversationPage = ({ params: { conversationId } }: Props) => {
  const conversation = useQuery(api.conversation.get, { id: conversationId });
  const { userId } = useAuth();
  const { markAllMessagesAsRead } = useMessageReadReceipts();

  // Mark all messages as read when the user opens the conversation
  useEffect(() => {
    if (conversation && userId) {
      // For group chats and individual conversations
      if (conversation && conversation.currentMember) {
        markAllMessagesAsRead(
          conversationId,
          conversation.currentMember._id as Id<"users">
        );
      }
    }
  }, [conversation, userId, conversationId, markAllMessagesAsRead]);

  // Skeleton loader for the conversation header
  const ConversationHeaderSkeleton = () => (
    <div className="px-4 py-3 border-b sticky top-0 bg-card z-10 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="block lg:hidden w-9 h-9" />{" "}
        {/* Space for back button */}
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex flex-col">
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
    </div>
  );

  // Conversation not found component
  const ConversationNotFound = () => (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <p className="text-muted-foreground text-center">
        This conversation doesn&apos;t exist or you don&apos;t have access to
        it.
      </p>
      <Button asChild variant="secondary">
        <Link href="/conversations">Back to Conversations</Link>
      </Button>
    </div>
  );

  // Conversation header component
  const ConversationHeader = () => {
    if (!conversation) return null;

    // Check if it's a group conversation
    const isGroup = conversation.isGroup;

    // For group conversations
    if (isGroup) {
      // Check if user is an active member (not removed or left)
      const isMemberActive = conversation.currentMember?.isMemberActive;

      return (
        <Header
          imageUrl={conversation.imageUrl || "/group-avatar.png"}
          name={conversation.name || "Group Chat"}
          isGroup={conversation.isGroup}
          memberCount={conversation.otherMembers?.length || 0}
          conversationId={conversationId}
          isMember={isMemberActive}
        />
      );
    }

    // For individual conversations
    return (
      <Header
        imageUrl={conversation.otherMember?.imageUrl}
        name={conversation.otherMember?.username || "Unknown"}
        isGroup={false}
        otherUserId={conversation.otherMember?._id}
        onlineStatus={conversation.otherMember?.onlineStatus || "offline"}
        lastSeen={conversation.otherMember?.lastSeen}
      />
    );
  };
  return (
    <ConversationContainer>
      {conversation === undefined ? (
        // Loading state
        <ConversationHeaderSkeleton />
      ) : conversation === null ? (
        // Conversation not found
        <ConversationNotFound />
      ) : (
        // Conversation found
        <>
          <ConversationHeader />
          <Body />
          <ChatInput />
        </>
      )}
    </ConversationContainer>
  );
};

export default ConversationPage;
