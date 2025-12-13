"use client";

import { setUserBalance } from "@/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { OnTopupTransactionUpdatedProps } from "@pawpal/shared";
import { createContext, useContext, useEffect } from "react";
import { io, type Socket } from "socket.io-client";

export interface ISocket extends Socket {}
export const socket: ISocket = io("http://localhost:8000/user", {
  withCredentials: true,
  autoConnect: false,
}) as ISocket;
export const WebsocketContext = createContext<ISocket>(socket);

export const useWebSocket = () => {
  const context = useContext(WebsocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};

export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (user?.id) {
      socket.connect();

      socket.on(
        "onTopupTransactionUpdated",
        (data: OnTopupTransactionUpdatedProps) =>
          dispatch(
            setUserBalance({
              type: data.walletType,
              balance: data.balance,
            })
          )
      );
    }

    return () => {
      socket.disconnect();
      socket.off("onTopupTransactionUpdated");
    };
  }, [socket, user]);

  return (
    <WebsocketContext.Provider value={socket}>
      {children}
    </WebsocketContext.Provider>
  );
};
