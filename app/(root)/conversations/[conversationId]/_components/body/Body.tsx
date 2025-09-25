"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useConversation } from "@/hooks/useConversation";
import { useMessageReadReceipts } from "@/hooks/usePresence";
import { useQuery } from "convex/react";
import React from "react";
import Message from "./Message";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const MessageSkeleton = ({ fromRight }: { fromRight: boolean }) => {
  return (
    <div
      className={cn("flex items-end", {
        "justify-end": fromRight,
      })}
    >
      <div
        className={cn("flex flex-col w-full mx-2", {
          "order-1 items-end": fromRight,
          "order-2 items-start": !fromRight,
        })}
      >
        <div
          className={cn("rounded-lg max-w-[70%]", {
            "rounded-br-none": fromRight,
            "rounded-bl-none": !fromRight,
          })}
        >
          <Skeleton className={`h-10 w-${fromRight ? "32" : "40"}`} />
        </div>
      </div>

      <Avatar
        className={cn("relative w-8 h-8", {
          "order-2": fromRight,
          "order-1": !fromRight,
        })}
      >
        <Skeleton className="h-full w-full rounded-full" />
      </Avatar>
    </div>
  );
};

const Body = () => {
  const { conversationId } = useConversation();
  const { markAllMessagesAsRead } = useMessageReadReceipts();

  const messages = useQuery(api.messages.get, {
    id: conversationId as Id<"conversations">,
  });

  // Get the other user's ID to check if they've blocked the current user
  const conversation = useQuery(api.conversation.get, {
    id: conversationId as Id<"conversations">,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isBlockedBy = useQuery(
    api.block.isBlockedBy,
    conversation?.otherMember?._id
      ? { userId: conversation.otherMember._id }
      : "skip"
  );

  // Mark messages as read when they are rendered
  React.useEffect(() => {
    if (messages && conversation?.currentMember && messages.length > 0) {
      // Mark all messages as read
      markAllMessagesAsRead(
        conversationId as Id<"conversations">,
        conversation.currentMember._id as Id<"users">
      );
    }
  }, [messages, conversation, markAllMessagesAsRead, conversationId]);

  const isLoading = messages === undefined;

  return (
    <div className="flex-1 w-full flex overflow-y-scroll flex-col-reverse gap-2 p-3 no-scrollbar">
      {isLoading ? (
        <>
          <MessageSkeleton fromRight={true} />
          <MessageSkeleton fromRight={false} />
          <MessageSkeleton fromRight={true} />
          <MessageSkeleton fromRight={false} />
          <MessageSkeleton fromRight={true} />
        </>
      ) : (
        <>
          {messages
            .filter((msg): msg is NonNullable<typeof msg> => msg !== null)
            .map(
              (
                {
                  message,
                  senderImage,
                  senderName,
                  isCurrentUser,
                  readStatus,
                  readBy,
                },
                index,
                filteredMessages
              ) => {
                const lastByUser =
                  filteredMessages[index - 1]?.message.senderId ===
                  filteredMessages[index].message.senderId;

                return (
                  <Message
                    key={message._id}
                    fromCurrentUser={isCurrentUser}
                    senderImage={senderImage}
                    senderName={senderName}
                    lastByUser={lastByUser}
                    content={message.content}
                    createdAt={message._creationTime}
                    type={message.type}
                    readStatus={readStatus}
                    readBy={readBy}
                  />
                );
              }
            )}
        </>
      )}
    </div>
  );
};

export default Body;
