"use client";

import React from "react";
import ConversationFallback from "@/components/shared/conversation/ConversationFallback";
import ItemList from "@/components/shared/item-list/itemList";
import AddFriendDialog from "./_components/AddFriendDialog";
import Request from "./_components/Request";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

const FriendsPage = () => {
  const requests = useQuery(api.requests.get);

  return (
    <div className="flex gap-4 h-full w-full">
      <ItemList title="Friends" action={<AddFriendDialog />}>
        {requests ? (
          requests.length === 0 ? (
            <p className="text-sm text-gray-500">No friend requests</p>
          ) : (
            requests.map((request) => (
              <Request
                key={request.request._id}
                id={request.request._id}
                imgUrl={request.sender.imageUrl}
                username={request.sender.username}
                email={request.sender.email}
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
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </div>
            </Card>
          ))
        )}
      </ItemList>
      <ConversationFallback />
    </div>
  );
};

export default FriendsPage;
