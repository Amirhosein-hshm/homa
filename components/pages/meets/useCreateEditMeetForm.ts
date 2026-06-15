"use client";

import { useCreateMeetMeetsPost, useUpdateMeetMeetsMeetHashPut } from "@/lib/generated/hooks/meets";
import {
  createMeetFormSchema,
  transformFormToApi,
  type CreateMeetFormInput,
} from "@/lib/validation/create-meet.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

type UseCreateEditMeetFormProps = {
  editMeetHash: string | null;
  detailData: { title: string; start_time: string; expires_at: string } | null;
  onSuccess: () => void;
};

export type CreateEditMeetFormController = {
  control: ReturnType<typeof useForm<CreateMeetFormInput>>["control"];
  isPending: boolean;
  isValid: boolean;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  resetForm: () => void;
};

export function useCreateEditMeetForm({
  editMeetHash,
  detailData,
  onSuccess,
}: UseCreateEditMeetFormProps): CreateEditMeetFormController {
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid, isSubmitting },
  } = useForm<CreateMeetFormInput>({
    mode: "onTouched",
    resolver: zodResolver(createMeetFormSchema),
    defaultValues: {
      title: "",
      start_time: "",
      expires_at: "",
      guest_usernames: "",
    },
  });

  useEffect(() => {
    if (detailData) {
      reset({
        title: detailData.title,
        start_time: detailData.start_time.slice(0, 16),
        expires_at: detailData.expires_at.slice(0, 16),
        guest_usernames: "",
      });
    }
  }, [detailData, reset]);

  const invalidateMeets = () => {
    queryClient.invalidateQueries({ queryKey: ["/meets"] });
    queryClient.invalidateQueries({ queryKey: ["/users/me"] });
  };

  const { mutate: createMeet, isPending: isCreating } = useCreateMeetMeetsPost({
    mutation: {
      onSuccess: () => {
        invalidateMeets();
        toast.success("جلسه با موفقیت ایجاد شد.");
        onSuccess();
      },
      onError: () => {
        toast.error("خطا در ایجاد جلسه.");
      },
    },
  });

  const { mutate: updateMeet, isPending: isUpdating } = useUpdateMeetMeetsMeetHashPut({
    mutation: {
      onSuccess: () => {
        invalidateMeets();
        toast.success("جلسه با موفقیت ویرایش شد.");
        onSuccess();
      },
      onError: () => {
        toast.error("خطا در ویرایش جلسه.");
      },
    },
  });

  const isPending = isCreating || isUpdating;

  const onValidSubmit: SubmitHandler<CreateMeetFormInput> = (data) => {
    const apiData = transformFormToApi(data);

    if (editMeetHash) {
      updateMeet({
        meetHash: editMeetHash,
        data: {
          title: apiData.title,
          start_time: apiData.start_time,
          expires_at: apiData.expires_at,
        },
      });
    } else {
      createMeet({
        data: {
          title: apiData.title,
          start_time: apiData.start_time,
          expires_at: apiData.expires_at,
          guest_usernames: apiData.guest_usernames,
        },
      });
    }
  };

  return {
    control,
    isPending: isPending || isSubmitting,
    isValid,
    onSubmit: handleSubmit(onValidSubmit),
    resetForm: () =>
      reset({
        title: "",
        start_time: "",
        expires_at: "",
        guest_usernames: "",
      }),
  };
}
