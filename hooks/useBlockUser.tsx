import { useMutationState } from "./useMutationState";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ConvexError } from "convex/values";
import { toast } from "sonner";

export const useBlockUser = () => {
  const { mutate: blockUser, pending: blockPending } = useMutationState(
    api.block.block
  );
  const { mutate: unblockUser, pending: unblockPending } = useMutationState(
    api.block.unblock
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { mutate: checkIfBlocked, pending: checkPending } = useMutationState(
    api.block.isBlocked
  );

  const block = async (userId: Id<"users">) => {
    await blockUser({ blockedId: userId })
      .then(() => {
        toast.success("User blocked successfully");
      })
      .catch((error) => {
        toast.error(
          error instanceof ConvexError ? error.data : "Failed to block user"
        );
      });
  };

  const unblock = async (userId: Id<"users">) => {
    await unblockUser({ blockedId: userId })
      .then(() => {
        toast.success("User unblocked successfully");
      })
      .catch((error) => {
        toast.error(
          error instanceof ConvexError ? error.data : "Failed to unblock user"
        );
      });
  };

  return {
    block,
    unblock,
    blockPending,
    unblockPending,
    checkPending,
  };
};
