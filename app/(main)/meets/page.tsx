import MeetingTable from "@/components/pages/meets/MeetTable";
import { createServerRequestOptions } from "@/lib/api/server-request-options";
import { getGetMeetsApiMeetsMeGetQueryOptions } from "@/lib/generated/hooks/meets";
import type { GetMeetsApiMeetsMeGetParams } from "@/lib/generated/types";
import { makeQueryClient } from "@/lib/query/query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";

type PageProps = {
  searchParams?: Promise<Record<string, string>>;
};

export const metadata: Metadata = {
  title: "لیست جلسات",
  description: "لیست جلسات",
};

export default async function Page({ searchParams }: PageProps) {
  const sp = (await searchParams) ?? {};
  const initialQuery: GetMeetsApiMeetsMeGetParams = {
    page: Number(sp?.page ?? 0) + 1,
    size: 12,
  };
  const queryClient = makeQueryClient();
  const request = await createServerRequestOptions();
  const queryOptions = getGetMeetsApiMeetsMeGetQueryOptions(initialQuery, {
    request,
  });

  await queryClient.prefetchQuery({
    queryKey: queryOptions.queryKey,
    queryFn: queryOptions.queryFn,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="h-full min-h-0 flex flex-col flex-1">
        <div className="flex-1 min-h-0">
          <MeetingTable initialQuery={initialQuery} />
        </div>
      </div>
    </HydrationBoundary>
  );
}
