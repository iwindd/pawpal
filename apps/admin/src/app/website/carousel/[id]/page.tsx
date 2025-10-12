import APISession from "@/libs/api/server";
import { notFound } from "next/navigation";
import CarouselView from "./CarouselView";

export default async function CarouselEditPage({
  params,
}: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = await params;
  const API = await APISession();
  const carousel = await API.carousel.findOne(id);

  if (!carousel.success) notFound();

  return <CarouselView carousel={carousel.data} />;
}
