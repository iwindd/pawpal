"use client";

import { HomeLayoutInput } from "@pawpal/shared";
import { createContext, ReactNode, useContext, useMemo } from "react";

interface HomeLayoutCreateContextType {
  initialValues: Partial<HomeLayoutInput> | null;
}

const HomeLayoutCreateContext = createContext<
  HomeLayoutCreateContextType | undefined
>(undefined);

export const HomeLayoutCreateProvider = ({
  children,
  initialValues,
}: {
  children: ReactNode;
  initialValues: Partial<HomeLayoutInput> | null;
}) => {
  const value = useMemo(() => ({ initialValues }), [initialValues]);

  return (
    <HomeLayoutCreateContext.Provider value={value}>
      {children}
    </HomeLayoutCreateContext.Provider>
  );
};

export const useHomeLayoutCreateContext = () => {
  const context = useContext(HomeLayoutCreateContext);
  if (context === undefined) {
    throw new Error(
      "useHomeLayoutCreateContext must be used within a HomeLayoutCreateProvider",
    );
  }
  return context;
};
