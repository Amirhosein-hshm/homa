"use client";

import { SmartPagination } from "@/components/ui/SmartPagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTimeFa } from "@/lib/helpers/date";
import { cn } from "@/lib/utils";
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import CreateEditMeetSheet from "./CreateEditMeetSheet";
import DeleteMeetDialog from "./DeleteMeetDialog";
import MeetRowActions from "./MeetRowActions";
import type { MeetListItemData } from "@/lib/generated/types/model";
import type { ReactNode } from "react";

type MeetDataTableProps = {
  data: MeetListItemData[];
  total: number;
  pageSize: number;
  isPending: boolean;
  role: string;
  showCreateButton: boolean;
  filterBar?: ReactNode;
};

export default function MeetDataTable({
  data,
  total,
  pageSize,
  isPending,
  role,
  showCreateButton,
  filterBar,
}: MeetDataTableProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editMeetHash, setEditMeetHash] = useState<string | null>(null);
  const [deleteMeet, setDeleteMeet] = useState<MeetListItemData | null>(null);

  const handleEdit = (meet: MeetListItemData) => {
    setEditMeetHash(meet.meet_hash);
    setSheetOpen(true);
  };

  const handleCreate = () => {
    setEditMeetHash(null);
    setSheetOpen(true);
  };

  const handleSheetClose = (open: boolean) => {
    setSheetOpen(open);
    if (!open) {
      setEditMeetHash(null);
    }
  };

  const columns: ColumnDef<MeetListItemData>[] = [
    {
      accessorKey: "title",
      header: "عنوان جلسه",
      cell: ({ row }) => (
        <span className="font-medium text-slate-900">{row.original.title}</span>
      ),
    },
    {
      accessorKey: "start_time",
      header: "زمان شروع",
      cell: ({ row }) => formatDateTimeFa(row.original.start_time),
    },
    {
      accessorKey: "participant_count",
      header: "شرکت‌کنندگان",
      cell: ({ row }) => (
        <span dir="ltr">{row.original.participant_count} نفر</span>
      ),
    },
    {
      accessorKey: "is_active",
      header: "وضعیت",
      cell: ({ row }) => (
        <span
          className={cn(
            "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium",
            row.original.is_active
              ? "bg-green-50 text-green-700"
              : "bg-slate-100 text-slate-500",
          )}
        >
          {row.original.is_active ? "فعال" : "غیرفعال"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "عملیات",
      cell: ({ row }) => (
        <MeetRowActions
          meet={row.original}
          role={role}
          onEdit={handleEdit}
          onDelete={setDeleteMeet}
        />
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <>
      <div className="rounded-lg border border-slate-200 bg-white shadow-xs flex flex-col h-full min-h-0 overflow-hidden">
        <div className="shrink-0 flex items-center justify-between gap-2 px-4 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2 flex-1">{filterBar}</div>
          {showCreateButton && (
            <button
              onClick={handleCreate}
              className="inline-flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              <PlusIcon className="size-4" />
              ایجاد جلسه
            </button>
          )}
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="bg-slate-50 text-sm font-medium text-slate-500 text-center"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {data.length > 0
                ? table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} className="hover:bg-slate-50 transition">
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="text-xs px-4 py-3 text-slate-700 text-center"
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center text-sm text-slate-500">
                      {isPending ? "در حال دریافت جلسات..." : "جلسه‌ای یافت نشد."}
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </div>

        <div className="shrink-0 border-t border-slate-100">
          <SmartPagination total={total} pageSize={pageSize} />
        </div>
      </div>

      <CreateEditMeetSheet
        open={sheetOpen}
        onOpenChange={handleSheetClose}
        editMeetHash={editMeetHash}
      />

      <DeleteMeetDialog
        meet={deleteMeet}
        open={!!deleteMeet}
        onOpenChange={(open) => {
          if (!open) setDeleteMeet(null);
        }}
      />
    </>
  );
}
