"use client";

import { FormInputField } from "@/components/ui/FormInputField";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type FakeLoginForm = {
  fullName: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

export default function SignUpForm() {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<FakeLoginForm>({
    mode: "onChange",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const onSubmit: SubmitHandler<FakeLoginForm> = async (data) => {
    console.log(data);
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
        id="loginForm"
        className="space-y-4"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <FormInputField
          id="fullName"
          name="fullName"
          control={control}
          label="نام و نام خانوادگی"
          placeholder="مثال:جواد محمدی"
          autoComplete="fullName"
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
            autoComplete="current-password"
          />
        </div>
        <div className="flex flex-col gap-1 relative">
          <Label htmlFor="pass" className="text-sm font-medium">
            تأیید رمز عبور
          </Label>

          <button
            type="button"
            aria-label={showPassword ? "مخفی کردن رمز عبور" : "نمایش رمز عبور"}
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
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          className="w-full inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition disabled:opacity-60"
          disabled={!isValid}
          aria-disabled={!isValid}
        >
          ایجاد حساب
        </button>
      </form>

      <footer className="mt-4 text-sm font-medium text-slate-600 text-center">
        با ورود، قوانین و حریم خصوصی ما را می‌پذیرید.
      </footer>
    </div>
  );
}
