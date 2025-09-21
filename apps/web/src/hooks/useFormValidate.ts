"use client";
import { ZodType } from "@pawpal/shared";
import { resolver, useForm, UseFormReturnType } from "@pawpal/ui/form";
import { useTranslations } from "next-intl";

interface UseFormValidateProps<T extends Record<string, any>> {
  schema: ZodType;
  group?: string;
  mode?: "uncontrolled" | "controlled";
  initialValues?: T;
}

const useFormValidate = <T extends Record<string, any>>({
  schema,
  group,
  ...props
}: UseFormValidateProps<T>): UseFormReturnType<T, (values: T) => T> => {
  const __ = useTranslations();
  const form = useForm<T>({
    ...props,
    validate: resolver(schema),
  });

  return {
    ...form,
    getInputProps: (path: keyof T) => {
      const props = form.getInputProps(path as any);
      return {
        ...props,
        error: props.error
          ? __(`Errors.${group || "global"}.${props.error as string}`)
          : undefined,
      };
    },
  };
};

export default useFormValidate;
