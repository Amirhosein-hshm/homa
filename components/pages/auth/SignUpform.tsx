"use client";

import { FormInputField } from "@/components/ui/FormInputField";
import { Label } from "@/components/ui/label";
import { signUpAction } from "@/lib/action/auth";
import { useServerAction } from "@/lib/generated/hooks/useServerAction";
import {
  type SignUpInput,
  signUpSchema,
} from "@/lib/validation/sign-up.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Resolver, SubmitHandler, useForm } from "react-hook-form";

export default function SignUpForm() {
  const router = useRouter();
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

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const onSubmit: SubmitHandler<SignUpInput> = (data) => {
    execute({
      first_name: data.first_name,
      last_name: data.last_name,
      username: data.username,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div
      className="col-span-12 lg:col-span-7"
      role="main"
      aria-labelledby="login-title"
    >
      <header className="mb-4 text-right">
        <h1 id="login-title" className="text-lg font-bold">
          ایجاد حساب جدید
        </h1>
        <p className="text-sm flex items-center justify-between gap-1 text-slate-500 mt-1">
          <span>قبلاً حساب دارید؟</span>
          <Link href="/login" className="text-indigo-600 hover:underline">
            وارد شوید
          </Link>
        </p>
      </header>

      <form
        id="signUpForm"
        className="space-y-4"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <FormInputField
          id="first_name"
          name="first_name"
          control={control}
          label="نام"
          placeholder="مثال: جواد"
          autoComplete="given-name"
        />
        <FormInputField
          id="last_name"
          name="last_name"
          control={control}
          label="نام خانوادگی"
          placeholder="مثال: محمدی"
          autoComplete="family-name"
        />
        <FormInputField
          id="username"
          name="username"
          control={control}
          label="نام کاربری"
          placeholder="مثال: javad.m"
          autoComplete="username"
        />
        <FormInputField
          id="email"
          type="email"
          name="email"
          control={control}
          label="ایمیل"
          placeholder="مثال: johnDoe@gmail.com"
          autoComplete="email"
        />

        <div className="flex flex-col gap-1 relative">
          <Label htmlFor="password" className="text-sm font-medium">
            رمز عبور
          </Label>

          <button
            type="button"
            aria-label={showPassword ? "مخفی کردن رمز عبور" : "نمایش رمز عبور"}
            className="absolute left-2 top-[50%]  text-slate-500 px-2 py-1 rounded-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>

          <FormInputField
            id="password"
            type={showPassword ? "text" : "password"}
            control={control}
            name="password"
            placeholder="حداقل ۸ کاراکتر"
            autoComplete="new-password"
          />
        </div>
        <div className="flex flex-col gap-1 relative">
          <Label htmlFor="passwordConfirm" className="text-sm font-medium">
            تأیید رمز عبور
          </Label>

          <button
            type="button"
            aria-label={
              showPasswordConfirm ? "مخفی کردن رمز عبور" : "نمایش رمز عبور"
            }
            className="absolute left-2 top-[50%]  text-slate-500 px-2 py-1 rounded-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            onClick={() => setShowPasswordConfirm((prev) => !prev)}
          >
            {showPasswordConfirm ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>

          <FormInputField
            id="passwordConfirm"
            type={showPasswordConfirm ? "text" : "password"}
            control={control}
            name="passwordConfirm"
            placeholder="حداقل ۸ کاراکتر"
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          className="w-full inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition disabled:opacity-60"
          disabled={!isValid || isPending}
          aria-disabled={!isValid || isPending}
        >
          {isPending ? "در حال ایجاد حساب..." : "ایجاد حساب"}
        </button>
      </form>

      <footer className="mt-4 text-sm font-medium text-slate-600 text-center">
        با ورود، قوانین و حریم خصوصی ما را می‌پذیرید.
      </footer>
    </div>
  );
}
