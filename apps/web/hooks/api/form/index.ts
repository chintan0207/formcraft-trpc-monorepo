import { trpc } from "~/trpc/client";

export const useCreateForm = () => {
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
  } = trpc.form.createForm.useMutation();

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
