"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Users,
  UserMinus,
  UserPlus,
  Settings,
  Mail,
  Crown,
} from "lucide-react";
import { toast } from "sonner";

type Props = {
  conversationId: Id<"conversations">;
  isOpen: boolean;
  onClose: () => void;
};

const GroupInfo = ({ conversationId, isOpen, onClose }: Props) => {
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [isChangeImageDialogOpen, setIsChangeImageDialogOpen] = useState(false);

  // Get conversation to check if user is still an active member
  const conversation = useQuery(api.conversation.get, { id: conversationId });
  const isMemberActive = conversation?.currentMember?.isMemberActive;

  const groupMembers = useQuery(
    api.group.getGroupMembers,
    isMemberActive ? { conversationId } : "skip"
  );
  const isGroupAdmin = useQuery(
    api.group.isGroupAdmin,
    isMemberActive ? { conversationId } : "skip"
  );

  const removeMember = useMutation(api.group.removeMember);
  const updateGroupImage = useMutation(api.group.updateGroupImage);
  const sendInvitation = useMutation(api.group.sendInvitation);

  const handleAddMember = async () => {
    if (!newMemberEmail.trim()) return;

    try {
      await sendInvitation({
        conversationId,
        receiverEmail: newMemberEmail,
      });
      setNewMemberEmail("");
      setIsAddMemberDialogOpen(false);
      toast.success("Invitation sent!");
    } catch (error) {
      console.error("Error adding member:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to send invitation"
      );
    }
  };

  const handleRemoveMember = async (memberId: Id<"users">) => {
    try {
      await removeMember({
        conversationId,
        userId: memberId,
      });
      toast.success("Member removed");
    } catch (error) {
      console.error("Error removing member:", error);
    }
  };

  const handleChangeImage = async () => {
    if (!newImageUrl.trim()) return;

    try {
      await updateGroupImage({
        conversationId,
        imageUrl: newImageUrl,
      });
      setNewImageUrl("");
      setIsChangeImageDialogOpen(false);
    } catch (error) {
      console.error("Error updating group image:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md max-h-[80vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Group Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isMemberActive ? (
            // Display a message when the user is no longer an active member
            <div className="text-center py-4">
              <p className="text-red-500 mb-4">
                {conversation?.currentMember?.status === "removed"
                  ? "You were removed from this group"
                  : "You have left this group"}
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                You can still see message history but cannot access group
                information or send messages.
              </p>
              <Button onClick={onClose} className="w-full cursor-pointer">
                Close
              </Button>
            </div>
          ) : (
            <>
              {/* Group Members */}
              <div>
                <h3 className="font-medium mb-2">
                  Members ({groupMembers?.length || 0})
                </h3>
                <div className="space-y-2">
                  {groupMembers?.map((member) => (
                    <div
                      key={member._id}
                      className="flex items-center justify-between p-2 bg-muted rounded-md"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.imageUrl} />
                          <AvatarFallback>
                            {member.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">
                            {member.username}
                          </p>
                          {member.role === "admin" && (
                            <Badge variant="secondary" className="text-xs">
                              <Crown className="h-3 w-3 mr-1" />
                              Admin
                            </Badge>
                          )}
                        </div>
                      </div>
                      {isGroupAdmin && member.role !== "admin" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMember(member._id)}
                          className="text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          <UserMinus className="h-4 w-4" />
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Admin Controls */}
              {isGroupAdmin && (
                <div className="space-y-2">
                  <h3 className="font-medium">Admin Controls</h3>

                  {/* Add Member Button */}
                  <Dialog
                    open={isAddMemberDialogOpen}
                    onOpenChange={setIsAddMemberDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Member
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Member</DialogTitle>
                        <DialogDescription>
                          Send an invitation to a user to join this group.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="email" className="text-right">
                            Email
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={newMemberEmail}
                            onChange={(e) => setNewMemberEmail(e.target.value)}
                            className="col-span-3"
                            placeholder="Enter user email"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          onClick={handleAddMember}
                          disabled={!newMemberEmail.trim()}
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Send Invitation
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Change Group Image Button */}
                  <Dialog
                    open={isChangeImageDialogOpen}
                    onOpenChange={setIsChangeImageDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Change Group Image
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Change Group Image</DialogTitle>
                        <DialogDescription>
                          Update the group profile picture.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="image" className="text-right">
                            Image URL
                          </Label>
                          <Input
                            id="image"
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                            className="col-span-3"
                            placeholder="Enter image URL"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          onClick={handleChangeImage}
                          disabled={!newImageUrl.trim()}
                        >
                          Update Image
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )}

              {/* Close Button */}
              <Button onClick={onClose} className="w-full cursor-pointer">
                Close
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GroupInfo;
