import { db, desc, eq } from "@repo/database";
import { formsTable } from "@repo/database/models/form";

import {
  createFormInput,
  listFormByUserIdInput,
  type CreateFormInputType,
  type ListFormByUserIdInputType,
} from "./model";

class FormService {
  public async createForm(payload: CreateFormInputType) {
    const { title, description, createdBy } = await createFormInput.parseAsync(payload);

    const formInsertResult = await db
      .insert(formsTable)
      .values({
        title,
        description,
        createdBy,
      })
      .returning({
        id: formsTable.id,
        title: formsTable.title,
        description: formsTable.description,
        createdBy: formsTable.createdBy,
      });

    if (!formInsertResult || formInsertResult.length === 0 || !formInsertResult[0]?.id) {
      throw new Error("Something went wrong while creating the form");
    }

    const formId = formInsertResult[0].id;

    return {
      id: formId,
    };
  }

  public async listFormByUserId(payload: ListFormByUserIdInputType) {
    const { userId } = await listFormByUserIdInput.parseAsync(payload);
    const forms = await db
      .select({
        id: formsTable.id,
        title: formsTable.title,
        description: formsTable.description,
        createdBy: formsTable.createdBy,
        createdAt: formsTable.createdAt,
        updatedAt: formsTable.updatedAt,
      })
      .from(formsTable)
      .where(eq(formsTable.createdBy, userId))
      .orderBy(desc(formsTable.createdAt));
    return forms;
  }
}

export default FormService;
