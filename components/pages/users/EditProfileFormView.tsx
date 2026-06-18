"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInputField } from "@/components/ui/FormInputField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoaderIcon } from "lucide-react";
import type { EditProfileFormController } from "./useEditProfileForm";

export function EditProfileFormView({
  form,
  isPending,
  profileLoading,
  canEditRole,
  canEditActive,
  onSubmit,
}: EditProfileFormController) {
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

            {canEditRole && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">نقش</label>
                <Select
                  value={form.watch("role") ?? "User"}
                  onValueChange={(value) => form.setValue("role", value, { shouldValidate: true })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب نقش" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="User">کاربر</SelectItem>
                    <SelectItem value="Host">میزبان</SelectItem>
                    <SelectItem value="Admin">مدیر</SelectItem>
                    <SelectItem value="SuperAdmin">مدیر ارشد</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {canEditActive && (
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium cursor-pointer" htmlFor="is_active">
                  وضعیت حساب
                </label>
                <input
                  id="is_active"
                  type="checkbox"
                  checked={form.watch("is_active") ?? true}
                  onChange={(e) => form.setValue("is_active", e.target.checked, { shouldValidate: true })}
                  className="size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-600">
                  {form.watch("is_active") ? "فعال" : "غیرفعال"}
                </span>
              </div>
            )}

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
