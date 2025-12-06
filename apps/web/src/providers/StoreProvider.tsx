"use client";
import { AuthState } from "@/features/auth/authSlice";
import { AppStore, makeStore } from "@/libs/store";
import { useRef } from "react";
import { Provider } from "react-redux";

export default function StoreProvider({
  children,
  preloadedState,
}: Readonly<{
  children: React.ReactNode;
  preloadedState: { auth: AuthState };
}>) {
  const storeRef = useRef<AppStore | null>(null);
  storeRef.current ??= makeStore(preloadedState);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
