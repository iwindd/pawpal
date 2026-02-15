"use client";
import { AdminProductTagResponse } from "@pawpal/shared";
import { createContext, useContext, useState } from "react";

const ProductTagContext = createContext<{
  productTag: AdminProductTagResponse;
  updateProductTag: (newProductTag: AdminProductTagResponse) => void;
} | null>(null);

export const ProductTagProvider = ({
  children,
  defaultValue,
}: {
  children: React.ReactNode;
  defaultValue: AdminProductTagResponse;
}) => {
  const [value, setValue] = useState<AdminProductTagResponse>(defaultValue);

  return (
    <ProductTagContext.Provider
      value={{
        productTag: value || defaultValue,
        updateProductTag: (newProductTag: AdminProductTagResponse) => {
          setValue(newProductTag);
        },
      }}
    >
      {children}
    </ProductTagContext.Provider>
  );
};

export const useProductTag = () => {
  const ctx = useContext(ProductTagContext);
  if (!ctx)
    throw new Error("useProductTag must be used inside ProductTagProvider");
  return ctx;
};
