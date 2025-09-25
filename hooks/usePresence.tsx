"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Id } from "@/convex/_generated/dataModel";

export const usePresence = () => {
  const { userId } = useAuth();
  const updatePresence = useMutation(api.presence.updatePresence);
  const [isActive, setIsActive] = useState(true);

  // Update presence when the user comes online or goes offline
  useEffect(() => {
    if (!userId) return;

    const handleVisibilityChange = () => {
      const newActive = !document.hidden;
      setIsActive(newActive);

      // Immediately update status when visibility changes
      if (newActive) {
        updatePresence({ clerkId: userId, onlineStatus: "online" });
      } else {
        updatePresence({ clerkId: userId, onlineStatus: "away" });
      }
    };

    const handleOnline = () => {
      setIsActive(true);
      updatePresence({ clerkId: userId, onlineStatus: "online" });
    };

    const handleOffline = () => {
      setIsActive(false);
      updatePresence({ clerkId: userId, onlineStatus: "offline" });
    };

    // Detect user activity to prevent "away" status when user is active
    const handleActivity = () => {
      if (!isActive) {
        setIsActive(true);
        updatePresence({ clerkId: userId, onlineStatus: "online" });
      }
    };

    // Set up event listeners
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Track user activity
    document.addEventListener("mousemove", handleActivity);
    document.addEventListener("keydown", handleActivity);
    document.addEventListener("click", handleActivity);

    // Initial presence update
    updatePresence({ clerkId: userId, onlineStatus: "online" });

    // Update presence based on activity
    const interval = setInterval(() => {
      if (isActive) {
        updatePresence({ clerkId: userId, onlineStatus: "online" });
      } else {
        updatePresence({ clerkId: userId, onlineStatus: "away" });
      }
    }, 15000); // Update every 15 seconds for more responsive status

    return () => {
      // Clean up event listeners
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      document.removeEventListener("mousemove", handleActivity);
      document.removeEventListener("keydown", handleActivity);
      document.removeEventListener("click", handleActivity);
      clearInterval(interval);

      // Set as offline when component unmounts
      updatePresence({ clerkId: userId, onlineStatus: "offline" });
    };
  }, [userId, isActive, updatePresence]);

  return { isActive };
};

export const useUserPresence = (clerkId: string) => {
  const presence = useQuery(api.presence.getPresence, { clerkId });
  return presence;
};

export const useMessageReadReceipts = () => {
  const markAsRead = useMutation(api.message.markAsRead);
  const markAllAsRead = useMutation(api.message.markAllAsRead);

  const markMessageAsRead = async (
    messageId: Id<"messages">,
    userId: Id<"users">
  ) => {
    await markAsRead({ messageId, userId });
  };

  const markAllMessagesAsRead = async (
    conversationId: Id<"conversations">,
    userId: Id<"users">
  ) => {
    await markAllAsRead({ conversationId, userId });
  };

  return { markMessageAsRead, markAllMessagesAsRead };
};
