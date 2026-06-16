"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { LocalUserChoices } from "@livekit/components-react";

import type { MeetDetailData } from "@/lib/generated/types/model";
import { useGetMeetByHashMeetsMeetHashGet } from "@/lib/generated/hooks/meets";
import { useGenerateTokenMeetsMeetHashTokenPost } from "@/lib/generated/hooks/live-kit";
import { useGetCurrentUserProfileUsersMeGet } from "@/lib/generated/hooks/users";

export function useRoomPage() {
  const params = useParams<{ roomId: string }>();
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState(false);
  const [preJoinChoices, setPreJoinChoices] = useState<LocalUserChoices | null>(null);

  const { data: meetData, isPending: meetLoading } = useGetMeetByHashMeetsMeetHashGet(params.roomId);
  const { data: currentUserRaw } = useGetCurrentUserProfileUsersMeGet();
  const tokenMutation = useGenerateTokenMeetsMeetHashTokenPost();

  const currentUser = currentUserRaw?.data?.data ?? null;
  const meetDetail: MeetDetailData | null =
    meetData && meetData.status === 200
      ? (meetData.data as { data: MeetDetailData }).data
      : null;
  const meetNotFound = !!meetData && !meetLoading && meetData.status !== 200;

  const isCreator = !!(currentUser && meetDetail && currentUser.id === meetDetail.creator_id);

  const meetReady = !!meetDetail && !meetLoading;
  const shouldFetchToken = meetReady && preJoinChoices && !token && !tokenError && !tokenMutation.isPending;

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

  const handleJoin = useCallback((choices: LocalUserChoices) => {
    setPreJoinChoices(choices);
  }, []);

  const handleRetry = useCallback(() => {
    setToken(null);
    setTokenError(false);
  }, []);

  const handleDisconnected = useCallback(() => {
    router.back();
  }, [router]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  return {
    meetDetail,
    meetLoading,
    meetNotFound,
    currentUser,
    isCreator,
    token,
    tokenError,
    isFetchingToken: tokenMutation.isPending && !token && !tokenError,
    preJoinChoices,
    handleJoin,
    handleRetry,
    handleDisconnected,
    handleBack,
  };
}
