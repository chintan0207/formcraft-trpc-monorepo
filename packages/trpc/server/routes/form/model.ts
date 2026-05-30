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

export const getPublicFormByIdInputModel = z.object({
  formId: z.string().describe("uuid of the public form"),
});

export const fieldTypeModel = z.enum(["TEXT", "NUMBER", "EMAIL", "YES_NO", "PASSWORD"]);

const fieldIndexModel = z.union([z.number(), z.string()]).transform((value) => String(value));

export const createFieldInputModel = z.object({
  label: z
    .string()
    .min(1, "Label is required")
    .max(100, "Label must be 100 characters or less")
    .describe("display label of the field"),
  description: z.string().optional().describe("description of the field"),
  placeholder: z.string().optional().describe("placeholder of the field"),
  isRequired: z.boolean().optional().describe("whether the field is required"),
  index: fieldIndexModel.optional().describe("fractional index used for sorting fields"),
  type: fieldTypeModel.describe("type of the field"),
  formId: z.string().describe("uuid of the form that owns the field"),
});

export const createFieldOutputModel = z.object({
  id: z.string().describe("id of the created field"),
});

export const getFieldInputModel = z.object({
  id: z.string().describe("uuid of the field"),
});

export const fieldOutputModel = z.object({
  id: z.string().describe("id of the field"),
  label: z.string().describe("display label of the field"),
  labelKey: z.string().describe("stable slug key generated from the first label"),
  description: z.string().nullable().describe("description of the field"),
  placeholder: z.string().nullable().describe("placeholder of the field"),
  isRequired: z.boolean().describe("whether the field is required"),
  index: z.string().describe("fractional index used for sorting fields"),
  type: fieldTypeModel.describe("type of the field"),
  formId: z.string().nullable().describe("id of the form that owns the field"),
  createdAt: z.date().nullable().describe("date when the field was created"),
  updatedAt: z.date().nullable().describe("date when the field was last updated"),
});

export const getFieldOutputModel = fieldOutputModel;

export const getFieldsByFormIdInputModel = z.object({
  formId: z.string().describe("uuid of the form"),
});

export const getFieldsByFormIdOutputModel = z.array(fieldOutputModel);

export const getPublicFormByIdOutputModel = z.object({
  id: z.string().describe("id of the form"),
  title: z.string().describe("title of the form"),
  description: z.string().nullable().describe("description of the form"),
  createdAt: z.date().nullable().describe("date when the form was created"),
  updatedAt: z.date().nullable().describe("date when the form was last updated"),
  fields: z.array(fieldOutputModel).describe("fields belonging to the form"),
});

export const createFormSubmissionInputModel = z.object({
  formId: z.string().describe("uuid of the form being submitted"),
  values: z
    .array(
      z.object({
        fieldId: z.string().describe("uuid of the submitted form field"),
        value: z.string().describe("submitted value for the field"),
      }),
    )
    .min(1, "At least one submitted field value is required")
    .describe("submitted values for the form"),
});

export const createFormSubmissionOutputModel = z.object({
  id: z.string().describe("id of the created form submission"),
});

export const formSubmissionValueModel = z.object({
  fieldId: z.string().describe("uuid of the submitted form field"),
  value: z.string().describe("submitted value for the field"),
});

export const formSubmissionOutputModel = z.object({
  id: z.string().describe("id of the form submission"),
  formId: z.string().nullable().describe("id of the form"),
  values: z.array(formSubmissionValueModel).describe("submitted values for the form"),
  createdAt: z.date().nullable().describe("date when the submission was created"),
  updatedAt: z.date().nullable().describe("date when the submission was last updated"),
});

export const getFormSubmissionByIdInputModel = z.object({
  id: z.string().describe("uuid of the submission"),
});

export const getFormSubmissionByIdOutputModel = formSubmissionOutputModel;

export const getFormSubmissionsByFormIdInputModel = z.object({
  formId: z.string().describe("uuid of the form"),
});

export const getFormSubmissionsByFormIdOutputModel = z.array(formSubmissionOutputModel);

export const updateFieldInputModel = z.object({
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

export const updateFieldOutputModel = z.object({
  id: z.string().describe("id of the updated field"),
});

export const deleteFieldInputModel = z.object({
  id: z.string().describe("uuid of the field"),
});

export const deleteFieldOutputModel = z.object({
  id: z.string().describe("id of the deleted field"),
});
