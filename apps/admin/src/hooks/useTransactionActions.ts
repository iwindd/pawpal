import {
  useSetAsFailedMutation,
  useSetAsSucceedMutation,
} from "@/services/transaction";
import { useConfirmation } from "@pawpal/ui/hooks";

export const useTransactionActions = () => {
  const { confirmation } = useConfirmation();

  const [setAsFailed, { isLoading: isSetAsFailed }] = useSetAsFailedMutation();
  const [setAsSucceed, { isLoading: isSetAsSucceed }] =
    useSetAsSucceedMutation();

  return {
    isLoading: isSetAsFailed || isSetAsSucceed,
    setSuccess: confirmation<string>(setAsSucceed, {
      confirmProps: { color: "green" },
    }),
    setFailed: confirmation<string>(setAsFailed, {
      confirmProps: { color: "red" },
    }),
  };
};
