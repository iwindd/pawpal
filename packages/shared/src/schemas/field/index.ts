import { optional, z } from "zod";
import { ENUM_FIELD_TYPE } from "../order/field";

export const FieldSchema = z.object({
  label: z.string().max(50),
  placeholder: z.string().max(50).optional(),
  type: z.enum([
    ENUM_FIELD_TYPE.EMAIL,
    ENUM_FIELD_TYPE.TEXT,
    ENUM_FIELD_TYPE.SELECT,
    ENUM_FIELD_TYPE.PASSWORD,
  ]),
  optional: optional(z.boolean().default(false)),
});

export const FieldSelectMetadataSchema = z.object({
  options: z.array(z.string().max(50)).min(1),
});

type FieldInputWithoutMetadata = z.infer<typeof FieldSchema>;
export type FieldSelectMetadataInput = z.infer<
  typeof FieldSelectMetadataSchema
>;

export type FieldInput = FieldInputWithoutMetadata & {
  metadata?: FieldSelectMetadataInput;
};
