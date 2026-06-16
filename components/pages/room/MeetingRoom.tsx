"use client";

import { Track } from "livekit-client";
import type { RemoteParticipant } from "livekit-client";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  ControlBar,
  ConnectionStateToast,
  ParticipantTile,
  useTracks,
  LayoutContextProvider,
  type LocalUserChoices,
} from "@livekit/components-react";

import ModerationDropdown from "./ModerationDropdown";

interface MeetingRoomProps {
  token: string;
  isCreator: boolean;
  preJoinChoices: LocalUserChoices;
  onDisconnected: () => void;
}

function MeetingContent({ isCreator }: { isCreator: boolean }) {
  const cameraTracks = useTracks(
    [{ source: Track.Source.Camera, withPlaceholder: true }],
    { onlySubscribed: false },
  );

  return (
    <LayoutContextProvider>
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-hidden p-2">
          <div className="grid h-full grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {cameraTracks.map((trackRef) => {
              const participant = trackRef.participant;
              return (
                <div
                  key={participant.identity}
                  className="relative overflow-hidden rounded-lg group"
                >
                  <ParticipantTile trackRef={trackRef} className="h-full" />
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
        </div>
        <ControlBar controls={{ chat: true, leave: true }} />
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
        <ConnectionStateToast />
      </LiveKitRoom>
    </div>
  );
}
