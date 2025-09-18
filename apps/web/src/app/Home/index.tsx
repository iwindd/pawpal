"use client";
import { useTranslations } from "next-intl";
import MainCarousel from "./components/MainCarousel";
import ProductSections from "./components/ProductSections";

export default function Home() {
  const __ = useTranslations("Home");

  return (
    <>
      <MainCarousel />
      <ProductSections />
    </>
  );
}
