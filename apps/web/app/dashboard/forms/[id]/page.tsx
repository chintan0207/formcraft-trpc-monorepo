"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  IconArrowLeft,
  IconEdit,
  IconFileDescription,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { toast } from "sonner";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Textarea } from "~/components/ui/textarea";
import {
  useCreateField,
  useDeleteField,
  useGetFieldsByFormId,
  useUpdateField,
} from "~/hooks/api/form";

const fieldTypes = ["TEXT", "NUMBER", "EMAIL", "YES_NO", "PASSWORD"] as const;

type FieldType = (typeof fieldTypes)[number];
type FieldRow = NonNullable<ReturnType<typeof useGetFieldsByFormId>["data"]>[number];

const fieldTypeLabels: Record<FieldType, string> = {
  TEXT: "Text",
  NUMBER: "Number",
  EMAIL: "Email",
  YES_NO: "Yes / No",
  PASSWORD: "Password",
};

const emptyFieldForm = {
  label: "",
  description: "",
  placeholder: "",
  isRequired: false,
  type: "TEXT" as FieldType,
};

export default function FormBuilderPage() {
  const params = useParams<{ id: string }>();
  const formId = params.id;
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [fieldForm, setFieldForm] = React.useState(emptyFieldForm);
  const [selectedField, setSelectedField] = React.useState<FieldRow | null>(null);

  const {
    data: fields = [],
    error: fieldsError,
    isError: isFieldsError,
    isLoading: isFieldsLoading,
  } = useGetFieldsByFormId(formId);
  const { createFieldAsync, isPending: isCreatingField } = useCreateField();
  const { updateFieldAsync, isPending: isUpdatingField } = useUpdateField();
  const { deleteFieldAsync, isPending: isDeletingField } = useDeleteField();

  const resetFieldForm = () => {
    setFieldForm(emptyFieldForm);
  };

  const handleCreateField = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await createFieldAsync({
        formId,
        label: fieldForm.label,
        description: fieldForm.description.trim() || undefined,
        placeholder: fieldForm.placeholder.trim() || undefined,
        isRequired: fieldForm.isRequired,
        type: fieldForm.type,
      });

      resetFieldForm();
      setCreateOpen(false);
      toast.success("Field created");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to create field");
    }
  };

  const openEditDialog = (field: FieldRow) => {
    setSelectedField(field);
    setFieldForm({
      label: field.label,
      description: field.description || "",
      placeholder: field.placeholder || "",
      isRequired: field.isRequired,
      type: field.type,
    });
    setEditOpen(true);
  };

  const handleUpdateField = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedField) return;

    try {
      await updateFieldAsync({
        id: selectedField.id,
        label: fieldForm.label,
        description: fieldForm.description.trim() || null,
        placeholder: fieldForm.placeholder.trim() || null,
        isRequired: fieldForm.isRequired,
        type: fieldForm.type,
      });

      setSelectedField(null);
      resetFieldForm();
      setEditOpen(false);
      toast.success("Field updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update field");
    }
  };

  const handleDeleteField = async (field: FieldRow) => {
    try {
      await deleteFieldAsync({ id: field.id });
      toast.success("Field deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete field");
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Button asChild variant="ghost" size="sm" className="-ml-3">
            <Link href="/dashboard/forms">
              <IconArrowLeft />
              Forms
            </Link>
          </Button>
          <h1 className="mt-2 text-2xl font-semibold tracking-normal">Form builder</h1>
          <p className="text-sm text-muted-foreground">Form ID: {formId}</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetFieldForm}>
              <IconPlus />
              Add field
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add field</DialogTitle>
              <DialogDescription>
                Create a field for this form. The field key is generated from the first label.
              </DialogDescription>
            </DialogHeader>
            <FieldForm
              formId="create-field-form"
              fieldForm={fieldForm}
              isSubmitting={isCreatingField}
              submitLabel="Create field"
              onChange={setFieldForm}
              onSubmit={handleCreateField}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <IconFileDescription className="mt-1 size-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-base">Fields</CardTitle>
              <CardDescription>
                Add fields and keep their ordering with fractional indexes.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isFieldsLoading ? (
            <div className="rounded-md border p-6 text-sm text-muted-foreground">
              Loading fields...
            </div>
          ) : isFieldsError ? (
            <div className="rounded-md border border-destructive/40 p-6 text-sm text-destructive">
              {fieldsError?.message || "Unable to load fields"}
            </div>
          ) : fields.length === 0 ? (
            <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
              No fields yet. Add your first field to start building this form.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Label</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Required</TableHead>
                  <TableHead>Index</TableHead>
                  <TableHead className="w-36 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field) => (
                  <TableRow key={field.id}>
                    <TableCell>
                      <div className="font-medium">{field.label}</div>
                      <div className="max-w-[360px] truncate text-xs text-muted-foreground">
                        {field.description || field.placeholder || "No helper text"}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {field.labelKey}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{fieldTypeLabels[field.type]}</Badge>
                    </TableCell>
                    <TableCell>{field.isRequired ? "Yes" : "No"}</TableCell>
                    <TableCell>{field.index}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => openEditDialog(field)}
                        >
                          <IconEdit />
                          <span className="sr-only">Edit field</span>
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          disabled={isDeletingField}
                          onClick={() => handleDeleteField(field)}
                        >
                          <IconTrash />
                          <span className="sr-only">Delete field</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit field</DialogTitle>
            <DialogDescription>
              The field key stays unchanged even when the label changes.
            </DialogDescription>
          </DialogHeader>
          <FieldForm
            formId="edit-field-form"
            fieldForm={fieldForm}
            isSubmitting={isUpdatingField}
            submitLabel="Save changes"
            onChange={setFieldForm}
            onSubmit={handleUpdateField}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FieldForm({
  formId,
  fieldForm,
  isSubmitting,
  submitLabel,
  onChange,
  onSubmit,
}: {
  formId: string;
  fieldForm: typeof emptyFieldForm;
  isSubmitting: boolean;
  submitLabel: string;
  onChange: React.Dispatch<React.SetStateAction<typeof emptyFieldForm>>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}) {
  return (
    <form id={formId} className="grid gap-4" onSubmit={onSubmit}>
      <div className="grid gap-2">
        <Label htmlFor={`${formId}-label`}>Label</Label>
        <Input
          id={`${formId}-label`}
          maxLength={100}
          onChange={(event) => onChange((current) => ({ ...current, label: event.target.value }))}
          placeholder="Email address"
          required
          value={fieldForm.label}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor={`${formId}-type`}>Type</Label>
        <Select
          value={fieldForm.type}
          onValueChange={(value: FieldType) => onChange((current) => ({ ...current, type: value }))}
        >
          <SelectTrigger id={`${formId}-type`} className="w-full">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {fieldTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {fieldTypeLabels[type]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor={`${formId}-description`}>Description</Label>
        <Textarea
          id={`${formId}-description`}
          onChange={(event) =>
            onChange((current) => ({ ...current, description: event.target.value }))
          }
          placeholder="Tell respondents what this field is for."
          value={fieldForm.description}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor={`${formId}-placeholder`}>Placeholder</Label>
        <Input
          id={`${formId}-placeholder`}
          onChange={(event) =>
            onChange((current) => ({ ...current, placeholder: event.target.value }))
          }
          placeholder="name@example.com"
          value={fieldForm.placeholder}
        />
      </div>
      <div className="flex items-center justify-between rounded-md border p-3">
        <div className="grid gap-1">
          <Label htmlFor={`${formId}-required`}>Required</Label>
          <p className="text-xs text-muted-foreground">
            Respondents must fill this field before submitting.
          </p>
        </div>
        <Switch
          id={`${formId}-required`}
          checked={fieldForm.isRequired}
          onCheckedChange={(checked) =>
            onChange((current) => ({ ...current, isRequired: checked }))
          }
        />
      </div>
      <DialogFooter>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </DialogFooter>
    </form>
  );
}
