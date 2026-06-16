"use client";

import { useCallback } from "react";
import { useParams } from "next/navigation";
import { Track } from "livekit-client";
import type { RemoteParticipant } from "livekit-client";
import { useRoomContext } from "@livekit/components-react";
import { MoreHorizontal, MicOff, UserX } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBanParticipantMeetsMeetHashBanUserIdPost } from "@/lib/generated/hooks/live-kit";

interface ModerationDropdownProps {
  participant: RemoteParticipant;
}

export default function ModerationDropdown({ participant }: ModerationDropdownProps) {
  const params = useParams<{ roomId: string }>();
  const room = useRoomContext();
  const banMutation = useBanParticipantMeetsMeetHashBanUserIdPost();

  const handleMute = useCallback(() => {
    const publication = participant.getTrackPublication(Track.Source.Microphone);
    if (publication) {
      publication.setEnabled(false);
      toast.success(`میکروفن ${participant.name || participant.identity} قطع شد`);
    } else {
      toast.error("میکروفنی برای این شرکت‌کننده یافت نشد");
    }
  }, [participant]);

  const handleKick = useCallback(() => {
    const userId = parseInt(participant.identity, 10);
    if (isNaN(userId)) {
      toast.error("شناسه کاربر نامعتبر است");
      return;
    }

    banMutation.mutate(
      { meetHash: params.roomId, userId },
      {
        onSuccess: () => {
          room.remoteParticipants.delete(participant.identity);
          toast.success(`${participant.name || participant.identity} از جلسه حذف شد`);
        },
        onError: () => {
          toast.error("خطا در حذف شرکت‌کننده");
        },
      },
    );
  }, [participant, params.roomId, banMutation, room]);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="size-8 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm"
          aria-label="تنظیمات شرکت‌کننده"
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={4} className="w-40">
        <DropdownMenuItem
          dir="rtl"
          className="cursor-pointer gap-2"
          onClick={handleMute}
        >
          <MicOff className="size-4" />
          قطع میکروفن
        </DropdownMenuItem>
        <DropdownMenuItem
          dir="rtl"
          className="cursor-pointer gap-2 text-red-600 focus:text-red-600"
          onClick={handleKick}
        >
          <UserX className="size-4" />
          حذف از جلسه
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
