import { ProductField } from "@pawpal/shared";
import { Select, TextInput } from "@pawpal/ui/core";

interface Field extends ProductField {}

interface FieldProps {
  fields: ProductField[];
}

const FieldText = (props: Field) => {
  return (
    <TextInput
      label={props.label}
      placeholder={props.placeholder}
      type="text"
    />
  );
};

const FieldEmail = (props: Field) => {
  return (
    <TextInput
      label={props.label}
      placeholder={props.placeholder}
      type="email"
    />
  );
};

const FieldSelect = (props: Field) => {
  return (
    <Select
      label={props.label}
      placeholder={props.placeholder}
      data={[{ label: "Option 1", value: "option1" }]}
    />
  );
};

const Fields = ({ fields }: FieldProps) => {
  return (
    <>
      {fields.map((field) => {
        if (field.type === "TEXT") {
          return <FieldText key={field.id} {...field} />;
        }

        if (field.type === "EMAIL") {
          return <FieldEmail key={field.id} {...field} />;
        }

        if (field.type === "SELECT") {
          return <FieldSelect key={field.id} {...field} />;
        }

        return null;
      })}
    </>
  );
};

export default Fields;
