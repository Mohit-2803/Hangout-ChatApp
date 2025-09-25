"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Users, Check, X } from "lucide-react";
import { toast } from "sonner";

type Props = {
  id: Id<"groupInvitations">;
  group: {
    _id: Id<"conversations">;
    name?: string;
    imageUrl?: string;
    isGroup: boolean;
  };
  sender: {
    _id: Id<"users">;
    username: string;
    imageUrl?: string;
  };
};

const GroupInvitation = ({ id, group, sender }: Props) => {
  const acceptInvitation = useMutation(api.group.acceptInvitation);
  const rejectInvitation = useMutation(api.group.rejectInvitation);

  const handleAccept = async () => {
    try {
      await acceptInvitation({ invitationId: id });
      toast.success("You have joined the group!");
    } catch (error) {
      console.error("Error accepting invitation:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to accept invitation"
      );
    }
  };

  const handleReject = async () => {
    try {
      await rejectInvitation({ invitationId: id });
      toast.success("Invitation rejected");
    } catch (error) {
      console.error("Error rejecting invitation:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to reject invitation"
      );
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="flex items-center justify-between p-4">
        {/* Left Side: Group Info with Avatar */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-12 w-12">
              <AvatarImage src={group.imageUrl || "/group-avatar.png"} />
              <AvatarFallback>
                {(group.name || "Group").charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full p-1">
              <Users className="h-3 w-3" />
            </div>
          </div>
          <div>
            <p className="font-medium">{group.name || "Group"}</p>
            <p className="text-sm text-muted-foreground">
              Invitation from {sender.username}
            </p>
          </div>
        </div>

        {/* Right Side: Action Buttons */}
        <div className="flex gap-2">
          <Button onClick={handleAccept} size="sm" className="cursor-pointer">
            <Check className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleReject}
            variant="outline"
            size="sm"
            className="cursor-pointer"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupInvitation;
