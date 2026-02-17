"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/lib/action/auth";
import { useServerAction } from "@/lib/generated/hooks/useServerAction";
import { ChevronDownIcon, LogOutIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type MainHeaderProfileProps = {
  avatarSrc: string;
  fullName: string;
  username: string;
};

export default function MainHeaderProfile({
  avatarSrc,
  fullName,
  username,
}: MainHeaderProfileProps) {
  const router = useRouter();
  const { execute, isPending } = useServerAction(logoutAction, {
    successMessage: null,
    onSuccess: ({ redirectTo }) => {
      router.replace(redirectTo);
      router.refresh();
    },
  });

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-10 rounded-full border border-slate-200 bg-white px-2 text-slate-700 hover:bg-slate-100"
          aria-label="پروفایل کاربر"
        >
          <Image
            src={avatarSrc}
            alt={fullName}
            width={30}
            height={30}
            className="h-7.5 w-7.5 rounded-full border border-slate-200 object-cover"
          />
          <span className="hidden text-sm font-medium sm:block">
            {fullName}
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
          <p className="text-sm font-semibold text-slate-900">{fullName}</p>
          <p dir="ltr" className="text-xs font-normal text-left text-slate-500">
            @{username}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="justify-end"
          variant="destructive"
          disabled={isPending}
          onSelect={(event) => {
            event.preventDefault();
            execute(undefined);
          }}
        >
          {isPending ? "در حال خروج..." : "خروج از حساب"}
          <LogOutIcon />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
