import { IconCirclePlus, IconFileDescription } from "@tabler/icons-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

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
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">Forms</h1>
          <p className="text-sm text-muted-foreground">
            Create, organize, and monitor your form workflows.
          </p>
        </div>
        <Button>
          <IconCirclePlus />
          New form
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
