"use client";
import { AdminProductEditResponse } from "@pawpal/shared";
import { createContext, useContext } from "react";

const ProductContext = createContext<AdminProductEditResponse | null>(null);

export const ProductProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: any;
}) => {
  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export const useProduct = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProduct must be used inside ProductProvider");
  return ctx;
};
