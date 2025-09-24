"use client";

import ConversationContainer from "@/components/shared/conversation/ConversationContainer";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Header from "./_components/Header";

type Props = {
  params: { conversationId: Id<"conversations"> };
};

const ConversationPage = ({ params: { conversationId } }: Props) => {
  const conversation = useQuery(api.conversation.get, { id: conversationId });

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

    return (
      <Header
        imageUrl={conversation.otherMember?.imageUrl}
        name={conversation.otherMember?.username || "Unknown"}
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
          {/* Message content will be implemented later */}
          <div className="flex-1 p-4">
            <p className="text-center text-muted-foreground">
              Message content will be implemented here
            </p>
          </div>
        </>
      )}
    </ConversationContainer>
  );
};

export default ConversationPage;
