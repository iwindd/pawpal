"use client";
import { AdminTagResponse } from "@pawpal/shared";
import { createContext, useContext, useState } from "react";

const TagContext = createContext<{
  tag: AdminTagResponse;
  updateTag: (newTag: AdminTagResponse) => void;
} | null>(null);

export const TagProvider = ({
  children,
  defaultValue,
}: {
  children: React.ReactNode;
  defaultValue: AdminTagResponse;
}) => {
  const [value, setValue] = useState<AdminTagResponse>(defaultValue);

  return (
    <TagContext.Provider
      value={{
        tag: value || defaultValue,
        updateTag: (newTag: AdminTagResponse) => {
          setValue(newTag);
        },
      }}
    >
      {children}
    </TagContext.Provider>
  );
};

export const useTag = () => {
  const ctx = useContext(TagContext);
  if (!ctx) throw new Error("useTag must be used inside TagProvider");
  return ctx;
};
