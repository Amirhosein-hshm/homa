"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, AlertTriangle } from "lucide-react";

import { LiveKitRoom, RoomAudioRenderer, VideoConference } from "@livekit/components-react";
import { useGetMeetByHashMeetsMeetHashGet } from "@/lib/generated/hooks/meets";
import { useGenerateTokenMeetsMeetHashTokenPost } from "@/lib/generated/hooks/live-kit";
import { Button } from "@/components/ui/button";

export default function RoomPage() {
  const params = useParams<{ roomId: string }>();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState(false);

  const { data: meetData, isPending: meetLoading } = useGetMeetByHashMeetsMeetHashGet(params.roomId);
  const tokenMutation = useGenerateTokenMeetsMeetHashTokenPost();

  const meetReady = !!meetData && !meetLoading && meetData.status === 200;
  const meetNotFound = !!meetData && !meetLoading && meetData.status !== 200;
  const shouldFetchToken = meetReady && !token && !tokenError && !tokenMutation.isPending;

  useEffect(() => {
    if (!shouldFetchToken) return;

    tokenMutation.mutate(
      { meetHash: params.roomId },
      {
        onSuccess: (res) => {
          const response = res as { data?: { data?: { token: string } } };
          const t = response?.data?.data?.token;
          if (t) {
            setToken(t);
          } else {
            setTokenError(true);
          }
        },
        onError: () => setTokenError(true),
      },
    );
  }, [shouldFetchToken, params.roomId, tokenMutation]);

  const handleDisconnected = useCallback(() => {
    router.back();
  }, [router]);

  const handleRetry = useCallback(() => {
    setToken(null);
    setTokenError(false);
  }, []);

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
          <Button variant="outline" onClick={() => router.back()}>
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

  if (!token) {
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
    <div className="fixed inset-0 z-50 bg-black">
      <LiveKitRoom
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL ?? ""}
        connect
        video
        audio
        onDisconnected={handleDisconnected}
        className="h-full w-full"
      >
        <VideoConference />
        <RoomAudioRenderer />
      </LiveKitRoom>
    </div>
  );
}
