import { z } from "zod";

export const RESOURCE_MAX_SIZE = 16 * 1024 * 1024;
export const RESOURCE_ALLOW_MIME = ["image/png", "image/jpg", "image/jpeg"];

// for multer file (nestjs)
export const MulterFileSchema = z.object({
  mimetype: z.enum(RESOURCE_ALLOW_MIME),
  size: z.number().max(RESOURCE_MAX_SIZE),
});

export const resourceUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((f) => RESOURCE_ALLOW_MIME.includes(f.type), {
      message: "file_type_not_accepted",
    })
    .refine((f) => f.size <= RESOURCE_MAX_SIZE, {
      message: "file_size_too_large",
    }),
});

export type ResourceUploadInput = z.infer<typeof resourceUploadSchema>;
