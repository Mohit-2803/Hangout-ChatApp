"use client";

import React from "react";
import ItemList from "@/components/shared/item-list/itemList";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import DMConversationItem from "./_components/DMConversationItem";
import GroupConversationItem from "./_components/GroupConversationItem";
import CreateGroupDialog from "./_components/CreateGroupDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type Props = {
  children: React.ReactNode;
};

const ConversationsLayout = ({ children }: Props) => {
  const conversations = useQuery(api.conversations.get);

  return (
    <div className="flex gap-4 h-full w-full">
      <ItemList
        title="Conversations"
        action={
          <CreateGroupDialog>
            <Button size="sm" variant={"default"} className="cursor-pointer">
              <Plus className="h-4 w-4" />
              Group
            </Button>
          </CreateGroupDialog>
        }
      >
        {conversations ? (
          conversations.length === 0 ? (
            <p className="text-sm text-gray-500">No conversations</p>
          ) : (
            conversations.map((item) => {
              if (item.conversation.isGroup) {
                return (
                  <GroupConversationItem
                    key={item.conversation._id}
                    id={item.conversation._id}
                    imageUrl={item.conversation.imageUrl}
                    name={item.conversation.name || "Group"}
                    memberCount={item?.otherMembers?.length || 0}
                    lastMessageSender={item.lastMessage?.sender}
                    lastMessageContent={item.lastMessage?.content}
                    lastMessageTimestamp={item.conversation._creationTime}
                  />
                );
              } else {
                return (
                  <DMConversationItem
                    key={item.conversation._id}
                    id={item.conversation._id}
                    imageUrl={item.otherMember?.imageUrl || ""}
                    username={item.otherMember?.username || "Unknown"}
                    lastMessageSender={item.lastMessage?.sender}
                    lastMessageContent={item.lastMessage?.content}
                    lastMessageTimestamp={item.conversation._creationTime}
                  />
                );
              }
            })
          )
        ) : (
          Array.from({ length: 8 }).map((_, index) => (
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
