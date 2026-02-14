"use client";

import { FormInputField } from "@/components/ui/FormInputField";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type FakeLoginForm = {
  userName: string;
  password: string;
};

export default function LoginForm() {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<FakeLoginForm>({
    mode: "onChange",
  });

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit: SubmitHandler<FakeLoginForm> = async (data) => {
    console.log(data);
  };

  return (
    <div
      className="col-span-12 flex flex-col justify-between lg:col-span-7"
      role="main"
      aria-labelledby="login-title"
    >
      <header className="mb-4 text-right">
        <div className="flex items-center justify-between">
          <h2 id="login-title" className="text-lg font-bold">
            خوش آمدید
          </h2>
          <Link
            href="/sign-up"
            className="text-sm text-indigo-600 hover:underline"
          >
            ثبت‌نام
          </Link>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          برای ادامه لطفاً وارد حساب خود شوید یا یکی بسازید.
        </p>
      </header>

      <form
        id="loginForm"
        className="space-y-4"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <FormInputField
          id="username"
          name="userName"
          control={control}
          label="ایمیل یا نام کاربری"
          placeholder="مثال: johnDoe@gmail.com"
          autoComplete="username"
        />

        <div className="flex flex-col gap-1 relative">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="password"
              className="text-sm font-medium cursor-pointer"
            >
              رمز عبور
            </Label>

            <Link
              href="/forgot-password"
              className="text-xs text-indigo-600 hover:underline"
            >
              رمز را فراموش کرده‌اید؟
            </Link>
          </div>

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

        {/* <div className="flex items-center justify-between gap-4">
          <LoginRememberMe />
        </div> */}

        <button
          type="submit"
          className="w-full inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition disabled:opacity-60 cursor-pointer"
          disabled={!isValid}
          aria-disabled={!isValid}
          title="ورود به سامانه "
        >
          ورود
        </button>
        <footer className="mt-1 text-sm font-medium text-slate-600 text-center">
          با ورود، قوانین و حریم خصوصی ما را می‌پذیرید.
        </footer>
      </form>
    </div>
  );
}
