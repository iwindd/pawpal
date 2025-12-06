import { z } from "zod";
import { ENUM_FIELD_TYPE } from "../../enums/field";
import { ProductField } from "../../types/response/product";

export const buildFieldSchema = (
  fields: ProductField[],
  defaultValues: Record<string, any> = {}
) => {
  const shape: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    switch (field.type) {
      case ENUM_FIELD_TYPE.TEXT:
        shape[field.id] = z.string();
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
          shape[field.id] = z.string();
        }
        break;
      }
      case ENUM_FIELD_TYPE.PASSWORD:
        shape[field.id] = z.string();
        break;
      default:
        break;
    }

    const object = shape[field.id];
    if (field.optional) shape[field.id] = object!.optional();

    defaultValues[field.id] = undefined;
  });

  return {
    schema: z.object(shape),
    default: defaultValues,
  };
};
