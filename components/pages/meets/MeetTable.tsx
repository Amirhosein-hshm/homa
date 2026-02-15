"use client";

import { SmartTable } from "@/components/ui/SmartTable";
import { ColumnDef } from "@tanstack/react-table";
import MeetingTableActions from "./MeetTableAction";

type Meeting = {
  id: string;
  title: string;
  participants: string;
  date: string;
};

const data: Meeting[] = [
  {
    id: "1",
    title: "جلسه برنامه‌ریزی اسپرینت",
    participants: "14",
    date: "۱۴۰۴/۰۹/۰۷",
  },
  {
    id: "2",
    title: "بازبینی کد (Code Review)",
    participants: "6",
    date: "۱۴۰۴/۰۹/۰۷",
  },
  {
    id: "3",
    title: "جلسه هماهنگی تیم فرانت‌اند",
    participants: "9",
    date: "۱۴۰۴/۰۹/۰۷",
  },
  {
    id: "4",
    title: "جلسه هماهنگی با بک‌اند",
    participants: "7",
    date: "۱۴۰۴/۰۹/۰۷",
  },
  {
    id: "5",
    title: "جلسه تحلیل نیازمندی‌ها",
    participants: "5",
    date: "۱۴۰۴/۰۹/۰۷",
  },
  { id: "6", title: "جلسه دمو محصول", participants: "18", date: "۱۴۰۴/۰۹/۰۷" },
  {
    id: "7",
    title: "جلسه رفع باگ‌های بحرانی",
    participants: "4",
    date: "۱۴۰۴/۰۹/۰۷",
  },
];

const columns: ColumnDef<Meeting>[] = [
  {
    accessorKey: "title",
    header: "عنوان جلسه",
  },
  {
    accessorKey: "date",
    header: "زمان ایجاد",
  },
  {
    accessorKey: "",
    header: "عملیات",
    cell: () => <MeetingTableActions />,
  },
];

export default function MeetingTable() {
  return (
    <SmartTable
      columns={columns}
      data={data}
      title={
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-medium">همه جلسات</h2>
          <span className="text-xs text-slate-500" id="resultLabel">
            نمایش ۰
          </span>
        </div>
      }
      emptyMessage="جلسه‌ای‌ یافت نشد"
      filterColumnKey="title"
      filterPlaceholder="جستجو بر‌اساس عنوان جلسه"
    />
  );
}
