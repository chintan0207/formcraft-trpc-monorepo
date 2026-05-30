import { z } from "zod";

export const formSubmissionValueModel = z.object({
  fieldId: z.string().describe("uuid of the submitted form field"),
  value: z.string().describe("submitted value for the field"),
});

export type FormSubmissionValueType = z.infer<typeof formSubmissionValueModel>;
export const formSubmissionValuesModel = z
  .array(formSubmissionValueModel)
  .min(1, "At least one submitted field value is required")
  .describe("submitted values for the form");
export type FormSubmissionValuesType = z.infer<typeof formSubmissionValuesModel>;

export const createFormSubmissionInput = z.object({
  formId: z.string().describe("uuid of the form being submitted"),
  values: formSubmissionValuesModel,
});

export type CreateFormSubmissionInputType = z.infer<typeof createFormSubmissionInput>;

export const getFormSubmissionsByFormIdInput = z.object({
  formId: z.string().describe("uuid of the form"),
});

export type GetFormSubmissionsByFormIdInputType = z.infer<typeof getFormSubmissionsByFormIdInput>;

export const getFormSubmissionByIdInput = z.object({
  id: z.string().describe("uuid of the submission"),
});

export type GetFormSubmissionByIdInputType = z.infer<typeof getFormSubmissionByIdInput>;
