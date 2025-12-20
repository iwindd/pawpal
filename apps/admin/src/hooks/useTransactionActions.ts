import {
  useFailJobTransactionMutation,
  useSuccessJobTransactionMutation,
} from "@/features/transaction/transactionApi";
import { useConfirmation } from "@pawpal/ui/hooks";

export const useTransactionActions = () => {
  const { confirmation } = useConfirmation();

  const [successJobTransaction, { isLoading: isSuccessJobTransaction }] =
    useSuccessJobTransactionMutation();

  const [failJobTransaction, { isLoading: isFailJobTransaction }] =
    useFailJobTransactionMutation();

  return {
    isLoading: isSuccessJobTransaction || isFailJobTransaction,
    successJobTransaction: confirmation<string>(successJobTransaction, {
      confirmProps: { color: "green" },
    }),
    failJobTransaction: confirmation<string>(failJobTransaction, {
      confirmProps: { color: "red" },
    }),
  };
};
