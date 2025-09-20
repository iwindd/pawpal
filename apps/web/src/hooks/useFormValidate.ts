"use client";
import { UseFormReturnType, useForm as useMantineForm } from "@mantine/form";
import { ZodType } from "@pawpal/shared";
import { zod4Resolver } from "mantine-form-zod-resolver";
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
  const form = useMantineForm<T>({
    ...props,
    validate: zod4Resolver(schema),
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
