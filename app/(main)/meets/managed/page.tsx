"use client";

import MeetDataTable from "@/components/pages/meets/MeetDataTable";
import { useGetCurrentUserProfileUsersMeGet, useGetUserManagedMeetsUsersMeManagedMeetsGet } from "@/lib/generated/hooks";
import type { PaginatedResponseDTOMeetListItemData } from "@/lib/generated/types/model";
import { useSearchParams } from "next/navigation";

const MEETS_PAGE_SIZE = 12;

export default function ManagedMeetsPage() {
  const searchParams = useSearchParams();
  const uiPage = Math.max(Number(searchParams.get("page") ?? 0), 0);
  const apiPage = uiPage + 1;

  const { data: profile } = useGetCurrentUserProfileUsersMeGet();
  const role =
    profile && profile.status === 200
      ? (profile as { data: { data: { role: string } } }).data?.data?.role ?? "User"
      : "User";

  const { data, isPending } = useGetUserManagedMeetsUsersMeManagedMeetsGet(
    {
      page: apiPage,
      size: MEETS_PAGE_SIZE,
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
      />
    </div>
  );
}
