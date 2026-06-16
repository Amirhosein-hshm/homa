"use client";

import "@livekit/components-styles";

import { Loader2, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useRoomPage } from "@/components/pages/room/useRoomPage";
import MeetingLobbyView from "@/components/pages/room/MeetingLobbyView";
import MeetingRoom from "@/components/pages/room/MeetingRoom";

export default function RoomPage() {
  const {
    meetDetail,
    meetLoading,
    meetNotFound,
    currentUser,
    isCreator,
    token,
    tokenError,
    isFetchingToken,
    preJoinChoices,
    handleJoin,
    handleRetry,
    handleDisconnected,
    handleBack,
  } = useRoomPage();

  if (meetLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 animate-spin text-indigo-600" />
          <p className="text-sm text-slate-500">در حال دریافت اطلاعات جلسه...</p>
        </div>
      </div>
    );
  }

  if (meetNotFound) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <AlertTriangle className="size-8 text-amber-500" />
          <p className="text-sm text-slate-600">جلسه مورد نظر یافت نشد.</p>
          <Button variant="outline" onClick={handleBack}>
            بازگشت
          </Button>
        </div>
      </div>
    );
  }

  if (tokenError) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <AlertTriangle className="size-8 text-red-500" />
          <p className="text-sm text-slate-600">خطا در اتصال به جلسه. لطفا دوباره تلاش کنید.</p>
          <Button variant="outline" onClick={handleRetry}>
            تلاش مجدد
          </Button>
        </div>
      </div>
    );
  }

  if (!preJoinChoices) {
    return (
      <MeetingLobbyView
        meetDetail={meetDetail}
        currentUser={currentUser}
        onJoin={handleJoin}
      />
    );
  }

  if (isFetchingToken || !token) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 animate-spin text-indigo-600" />
          <p className="text-sm text-slate-500">در حال اتصال به جلسه...</p>
        </div>
      </div>
    );
  }

  return (
    <MeetingRoom
      token={token}
      isCreator={isCreator}
      preJoinChoices={preJoinChoices}
      onDisconnected={handleDisconnected}
    />
  );
}
