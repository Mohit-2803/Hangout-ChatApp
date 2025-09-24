"use client";

import React from "react";
import ItemList from "@/components/shared/item-list/itemList";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import DMConversationItem from "./_components/DMConversationItem";

type Props = {
  children: React.ReactNode;
};

const ConversationsLayout = ({ children }: Props) => {
  const conversations = useQuery(api.conversations.get);

  return (
    <div className="flex gap-4 h-full w-full">
      <ItemList title="Conversations">
        {conversations ? (
          conversations.length === 0 ? (
            <p className="text-sm text-gray-500">No conversations</p>
          ) : (
            conversations.map((item) => (
              <DMConversationItem
                key={item.conversation._id}
                id={item.conversation._id}
                imageUrl={item.otherMember?.imageUrl || ""}
                username={item.otherMember?.username || "Unknown"}
              />
            ))
          )
        ) : (
          Array.from({ length: 3 }).map((_, index) => (
            <Card
              key={index}
              className="w-full p-2 flex flex-row items-center justify-between gap-2"
            >
              <div className="flex items-center gap-4 truncate">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex flex-col truncate space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            </Card>
          ))
        )}
      </ItemList>
      {children}
    </div>
  );
};

export default ConversationsLayout;
