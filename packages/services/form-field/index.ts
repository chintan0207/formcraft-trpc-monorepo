import { asc, db, eq, max } from "@repo/database";
import { formFieldsTable } from "@repo/database/models/form-field";

import {
  createFieldInput,
  deleteFieldInput,
  getFieldInput,
  getFieldsByFormIdInput,
  updateFieldInput,
  type CreateFieldInputType,
  type DeleteFieldInputType,
  type GetFieldInputType,
  type GetFieldsByFormIdInputType,
  type UpdateFieldInputType,
} from "./model";

function createLabelKey(label: string) {
  const labelKey = label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return labelKey || "field";
}

class FormFieldService {
  private async getNextFieldIndex(formId: string) {
    const result = await db
      .select({
        maxIndex: max(formFieldsTable.index),
      })
      .from(formFieldsTable)
      .where(eq(formFieldsTable.formId, formId));
    const current = result[0]?.maxIndex;
    const nextNum = current ? parseFloat(current) + 1 : 1;
    return nextNum.toFixed(2);
  }

  public async createField(payload: CreateFieldInputType) {
    const { label, description, placeholder, isRequired, index, type, formId } =
      await createFieldInput.parseAsync(payload);

    const fieldIndex = index ?? (await this.getNextFieldIndex(formId));
    const fieldLabelKey = createLabelKey(label);

    const fieldInsertResult = await db
      .insert(formFieldsTable)
      .values({
        label,
        labelKey: fieldLabelKey,
        description,
        placeholder,
        isRequired,
        index: fieldIndex,
        type,
        formId,
      })
      .returning({
        id: formFieldsTable.id,
      });

    if (!fieldInsertResult || fieldInsertResult.length === 0 || !fieldInsertResult[0]?.id) {
      throw new Error("Something went wrong while creating the field");
    }

    return {
      id: fieldInsertResult[0].id,
    };
  }

  public async getField(payload: GetFieldInputType) {
    const { id } = await getFieldInput.parseAsync(payload);

    const result = await db
      .select()
      .from(formFieldsTable)
      .where(eq(formFieldsTable.id, id))
      .limit(1);

    if (!result || result.length === 0) {
      throw new Error(`Field with id ${id} does not exist`);
    }

    return result[0]!;
  }

  public async getFieldsByFormId(payload: GetFieldsByFormIdInputType) {
    const { formId } = await getFieldsByFormIdInput.parseAsync(payload);

    return await db
      .select()
      .from(formFieldsTable)
      .where(eq(formFieldsTable.formId, formId))
      .orderBy(asc(formFieldsTable.index));
  }

  public async updateField(payload: UpdateFieldInputType) {
    const { id, ...fieldValues } = await updateFieldInput.parseAsync(payload);

    if (Object.keys(fieldValues).length === 0) {
      throw new Error("No field values provided for update");
    }

    const fieldUpdateResult = await db
      .update(formFieldsTable)
      .set(fieldValues)
      .where(eq(formFieldsTable.id, id))
      .returning({
        id: formFieldsTable.id,
      });

    if (!fieldUpdateResult || fieldUpdateResult.length === 0 || !fieldUpdateResult[0]?.id) {
      throw new Error(`Field with id ${id} does not exist`);
    }

    return {
      id: fieldUpdateResult[0].id,
    };
  }

  public async deleteField(payload: DeleteFieldInputType) {
    const { id } = await deleteFieldInput.parseAsync(payload);

    const fieldDeleteResult = await db
      .delete(formFieldsTable)
      .where(eq(formFieldsTable.id, id))
      .returning({
        id: formFieldsTable.id,
      });

    if (!fieldDeleteResult || fieldDeleteResult.length === 0 || !fieldDeleteResult[0]?.id) {
      throw new Error(`Field with id ${id} does not exist`);
    }

    return {
      id: fieldDeleteResult[0].id,
    };
  }
}

export default FormFieldService;
