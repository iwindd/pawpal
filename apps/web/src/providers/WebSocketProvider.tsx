"use client";

import { setUserBalance } from "@/features/auth/authSlice";
import { clearCurrentCharge } from "@/features/topup/topupSlice";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { IconCheck, IconX } from "@pawpal/icons";
import {
  ENUM_TRANSACTION_STATUS,
  OnTopupTransactionUpdatedProps,
} from "@pawpal/shared";
import { Notifications } from "@pawpal/ui/notifications";
import { useTranslations } from "next-intl";
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
  const __ = useTranslations();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (user?.id) {
      socket.connect();

      socket.on(
        "onTopupTransactionUpdated",
        (data: OnTopupTransactionUpdatedProps) => {
          dispatch(
            setUserBalance({
              type: data.walletType,
              balance: data.balance,
            }),
          );

          dispatch(clearCurrentCharge());

          switch (data.status) {
            case ENUM_TRANSACTION_STATUS.SUCCEEDED:
              return Notifications.update({
                id: `topup-${data.id}`,
                color: "teal",
                title: __("PromptPayManualModal.notify.success.title"),
                message: __("PromptPayManualModal.notify.success.message"),
                icon: <IconCheck size={18} />,
                loading: false,
                autoClose: 2000,
              });
            case ENUM_TRANSACTION_STATUS.FAILED:
              return Notifications.update({
                id: `topup-${data.id}`,
                color: "red",
                title: __("PromptPayManualModal.notify.failed.title"),
                message: __("PromptPayManualModal.notify.failed.message"),
                icon: <IconX size={18} />,
                loading: false,
                autoClose: 2000,
              });
            default:
              break;
          }
        },
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
