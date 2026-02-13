"use client";
import { AdminCategoryResponse } from "@pawpal/shared";
import { createContext, useContext, useState } from "react";

const CategoryContext = createContext<{
  category: AdminCategoryResponse;
  updateCategory: (newCategory: AdminCategoryResponse) => void;
} | null>(null);

export const CategoryProvider = ({
  children,
  defaultValue,
}: {
  children: React.ReactNode;
  defaultValue: AdminCategoryResponse;
}) => {
  const [value, setValue] = useState<AdminCategoryResponse>(defaultValue);

  return (
    <CategoryContext.Provider
      value={{
        category: value || defaultValue,
        updateCategory: (newCategory: AdminCategoryResponse) => {
          setValue(newCategory);
        },
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => {
  const ctx = useContext(CategoryContext);
  if (!ctx) throw new Error("useCategory must be used inside CategoryProvider");
  return ctx;
};
