"use client";

import { Track, ConnectionState } from "livekit-client";
import type { RemoteParticipant } from "livekit-client";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  ParticipantTile,
  useTracks,
  LayoutContextProvider,
  TrackToggle,
  DisconnectButton,
  useRoomContext,
  useConnectionState,
  type LocalUserChoices,
} from "@livekit/components-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import ModerationDropdown from "./ModerationDropdown";

interface MeetingRoomProps {
  token: string;
  isCreator: boolean;
  preJoinChoices: LocalUserChoices;
  onDisconnected: () => void;
}

function getGridClass(count: number): string {
  if (count <= 1) return "grid-cols-1 max-w-4xl mx-auto h-full";
  if (count === 2) return "grid-cols-1 md:grid-cols-2";
  return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
}

function FarsiConnectionStateToast() {
  const connectionState = useConnectionState();

  if (connectionState === ConnectionState.Connected) return null;

  const map: Record<number, string> = {
    [ConnectionState.Connecting]: "در حال اتصال...",
    [ConnectionState.Disconnected]: "قطع شد",
    [ConnectionState.Reconnecting]: "در حال اتصال مجدد...",
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100]">
      <div className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm shadow-lg">
        {map[connectionState] ?? "خطا در اتصال"}
      </div>
    </div>
  );
}

function MeetingContent({ isCreator }: { isCreator: boolean }) {
  const cameraTracks = useTracks(
    [{ source: Track.Source.Camera, withPlaceholder: true }],
    { onlySubscribed: false },
  );
  const room = useRoomContext();
  const [raisedHands, setRaisedHands] = useState<Set<string>>(new Set());
  const [handRaised, setHandRaised] = useState(false);
  const prevRaisedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const updateHands = () => {
      const hands = new Set<string>();
      for (const p of room.remoteParticipants.values()) {
        if (p.attributes?.raisedHand === "true") {
          hands.add(p.identity);
        }
      }
      if (room.localParticipant.attributes?.raisedHand === "true") {
        hands.add(room.localParticipant.identity);
      }

      if (isCreator) {
        for (const id of hands) {
          if (!prevRaisedRef.current.has(id) && id !== room.localParticipant.identity) {
            const p = room.remoteParticipants.get(id);
            toast.success(`${p?.name || id} دست خود را بالا برد`);
          }
        }
      }

      prevRaisedRef.current = new Set(hands);
      setRaisedHands(hands);
    };

    updateHands();
    room.on("participantAttributesChanged", updateHands);
    return () => {
      room.off("participantAttributesChanged", updateHands);
    };
  }, [room, isCreator]);

  const toggleRaiseHand = () => {
    const newValue = !handRaised;
    setHandRaised(newValue);
    room.localParticipant.setAttributes({
      raisedHand: newValue ? "true" : "",
    });
  };

  const gridClass = getGridClass(cameraTracks.length);

  return (
    <LayoutContextProvider>
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-hidden p-2">
          {cameraTracks.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-slate-400 text-sm">هیچ شرکت‌کننده‌ای وجود ندارد</p>
            </div>
          ) : (
            <div className={`grid h-full gap-2 ${gridClass}`}>
              {cameraTracks.map((trackRef) => {
                const participant = trackRef.participant;
                const hasRaisedHand = raisedHands.has(participant.identity);
                return (
                  <div
                    key={participant.identity}
                    className="relative overflow-hidden rounded-lg group"
                  >
                    <ParticipantTile trackRef={trackRef} className="h-full" />
                    {hasRaisedHand && (
                      <span className="absolute top-2 right-2 z-20 bg-yellow-400 rounded-full px-2 py-1 text-sm shadow-lg font-bold">
                        ✋
                      </span>
                    )}
                    {isCreator && !participant.isLocal && (
                      <div className="absolute left-2 top-2 z-10 opacity-0 transition-opacity group-hover:opacity-100">
                        <ModerationDropdown
                          participant={participant as RemoteParticipant}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="shrink-0 overflow-x-auto border-t border-white/10 bg-slate-900/95 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-1 px-2 py-3 min-w-max mx-auto">
            <TrackToggle
              source={Track.Source.Microphone}
              className="lk-button"
            >
              میکروفون
            </TrackToggle>
            <TrackToggle
              source={Track.Source.Camera}
              className="lk-button"
            >
              دوربین
            </TrackToggle>
            <TrackToggle
              source={Track.Source.ScreenShare}
              className="lk-button"
            >
              اشتراک‌گذاری صفحه
            </TrackToggle>
            <button
              onClick={toggleRaiseHand}
              className={`lk-button ${handRaised ? "bg-yellow-500 text-black hover:bg-yellow-400" : ""}`}
            >
              ✋ {handRaised ? "دست پایین" : "بالا بردن دست"}
            </button>
            <DisconnectButton className="lk-button bg-red-600 hover:bg-red-700">
              خروج از جلسه
            </DisconnectButton>
          </div>
        </div>
      </div>
    </LayoutContextProvider>
  );
}

export default function MeetingRoom({
  token,
  isCreator,
  preJoinChoices,
  onDisconnected,
}: MeetingRoomProps) {
  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black"
      data-lk-theme="default"
    >
      <LiveKitRoom
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL ?? ""}
        connect
        video={preJoinChoices.videoEnabled}
        audio={preJoinChoices.audioEnabled}
        onDisconnected={onDisconnected}
        className="h-full w-full"
      >
        <MeetingContent isCreator={isCreator} />
        <RoomAudioRenderer />
        <FarsiConnectionStateToast />
      </LiveKitRoom>
    </div>
  );
}
