"use client";

import { useRegisterUserUsersRegisterPost } from "@/lib/generated/hooks";
import { Role } from "@/lib/generated/types/model";
import {
  type SignUpInput,
  signUpSchema,
} from "@/lib/validation/sign-up.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { type Resolver, type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

export function useSignUpForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const signUpResolver = zodResolver(
    signUpSchema as unknown as Parameters<typeof zodResolver>[0],
  ) as unknown as Resolver<SignUpInput>;

  const { mutateAsync, isPending } = useRegisterUserUsersRegisterPost({
    mutation: {
      onSuccess: () => {
        toast.success("حساب کاربری با موفقیت ایجاد شد.");
        router.replace("/login");
      },
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
    mutateAsync({
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        username: data.username,
        email: data.email,
        password: data.password,
        role: Role.User,
      },
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
