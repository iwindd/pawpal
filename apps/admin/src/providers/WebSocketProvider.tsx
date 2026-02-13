"use client";

import {
  addOrder,
  addTransaction,
  finishedOrder,
  finishedTransaction,
} from "@/features/job/jobSlice";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { AdminOrderResponse, AdminTransactionResponse } from "@pawpal/shared";
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

      socket.on(
        "onNewJobTransaction",
        (transaction: AdminTransactionResponse) => {
          dispatch(addTransaction(transaction));
        },
      );

      socket.on(
        "onFinishedJobTransaction",
        (transaction: AdminTransactionResponse) => {
          dispatch(finishedTransaction(transaction));
        },
      );

      socket.on("onNewJobOrder", (order: AdminOrderResponse) => {
        dispatch(addOrder(order));
      });

      socket.on("onFinishedJobOrder", (order: AdminOrderResponse) => {
        dispatch(finishedOrder(order));
      });
    }

    return () => {
      socket.off("onNewJobTransaction");
      socket.off("onFinishedJobTransaction");
      socket.off("onNewJobOrder");
      socket.off("onFinishedJobOrder");
      socket.disconnect();
    };
  }, [socket, user]);

  return (
    <WebsocketContext.Provider value={socket}>
      {children}
    </WebsocketContext.Provider>
  );
};
