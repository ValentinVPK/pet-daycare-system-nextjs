import { z } from "zod";
import { DEFAULT_PET_IMAGE_URL } from "./constants";

export const petIdSchema = z.string().cuid();

export const petFormSchema = z
  .object({
    name: z.string().trim().min(1, { message: "Name is required" }).max(100),
    ownerName: z
      .string()
      .trim()
      .min(1, { message: "Owner name is required" })
      .max(100),
    imageUrl: z.union([
      z.string().trim().url({ message: "Invalid image URL" }),
      z.literal(""),
    ]),
    age: z.coerce
      .number()
      .int()
      .positive()
      .min(0, { message: "Age must be a positive number" })
      .max(100),
    notes: z.union([
      z
        .string()
        .trim()
        .max(1000, { message: "Notes must be less than 300 characters" }),
      z.literal(""),
    ]),
  })
  .transform((data) => ({
    ...data,
    imageUrl: data.imageUrl || DEFAULT_PET_IMAGE_URL,
  }));

export type TPetForm = z.infer<typeof petFormSchema>;
