"use client";
import CarouselForm from "@/components/Forms/CarouselForm";
import API from "@/libs/api/client";
import { CarouselInput, CarouselResponse } from "@pawpal/shared";
import { notify } from "@pawpal/ui/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { refreshCarousel } from "../actions";

interface CarouselViewProps {
  carousel: CarouselResponse;
}

const CarouselView = ({ carousel }: CarouselViewProps) => {
  const __ = useTranslations("Carousel.notify.updated");
  const [message, setMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: CarouselInput) => {
      return await API.carousel.update(carousel.id, payload);
    },
    onSuccess: ({ data: carousel }) => {
      queryClient.invalidateQueries({ queryKey: ["carousels"] });
      refreshCarousel(carousel.id);
      notify.show({
        title: __("title"),
        message: __("message"),
        color: "green",
      });
    },
    onError: () => setMessage("error"),
  });

  const onSubmit = async (values: CarouselInput) => {
    mutate(values);
  };

  return (
    <div>
      <CarouselForm
        carousel={carousel}
        onSubmit={onSubmit}
        isLoading={isPending}
        errorMessage={message}
      />
    </div>
  );
};

export default CarouselView;
