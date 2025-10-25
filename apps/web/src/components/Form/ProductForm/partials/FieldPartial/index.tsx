import { ProductField } from "@pawpal/shared";
import { Card, Select, TextInput, Title } from "@pawpal/ui/core";
import { UseFormReturnType } from "@pawpal/ui/form";
import { useTranslations } from "next-intl";
import { PurchaseFormInput } from "../..";

interface Field extends ProductField {
  form: UseFormReturnType<PurchaseFormInput>;
}

interface FieldProps {
  fields: ProductField[];
  form: UseFormReturnType<PurchaseFormInput>;
}

const FieldText = (props: Field) => {
  return (
    <TextInput
      label={props.label}
      placeholder={props.placeholder}
      type="text"
      withAsterisk={!props.optional}
      key={props.form.key(`fields.${props.id}`)}
      {...props.form.getInputProps(`fields.${props.id}`)}
    />
  );
};

const FieldPassword = (props: Field) => {
  return (
    <TextInput
      label={props.label}
      placeholder={props.placeholder}
      type="password"
      withAsterisk={!props.optional}
      key={props.form.key(`fields.${props.id}`)}
      {...props.form.getInputProps(`fields.${props.id}`)}
    />
  );
};

const FieldEmail = (props: Field) => {
  return (
    <TextInput
      label={props.label}
      placeholder={props.placeholder}
      type="email"
      withAsterisk={!props.optional}
      key={props.form.key(`fields.${props.id}`)}
      {...props.form.getInputProps(`fields.${props.id}`)}
    />
  );
};

const FieldSelect = (props: Field) => {
  const options = props.metadata.options || [];

  return (
    <Select
      label={props.label}
      placeholder={props.placeholder}
      defaultValue={(options.length > 0 && "0") || undefined}
      data={options.map((option: string, index: number) => ({
        value: option,
        label: option,
      }))}
      withAsterisk={!props.optional}
      key={props.form.key(`fields.${props.id}`)}
      {...props.form.getInputProps(`fields.${props.id}`)}
    />
  );
};

const FieldPartial = ({ fields, form }: FieldProps) => {
  const __ = useTranslations("ProductDetail");

  return (
    <Card shadow="sm">
      <Title order={6} mb="md">
        {__("gameAccount")}
      </Title>
      {fields.map((field) => {
        if (field.type === "TEXT") {
          return <FieldText key={field.id} {...field} form={form} />;
        }

        if (field.type === "EMAIL") {
          return <FieldEmail key={field.id} {...field} form={form} />;
        }

        if (field.type === "SELECT") {
          return <FieldSelect key={field.id} {...field} form={form} />;
        }

        if (field.type === "PASSWORD") {
          return <FieldPassword key={field.id} {...field} form={form} />;
        }

        return null;
      })}
    </Card>
  );
};

export default FieldPartial;
