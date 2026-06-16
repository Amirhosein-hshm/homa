"use client";

import { PreJoin } from "@livekit/components-react";
import type { LocalUserChoices } from "@livekit/components-react";
import type { MeetDetailData, GetMeResponseDTO } from "@/lib/generated/types/model";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const dateFormatter = new Intl.DateTimeFormat("fa-IR", {
  dateStyle: "long",
  timeStyle: "short",
});

interface MeetingLobbyViewProps {
  meetDetail: MeetDetailData | null;
  currentUser: GetMeResponseDTO | null;
  onJoin: (choices: LocalUserChoices) => void;
}

export default function MeetingLobbyView({ meetDetail, currentUser, onJoin }: MeetingLobbyViewProps) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 p-4">
      <div className="grid w-full max-w-5xl grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg lg:col-span-3">
          <div className="lk-prejoin-wrapper [&_.lk-prejoin]:border-0 [&_.lk-prejoin]:shadow-none">
            <PreJoin
              onSubmit={onJoin}
              joinLabel="ورود به جلسه"
              micLabel="میکروفن"
              camLabel="دوربین"
              userLabel="نام کاربری"
              defaults={{
                username: currentUser
                  ? `${currentUser.first_name} ${currentUser.last_name}`
                  : "",
              }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card className="border-slate-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">
                {meetDetail?.title ?? "جلسه"}
              </CardTitle>
              <CardDescription>اطلاعات جلسه</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {meetDetail ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">سازنده</span>
                    <span className="font-medium text-slate-800">
                      {currentUser?.id === meetDetail.creator_id
                        ? "شما"
                        : `کاربر ${meetDetail.creator_id}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">زمان شروع</span>
                    <span className="font-medium text-slate-800" dir="ltr">
                      {dateFormatter.format(new Date(meetDetail.start_time))}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">مدت اعتبار تا</span>
                    <span className="font-medium text-slate-800" dir="ltr">
                      {dateFormatter.format(new Date(meetDetail.expires_at))}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">وضعیت</span>
                    <span
                      className={`font-medium ${meetDetail.is_active ? "text-emerald-600" : "text-slate-400"}`}
                    >
                      {meetDetail.is_active ? "فعال" : "غیرفعال"}
                    </span>
                  </div>
                </>
              ) : (
                <p className="text-slate-400">در حال بارگذاری...</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm">شرکت‌کنندگان در جلسه</CardTitle>
              <CardDescription>
                {meetDetail?.participant_ids.length ?? 0} نفر
              </CardDescription>
            </CardHeader>
            <CardContent>
              {meetDetail && meetDetail.participant_ids.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {meetDetail.participant_ids.map((id) => {
                    const isCurrentUser = currentUser?.id === id;
                    return (
                      <div
                        key={id}
                        className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${
                          isCurrentUser
                            ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                            : "border-slate-200 bg-slate-50 text-slate-600"
                        }`}
                      >
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-current text-[10px] text-white">
                          {id.toString().slice(0, 2)}
                        </span>
                        {isCurrentUser ? "شما" : `کاربر ${id}`}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-slate-400">شرکت‌کننده‌ای هنوز وارد نشده است.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
