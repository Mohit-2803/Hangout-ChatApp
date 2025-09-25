"use client";

import React, { createContext, useContext } from "react";

interface MessageScrollContextType {
  scrollToBottom: () => void;
  smoothScrollToBottom: () => void;
}

const MessageScrollContext = createContext<MessageScrollContextType | null>(
  null
);

export const useMessageScrollContext = () => {
  const context = useContext(MessageScrollContext);
  if (!context) {
    throw new Error(
      "useMessageScrollContext must be used within a MessageScrollProvider"
    );
  }
  return context;
};

interface MessageScrollProviderProps {
  children: React.ReactNode;
  scrollAreaRef: React.RefObject<HTMLDivElement>;
}

export const MessageScrollProvider: React.FC<MessageScrollProviderProps> = ({
  children,
  scrollAreaRef,
}) => {
  const scrollToBottom = React.useCallback(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = 0;
    }
  }, [scrollAreaRef]);

  const smoothScrollToBottom = React.useCallback(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [scrollAreaRef]);

  const contextValue = React.useMemo(
    () => ({
      scrollToBottom,
      smoothScrollToBottom,
    }),
    [scrollToBottom, smoothScrollToBottom]
  );

  return (
    <MessageScrollContext.Provider value={contextValue}>
      {children}
    </MessageScrollContext.Provider>
  );
};
