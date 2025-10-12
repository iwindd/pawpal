import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const STORAGE_URL = new URL(process.env.NEXT_PUBLIC_STORAGE_URL || "");

const nextConfig: NextConfig = {
  images: {
    qualities: [25, 50, 75, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.gtranslate.net",
        port: "",
        pathname: "/flags/svg/**",
      },
      {
        protocol: STORAGE_URL.protocol === "http:" ? "http" : "https",
        hostname: STORAGE_URL.hostname,
        port: STORAGE_URL.port || "8000",
        pathname: `${STORAGE_URL.pathname}/**`,
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
