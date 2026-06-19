"use client";

import { setAuthSessionAction } from "@/lib/action/auth";
import { useLoginUserUsersLoginPost } from "@/lib/generated/hooks";
import type { LoginUserUsersLoginPostMutationResult } from "@/lib/generated/endpoints/users/users";
import { type LoginInput, loginSchema } from "@/lib/validation/login.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { type Resolver, type SubmitHandler, useForm } from "react-hook-form";
export function useLoginForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  const loginResolver = zodResolver(
    loginSchema as unknown as Parameters<typeof zodResolver>[0],
  ) as unknown as Resolver<LoginInput>;

  const { mutate, isPending } = useLoginUserUsersLoginPost({
    mutation: {
      onSuccess: async (response: LoginUserUsersLoginPostMutationResult) => {
        if (response.status !== 200) {
          return;
        }

        const data = response.data as {
          access_token: string;
          refresh_token: string;
          token_type: string;
        };

        const result = await setAuthSessionAction({
          token: data.access_token,
          refresh_token: data.refresh_token,
          type: data.token_type || "Bearer",
        });

        if (result.success) {
          queryClient.clear();
          router.refresh();
          router.replace("/meets");
        }
      },
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<LoginInput>({
    mode: "onTouched",
    resolver: loginResolver,
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onValidSubmit: SubmitHandler<LoginInput> = (data) => {
    mutate({ data: { username: data.username, password: data.password } });
  };

  return {
    control,
    isPending,
    isValid,
    showPassword,
    onTogglePasswordVisibility: () => {
      setShowPassword((previous) => !previous);
    },
    onSubmit: handleSubmit(onValidSubmit),
  };
}

export type LoginFormController = ReturnType<typeof useLoginForm>;
