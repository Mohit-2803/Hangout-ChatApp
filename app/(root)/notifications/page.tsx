"use client";

import React from "react";
import ConversationFallback from "@/components/shared/conversation/ConversationFallback";
import ItemList from "@/components/shared/item-list/itemList";
import GroupInvitation from "../friends/_components/GroupInvitation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

const NotificationsPage = () => {
  const groupInvitations = useQuery(api.group.getGroupInvitations);

  return (
    <div className="flex gap-4 h-full w-full">
      <ItemList title="Notifications">
        {/* Group Invitations Section */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Group Invitations
          </h3>
          {groupInvitations ? (
            groupInvitations.length === 0 ? (
              <p className="text-sm text-gray-500">No group invitations</p>
            ) : (
              groupInvitations.map(
                (invitation) =>
                  invitation.group &&
                  invitation.sender && (
                    <GroupInvitation
                      key={invitation._id}
                      id={invitation._id}
                      group={invitation.group}
                      sender={invitation.sender}
                    />
                  )
              )
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
        </div>
      </ItemList>
      <ConversationFallback />
    </div>
  );
};

export default NotificationsPage;
