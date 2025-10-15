import { z } from "zod";
import { ProductField } from "../../types/response/product";

export type FieldType = keyof typeof ENUM_FIELD_TYPE;
export const ENUM_FIELD_TYPE = {
  TEXT: "TEXT",
  EMAIL: "EMAIL",
  SELECT: "SELECT",
};

export const buildFieldSchema = <T extends ProductField[]>(
  fields: T,
  defaultValues: Record<string, any> = {}
) => {
  const shape: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    switch (field.type) {
      case ENUM_FIELD_TYPE.TEXT:
        shape[field.id] = z.string().min(1);
        break;
      case ENUM_FIELD_TYPE.EMAIL:
        shape[field.id] = z.email();
        break;
      case ENUM_FIELD_TYPE.SELECT: {
        const options: string[] = field.metadata?.options || [];
        // z.enum requires a non-empty tuple. If options is empty, fall back to a string with a basic constraint
        if (options.length > 0) {
          const tuple = [options[0], ...options.slice(1)] as [
            string,
            ...string[],
          ];

          shape[field.id] = z.enum(tuple);
        } else {
          shape[field.id] = z.string().min(1);
        }
        break;
      }
      default:
        break;
    }

    defaultValues[field.id] = undefined;
  });

  return {
    schema: z.object(shape),
    default: defaultValues,
  };
};
