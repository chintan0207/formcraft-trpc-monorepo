import { formFieldService, formService } from "../../services";
import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
  createFieldInputModel,
  createFieldOutputModel,
  createFormInputModel,
  createFormOutputModel,
  deleteFieldInputModel,
  deleteFieldOutputModel,
  getFieldInputModel,
  getFieldOutputModel,
  getFieldsByFormIdInputModel,
  getFieldsByFormIdOutputModel,
  getPublicFormByIdInputModel,
  getPublicFormByIdOutputModel,
  listFormByUserIdInputModel,
  listFormByUserIdOutputModel,
  updateFieldInputModel,
  updateFieldOutputModel,
} from "./model";

const TAGS = ["Form"];
const getPath = generatePath("/form");

export const formRouter = router({
  createForm: authenticatedProcedure
    .meta({
      openapi: { method: "POST", path: getPath("/createForm"), tags: TAGS, protect: true },
    })
    .input(createFormInputModel)
    .output(createFormOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { title, description } = input;

      const { id } = await formService.createForm({
        title,
        description,
        createdBy: ctx.user.id,
      });

      return { id };
    }),

  listFormByUserId: authenticatedProcedure
    .meta({
      openapi: { method: "GET", path: getPath("/listFormByUserId"), tags: TAGS, protect: true },
    })
    .input(listFormByUserIdInputModel)
    .output(listFormByUserIdOutputModel)
    .query(async ({ ctx }) => {
      const forms = await formService.listFormByUserId({
        userId: ctx.user.id,
      });
      return forms;
    }),

  getPublicFormById: publicProcedure
    .meta({
      openapi: { method: "GET", path: getPath("/getPublicFormById"), tags: TAGS },
    })
    .input(getPublicFormByIdInputModel)
    .output(getPublicFormByIdOutputModel)
    .query(async ({ input }) => {
      return await formService.getPublicFormById(input);
    }),

  createField: authenticatedProcedure
    .meta({
      openapi: { method: "POST", path: getPath("/createField"), tags: TAGS, protect: true },
    })
    .input(createFieldInputModel)
    .output(createFieldOutputModel)
    .mutation(async ({ input }) => {
      const { id } = await formFieldService.createField(input);
      return { id };
    }),

  getField: authenticatedProcedure
    .meta({
      openapi: { method: "GET", path: getPath("/getField"), tags: TAGS, protect: true },
    })
    .input(getFieldInputModel)
    .output(getFieldOutputModel)
    .query(async ({ input }) => {
      return await formFieldService.getField(input);
    }),

  getFieldsByFormId: authenticatedProcedure
    .meta({
      openapi: { method: "GET", path: getPath("/getFieldsByFormId"), tags: TAGS, protect: true },
    })
    .input(getFieldsByFormIdInputModel)
    .output(getFieldsByFormIdOutputModel)
    .query(async ({ input }) => {
      return await formFieldService.getFieldsByFormId(input);
    }),

  updateField: authenticatedProcedure
    .meta({
      openapi: { method: "PATCH", path: getPath("/updateField"), tags: TAGS, protect: true },
    })
    .input(updateFieldInputModel)
    .output(updateFieldOutputModel)
    .mutation(async ({ input }) => {
      const { id } = await formFieldService.updateField(input);
      return { id };
    }),

  deleteField: authenticatedProcedure
    .meta({
      openapi: { method: "DELETE", path: getPath("/deleteField"), tags: TAGS, protect: true },
    })
    .input(deleteFieldInputModel)
    .output(deleteFieldOutputModel)
    .mutation(async ({ input }) => {
      const { id } = await formFieldService.deleteField(input);
      return { id };
    }),
});
