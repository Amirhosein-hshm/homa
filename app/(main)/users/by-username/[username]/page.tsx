"use client";

import { useGetCurrentUserProfileUsersMeGet, useGetUserByUsernameUsersByUsernameUsernameGet } from "@/lib/generated/hooks";
import type { SingleResponseDTOGetMeResponseDTO } from "@/lib/generated/types/model";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PencilIcon } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
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

  const isOwnProfile = currentUser?.id === profile?.id;
  const isAdmin = currentUser?.role === "Admin" || currentUser?.role === "SuperAdmin";
  const canEdit = isOwnProfile || isAdmin;

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
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${roleColors[profile.role] || "bg-slate-100 text-slate-700"}`}
          >
            {roleLabels[profile.role] || profile.role}
          </span>
        </CardHeader>
        <CardContent className="space-y-3 pt-4">
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

          {canEdit && (
            <Button
              className="w-full mt-4 gap-2"
              onClick={() => router.push(`/users/${profile.id}/edit`)}
            >
              <PencilIcon className="size-4" />
              ویرایش نمایه
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
