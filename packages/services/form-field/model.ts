import { z } from "zod";

export const fieldTypeModel = z.enum(["TEXT", "NUMBER", "EMAIL", "YES_NO", "PASSWORD"]);

const fieldIndexModel = z.union([z.number(), z.string()]).transform((value) => String(value));

export const createFieldInput = z.object({
  label: z
    .string()
    .min(1, "Label is required")
    .max(100, "Label must be 100 characters or less")
    .describe("display label of the field"),
  description: z.string().optional().describe("description of the field"),
  placeholder: z.string().optional().describe("placeholder of the field"),
  isRequired: z.boolean().optional().describe("whether the field is required"),
  index: fieldIndexModel.describe("fractional index used for sorting fields"),
  type: fieldTypeModel.describe("type of the field"),
  formId: z.string().describe("uuid of the form that owns the field"),
});

export type CreateFieldInputType = z.infer<typeof createFieldInput>;

export const updateFieldInput = z.object({
  id: z.string().describe("uuid of the field"),
  label: z
    .string()
    .min(1, "Label is required")
    .max(100, "Label must be 100 characters or less")
    .optional()
    .describe("display label of the field"),
  description: z.string().nullable().optional().describe("description of the field"),
  placeholder: z.string().nullable().optional().describe("placeholder of the field"),
  isRequired: z.boolean().optional().describe("whether the field is required"),
  index: fieldIndexModel.optional().describe("fractional index used for sorting fields"),
  type: fieldTypeModel.optional().describe("type of the field"),
});

export type UpdateFieldInputType = z.infer<typeof updateFieldInput>;

export const deleteFieldInput = z.object({
  id: z.string().describe("uuid of the field"),
});

export type DeleteFieldInputType = z.infer<typeof deleteFieldInput>;

export const getFieldInput = z.object({
  id: z.string().describe("uuid of the field"),
});

export type GetFieldInputType = z.infer<typeof getFieldInput>;

export const getFieldsByFormIdInput = z.object({
  formId: z.string().describe("uuid of the form"),
});

export type GetFieldsByFormIdInputType = z.infer<typeof getFieldsByFormIdInput>;
