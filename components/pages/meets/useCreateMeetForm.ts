"use client";

import { createMeetAction } from "@/lib/action/meets";
import { useServerAction } from "@/lib/generated/hooks/useServerAction";
import {
  createMeetSchema,
  type CreateMeetInput,
} from "@/lib/validation/create-meet.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { type Resolver, type SubmitHandler, useForm } from "react-hook-form";

const MEETS_QUERY_KEY = ["/api/meets/me"] as const;

export function useCreateMeetForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const createMeetResolver = zodResolver(
    createMeetSchema as unknown as Parameters<typeof zodResolver>[0],
  ) as unknown as Resolver<CreateMeetInput>;

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<CreateMeetInput>({
    mode: "onTouched",
    resolver: createMeetResolver,
    defaultValues: {
      title: "",
    },
  });

  const { execute, isPending } = useServerAction(createMeetAction, {
    successMessage: "جلسه جدید با موفقیت ایجاد شد.",
    onSuccess: () => {
      setOpen(false);
      reset({ title: "" });
      void queryClient.invalidateQueries({ queryKey: [...MEETS_QUERY_KEY] });
      router.refresh();
    },
  });

  const onValidSubmit: SubmitHandler<CreateMeetInput> = (data) => {
    execute({ title: data.title });
  };

  const onOpenChange = (nextOpen: boolean) => {
    if (isPending) {
      return;
    }

    setOpen(nextOpen);

    if (!nextOpen) {
      reset({ title: "" });
    }
  };

  return {
    control,
    isPending,
    isValid,
    open,
    onOpenChange,
    onSubmit: handleSubmit(onValidSubmit),
  };
}

export type CreateMeetFormController = ReturnType<typeof useCreateMeetForm>;
