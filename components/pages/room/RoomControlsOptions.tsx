"use client";
import { MoreHorizontalIcon } from "lucide-react";
import { v4 as uuid } from "uuid";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// TODO: Remove this Array after implementing the real control options
const fakeControlOptions = [
  {
    id: uuid(),
    label: "افزودن فایل ",
    action: () => alert("افزودن فایل"),
  },
  {
    id: uuid(),
    label: "اشتراک گدازی محتوا",
    action: () => alert("اشتراک گدازی محتوا"),
  },
  {
    id: uuid(),
    label: "تخته",
    action: () => alert("تخته"),
  },
];

export function RoomControlsOptions() {
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            title="گزینه های بیشتر"
            className="bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-2 rounded-full cursor-pointer"
            variant="outline"
            aria-label="Open menu"
            size="icon-sm"
          >
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-40 rounded-sm"
          align="center"
          sideOffset={12}
        >
          <DropdownMenuGroup>
            {fakeControlOptions.map((item) => (
              <DropdownMenuItem
                dir="rtl"
                onSelect={() => item.action()}
                key={item.id}
              >
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
