import { z } from "zod";
import { ENUM_FIELD_TYPE } from "../../enums/field";

const baseFieldSchema = z.object({
  label: z.string().min(3).max(50),
  placeholder: z.string().min(3).max(50).optional(),
  optional: z.boolean().default(false),
});

export const FieldSchema = z.discriminatedUnion("type", [
  baseFieldSchema.extend({
    type: z.literal(ENUM_FIELD_TYPE.EMAIL),
  }),
  baseFieldSchema.extend({
    type: z.literal(ENUM_FIELD_TYPE.TEXT),
  }),
  baseFieldSchema.extend({
    type: z.literal(ENUM_FIELD_TYPE.PASSWORD),
  }),
  baseFieldSchema.extend({
    type: z.literal(ENUM_FIELD_TYPE.SELECT),
    metadata: z.object({
      options: z.array(z.string().min(3).max(50)).min(1),
    }),
  }),
]);

export type FieldInput = z.infer<typeof FieldSchema>;
