"use client";

import { loginAction } from "@/lib/action/auth";
import { useServerAction } from "@/lib/generated/hooks/useServerAction";
import { type LoginInput, loginSchema } from "@/lib/validation/login.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { type Resolver, type SubmitHandler, useForm } from "react-hook-form";

export function useLoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const loginResolver = zodResolver(
    loginSchema as unknown as Parameters<typeof zodResolver>[0],
  ) as unknown as Resolver<LoginInput>;

  const { execute, isPending } = useServerAction(loginAction, {
    successMessage: "ورود با موفقیت انجام شد.",
    onSuccess: (data) => {
      router.replace(data.redirectTo);
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
    execute(data);
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
