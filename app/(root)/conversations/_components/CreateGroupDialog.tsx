"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Plus } from "lucide-react";

type Props = {
  children: React.ReactNode;
};

const CreateGroupDialog = ({ children }: Props) => {
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupImage, setGroupImage] = useState("");

  const createGroup = useMutation(api.group.createGroup);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!groupName.trim()) {
      return;
    }

    try {
      const conversationId = await createGroup({
        name: groupName,
        imageUrl: groupImage || undefined,
      });

      // Reset form
      setGroupName("");
      setGroupImage("");
      setOpen(false);

      // Redirect to the new group conversation
      window.location.href = `/conversations/${conversationId}`;
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
          <DialogDescription>
            Create a new group conversation. You will be the admin of this
            group.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="col-span-3"
                placeholder="Enter group name"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Image URL
              </Label>
              <Input
                id="image"
                value={groupImage}
                onChange={(e) => setGroupImage(e.target.value)}
                className="col-span-3"
                placeholder="Enter image URL (optional)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={!groupName.trim()}
              className="cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Create Group
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupDialog;
