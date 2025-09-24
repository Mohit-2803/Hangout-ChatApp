import { Id } from "@/convex/_generated/dataModel";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import React from "react";

type Props = {
  id: Id<"conversations">;
  imageUrl: string;
  username: string;
};

const DMConversationItem = ({ id, imageUrl, username }: Props) => {
  return (
    <Link className="w-full" href={`/conversations/${id}`}>
      <Card className="w-full p-2 flex flex-row items-center gap-4 hover:bg-accent transition cursor-pointer">
        <Avatar>
          <AvatarImage src={imageUrl} />
          <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col truncate">
          <h4 className="truncate font-medium">{username}</h4>
          <span className="text-sm text-gray-500 truncate">
            Click to view conversation
          </span>
        </div>
      </Card>
    </Link>
  );
};

export default DMConversationItem;
