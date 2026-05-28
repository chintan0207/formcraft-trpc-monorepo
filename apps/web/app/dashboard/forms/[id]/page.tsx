import Link from "next/link";
import { IconArrowLeft, IconFileDescription } from "@tabler/icons-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default async function FormBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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
          <h1 className="mt-2 text-2xl font-semibold tracking-normal">
            Form builder
          </h1>
          <p className="text-sm text-muted-foreground">Form ID: {id}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start gap-3">
            <IconFileDescription className="mt-1 size-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-base">Builder workspace</CardTitle>
              <CardDescription>
                Add fields and configure this form from here.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
            Field builder controls will live here.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
