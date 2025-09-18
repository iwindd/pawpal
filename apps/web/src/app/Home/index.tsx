"use client";
import { useTranslations } from "next-intl";
import MainCarousel from "./components/MainCarousel";

export default function Home() {
  const __ = useTranslations("Home");

  return <MainCarousel />;
}
