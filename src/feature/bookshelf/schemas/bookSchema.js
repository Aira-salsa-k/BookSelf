import { z } from "zod";

export const bookSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(50, "Title is too long, max 50 characters!"),
  author: z
    .string()
    .min(1, "Author is required")
    .max(30, "Author name is too long, max 30 characters!"),
  year: z.coerce
    .number({ invalid_type_error: "Year must be a number" })
    .min(1000, "Year must be at least 1000")
    .max(new Date().getFullYear(), "Year cannot be in the future!"),
  isComplete: z.boolean().default(false),
  image: z.string().nullable().optional(), // base64 string or URL
  review: z
    .string()
    .max(200, "Review is too long, max 200 characters!")
    .optional(),
  rating: z.coerce.number().min(0).max(5).default(0),
});
