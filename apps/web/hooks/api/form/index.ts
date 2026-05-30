import { trpc } from "~/trpc/client";

export const useCreateForm = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: createFormAsync,
    mutate: createForm,
    data,
    error,
    failureCount,
    isError,
    isIdle,
    isPending,
    isSuccess,
    status,
  } = trpc.form.createForm.useMutation({
    onSuccess: async () => {
      await utils.form.listFormByUserId.invalidate();
    },
  });

  return {
    createFormAsync,
    createForm,
    data,
    error,
    failureCount,
    isError,
    isIdle,
    isPending,
    isSuccess,
    status,
  };
};

export const useListForms = () => {
  const { data, error, isError, isLoading, isSuccess, status } =
    trpc.form.listFormByUserId.useQuery();

  return {
    data,
    error,
    isError,
    isLoading,
    isSuccess,
    status,
  };
};

export const useCreateField = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: createFieldAsync,
    mutate: createField,
    data,
    error,
    failureCount,
    isError,
    isIdle,
    isPending,
    isSuccess,
    status,
  } = trpc.form.createField.useMutation({
    onSuccess: async (_data, variables) => {
      await utils.form.getFieldsByFormId.invalidate({
        formId: variables.formId,
      });
    },
  });

  return {
    createFieldAsync,
    createField,
    data,
    error,
    failureCount,
    isError,
    isIdle,
    isPending,
    isSuccess,
    status,
  };
};

export const useGetField = (id: string) => {
  const { data, error, isError, isLoading, isSuccess, status } = trpc.form.getField.useQuery({
    id,
  });

  return {
    data,
    error,
    isError,
    isLoading,
    isSuccess,
    status,
  };
};

export const useGetFieldsByFormId = (formId: string) => {
  const { data, error, isError, isLoading, isSuccess, status } =
    trpc.form.getFieldsByFormId.useQuery({ formId });

  return {
    data,
    error,
    isError,
    isLoading,
    isSuccess,
    status,
  };
};

export const useUpdateField = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: updateFieldAsync,
    mutate: updateField,
    data,
    error,
    failureCount,
    isError,
    isIdle,
    isPending,
    isSuccess,
    status,
  } = trpc.form.updateField.useMutation({
    onSuccess: async (_data, variables) => {
      await Promise.all([
        utils.form.getField.invalidate({ id: variables.id }),
        utils.form.getFieldsByFormId.invalidate(),
      ]);
    },
  });

  return {
    updateFieldAsync,
    updateField,
    data,
    error,
    failureCount,
    isError,
    isIdle,
    isPending,
    isSuccess,
    status,
  };
};

export const useDeleteField = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: deleteFieldAsync,
    mutate: deleteField,
    data,
    error,
    failureCount,
    isError,
    isIdle,
    isPending,
    isSuccess,
    status,
  } = trpc.form.deleteField.useMutation({
    onSuccess: async (_data, variables) => {
      await Promise.all([
        utils.form.getField.invalidate({ id: variables.id }),
        utils.form.getFieldsByFormId.invalidate(),
      ]);
    },
  });

  return {
    deleteFieldAsync,
    deleteField,
    data,
    error,
    failureCount,
    isError,
    isIdle,
    isPending,
    isSuccess,
    status,
  };
};

export const useGetFormById = (formId: string) => {
  const { data, error, isError, isLoading, isSuccess, status } =
    trpc.form.getPublicFormById.useQuery({ formId });

  return {
    data,
    error,
    isError,
    isLoading,
    isSuccess,
    status,
  };
};

export const useCreateFormSubmission = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: createFormSubmissionAsync,
    mutate: createFormSubmission,
    data,
    error,
    failureCount,
    isError,
    isIdle,
    isPending,
    isSuccess,
    status,
  } = trpc.form.createFormSubmission.useMutation({
    onSuccess: async () => {
      await utils.form.getPublicFormById.invalidate();
    },
  });

  return {
    createFormSubmissionAsync,
    createFormSubmission,
    data,
    error,
    failureCount,
    isError,
    isIdle,
    isPending,
    isSuccess,
    status,
  };
};

export const useGetFormSubmissionById = (id: string) => {
  const { data, error, isError, isLoading, isSuccess, status } =
    trpc.form.getSubmissionById.useQuery({ id });

  return {
    data,
    error,
    isError,
    isLoading,
    isSuccess,
    status,
  };
};

export const useGetFormSubmissionsByFormId = (formId: string) => {
  const { data, error, isError, isLoading, isSuccess, status } =
    trpc.form.getSubmissionsByFormId.useQuery({ formId }) ;

  return {
    data,
    error,
    isError,
    isLoading,
    isSuccess,
    status,
  };

}