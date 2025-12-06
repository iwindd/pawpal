export type FieldType = keyof typeof ENUM_FIELD_TYPE;
export const ENUM_FIELD_TYPE = {
  TEXT: "TEXT",
  EMAIL: "EMAIL",
  SELECT: "SELECT",
  PASSWORD: "PASSWORD",
};
