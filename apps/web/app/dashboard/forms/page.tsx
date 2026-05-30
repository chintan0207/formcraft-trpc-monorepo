"use client";

import * as React from "react";
import Link from "next/link";
import { IconCirclePlus } from "@tabler/icons-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import { IconDotsVertical, IconEye, IconCopy, IconTrash } from "@tabler/icons-react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Textarea } from "~/components/ui/textarea";
import { useCreateForm, useListForms } from "~/hooks/api/form";

function formatDate(date: Date | string | null) {
  if (!date) return "Not available";

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export default function FormsPage() {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const { createFormAsync, isPending } = useCreateForm();
  const {
    data: forms = [],
    error: listFormsError,
    isError: isListFormsError,
    isLoading: isListFormsLoading,
  } = useListForms();

  const handleCreateForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await createFormAsync({
        title,
        description: description.trim() || undefined,
      });

      setTitle("");
      setDescription("");
      setOpen(false);
      toast.success("Form created");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to create form");
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">Forms</h1>
          <p className="text-sm text-muted-foreground">
            Create, organize, and monitor your form workflows.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <IconCirclePlus />
              New form
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create form</DialogTitle>
              <DialogDescription>Add the basic details for your new form.</DialogDescription>
            </DialogHeader>
            <form className="grid gap-4" onSubmit={handleCreateForm}>
              <div className="grid gap-2">
                <Label htmlFor="new-form-title">Title</Label>
                <Input
                  id="new-form-title"
                  maxLength={55}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Customer feedback"
                  required
                  value={title}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-form-description">Description</Label>
                <Textarea
                  id="new-form-description"
                  maxLength={300}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Collect product feedback and satisfaction scores."
                  value={description}
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Creating..." : "Create form"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your forms</CardTitle>
          <CardDescription>Open a form to edit fields and continue building it.</CardDescription>
        </CardHeader>
        <CardContent>
          {isListFormsLoading ? (
            <div className="rounded-md border p-6 text-sm text-muted-foreground">
              Loading forms...
            </div>
          ) : isListFormsError ? (
            <div className="rounded-md border border-destructive/40 p-6 text-sm text-destructive">
              {listFormsError?.message || "Unable to load forms"}
            </div>
          ) : forms.length === 0 ? (
            <div className="rounded-md border p-6 text-sm text-muted-foreground">
              No forms yet. Create your first form to start building.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[280px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {forms.map((form) => (
                  <TableRow key={form.id}>
                    <TableCell className="font-medium">{form.title}</TableCell>

                    <TableCell className="max-w-[360px] truncate text-muted-foreground">
                      {form.description || "No description added."}
                    </TableCell>

                    <TableCell>
                      <Badge variant="secondary">Draft</Badge>
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {formatDate(form.createdAt)}
                    </TableCell>

                    <TableCell>
                      <div className="flex justify-end gap-2">
                        {/* BUILDER */}
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/dashboard/forms/${form.id}`}>Builder</Link>
                        </Button>

                        {/* SUBMISSIONS */}
                        <Button asChild size="sm">
                          <Link href={`/dashboard/forms/${form.id}/submissions`}>Submissions</Link>
                        </Button>

                        {/* MORE ACTIONS */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <IconDotsVertical size={18} />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/form/${form.id}`} target="_blank">
                                <IconEye />
                                Preview Form
                              </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  `${window.location.origin}/form/${form.id}`,
                                );

                                toast.success("Form link copied");
                              }}
                            >
                              <IconCopy />
                              Copy Form Link
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem className="text-destructive">
                              <IconTrash />
                              Delete Form
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
