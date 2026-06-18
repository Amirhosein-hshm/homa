"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetCurrentUserProfileUsersMeGet } from "@/lib/generated/hooks";
import { EyeIcon, MoreHorizontalIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DeleteUserDialog } from "./DeleteUserDialog";

type UserManagementTableActionProps = {
  userId: number;
  username: string;
};

export function UserManagementTableAction({
  userId,
  username,
}: UserManagementTableActionProps) {
  const router = useRouter();
  const { data } = useGetCurrentUserProfileUsersMeGet();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const role =
    data && data.status === 200
      ? (data as { data: { data: { role: string } } }).data?.data?.role ?? "User"
      : "User";

  const isAdmin = role === "Admin" || role === "SuperAdmin";

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button className="p-1 rounded-md hover:bg-slate-100 transition-colors">
            <MoreHorizontalIcon className="size-4 text-slate-500" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="text-right min-w-[10rem]">
          <DropdownMenuItem
            className="justify-end cursor-pointer gap-2"
            onClick={() => router.push(`/users/by-username/${username}`)}
          >
            مشاهده نمایه
            <EyeIcon className="size-4" />
          </DropdownMenuItem>

          {isAdmin && (
            <DropdownMenuItem
              className="justify-end cursor-pointer gap-2"
              onClick={() => router.push(`/users/${userId}/edit?username=${username}`)}
            >
              ویرایش
              <PencilIcon className="size-4" />
            </DropdownMenuItem>
          )}

          {isAdmin && (
            <DropdownMenuItem
              className="justify-end cursor-pointer gap-2 text-red-600 focus:text-red-600"
              onClick={() => setDeleteOpen(true)}
            >
              حذف
              <Trash2Icon className="size-4" />
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteUserDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        userId={userId}
        username={username}
      />
    </>
  );
}
