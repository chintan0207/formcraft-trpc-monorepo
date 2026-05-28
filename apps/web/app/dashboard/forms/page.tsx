"use client";

import * as React from "react";
import { IconCirclePlus, IconFileDescription } from "@tabler/icons-react";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
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
import { Textarea } from "~/components/ui/textarea";
import { useCreateForm } from "~/hooks/api/form";

const forms = [
  {
    name: "Customer feedback",
    description: "Collect product feedback and satisfaction scores.",
    responses: 128,
  },
  {
    name: "Lead capture",
    description: "Qualify inbound interest from the marketing site.",
    responses: 42,
  },
  {
    name: "Event registration",
    description: "Manage attendee details for upcoming sessions.",
    responses: 76,
  },
];

export default function FormsPage() {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [createdForms, setCreatedForms] = React.useState<
    {
      id: string;
      title: string;
      description: string | null;
    }[]
  >([]);
  const { createFormAsync, isPending } = useCreateForm();

  const handleCreateForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const form = await createFormAsync({
        title,
        description: description.trim() || undefined,
      });

      setCreatedForms((currentForms) => [
        {
          id: form.id,
          title,
          description: description.trim() || null,
        },
        ...currentForms,
      ]);
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
              <DialogDescription>
                Add the basic details for your new form.
              </DialogDescription>
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

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {createdForms.map((form) => (
            <Card key={form.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <IconFileDescription className="mt-1 size-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Draft</span>
                </div>
                <CardTitle className="text-base">{form.title}</CardTitle>
                <CardDescription>
                  {form.description || "No description added."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Open form
                </Button>
              </CardContent>
            </Card>
          ))}
          {forms.map((form) => (
            <Card key={form.name}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <IconFileDescription className="mt-1 size-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {form.responses} responses
                  </span>
                </div>
                <CardTitle className="text-base">{form.name}</CardTitle>
                <CardDescription>{form.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Open form
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick draft</CardTitle>
            <CardDescription>
              Start a simple form structure before adding fields.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="form-name">Form name</Label>
              <Input id="form-name" placeholder="Untitled form" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="form-description">Description</Label>
              <Textarea
                id="form-description"
                placeholder="What should respondents know?"
              />
            </div>
            <Button className="w-full">Create draft</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
