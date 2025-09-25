import { Id } from "@/convex/_generated/dataModel";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import React from "react";
import { format } from "date-fns";
import { Users } from "lucide-react";

type Props = {
  id: Id<"conversations">;
  imageUrl?: string;
  name: string;
  memberCount: number;
  lastMessageSender?: string;
  lastMessageContent?: string;
  lastMessageTimestamp?: number;
};

const GroupConversationItem = ({
  id,
  imageUrl,
  name,
  memberCount,
  lastMessageSender,
  lastMessageContent,
  lastMessageTimestamp,
}: Props) => {
  const getLastMessage = () => {
    if (lastMessageContent) {
      return `${lastMessageSender}: ${lastMessageContent}`;
    }
    return "Click to view conversation";
  };

  return (
    <Link className="w-full" href={`/conversations/${id}`}>
      <Card className="w-full p-2 flex flex-row items-center gap-4 hover:bg-accent transition cursor-pointer">
        <div className="relative">
          <Avatar>
            <AvatarImage src={imageUrl || "/group-avatar.png"} />
            <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-0.5">
            <Users className="h-3 w-3" />
          </div>
        </div>
        <div className="flex flex-col truncate flex-1">
          <div className="flex justify-between items-center mr-0.5">
            <h4 className="truncate font-medium">{name}</h4>
            {lastMessageTimestamp && (
              <span className="text-xs text-gray-400">
                {format(new Date(lastMessageTimestamp), "HH:mm")}
              </span>
            )}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 truncate">
              {getLastMessage()}
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Users className="h-3 w-3" />
              {memberCount + 1}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default GroupConversationItem;
