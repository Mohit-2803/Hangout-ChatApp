"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/convex/_generated/api";
import { UserPlus } from "lucide-react";
import { ConvexError } from "convex/values";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutationState } from "@/hooks/useMutationState";

const addFriendFormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

const AddFriendDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: createFriendRequest, pending } = useMutationState(
    api.request.create
  );

  const form = useForm<z.infer<typeof addFriendFormSchema>>({
    resolver: zodResolver(addFriendFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof addFriendFormSchema>) => {
    try {
      await createFriendRequest({ email: values.email });
      toast.success("Friend request sent successfully!");
      form.reset();
      setIsOpen(false);
    } catch (error) {
      let errorMessage = "An unexpected error occurred";

      if (error instanceof ConvexError) {
        errorMessage = error.data;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      form.setError("email", {
        type: "manual",
        message: errorMessage,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant={"outline"} className="cursor-pointer">
          <UserPlus />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Friend</DialogTitle>
          <DialogDescription>
            Send a friend request by entering their email address.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="friend@example.com"
                      type="email"
                      {...field}
                      disabled={pending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={pending}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={pending}
                className="cursor-pointer"
              >
                {pending ? "Sending..." : "Send Request"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFriendDialog;
