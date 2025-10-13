import PageHeader from "@/components/Pages/PageHeader";
import APISession from "@/libs/api/server";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import CarouselView from "./CarouselView";

export default async function CarouselEditPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;
  const API = await APISession();
  const carousel = await API.carousel.findOne(id);
  const __ = await getTranslations("Carousel");

  if (!carousel.success) notFound();

  return (
    <div>
      <PageHeader title={__("edit.title")} />
      <CarouselView carousel={carousel.data} />;
    </div>
  );
}
