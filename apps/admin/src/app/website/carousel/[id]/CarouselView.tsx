"use client";
import CarouselForm from "@/components/Forms/CarouselForm";
import { useUpdateCarouselMutation } from "@/services/carousel";
import { CarouselInput, CarouselResponse } from "@pawpal/shared";
import { notify } from "@pawpal/ui/notifications";
import { useTranslations } from "next-intl";

interface CarouselViewProps {
  carousel: CarouselResponse;
}

const CarouselView = ({ carousel }: CarouselViewProps) => {
  const __ = useTranslations("Carousel.notify.updated");
  const [updateCarouselMutation, { isLoading, error }] =
    useUpdateCarouselMutation();

  const onSubmit = async (values: CarouselInput) => {
    const response = await updateCarouselMutation({
      carouselId: carousel.id,
      payload: values,
    });

    if (response.error) return;
    notify.show({
      title: __("title"),
      message: __("message"),
      color: "green",
    });
  };

  return (
    <div>
      <CarouselForm
        carousel={carousel}
        onSubmit={onSubmit}
        isLoading={isLoading}
        errorMessage={error && "error"}
      />
    </div>
  );
};

export default CarouselView;
