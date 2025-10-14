import { z } from "zod";

export const updateOrderStatusSchema = z.object({
  status: z.enum(["PROCESSING", "COMPLETED", "CANCELLED"], {
    message: "invalid_status",
  }),
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
