"use client";

import { useState } from "react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Spinner } from "~/components/ui/spinner";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { useParams } from "next/navigation";
import { useCreateFormSubmission, useGetFormById } from "~/hooks/api/form";

interface FormFieldValue {
  [key: string]: string | boolean | undefined;
}

export default function PublicFormPage() {
  const params = useParams<{ form_id: string }>();
  const formId = params.form_id;
  const [formData, setFormData] = useState<FormFieldValue>({});
  const [submitted, setSubmitted] = useState(false);

  const { data: form, isLoading, error } = useGetFormById(formId);
  const {
    createFormSubmissionAsync,
    isPending: isSubmitting,
    error: submissionError,
  } = useCreateFormSubmission();

  const handleInputChange = (fieldId: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formId) return;

    const values = sortedFields.map((field) => ({
      fieldId: field.id,
      value: String(formData[field.id] ?? ""),
    }));

    await createFormSubmissionAsync({
      formId,
      values,
    });

    setSubmitted(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Spinner className="h-8 w-8" />
          <p className="text-sm text-muted-foreground">Loading form...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Form</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error.message || "Failed to load the form. Please try again."}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Form Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              The form you are looking for does not exist.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Sort fields by index
  const sortedFields = [...(form.fields || [])].sort((a, b) => {
    return parseFloat(a.index) - parseFloat(b.index);
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8 px-4">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl">{form.title}</CardTitle>
            {form.description && (
              <CardDescription className="text-base">{form.description}</CardDescription>
            )}
          </CardHeader>

          <CardContent>
            {submitted ? (
              <div className="space-y-4 py-8">
                <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950">
                  <h3 className="font-semibold text-green-900 dark:text-green-100">
                    Form Submitted Successfully!
                  </h3>
                  <p className="mt-2 text-sm text-green-800 dark:text-green-200">
                    Thank you for completing this form.
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({});
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Submit Another Response
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {sortedFields.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No fields in this form yet.
                  </p>
                ) : (
                  sortedFields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label htmlFor={field.id} className="text-base">
                        {field.label}
                        {field.isRequired && <span className="ml-1 text-red-500">*</span>}
                      </Label>

                      {field.description && (
                        <p className="text-sm text-muted-foreground">{field.description}</p>
                      )}

                      {/* TEXT Field */}
                      {field.type === "TEXT" && (
                        <Input
                          id={field.id}
                          placeholder={field.placeholder || ""}
                          value={(formData[field.id] as string) || ""}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          required={field.isRequired}
                        />
                      )}

                      {/* NUMBER Field */}
                      {field.type === "NUMBER" && (
                        <Input
                          id={field.id}
                          type="number"
                          placeholder={field.placeholder || ""}
                          value={(formData[field.id] as string) || ""}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          required={field.isRequired}
                        />
                      )}

                      {/* EMAIL Field */}
                      {field.type === "EMAIL" && (
                        <Input
                          id={field.id}
                          type="email"
                          placeholder={field.placeholder || "example@email.com"}
                          value={(formData[field.id] as string) || ""}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          required={field.isRequired}
                        />
                      )}

                      {/* PASSWORD Field */}
                      {field.type === "PASSWORD" && (
                        <Input
                          id={field.id}
                          type="password"
                          placeholder={field.placeholder || ""}
                          value={(formData[field.id] as string) || ""}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          required={field.isRequired}
                        />
                      )}

                      {/* YES_NO Field */}
                      {field.type === "YES_NO" && (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={field.id}
                            checked={(formData[field.id] as boolean) || false}
                            onCheckedChange={(checked) =>
                              handleInputChange(field.id, checked as boolean)
                            }
                          />
                          <Label htmlFor={field.id} className="cursor-pointer text-base">
                            {field.placeholder || "Yes"}
                          </Label>
                        </div>
                      )}
                    </div>
                  ))
                )}

                {sortedFields.length > 0 && (
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Form"}
                  </Button>
                )}
                {submissionError && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {submissionError.message || "Unable to submit the form. Please try again."}
                    </AlertDescription>
                  </Alert>
                )}
              </form>
            )}
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-xs text-muted-foreground">Form ID: {form.id}</p>
      </div>
    </div>
  );
}
