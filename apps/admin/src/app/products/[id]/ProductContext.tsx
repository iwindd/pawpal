"use client";
import { AdminProductResponse } from "@pawpal/shared";
import { createContext, useContext, useState } from "react";

const ProductContext = createContext<{
  product: AdminProductResponse;
  updateProduct: (newProduct: AdminProductResponse) => void;
} | null>(null);

export const ProductProvider = ({
  children,
  defaultValue,
}: {
  children: React.ReactNode;
  defaultValue: AdminProductResponse;
}) => {
  const [value, setValue] = useState<AdminProductResponse>(defaultValue);

  return (
    <ProductContext.Provider
      value={{
        product: value || defaultValue,
        updateProduct: (newProduct: AdminProductResponse) => {
          setValue(newProduct);
        },
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProduct must be used inside ProductProvider");
  return ctx;
};
