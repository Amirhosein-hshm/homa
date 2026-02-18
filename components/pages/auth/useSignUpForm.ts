"use client";

import { signUpAction } from "@/lib/action/auth";
import { useServerAction } from "@/lib/generated/hooks/useServerAction";
import {
  type SignUpInput,
  signUpSchema,
} from "@/lib/validation/sign-up.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { type Resolver, type SubmitHandler, useForm } from "react-hook-form";

export function useSignUpForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const signUpResolver = zodResolver(
    signUpSchema as unknown as Parameters<typeof zodResolver>[0],
  ) as unknown as Resolver<SignUpInput>;

  const { execute, isPending } = useServerAction(signUpAction, {
    successMessage: "حساب کاربری با موفقیت ایجاد شد.",
    onSuccess: (data) => {
      router.replace(data.redirectTo);
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<SignUpInput>({
    mode: "onTouched",
    resolver: signUpResolver,
    defaultValues: {
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const onValidSubmit: SubmitHandler<SignUpInput> = (data) => {
    execute({
      first_name: data.first_name,
      last_name: data.last_name,
      username: data.username,
      email: data.email,
      password: data.password,
    });
  };

  return {
    control,
    isPending,
    isValid,
    showPassword,
    showPasswordConfirm,
    onTogglePasswordVisibility: () => {
      setShowPassword((previous) => !previous);
    },
    onTogglePasswordConfirmVisibility: () => {
      setShowPasswordConfirm((previous) => !previous);
    },
    onSubmit: handleSubmit(onValidSubmit),
  };
}

export type SignUpFormController = ReturnType<typeof useSignUpForm>;
