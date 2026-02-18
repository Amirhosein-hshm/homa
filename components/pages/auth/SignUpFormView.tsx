"use client";

import { FormInputField } from "@/components/ui/FormInputField";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import type { SignUpFormController } from "./useSignUpForm";

type SignUpFormViewProps = SignUpFormController;

export default function SignUpFormView({
  control,
  isPending,
  isValid,
  showPassword,
  showPasswordConfirm,
  onTogglePasswordVisibility,
  onTogglePasswordConfirmVisibility,
  onSubmit,
}: SignUpFormViewProps) {
  return (
    <section
      className="col-span-12 flex flex-col justify-between lg:col-span-7"
      aria-labelledby="signup-title"
    >
      <header className="mb-4 text-right">
        <div className="flex items-center justify-between">
          <h1 id="signup-title" className="text-lg font-bold">
            ایجاد حساب جدید
          </h1>
          <Link href="/login" className="text-sm text-indigo-600 hover:underline">
            ورود
          </Link>
        </div>
        <p id="signup-description" className="mt-1 text-sm text-slate-500">
          برای شروع، اطلاعات خود را وارد کنید تا حساب کاربری شما ایجاد شود.
        </p>
      </header>

      <form
        id="signUpForm"
        className="space-y-4"
        onSubmit={onSubmit}
        noValidate
        aria-busy={isPending}
        aria-describedby="signup-description"
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
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
        />
        <FormInputField
          id="email"
          type="email"
          name="email"
          control={control}
          label="ایمیل"
          placeholder="مثال: javad@example.com"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
        />

        <div className="relative flex flex-col gap-1">
          <Label htmlFor="password" className="cursor-pointer text-sm font-medium">
            رمز عبور
          </Label>

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
            placeholder="حداقل ۸ کاراکتر"
            autoComplete="new-password"
          />
        </div>

        <div className="relative flex flex-col gap-1">
          <Label
            htmlFor="passwordConfirm"
            className="cursor-pointer text-sm font-medium"
          >
            تأیید رمز عبور
          </Label>

          <button
            type="button"
            aria-label={
              showPasswordConfirm ? "مخفی کردن رمز عبور" : "نمایش رمز عبور"
            }
            aria-pressed={showPasswordConfirm}
            aria-controls="passwordConfirm"
            className="absolute left-2 top-[50%] rounded-md px-2 py-1 text-slate-500 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onClick={onTogglePasswordConfirmVisibility}
          >
            {showPasswordConfirm ? (
              <Eye size={18} aria-hidden="true" />
            ) : (
              <EyeOff size={18} aria-hidden="true" />
            )}
          </button>

          <FormInputField
            id="passwordConfirm"
            type={showPasswordConfirm ? "text" : "password"}
            control={control}
            name="passwordConfirm"
            placeholder="تأیید رمز عبور"
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          className="inline-flex w-full cursor-pointer items-center justify-center rounded-md bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
          disabled={!isValid || isPending}
          aria-disabled={!isValid || isPending}
          title="ایجاد حساب کاربری"
        >
          {isPending ? "در حال ایجاد حساب..." : "ایجاد حساب"}
        </button>

        <p className="sr-only" aria-live="polite">
          {isPending ? "در حال ایجاد حساب کاربری" : ""}
        </p>

        <footer className="mt-1 text-center text-sm font-medium text-slate-600">
          با ثبت‌نام، قوانین و حریم خصوصی ما را می‌پذیرید.
        </footer>
      </form>
    </section>
  );
}
