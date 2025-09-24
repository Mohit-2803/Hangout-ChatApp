import { useParams } from "next/navigation";
import { useMemo } from "react";

export const useConversation = () => {
  const params = useParams();
  const conversationId = useMemo(() => {
    if (!params?.conversationId) {
      return "" as string;
    }
    return params.conversationId;
  }, [params?.conversationId]);

  const isActive = useMemo(() => !!conversationId, [conversationId]);

  return { conversationId, isActive };
};
