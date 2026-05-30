ALTER TABLE "forms_submissions" DROP CONSTRAINT "forms_submissions_form_field_id_form_fields_id_fk";
--> statement-breakpoint
ALTER TABLE "forms_submissions" DROP COLUMN "form_field_id";