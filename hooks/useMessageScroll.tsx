"use client";

import React from "react";

export const useMessageScroll = () => {
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  // Function to scroll to bottom (or top since we're using flex-col-reverse)
  const scrollToBottom = React.useCallback(() => {
    if (scrollAreaRef.current) {
      // Since we're using flex-col-reverse, scrollTop 0 is the bottom
      scrollAreaRef.current.scrollTop = 0;
    }
  }, []);

  // Function to smoothly scroll to bottom
  const smoothScrollToBottom = React.useCallback(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, []);

  return {
    scrollAreaRef,
    scrollToBottom,
    smoothScrollToBottom,
  };
};
