"use client";
import HomeLayoutForm from "@/components/Forms/HomeLayoutForm";
import PageHeader from "@/components/Pages/PageHeader";
import { getPath } from "@/configs/route";
import { useCreateHomeLayoutMutation } from "@/features/home-layout/homeLayoutApi";
import { HomeLayoutInput } from "@pawpal/shared";
import { notify } from "@pawpal/ui/notifications";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useHomeLayoutCreateContext } from "./context";

const HomeLayoutCreatePage = () => {
  const __ = useTranslations("HomeLayout.create");
  const router = useRouter();
  const { initialValues } = useHomeLayoutCreateContext();

  const [createRow, { isLoading }] = useCreateHomeLayoutMutation();

  const onSubmit = async (payload: HomeLayoutInput) => {
    try {
      await createRow(payload).unwrap();
      notify.show({ message: __("success"), color: "green" });
      router.push(getPath("website.home"));
    } catch (error) {
      console.error(error);
      notify.show({ message: __("failed"), color: "red" });
    }
  };

  return (
    <>
      <PageHeader title={__("title")} />
      <HomeLayoutForm
        initialValues={
          initialValues
            ? {
                sections: initialValues.sections,
              }
            : undefined
        }
        onSubmit={onSubmit}
        isLoading={isLoading}
      />
    </>
  );
};

export default HomeLayoutCreatePage;
