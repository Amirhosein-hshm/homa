"use client";

import {
  getGetCurrentUserProfileUsersMeGetQueryKey,
  useGetCurrentUserProfileUsersMeGet,
  useUpdateUserUsersUserIdPut,
} from "@/lib/generated/hooks";
import { type MyProfileInput, myProfileSchema } from "@/lib/validation/my-profile.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
export function useMyProfileForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: currentUserData } = useGetCurrentUserProfileUsersMeGet();

  const currentUser =
    currentUserData && currentUserData.status === 200
      ? (currentUserData as { data: { data: { id: number; first_name: string; last_name: string; username: string; email: string } } }).data?.data
      : null;

  const form = useForm<MyProfileInput>({
    mode: "onTouched",
    resolver: zodResolver(
      myProfileSchema as unknown as Parameters<typeof zodResolver>[0],
    ) as never,
    defaultValues: {
      first_name: "",
      last_name: "",
      username: "",
      email: "",
    },
  });

  useEffect(() => {
    if (currentUser) {
      form.reset({
        first_name: currentUser.first_name || "",
        last_name: currentUser.last_name || "",
        username: currentUser.username || "",
        email: currentUser.email || "",
      });
    }
  }, [currentUser, form]);

  const { mutate, isPending } = useUpdateUserUsersUserIdPut({
    mutation: {
      onSuccess: (response) => {
        if (response.status === 200) {
          queryClient.invalidateQueries({ queryKey: getGetCurrentUserProfileUsersMeGetQueryKey() });
          router.push(`/profile/${form.getValues("username")}`);
        }
      },
    },
  });

  const onSubmit = form.handleSubmit((data: MyProfileInput) => {
    if (!currentUser) return;
    mutate({
      userId: currentUser.id,
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        username: data.username,
        email: data.email,
      } as never,
    });
  });

  return {
    form,
    isPending,
    profileLoading: !currentUser,
    onSubmit,
  };
}

export type MyProfileFormController = ReturnType<typeof useMyProfileForm>;
