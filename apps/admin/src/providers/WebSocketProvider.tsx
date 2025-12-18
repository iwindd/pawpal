"use client";

import { orderApi } from "@/features/order/orderApi";
import { transactionApi } from "@/features/transaction/transactionApi";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { createContext, useContext, useEffect } from "react";
import { io, type Socket } from "socket.io-client";

export interface ISocket extends Socket {}
export const socket: ISocket = io("http://localhost:8000/admin", {
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

      socket.on("onNewJobTransaction", () =>
        dispatch(transactionApi.util.invalidateTags(["Transactions"]))
      );

      socket.on("onNewJobOrder", () =>
        dispatch(orderApi.util.invalidateTags(["Orders"]))
      );
    }

    return () => {
      socket.off("onNewJobTransaction");
      socket.off("onNewJobOrder");
      socket.disconnect();
    };
  }, [socket, user]);

  return (
    <WebsocketContext.Provider value={socket}>
      {children}
    </WebsocketContext.Provider>
  );
};
