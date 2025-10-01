import AppLayout from "@/components/layouts/AppLayout";
import { AuthProvider } from "@/contexts/AuthContext";
import APISession from "@/libs/api/server";
import { ColorSchemeScript, mantineHtmlProps } from "@pawpal/ui/core";
import lamoon from "@pawpal/ui/fonts/lamoon";
import sarabun from "@pawpal/ui/fonts/sarabun";
import { UIProvider } from "@pawpal/ui/provider";
import "@pawpal/ui/styles/global.css";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";

export const metadata: Metadata = {
  title: "Pawpal Admin",
  description: "Pawpal Admin Dashboard",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let session = null;

  try {
    const API = await APISession();
    const response = await API.auth.getProfile();
    session = response.success ? response.data : null;
  } catch (error) {
    console.error("Failed to load user session:", error);
    session = null;
  }

  return (
    <html
      lang="en"
      {...mantineHtmlProps}
      suppressHydrationWarning
      className={`${sarabun.className} ${lamoon.className}`}
    >
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <ColorSchemeScript />
      </head>
      <body>
        <NextIntlClientProvider>
          <UIProvider>
            <AuthProvider session={session}>
              {session ? <AppLayout>{children}</AppLayout> : children}
            </AuthProvider>
          </UIProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
