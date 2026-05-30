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

    if (!result || result.length === 0) {
      throw new Error(`Form submission with id ${id} does not exist`);
    }

    return result[0]!;
  }

  public async getSubmissionsByFormId(payload: GetFormSubmissionsByFormIdInputType) {
    const { formId } = await getFormSubmissionsByFormIdInput.parseAsync(payload);

    return await db
      .select()
      .from(formsSubmissionsTable)
      .where(eq(formsSubmissionsTable.formId, formId))
      .orderBy(desc(formsSubmissionsTable.createdAt));
  }
}

export default FormSubmissionService;
