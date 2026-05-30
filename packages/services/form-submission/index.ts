import { db, desc, eq } from "@repo/database";
import { formsSubmissionsTable } from "@repo/database/models/form-submission";
import {
  createFormSubmissionInput,
  getFormSubmissionByIdInput,
  getFormSubmissionsByFormIdInput,
  type CreateFormSubmissionInputType,
  type GetFormSubmissionByIdInputType,
  type GetFormSubmissionsByFormIdInputType,
} from "./model";

class FormSubmissionService {
  public async createSubmission(payload: CreateFormSubmissionInputType) {
    const { formId, values } = await createFormSubmissionInput.parseAsync(payload);

    const insertResult = await db
      .insert(formsSubmissionsTable)
      .values({
        formId,
        values,
      })
      .returning({
        id: formsSubmissionsTable.id,
      });

    if (!insertResult || insertResult.length === 0 || !insertResult[0]?.id) {
      throw new Error("Something went wrong while creating the form submission");
    }

    return {
      id: insertResult[0].id,
    };
  }

  public async getSubmissionById(payload: GetFormSubmissionByIdInputType) {
    const { id } = await getFormSubmissionByIdInput.parseAsync(payload);

    const result = await db
      .select()
      .from(formsSubmissionsTable)
      .where(eq(formsSubmissionsTable.id, id))
      .limit(1);

    if (!result || result.length === 0 || !result[0]?.id) {
      throw new Error(`Form submission with id ${id} does not exist`);
    }

    const submission = result[0]!;
    return {
      ...submission,
      values: submission.values || [],
    };
  }

  public async getSubmissionsByFormId(payload: GetFormSubmissionsByFormIdInputType) {
    const { formId } = await getFormSubmissionsByFormIdInput.parseAsync(payload);

    const results = await db
      .select({
        id: formsSubmissionsTable.id,
        formId: formsSubmissionsTable.formId,
        values: formsSubmissionsTable.values,
        createdAt: formsSubmissionsTable.createdAt,
        updatedAt: formsSubmissionsTable.updatedAt,
      })
      .from(formsSubmissionsTable)
      .where(eq(formsSubmissionsTable.formId, formId))
      .orderBy(desc(formsSubmissionsTable.createdAt));

    return results.map((submission) => ({
      ...submission,
      values: submission.values || [],
    }));
  }
}

export default FormSubmissionService;
