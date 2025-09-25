import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  MoreVertical,
  Phone,
  Video,
  Circle,
  Info,
  LogOut,
  User,
  Search,
  Bell,
  Ban,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Id } from "@/convex/_generated/dataModel";
import { useBlockUser } from "@/hooks/useBlockUser";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { format } from "date-fns/format";
import GroupInfo from "./GroupInfo";
import { toast } from "sonner";

type Props = {
  imageUrl?: string;
  name: string;
  isGroup?: boolean;
  memberCount?: number;
  otherUserId?: Id<"users">;
  onlineStatus?: string;
  lastSeen?: number | null;
  conversationId?: Id<"conversations">;
  isMember?: boolean;
};

const Header = ({
  imageUrl,
  name,
  isGroup = false,
  memberCount = 0,
  otherUserId,
  onlineStatus = "offline",
  lastSeen = null,
  conversationId,
  isMember = true, // Add prop to check if user is still a member
}: Props) => {
  const { block, unblock } = useBlockUser();
  const isUserBlocked = useQuery(
    api.block.isBlocked,
    otherUserId ? { userId: otherUserId } : "skip"
  );
  const [isGroupInfoOpen, setIsGroupInfoOpen] = useState(false);

  // Check if current user is admin of the group
  const isGroupAdmin = useQuery(
    api.group.isGroupAdmin,
    conversationId ? { conversationId } : "skip"
  );

  // Leave group mutation
  const leaveGroup = useMutation(api.group.leaveGroup);

  // Delete group mutation
  const deleteGroup = useMutation(api.group.deleteGroup);

  const handleBlockUser = () => {
    if (otherUserId) {
      if (isUserBlocked) {
        unblock(otherUserId);
      } else {
        block(otherUserId);
      }
    }
  };

  const handleLeaveGroup = async () => {
    if (!conversationId) return;

    try {
      await leaveGroup({ conversationId });
      toast.success("You have left the group");
      window.location.href = "/conversations";
    } catch (error) {
      console.error("Error leaving group:", error);
      toast.error("Failed to leave the group");
    }
  };

  const handleDeleteGroup = async () => {
    if (!conversationId) return;

    try {
      await deleteGroup({ conversationId });
      toast.success("Group has been deleted");
      window.location.href = "/conversations";
    } catch (error) {
      console.error("Error deleting group:", error);
      toast.error("Failed to delete the group");
    }
  };
  return (
    <Card className="w-full flex flex-row items-center px-4 py-3 justify-between border-b rounded-none sticky top-0 bg-card z-10">
      <div className="flex items-center gap-3">
        <Link className="block lg:hidden" href="/conversations">
          <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <Avatar className="h-10 w-10 border-2 border-primary/10">
          <AvatarImage src={imageUrl} />
          <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h2 className="font-medium text-sm md:text-base">{name}</h2>
          {isGroup ? (
            <p className="text-xs text-muted-foreground">
              {memberCount + 1} {memberCount + 1 === 1 ? "member" : "members"}
            </p>
          ) : (
            <div className="flex items-center gap-1.5">
              <Circle
                className={cn("h-2 w-2 fill-current", {
                  "text-green-500": onlineStatus === "online",
                  "text-yellow-500": onlineStatus === "away",
                  "text-gray-500": onlineStatus === "offline",
                })}
              />
              <p className="text-xs text-muted-foreground">
                {onlineStatus === "online"
                  ? "Online"
                  : onlineStatus === "away"
                    ? "Away"
                    : lastSeen
                      ? `Last seen ${format(lastSeen, "HH:mm")}`
                      : "Offline"}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1">
        {!isGroup && (
          <>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Video className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Phone className="h-5 w-5" />
            </Button>
          </>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full cursor-pointer"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isGroup ? (
              <>
                {isMember && (
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => setIsGroupInfoOpen(true)}
                  >
                    <Info className="h-4 w-4 mr-2" />
                    Group info
                  </DropdownMenuItem>
                )}
                {isMember && (
                  <DropdownMenuItem
                    className="cursor-pointer text-red-500"
                    onClick={handleLeaveGroup}
                  >
                    <LogOut className="h-4 w-4 mr-2" color="red" />
                    Leave group
                  </DropdownMenuItem>
                )}
              </>
            ) : (
              <>
                <DropdownMenuItem className="cursor-pointer">
                  <User className="h-4 w-4 mr-2" />
                  View profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleBlockUser}
                  className={cn("cursor-pointer", {
                    "text-green-600": isUserBlocked,
                    "text-red-600": !isUserBlocked,
                  })}
                >
                  {isUserBlocked ? (
                    <PlusCircle className="h-4 w-4 mr-2" />
                  ) : (
                    <Ban className="h-4 w-4 mr-2" />
                  )}
                  {isUserBlocked ? "Unblock user" : "Block user"}
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <Search className="h-4 w-4 mr-2" />
              Search messages
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Bell className="h-4 w-4 mr-2" />
              Mute notifications
            </DropdownMenuItem>
            {isGroup && isGroupAdmin && (
              <DropdownMenuItem
                className="text-destructive cursor-pointer"
                onClick={handleDeleteGroup}
              >
                Delete group
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Group Info Modal */}
      {isGroup && conversationId && (
        <GroupInfo
          conversationId={conversationId}
          isOpen={isGroupInfoOpen}
          onClose={() => setIsGroupInfoOpen(false)}
        />
      )}
    </Card>
  );
};

export default Header;
