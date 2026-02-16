"use client";

import { FormInputField } from "@/components/ui/FormInputField";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import type { LoginFormController } from "./useLoginForm";

type LoginFormViewProps = LoginFormController;

export default function LoginFormView({
  control,
  isPending,
  isValid,
  showPassword,
  onTogglePasswordVisibility,
  onSubmit,
}: LoginFormViewProps) {
  return (
    <section className="col-span-12 flex flex-col justify-between lg:col-span-7" aria-labelledby="login-title">
      <header className="mb-4 text-right">
        <div className="flex items-center justify-between">
          <h1 id="login-title" className="text-lg font-bold">
            خوش آمدید
          </h1>
          <Link href="/sign-up" className="text-sm text-indigo-600 hover:underline">
            ثبت‌نام
          </Link>
        </div>
        <p id="login-description" className="mt-1 text-sm text-slate-500">
          برای ادامه لطفاً وارد حساب خود شوید یا یکی بسازید.
        </p>
      </header>

      <form
        id="loginForm"
        className="space-y-4"
        onSubmit={onSubmit}
        noValidate
        aria-busy={isPending}
        aria-describedby="login-description"
      >
        <FormInputField
          id="username"
          name="username"
          control={control}
          label="نام کاربری"
          placeholder="مثال: john.doe"
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
        />

        <div className="relative flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="cursor-pointer text-sm font-medium">
              رمز عبور
            </Label>

            <Link href="/forgot-password" className="text-xs text-indigo-600 hover:underline">
              رمز را فراموش کرده‌اید؟
            </Link>
          </div>

          <button
            type="button"
            aria-label={showPassword ? "مخفی کردن رمز عبور" : "نمایش رمز عبور"}
            aria-pressed={showPassword}
            aria-controls="password"
            className="absolute left-2 top-[50%] rounded-md px-2 py-1 text-slate-500 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onClick={onTogglePasswordVisibility}
          >
            {showPassword ? (
              <Eye size={18} aria-hidden="true" />
            ) : (
              <EyeOff size={18} aria-hidden="true" />
            )}
          </button>

          <FormInputField
            id="password"
            type={showPassword ? "text" : "password"}
            control={control}
            name="password"
            placeholder="رمز عبور"
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          className="inline-flex w-full cursor-pointer items-center justify-center rounded-md bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
          disabled={!isValid || isPending}
          aria-disabled={!isValid || isPending}
          title="ورود به سامانه"
        >
          {isPending ? "در حال ورود..." : "ورود"}
        </button>

        <p className="sr-only" aria-live="polite">
          {isPending ? "در حال ورود به حساب کاربری" : ""}
        </p>

        <footer className="mt-1 text-center text-sm font-medium text-slate-600">
          با ورود، قوانین و حریم خصوصی ما را می‌پذیرید.
        </footer>
      </form>
    </section>
  );
}
