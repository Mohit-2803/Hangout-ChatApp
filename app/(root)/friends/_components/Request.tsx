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
    <Card className="w-full">
      <div className="p-4 flex items-center justify-between">
        {/* Left Side: User Info with Avatar */}
        <div className="flex items-center gap-4 truncate">
          <Avatar className="h-12 w-12">
            <AvatarImage src={imgUrl} />
            <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="font-medium">{username}</p>
            <p className="text-sm text-muted-foreground truncate">{email}</p>
          </div>
        </div>

        {/* Right Side: Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
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
            <CheckIcon className="h-4 w-4 mr-1" />
            Accept
          </Button>
          <Button
            size="sm"
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
            variant="outline"
            disabled={acceptPending || denyPending}
          >
            <XIcon className="h-4 w-4 mr-1" />
            Reject
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Request;
