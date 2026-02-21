"use client";
import { AdminTransactionResponse } from "@pawpal/shared";
import { createContext, useContext, useState } from "react";

const TransactionContext = createContext<{
  transaction: AdminTransactionResponse;
  updateTransaction: (newTransaction: AdminTransactionResponse) => void;
} | null>(null);

export const TransactionProvider = ({
  children,
  defaultValue,
}: {
  children: React.ReactNode;
  defaultValue: AdminTransactionResponse;
}) => {
  const [value, setValue] = useState<AdminTransactionResponse>(defaultValue);

  return (
    <TransactionContext.Provider
      value={{
        transaction: value || defaultValue,
        updateTransaction: (newTransaction: AdminTransactionResponse) => {
          setValue(newTransaction);
        },
      }}
    >
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
