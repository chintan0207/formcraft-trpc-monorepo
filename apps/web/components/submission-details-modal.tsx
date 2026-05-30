"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

import { Separator } from "~/components/ui/separator";
import { useGetFormSubmissionById } from "~/hooks/api/form";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submissionId: string | null;
  fields?: {
    id: string;
    label: string;
  }[];
};

export function SubmissionDetailsModal({
  open,
  onOpenChange,
  submissionId,
  fields,
}: Props) {
  const { data, isLoading } = useGetFormSubmissionById(
    submissionId ?? "",
  );

  const valuesMap = new Map(
    data?.values?.map((v) => [v.fieldId, v.value]) ?? [],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Submission Details</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="py-10 text-center">
            Loading...
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Submitted At
              </p>

              <p>
                {data?.createdAt
                  ? new Date(data.createdAt).toLocaleString()
                  : "-"}
              </p>
            </div>

            <Separator />

            {fields?.map((field) => (
              <div
                key={field.id}
                className="space-y-1"
              >
                <p className="font-medium">
                  {field.label}
                </p>

                <p className="text-muted-foreground break-words">
                  {valuesMap.get(field.id) || "-"}
                </p>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}