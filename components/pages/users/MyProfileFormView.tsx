"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInputField } from "@/components/ui/FormInputField";
import { LoaderIcon } from "lucide-react";
import type { MyProfileFormController } from "./useMyProfileForm";

export function MyProfileFormView({
  form,
  isPending,
  profileLoading,
  onSubmit,
}: MyProfileFormController) {
  if (profileLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoaderIcon className="size-6 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>ویرایش نمایه</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormInputField
                name="first_name"
                control={form.control}
                label="نام"
                placeholder="نام خود را وارد کنید"
              />
              <FormInputField
                name="last_name"
                control={form.control}
                label="نام خانوادگی"
                placeholder="نام خانوادگی خود را وارد کنید"
              />
            </div>

            <FormInputField
              name="username"
              control={form.control}
              label="نام کاربری"
              placeholder="نام کاربری خود را وارد کنید"
            />

            <FormInputField
              name="email"
              control={form.control}
              label="ایمیل"
              placeholder="ایمیل خود را وارد کنید"
              type="email"
            />

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" disabled={isPending} className="gap-2">
                {isPending && <LoaderIcon className="size-4 animate-spin" />}
                {isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => window.history.back()}
                disabled={isPending}
              >
                انصراف
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
