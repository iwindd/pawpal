/* eslint-disable no-undef */
import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "./app"),
      "@/components": path.resolve(__dirname, "./app/components"),
      "@/lib": path.resolve(__dirname, "./app/lib"),
      "@/utils": path.resolve(__dirname, "./app/utils"),
      "@/hooks": path.resolve(__dirname, "./app/hooks"),
      "@/types": path.resolve(__dirname, "./app/types"),
      "@/config": path.resolve(__dirname, "./app/configs"),
      "@/styles": path.resolve(__dirname, "./app/styles"),
      "@/public": path.resolve(__dirname, "./public"),
    };
    return config;
  },
};

export default nextConfig;
