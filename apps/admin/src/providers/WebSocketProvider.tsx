"use client";

import { transactionApi } from "@/features/transaction/transactionApi";
import { useAppDispatch } from "@/hooks";
import { createContext, useContext, useEffect } from "react";
import { io, type Socket } from "socket.io-client";

export interface ISocket extends Socket {}
export const socket: ISocket = io("http://localhost:8000") as ISocket;
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
  const socket = useWebSocket();
  const dispatch = useAppDispatch();

  useEffect(() => {
    socket.connect();

    socket.on("onNewJobTransaction", () => {
      console.log("onNewJobTransaction");
      dispatch(transactionApi.util.invalidateTags(["Transactions"]));
    });

    return () => {
      socket.off("onNewJobTransaction");
      socket.disconnect();
    };
  }, [socket]);

  return (
    <WebsocketContext.Provider value={socket}>
      {children}
    </WebsocketContext.Provider>
  );
};
