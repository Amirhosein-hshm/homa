"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon, EyeIcon, PencilIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import type { MeetListItemData } from "@/lib/generated/types/model";

type MeetRowActionsProps = {
  meet: MeetListItemData;
  role: string;
  onEdit: (meet: MeetListItemData) => void;
  onDelete: (meet: MeetListItemData) => void;
};

export default function MeetRowActions({ meet, role, onEdit, onDelete }: MeetRowActionsProps) {
  const isAdmin = role === "SuperAdmin" || role === "Admin" || role === "Host";

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          className="inline-flex items-center justify-center rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
          aria-label="عملیات"
        >
          <MoreHorizontalIcon className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="text-right min-w-[10rem]">
        <DropdownMenuItem asChild>
          <Link href={`/room/${meet.meet_hash}`} className="justify-end gap-2 cursor-pointer">
            <EyeIcon className="size-4" />
            مشاهده
          </Link>
        </DropdownMenuItem>
        {isAdmin && (
          <>
            <DropdownMenuItem
              className="justify-end gap-2 cursor-pointer"
              onSelect={(e) => {
                e.preventDefault();
                onEdit(meet);
              }}
            >
              <PencilIcon className="size-4" />
              ویرایش
            </DropdownMenuItem>
            <DropdownMenuItem
              className="justify-end gap-2 cursor-pointer text-red-600 focus:text-red-600"
              onSelect={(e) => {
                e.preventDefault();
                onDelete(meet);
              }}
            >
              <Trash2Icon className="size-4" />
              حذف
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
