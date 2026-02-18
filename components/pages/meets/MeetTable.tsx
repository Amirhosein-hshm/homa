"use client";

import { SmartTable } from "@/components/ui/SmartTable";
import { useGetMeetsApiMeetsMeGet } from "@/lib/generated/hooks/meets";
import type { GetMeetsApiMeetsMeGetParams, Meet } from "@/lib/generated/types";
import { formatDateTimeFa } from "@/lib/helpers/date";
import { ColumnDef } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import CreateMeetModal from "./CreateMeetModal";
import MeetingTableActions from "./MeetTableAction";

type MeetingTableProps = {
  initialQuery: GetMeetsApiMeetsMeGetParams;
};

const MEETS_PAGE_SIZE = 12;

const columns: ColumnDef<Meet>[] = [
  {
    accessorKey: "title",
    header: "عنوان جلسه",
  },
  {
    accessorKey: "created_at",
    header: "زمان ایجاد",
    cell: ({ row }) => formatDateTimeFa(row.original.created_at),
  },
  {
    accessorKey: "actions",
    header: "عملیات",
    cell: ({ row }) => <MeetingTableActions id={row.original.join_token} />,
  },
];

export default function MeetingTable({ initialQuery }: MeetingTableProps) {
  const searchParams = useSearchParams();
  const initialUiPage = Math.max((initialQuery.page ?? 1) - 1, 0);
  const parsedUiPage = Number(searchParams.get("page") ?? initialUiPage);
  const uiPage =
    Number.isInteger(parsedUiPage) && parsedUiPage >= 0
      ? parsedUiPage
      : initialUiPage;
  const apiPage = uiPage + 1;

  const { data, isPending } = useGetMeetsApiMeetsMeGet(
    { page: apiPage, size: MEETS_PAGE_SIZE },
    {
      query: {
        enabled: false,
      },
    },
  );
  const payload = data?.status === 200 ? data.data.payload : null;
  const items = payload?.items ?? [];
  const total = payload?.total ?? 0;

  return (
    <div className="h-full min-h-0 flex flex-col flex-1">
      <div className="flex-1 min-h-0">
        <SmartTable
          columns={columns}
          data={items}
          paginationTotal={total}
          paginationPageSize={MEETS_PAGE_SIZE}
          customButton={<CreateMeetModal />}
          title={
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-medium">همه جلسات</h2>
              <span className="text-xs text-slate-500" id="resultLabel">
                نمایش {total} جلسه
              </span>
            </div>
          }
          emptyMessage={
            isPending ? "در حال دریافت جلسات..." : "جلسه‌ای‌ یافت نشد"
          }
          filterColumnKey="title"
          filterPlaceholder="جستجو بر‌اساس عنوان جلسه"
        />
      </div>
    </div>
  );
}
