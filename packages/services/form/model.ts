import { z } from "zod";

export const createFormInput = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(55, "Title must be 55 characters or less")
    .describe("title of the form"),
  description: z
    .string()
    .max(300, "Description must be 300 characters or less")
    .optional()
    .describe("description of the form"),
  createdBy: z.string().describe("uuid of the user creating the form"),
});

export type CreateFormInputType = z.infer<typeof createFormInput>;

export const listFormByUserIdInput = z.object({
  userId: z.string().describe("uuid of the user whose forms should be listed"),
});

export type ListFormByUserIdInputType = z.infer<typeof listFormByUserIdInput>;

export const getPublicFormByIdInput = z.object({
  formId: z.string().describe("uuid of the public form"),
});

export type GetPublicFormByIdInputType = z.infer<typeof getPublicFormByIdInput>;
