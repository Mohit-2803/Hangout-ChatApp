import React from "react";
import { format } from "date-fns/format";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, CheckCheck, Info } from "lucide-react";

type Props = {
  fromCurrentUser: boolean;
  senderImage: string | null;
  senderName: string;
  lastByUser: boolean;
  content: string[];
  createdAt: number;
  type: string;
  readStatus?: string;
};

const Message = ({
  fromCurrentUser,
  senderImage,
  senderName,
  lastByUser,
  content,
  createdAt,
  type,
  readStatus = "sent",
}: Props) => {
  const formatTime = (timestamp: number) => {
    return format(timestamp, "HH:mm");
  };

  // Render system message differently
  if (type === "system") {
    return (
      <div className="flex justify-center my-2">
        <div className="bg-muted px-4 py-2 rounded-full flex items-center text-xs text-muted-foreground">
          <Info className="h-3 w-3 mr-1" />
          {content.join("")}
          <span className="ml-2">{formatTime(createdAt)}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("flex items-end", {
        "justify-end": fromCurrentUser,
      })}
    >
      <div
        className={cn("flex flex-col w-full mx-2", {
          "order-1 items-end": fromCurrentUser,
          "order-2 items-start": !fromCurrentUser,
        })}
      >
        <div
          className={cn("px-4 py-2 rounded-lg max-w-[70%]", {
            "bg-primary text-primary-foreground": fromCurrentUser,
            "bg-secondary text-secondary-foreground": !fromCurrentUser,
            "rounded-br-none": fromCurrentUser && !lastByUser,
            "rounded-bl-none": !fromCurrentUser && !lastByUser,
          })}
        >
          {type === "text" ? (
            <p className="text-wrap break-words whitespace-pre-wrap">
              {content.join("")}
            </p>
          ) : null}
          <div
            className={cn("text-xs flex w-full my-1 items-center gap-1", {
              "text-primary-foreground/70 justify-end": fromCurrentUser,
              "text-secondary-foreground/70 justify-start": !fromCurrentUser,
            })}
          >
            <span>{formatTime(createdAt)}</span>
            {fromCurrentUser && (
              <span className="ml-1">
                {readStatus === "sent" && <Check className="h-3 w-3" />}
                {readStatus === "delivered" && (
                  <CheckCheck className="h-3 w-3" />
                )}
                {readStatus === "read" && (
                  <CheckCheck className="h-3 w-3 text-pink-600" />
                )}
              </span>
            )}
          </div>
        </div>
      </div>

      <Avatar
        className={cn("relative w-8 h-8", {
          "order-2": fromCurrentUser,
          "order-1": !fromCurrentUser,
          invisible: lastByUser,
        })}
      >
        <AvatarImage src={senderImage || undefined} />
        <AvatarFallback>{senderName.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default Message;
