"use client";

import {
  getGetCurrentUserProfileUsersMeGetQueryKey,
  getListUsersUsersGetQueryKey,
  useGetCurrentUserProfileUsersMeGet,
  useUpdateUserUsersUserIdPut,
} from "@/lib/generated/hooks";
import { getUserByUsernameUsersByUsernameUsernameGet } from "@/lib/generated/endpoints/users/users";
import { type EditProfileInput, editProfileSchema } from "@/lib/validation/edit-profile.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function useEditProfileForm() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const userId = Number(params.userId);
  const usernameParam = searchParams.get("username");
  const fetchGuard = useRef(false);

  const { data: currentUserData } = useGetCurrentUserProfileUsersMeGet();

  const currentUser =
    currentUserData && currentUserData.status === 200
      ? (currentUserData as { data: { data: { id: number; role: string; username: string; first_name: string; last_name: string; email: string; is_active?: boolean } } }).data?.data
      : null;

  const isAdmin = currentUser?.role === "Admin" || currentUser?.role === "SuperAdmin";
  const isOwnProfile = currentUser?.id === userId;
  const canEditRole = isAdmin;
  const canEditActive = isAdmin;

  const form = useForm<EditProfileInput>({
    mode: "onTouched",
    resolver: zodResolver(
      editProfileSchema as unknown as Parameters<typeof zodResolver>[0],
    ) as never,
    defaultValues: {
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      role: "User",
      is_active: true,
    },
  });

  useEffect(() => {
    if (currentUser === null || fetchGuard.current) return;

    if (!isOwnProfile && !isAdmin) {
      router.replace("/meets/managed");
      return;
    }

    fetchGuard.current = true;

    const populateForm = async () => {
      if (isOwnProfile && currentUser) {
        form.reset({
          first_name: currentUser.first_name || "",
          last_name: currentUser.last_name || "",
          username: currentUser.username || "",
          email: currentUser.email || "",
          role: currentUser.role || "User",
          is_active: currentUser.is_active ?? true,
        });
        return;
      }

      if (!isOwnProfile && isAdmin && usernameParam) {
        try {
          const res = await getUserByUsernameUsersByUsernameUsernameGet(usernameParam);
          if (res.status === 200) {
            const userData = (res as { data: { data: EditProfileInput & { id: number; is_active?: boolean } } }).data.data;
            if (userData.id === userId) {
              form.reset({
                first_name: userData.first_name || "",
                last_name: userData.last_name || "",
                username: userData.username || "",
                email: userData.email || "",
                role: userData.role || "User",
                is_active: userData.is_active ?? true,
              });
              return;
            }
          }
        } catch {
          toast.error("خطا در دریافت اطلاعات کاربر");
        }
      }
    };

    populateForm();
  }, [currentUser, isOwnProfile, isAdmin, userId, usernameParam, form, router]);

  const { mutate, isPending } = useUpdateUserUsersUserIdPut({
    mutation: {
      onSuccess: (response) => {
        if (response.status === 200) {
          toast.success("پروفایل با موفقیت به‌روزرسانی شد.");
          queryClient.invalidateQueries({ queryKey: getGetCurrentUserProfileUsersMeGetQueryKey() });
          queryClient.invalidateQueries({ queryKey: getListUsersUsersGetQueryKey() });

          const updatedUsername = form.getValues("username");
          router.push(`/users/by-username/${updatedUsername}`);
        }
      },
    },
  });

  const onSubmit = form.handleSubmit((data: EditProfileInput) => {
    const body: Record<string, unknown> = {};

    if (data.first_name) body.first_name = data.first_name;
    if (data.last_name) body.last_name = data.last_name;
    if (data.username) body.username = data.username;
    if (data.email) body.email = data.email;
    if (canEditRole && data.role) body.role = data.role;
    if (canEditActive) body.is_active = data.is_active;

    mutate({ userId, data: body as never });
  });

  return {
    form,
    isPending,
    profileLoading: currentUser === null,
    isAdmin,
    isOwnProfile,
    canEditRole,
    canEditActive,
    onSubmit,
  };
}

export type EditProfileFormController = ReturnType<typeof useEditProfileForm>;
