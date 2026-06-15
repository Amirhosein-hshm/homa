"use client";

import MeetDataTable from "@/components/pages/meets/MeetDataTable";
import MeetsFilterBar from "@/components/pages/meets/MeetsFilterBar";
import { useGetCurrentUserProfileUsersMeGet, useListMeetsMeetsGet } from "@/lib/generated/hooks";
import type { PaginatedResponseDTOMeetListItemData } from "@/lib/generated/types/model";
import { useSearchParams } from "next/navigation";

const MEETS_PAGE_SIZE = 12;

export default function AllMeetsPage() {
  const searchParams = useSearchParams();
  const uiPage = Math.max(Number(searchParams.get("page") ?? 0), 0);
  const apiPage = uiPage + 1;

  const { data: profile } = useGetCurrentUserProfileUsersMeGet();
  const role =
    profile && profile.status === 200
      ? (profile as { data: { data: { role: string } } }).data?.data?.role ?? "User"
      : "User";

  const { data, isPending } = useListMeetsMeetsGet(
    {
      page: apiPage,
      size: MEETS_PAGE_SIZE,
      title_query: searchParams.get("title_query") || undefined,
      start_date: searchParams.get("start_date") || undefined,
      end_date: searchParams.get("end_date") || undefined,
    },
  );

  const paginated = data && data.status === 200
    ? (data as { data: PaginatedResponseDTOMeetListItemData; status: 200 }).data
    : null;
  const items = paginated?.data ?? [];
  const total = paginated?.total ?? 0;

  return (
    <div className="h-full flex flex-col">
      <MeetDataTable
        data={items}
        total={total}
        pageSize={MEETS_PAGE_SIZE}
        isPending={isPending}
        role={role}
        showCreateButton={true}
        filterBar={<MeetsFilterBar />}
      />
    </div>
  );
}
