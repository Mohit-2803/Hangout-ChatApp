import ConversationContainer from "@/components/shared/conversation/ConversationContainer";
import { Id } from "@/convex/_generated/dataModel";
import { Suspense } from "react";
import ConversationContent from "./_components/ConversationContent";

type Props = {
  params: Promise<{ conversationId: Id<"conversations"> }>;
};

const ConversationPage = async ({ params }: Props) => {
  const { conversationId } = await params;

  return (
    <ConversationContainer>
      <Suspense fallback={<div>Loading...</div>}>
        <ConversationContent conversationId={conversationId} />
      </Suspense>
    </ConversationContainer>
  );
};

export default ConversationPage;
