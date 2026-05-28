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
