import { formService } from "../../services";
import { authenticatedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
  createFormInputModel,
  createFormOutputModel,
  listFormByUserIdInputModel,
  listFormByUserIdOutputModel,
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
});
