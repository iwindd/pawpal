"use client";
import CarouselForm, {
  CarouselFormControl,
} from "@/components/Forms/CarouselForm";
import PageHeader from "@/components/Pages/PageHeader";
import API from "@/libs/api/client";
import { CarouselInput } from "@pawpal/shared";
import { notify } from "@pawpal/ui/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CarouselCreatePage = () => {
  const __ = useTranslations("Carousel");
  const [message, setMessage] = useState<string | null>(null);
  const [disabled, setDisabled] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: CarouselInput) => {
      return await API.carousel.create(payload);
    },
    onSuccess: ({ data: carousel }) => {
      queryClient.invalidateQueries({ queryKey: ["carousels"] });
      router.push(`/website/carousel/${carousel.id}`);
      notify.show({
        title: __("notify.created.title"),
        message: __("notify.created.message"),
        color: "green",
      });
    },
    onError: () => setMessage("error"),
  });

  const onSubmit = async (values: CarouselInput, form: CarouselFormControl) => {
    mutate(values, {
      onSuccess() {
        setDisabled(true);
        form.reset();
      },
    });
  };

  return (
    <div>
      <PageHeader title={__("create.title")} />
      <CarouselForm
        onSubmit={onSubmit}
        isLoading={isPending}
        errorMessage={message}
        disabled={disabled}
      />
    </div>
  );
};

export default CarouselCreatePage;
