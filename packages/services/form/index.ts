import { asc, db, desc, eq } from "@repo/database";
import { formFieldsTable } from "@repo/database/models/form-field";
import { formsTable } from "@repo/database/models/form";

import {
  createFormInput,
  getPublicFormByIdInput,
  listFormByUserIdInput,
  type CreateFormInputType,
  type GetPublicFormByIdInputType,
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

  public async getPublicFormById(payload: GetPublicFormByIdInputType) {
    const { formId } = await getPublicFormByIdInput.parseAsync(payload);

    const rows = await db
      .select({
        form: {
          id: formsTable.id,
          title: formsTable.title,
          description: formsTable.description,
          createdAt: formsTable.createdAt,
          updatedAt: formsTable.updatedAt,
        },
        field: {
          id: formFieldsTable.id,
          label: formFieldsTable.label,
          labelKey: formFieldsTable.labelKey,
          description: formFieldsTable.description,
          placeholder: formFieldsTable.placeholder,
          isRequired: formFieldsTable.isRequired,
          index: formFieldsTable.index,
          type: formFieldsTable.type,
          formId: formFieldsTable.formId,
          createdAt: formFieldsTable.createdAt,
          updatedAt: formFieldsTable.updatedAt,
        },
      })
      .from(formsTable)
      .leftJoin(formFieldsTable, eq(formFieldsTable.formId, formsTable.id))
      .where(eq(formsTable.id, formId))
      .orderBy(asc(formFieldsTable.index));

    if (!rows || rows.length === 0) {
      throw new Error(`Form with id ${formId} does not exist`);
    }

    const { id, title, description, createdAt, updatedAt } = rows[0]!.form;
    const fields = rows.flatMap((row) => {
      if (!row.field) return [];

      return [
        {
          id: row.field.id,
          label: row.field.label,
          labelKey: row.field.labelKey,
          description: row.field.description,
          placeholder: row.field.placeholder,
          isRequired: row.field.isRequired,
          index: row.field.index,
          type: row.field.type,
          formId: row.field.formId,
          createdAt: row.field.createdAt,
          updatedAt: row.field.updatedAt,
        },
      ];
    });

    return {
      id,
      title,
      description,
      createdAt,
      updatedAt,
      fields,
    };
  }
}

export default FormService;
