"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBlockUser } from "@/hooks/useBlockUser";
import { Id } from "@/convex/_generated/dataModel";

const BlockedUsersPage = () => {
  const blockedUsers = useQuery(api.block.getBlockedUsers);
  const { unblock, unblockPending } = useBlockUser();

  const handleUnblock = (userId: Id<"users">) => {
    unblock(userId);
  };

  return (
    <div className="flex flex-col gap-4 h-full p-4">
      <h1 className="text-2xl font-bold">Blocked Users</h1>

      {blockedUsers === undefined ? (
        // Loading state
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card
              key={index}
              className="w-full p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex flex-col space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <Skeleton className="h-8 w-16" />
            </Card>
          ))}
        </div>
      ) : blockedUsers.length === 0 ? (
        // No blocked users
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <p className="text-muted-foreground text-center">
            You havent blocked any users.
          </p>
        </div>
      ) : (
        // List of blocked users
        <div className="space-y-4">
          {blockedUsers
            .filter((user): user is NonNullable<typeof user> => user !== null)
            .map((user) => (
              <Card
                key={user._id}
                className="w-full p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.imageUrl} />
                    <AvatarFallback>
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{user.username}</h3>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => handleUnblock(user._id)}
                  disabled={unblockPending}
                  variant="outline"
                >
                  Unblock
                </Button>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
};

export default BlockedUsersPage;
