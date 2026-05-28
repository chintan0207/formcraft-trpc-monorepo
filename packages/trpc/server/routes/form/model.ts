import { z } from "zod";

export const createFormInputModel = z.object({
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
});

export const createFormOutputModel = z.object({
  id: z.string().describe("id of the created form"),
});

export const listFormByUserIdInputModel = z.undefined();

export const listFormByUserIdOutputModel = z.array(
  z.object({
    id: z.string().describe("id of the form"),
    title: z.string().describe("title of the form"),
    description: z.string().nullable().describe("description of the form"),
    createdBy: z.string().nullable().describe("id of the user who created the form"),
    createdAt: z.date().nullable().describe("date when the form was created"),
    updatedAt: z.date().nullable().describe("date when the form was last updated"),
  }),
);
