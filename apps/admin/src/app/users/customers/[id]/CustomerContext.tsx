"use client";
import { AdminCustomerResponse } from "@pawpal/shared";
import React, { createContext, useContext, useState } from "react";

const CustomerContext = createContext<{
  customer: AdminCustomerResponse;
  updateCustomer: (newCustomer: AdminCustomerResponse) => void;
} | null>(null);

export const CustomerProvider = ({
  children,
  defaultValue,
}: {
  children: React.ReactNode;
  defaultValue: AdminCustomerResponse;
}) => {
  const [value, setValue] = useState<AdminCustomerResponse>(defaultValue);

  const contextValue = React.useMemo(
    () => ({
      customer: value || defaultValue,
      updateCustomer: (newCustomer: AdminCustomerResponse) => {
        setValue(newCustomer);
      },
    }),
    [value, defaultValue]
  );

  return (
    <CustomerContext.Provider value={contextValue}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => {
  const ctx = useContext(CustomerContext);
  if (!ctx) throw new Error("useCustomer must be used inside CustomerProvider");
  return ctx;
};
