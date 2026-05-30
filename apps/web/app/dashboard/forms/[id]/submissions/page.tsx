"use client"

import * as React from "react";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Eye } from "lucide-react";

import {
  useGetFormById,
  useGetFieldsByFormId,
  useGetFormSubmissionsByFormId,
} from "~/hooks/api/form";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

import { Button } from "~/components/ui/button";
import { SubmissionDetailsModal } from "~/components/submission-details-modal";


type SubmissionRow = {
  id: string;
  createdAt: string;
  [key: string]: string;
};

export default function SubmissionsPage() {
  const params = useParams<{ id: string }>();
  const formId = params.id;

  const [selectedSubmissionId, setSelectedSubmissionId] =
    useState<string | null>(null);

  const [open, setOpen] = useState(false);

  const { data: form, isLoading: formLoading } =
    useGetFormById(formId);

  const { data: fields, isLoading: fieldsLoading } =
    useGetFieldsByFormId(formId);

  const {
    data: submissions,
    isLoading: submissionsLoading,
  } = useGetFormSubmissionsByFormId(formId);

  const tableData = useMemo<SubmissionRow[]>(() => {
    if (!submissions || !fields) return [];

    return submissions.map((submission) => {
      const row: SubmissionRow = {
        id: submission.id,
        createdAt: new Date( 
          submission.createdAt,
        ).toLocaleString(),
      };

      fields.forEach((field) => {
        const value = submission.values.find(
          (v) => v.fieldId === field.id,
        );

        row[field.id] = value?.value ?? "";
      });

      return row;
    });
  }, [submissions, fields]);

  const columns = useMemo<ColumnDef<SubmissionRow>[]>(
    () => {
      if (!fields) return [];

      const dynamicColumns: ColumnDef<SubmissionRow>[] =
        fields.map((field) => ({
          accessorKey: field.id,
          header: field.label,
          cell: ({ row }) =>
            row.getValue(field.id) ?? "-",
        }));

      return [
        {
          accessorKey: "createdAt",
          header: "Submitted At",
        },

        ...dynamicColumns,

        {
          id: "actions",
          header: "Actions",
          cell: ({ row }) => (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSelectedSubmissionId(
                  row.original.id,
                );
                setOpen(true);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
          ),
        },
      ];
    },
    [fields],
  );

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (
    formLoading ||
    fieldsLoading ||
    submissionsLoading
  ) {
    return (
      <div className="p-6">
        Loading submissions...
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold">
            {form?.title ?? "Form"} Submissions
          </h1>

          <p className="text-muted-foreground">
            Total submissions:{" "}
            {submissions?.length ?? 0}
          </p>
        </div>

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              {table
                .getHeaderGroups()
                .map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(
                      (header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column
                                  .columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      ),
                    )}
                  </TableRow>
                ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length ? (
                table
                  .getRowModel()
                  .rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedSubmissionId(
                          row.original.id,
                        );
                        setOpen(true);
                      }}
                    >
                      {row
                        .getVisibleCells()
                        .map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef
                                .cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No submissions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <SubmissionDetailsModal
        open={open}
        onOpenChange={setOpen}
        submissionId={selectedSubmissionId}
        fields={fields?.map((f) => ({
          id: f.id,
          label: f.label,
        }))}
      />
    </>
  );
}