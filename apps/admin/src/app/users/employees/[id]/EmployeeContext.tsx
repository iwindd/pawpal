"use client";
import { AdminEmployeeResponse } from "@pawpal/shared";
import React, { createContext, useContext, useMemo, useState } from "react";

const EmployeeContext = createContext<{
  employee: AdminEmployeeResponse;
  updateEmployee: (newEmployee: AdminEmployeeResponse) => void;
} | null>(null);

export const EmployeeProvider = ({
  children,
  defaultValue,
}: {
  children: React.ReactNode;
  defaultValue: AdminEmployeeResponse;
}) => {
  const [value, setValue] = useState<AdminEmployeeResponse>(defaultValue);

  const contextValue = useMemo(
    () => ({
      employee: value || defaultValue,
      updateEmployee: (newEmployee: AdminEmployeeResponse) => {
        setValue(newEmployee);
      },
    }),
    [value, defaultValue]
  );

  return (
    <EmployeeContext.Provider value={contextValue}>
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployee = () => {
  const ctx = useContext(EmployeeContext);
  if (!ctx) throw new Error("useEmployee must be used inside EmployeeProvider");
  return ctx;
};
