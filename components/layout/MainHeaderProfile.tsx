"use client";

import { clearAuthSessionAction } from "@/lib/action/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogoutUserUsersLogoutPost } from "@/lib/generated/hooks";
import { useGetCurrentUserProfileUsersMeGet } from "@/lib/generated/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronDownIcon, LogOutIcon, UserIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
};

export default function MainHeaderProfile() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading } = useGetCurrentUserProfileUsersMeGet();

  const profile = (() => {
    if (!data || data.status !== 200) {
      return {
        avatarSrc: "/images/avatar-user.svg",
        fullName: "کاربر",
        username: "user",
      };
    }

    const responseData = (data as { data: { data: { first_name: string; last_name: string; username: string } } }).data?.data;
    const firstName = responseData?.first_name?.trim() || "";
    const lastName = responseData?.last_name?.trim() || "";
    const fullName = [firstName, lastName].filter(Boolean).join(" ") || "کاربر";
    const username = responseData?.username?.replace(/^@+/, "") || "user";

    return {
      avatarSrc: "/images/avatar-user.svg",
      fullName,
      username,
    };
  })();

  const { mutate, isPending } = useLogoutUserUsersLogoutPost({
    mutation: {
      onSuccess: async () => {
        await clearAuthSessionAction();
        queryClient.clear();
        toast.success("خروج با موفقیت انجام شد.");
        router.refresh();
        router.replace("/login");
      },
    },
  });

  const handleLogout = () => {
    const refreshToken = getCookie("refresh_token");
    if (refreshToken) {
      mutate({ data: { refresh_token: refreshToken } });
    } else {
      void (async () => {
        await clearAuthSessionAction();
        queryClient.clear();
        router.refresh();
        router.replace("/login");
      })();
    }
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-10 rounded-full border border-slate-200 bg-white px-2 text-slate-700 hover:bg-slate-100"
          aria-label="پروفایل کاربر"
        >
          {isLoading ? (
            <span className="h-7.5 w-7.5 rounded-full bg-slate-200 animate-pulse" />
          ) : (
            <Image
              src={profile.avatarSrc}
              alt={profile.fullName}
              width={30}
              height={30}
              className="h-7.5 w-7.5 rounded-full border border-slate-200 object-cover"
            />
          )}
          <span className="hidden text-sm font-medium sm:block">
            {profile.fullName}
          </span>
          <ChevronDownIcon className="size-4 text-slate-500" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={10}
        className="w-56 text-right"
      >
        <DropdownMenuLabel className="space-y-1">
          <p className="text-sm font-semibold text-slate-900">{profile.fullName}</p>
          <p dir="ltr" className="text-xs font-normal text-left text-slate-500">
            @{profile.username}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="justify-end cursor-pointer gap-2"
          onClick={() => router.push(`/my-profile`)}
        >
          مشاهده نمایه
          <UserIcon className="size-4" />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="justify-end cursor-pointer"
          variant="destructive"
          disabled={isPending}
          onSelect={(event) => {
            event.preventDefault();
            handleLogout();
          }}
        >
          {isPending ? "در حال خروج..." : "خروج از حساب"}
          <LogOutIcon />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
