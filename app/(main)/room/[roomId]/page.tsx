"use client";

import RoomControls from "@/components/pages/room/RoomControls";
import RoomHeader from "@/components/pages/room/RoomHeader";
import RoomMainSection from "@/components/pages/room/RoomMainSection";
import { useGetMeetByHashMeetsMeetHashGet } from "@/lib/generated/hooks/meets";
import type { SingleResponseDTOMeetDetailData } from "@/lib/generated/types/model";
import { useParams } from "next/navigation";

export default function RoomPage() {
  const params = useParams<{ roomId: string }>();
  const { data, isPending } = useGetMeetByHashMeetsMeetHashGet(params.roomId);

  const meet =
    data && data.status === 200
      ? (data as { data: SingleResponseDTOMeetDetailData; status: 200 }).data?.data
      : null;

  if (isPending) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-slate-500">
        در حال دریافت اطلاعات جلسه...
      </div>
    );
  }

  if (!meet) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-slate-500">
        جلسه مورد نظر یافت نشد.
      </div>
    );
  }

  return (
    <>
      <RoomHeader />
      <RoomMainSection />
      <RoomControls />
    </>
  );
}
