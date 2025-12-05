"use client";
import CarouselForm from "@/components/Forms/CarouselForm";
import PageHeader from "@/components/Pages/PageHeader";
import { useCreateCarouselMutation } from "@/services/carousel";
import { CarouselInput } from "@pawpal/shared";
import { notify } from "@pawpal/ui/notifications";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CarouselCreatePage = () => {
  const __ = useTranslations("Carousel");
  const [disabled, setDisabled] = useState<boolean>(false);
  const router = useRouter();

  const [createCarouselMutation, { isLoading, error }] =
    useCreateCarouselMutation();

  const onSubmit = async (payload: CarouselInput) => {
    const response = await createCarouselMutation(payload);
    if (response.error) return;

    setDisabled(true);
    router.push(`/website/carousel/${response.data.id}`);
    notify.show({
      title: __("notify.created.title"),
      message: __("notify.created.message"),
      color: "green",
    });
  };

  return (
    <div>
      <PageHeader title={__("create.title")} />
      <CarouselForm
        onSubmit={onSubmit}
        isLoading={isLoading}
        errorMessage={error && "error"}
        disabled={disabled}
      />
    </div>
  );
};

export default CarouselCreatePage;
