import React from "react";
import { Id } from "@/convex/_generated/dataModel";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CheckIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { ConvexError } from "convex/values";
import { api } from "@/convex/_generated/api";
import { useMutationState } from "@/hooks/useMutationState";

type Props = {
  id: Id<"requests">;
  imgUrl: string;
  username: string;
  email: string;
};

const Request = ({ id, imgUrl, username, email }: Props) => {
  const { mutate: acceptRequest, pending: acceptPending } = useMutationState(
    api.request.accept
  );
  const { mutate: denyRequest, pending: denyPending } = useMutationState(
    api.request.deny
  );

  return (
    <Card className="w-full p-2 flex flex-row items-center justify-between gap-2">
      <div className="flex items-center gap-4 truncate">
        <Avatar>
          <AvatarImage src={imgUrl} />
          <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col truncate">
          <h4 className="truncate">{username}</h4>
          <span className="text-sm text-gray-500 truncate">{email}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          className="cursor-pointer"
          onClick={() => {
            acceptRequest({ id })
              .then(() => {
                toast.success("Friend request accepted");
              })
              .catch((err) => {
                toast.error(
                  err instanceof ConvexError
                    ? err.data
                    : "Failed to accept friend request"
                );
              });
          }}
          disabled={acceptPending || denyPending}
        >
          <CheckIcon />
        </Button>
        <Button
          size="icon"
          className="cursor-pointer"
          onClick={() => {
            denyRequest({ id })
              .then(() => {
                toast.success("Friend request denied");
              })
              .catch((err) => {
                toast.error(
                  err instanceof ConvexError
                    ? err.data
                    : "Failed to deny friend request"
                );
              });
          }}
          variant={"destructive"}
          disabled={acceptPending || denyPending}
        >
          <XIcon />
        </Button>
      </div>
    </Card>
  );
};

export default Request;
