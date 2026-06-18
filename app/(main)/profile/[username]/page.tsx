"use client";

import {
  getGetCurrentUserProfileUsersMeGetQueryKey,
  getListUsersUsersGetQueryKey,
  useGetCurrentUserProfileUsersMeGet,
  useGetUserByUsernameUsersByUsernameUsernameGet,
  useUpdateUserUsersUserIdPut,
} from "@/lib/generated/hooks";
import type { SingleResponseDTOGetMeResponseDTO } from "@/lib/generated/types/model";
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
import { useQueryClient } from "@tanstack/react-query";
import { LoaderIcon, PencilIcon } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const roleLabels: Record<string, string> = {
  SuperAdmin: "مدیر ارشد",
  Admin: "مدیر",
  Host: "میزبان",
  User: "کاربر",
};

const roleColors: Record<string, string> = {
  SuperAdmin: "bg-purple-100 text-purple-700",
  Admin: "bg-blue-100 text-blue-700",
  Host: "bg-amber-100 text-amber-700",
  User: "bg-slate-100 text-slate-700",
};

export default function UserProfilePage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const username = params.username as string;

  const { data: profileData, isLoading } = useGetUserByUsernameUsersByUsernameUsernameGet(username);
  const { data: currentUserData } = useGetCurrentUserProfileUsersMeGet();

  const profile =
    profileData && profileData.status === 200
      ? (profileData as { data: SingleResponseDTOGetMeResponseDTO; status: 200 }).data.data
      : null;

  const currentUser =
    currentUserData && currentUserData.status === 200
      ? (currentUserData as { data: { data: { id: number; role: string } } }).data?.data
      : null;

  const isAdmin = currentUser?.role === "Admin" || currentUser?.role === "SuperAdmin";
  const [editing, setEditing] = useState(false);

  const form = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      role: "User",
      is_active: true,
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        username: profile.username || "",
        email: profile.email || "",
        role: profile.role || "User",
        is_active: profile.is_active ?? true,
      });
    }
  }, [profile, form]);

  const { mutate, isPending } = useUpdateUserUsersUserIdPut({
    mutation: {
      onSuccess: (response) => {
        if (response.status === 200) {
          toast.success("پروفایل با موفقیت به‌روزرسانی شد.");
          queryClient.invalidateQueries({ queryKey: getGetCurrentUserProfileUsersMeGetQueryKey() });
          queryClient.invalidateQueries({ queryKey: getListUsersUsersGetQueryKey() });
          setEditing(false);
        }
      },
    },
  });

  const handleSave = form.handleSubmit((data) => {
    if (!profile) return;
    mutate({
      userId: profile.id,
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        username: data.username,
        email: data.email,
        role: data.role,
        is_active: data.is_active,
      } as never,
    });
  });

  const isOwnProfile = currentUser?.id === profile?.id;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-slate-400">در حال بارگذاری...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-slate-500">کاربری با این نام کاربری یافت نشد.</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center border-b pb-4">
          <div className="size-20 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
            <Image
              src="/images/avatar-user.svg"
              alt={profile.first_name}
              width={64}
              height={64}
              className="rounded-full"
            />
          </div>
          <CardTitle className="text-lg">
            {profile.first_name} {profile.last_name}
          </CardTitle>
          {!editing && (
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${roleColors[profile.role] || "bg-slate-100 text-slate-700"}`}
            >
              {roleLabels[profile.role] || profile.role}
            </span>
          )}
        </CardHeader>
        <CardContent className="space-y-3 pt-4">
          {editing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <FormInputField name="first_name" control={form.control} label="نام" />
                <FormInputField name="last_name" control={form.control} label="نام خانوادگی" />
              </div>
              <FormInputField name="username" control={form.control} label="نام کاربری" />
              <FormInputField name="email" control={form.control} label="ایمیل" type="email" />

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">نقش</label>
                <Select
                  value={form.watch("role") ?? "User"}
                  onValueChange={(value) => form.setValue("role", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="User">کاربر</SelectItem>
                    <SelectItem value="Host">میزبان</SelectItem>
                    <SelectItem value="Admin">مدیر</SelectItem>
                    <SelectItem value="SuperAdmin">مدیر ارشد</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm font-medium cursor-pointer" htmlFor="edit_is_active">
                  وضعیت حساب
                </label>
                <input
                  id="edit_is_active"
                  type="checkbox"
                  checked={form.watch("is_active") ?? true}
                  onChange={(e) => form.setValue("is_active", e.target.checked)}
                  className="size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-600">
                  {form.watch("is_active") ? "فعال" : "غیرفعال"}
                </span>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" disabled={isPending} className="gap-2">
                  {isPending && <LoaderIcon className="size-4 animate-spin" />}
                  {isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}
                </Button>
                <Button type="button" variant="outline" disabled={isPending} onClick={() => setEditing(false)}>
                  انصراف
                </Button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">نام کاربری</span>
                <span className="font-medium" dir="ltr">@{profile.username}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">ایمیل</span>
                <span className="font-medium" dir="ltr">{profile.email}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">وضعیت</span>
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                    profile.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {profile.is_active ? "فعال" : "غیرفعال"}
                </span>
              </div>

              {isAdmin && !isOwnProfile && (
                <Button className="w-full mt-4 gap-2" onClick={() => setEditing(true)}>
                  <PencilIcon className="size-4" />
                  ویرایش نمایه
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
