import { FieldType } from "../../schemas/order/field";
import { Creator } from "./creator";

export interface AdminFieldResponse {
  id: string;
  label: string;
  placeholder: string | null;
  type: FieldType;
  optional: boolean;
  metadata: {
    options?: string[];
  };
  createdAt: Date;
  creator: Creator;
  order: number;
}
