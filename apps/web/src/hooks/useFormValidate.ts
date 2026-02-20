"use client";
import { ZodType } from "@pawpal/shared";
import {
  resolver,
  useForm,
  UseFormInput,
  UseFormReturnType,
} from "@pawpal/ui/form";
import { useTranslations } from "next-intl";

interface ExtraOptions {
  schema: ZodType;
  group?: string;
}

const useFormValidate = <T extends Record<string, any>>({
  schema,
  group,
  ...props
}: UseFormInput<T> & ExtraOptions): UseFormReturnType<T> => {
  const __ = useTranslations();
  const form = useForm<T>({
    ...props,
    validate: resolver(schema),
  });

  return {
    ...form,
    getInputProps: (path, options?: any) => {
      const props = form.getInputProps(path as any, options);
      return {
        ...props,
        error: props.error ? props.error : undefined,
      };
    },
  };
};

export default useFormValidate;
