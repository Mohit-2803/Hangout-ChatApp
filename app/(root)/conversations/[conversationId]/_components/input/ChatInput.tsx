"use client";

import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useConversation } from "@/hooks/useConversation";
import { useMutationState } from "@/hooks/useMutationState";
import { useBlockUser } from "@/hooks/useBlockUser";
import { useQuery } from "convex/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConvexError } from "convex/values";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react";

const chatMessageSchema = z.object({
  content: z
    .string()
    .min(1, "Message cannot be empty")
    .max(1000, "Message is too long"),
});

const ChatInput = () => {
  const textAreaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const { conversationId } = useConversation();

  const { mutate: createMessage } = useMutationState(api.message.create);
  const { unblock } = useBlockUser();

  // Get the other user's ID to check blocking status
  const conversation = useQuery(api.conversation.get, {
    id: conversationId as Id<"conversations">,
  });

  // Check if current user is blocked by the other user
  const isBlockedBy = useQuery(
    api.block.isBlockedBy,
    conversation?.otherMember?._id
      ? { userId: conversation.otherMember._id }
      : "skip"
  );

  // Check if current user has blocked the other user
  const isBlocking = useQuery(
    api.block.isBlocked,
    conversation?.otherMember?._id
      ? { userId: conversation.otherMember._id }
      : "skip"
  );

  const form = useForm<z.infer<typeof chatMessageSchema>>({
    resolver: zodResolver(chatMessageSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof chatMessageSchema>) => {
    await createMessage({
      conversationId,
      type: "text",
      content: [data.content],
    })
      .then(() => {
        form.reset();
        // Auto-scroll will be handled by the Body component when the new message is added
      })
      .catch((err) => {
        toast.error(
          err instanceof ConvexError ? err.data : "Failed to send message"
        );
      });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value, selectionStart } = event.target;

    if (selectionStart !== null) {
      form.setValue("content", value);
    }
  };

  // Check if the user is still an active member of the group
  const isMemberActive = conversation?.currentMember?.isMemberActive;

  // If user is no longer active in the group, show appropriate message
  if (conversation?.isGroup && !isMemberActive) {
    const status = conversation?.currentMember?.status;
    return (
      <Card className="w-full p-4 rounded-lg relative">
        <div className="text-center">
          <p className="text-sm text-red-500">
            {status === "removed"
              ? "You were removed from this group"
              : "You have left this group"}
          </p>
        </div>
      </Card>
    );
  }

  // If user is blocked or has blocked someone, show appropriate message
  if (isBlockedBy || isBlocking) {
    return (
      <Card className="w-full p-4 rounded-lg relative">
        <div className="text-center">
          {isBlockedBy ? (
            <p className="text-sm text-muted-foreground">
              You have been blocked by this contact
            </p>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm text-muted-foreground">
                You have blocked this user
              </p>
              <Button
                onClick={() => {
                  if (conversation?.otherMember?._id) {
                    unblock(conversation.otherMember._id);
                  }
                }}
                variant="outline"
                size="sm"
              >
                Unblock User
              </Button>
            </div>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full p-2 rounded-lg relative">
      <div className="flex gap-2 items-end w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex gap-2 items-end w-full"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="h-full w-full">
                  <FormControl>
                    <TextareaAutosize
                      rows={1}
                      maxRows={3}
                      placeholder="Type a message..."
                      {...field}
                      onChange={handleInputChange}
                      ref={textAreaRef}
                      onKeyDown={async (e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          await form.handleSubmit(handleSubmit)();
                        }
                      }}
                      className="min-h-full w-full resize-none border-0 outline-0 bg-card text-card-foreground placeholder:text-muted-foreground p-1.5"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              <SendHorizonal />
            </Button>
          </form>
        </Form>
      </div>
    </Card>
  );
};

export default ChatInput;
