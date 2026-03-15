import APISession from "@/libs/api/server";
import { ReactNode } from "react";
import { HomeLayoutCreateProvider } from "./context";

export default async function HomeLayoutCreateLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const API = await APISession();
  const latestPublishedLayout = await API.homeLayout.getPublishedHomeLayout();

  return (
    <HomeLayoutCreateProvider initialValues={latestPublishedLayout}>
      {children}
    </HomeLayoutCreateProvider>
  );
}
