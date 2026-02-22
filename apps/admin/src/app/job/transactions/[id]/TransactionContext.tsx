"use client";
import {
  useAssignJobTransactionMutation,
  useFailJobTransactionMutation,
  useSuccessJobTransactionMutation,
} from "@/features/transaction/transactionApi";
import { AdminTransactionResponse } from "@pawpal/shared";
import { useConfirmation } from "@pawpal/ui/hooks";
import { createContext, useContext, useMemo, useState } from "react";

const TransactionContext = createContext<{
  transaction: AdminTransactionResponse;
  isLoading: boolean;
  actions: {
    assign: () => Promise<void>;
    success: () => Promise<void>;
    fail: () => Promise<void>;
  };
} | null>(null);

export const TransactionProvider = ({
  children,
  defaultValue,
}: {
  children: React.ReactNode;
  defaultValue: AdminTransactionResponse;
}) => {
  const { confirmation } = useConfirmation();
  const [transaction, setTransaction] =
    useState<AdminTransactionResponse>(defaultValue);

  const [successJob, { isLoading: isLoadingSuccess }] =
    useSuccessJobTransactionMutation();

  const [failJob, { isLoading: isLoadingFail }] =
    useFailJobTransactionMutation();

  const [assignJob, { isLoading: isLoadingAssign }] =
    useAssignJobTransactionMutation();

  const handleAssign = confirmation(
    async () => {
      try {
        const response = await assignJob(transaction.id).unwrap();

        setTransaction((prev) => ({
          ...prev,
          ...response,
        }));
      } catch (error) {
        console.error(`Assign Job Error: ${error}`);
      }
    },
    {
      confirmProps: { color: "blue" },
      title: "Assign Case",
      message: "Are you sure you want to assign this case?",
    },
  );

  const handleSuccess = confirmation(
    async () => {
      try {
        const response = await successJob(transaction.id).unwrap();

        setTransaction((prev) => ({
          ...prev,
          ...response,
        }));
      } catch (error) {
        console.error(`Success Job Error: ${error}`);
      }
    },
    {
      confirmProps: { color: "green" },
      title: "Success Case",
      message: "Are you sure you want to success this case?",
    },
  );

  const handleFail = confirmation(
    async () => {
      try {
        const response = await failJob(transaction.id).unwrap();

        setTransaction((prev) => ({
          ...prev,
          ...response,
        }));
      } catch (error) {
        console.error(`Fail Job Error: ${error}`);
      }
    },
    {
      confirmProps: { color: "red" },
      title: "Fail Case",
      message: "Are you sure you want to fail this case?",
    },
  );

  const value = useMemo(() => {
    return {
      transaction: transaction,
      isLoading: isLoadingAssign || isLoadingSuccess || isLoadingFail,
      actions: {
        assign: handleAssign as () => Promise<void>,
        success: handleSuccess as () => Promise<void>,
        fail: handleFail as () => Promise<void>,
      },
    };
  }, [
    transaction,
    isLoadingAssign,
    isLoadingSuccess,
    isLoadingFail,
    confirmation,
  ]);

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransaction = () => {
  const ctx = useContext(TransactionContext);
  if (!ctx)
    throw new Error("useTransaction must be used inside TransactionProvider");
  return ctx;
};
