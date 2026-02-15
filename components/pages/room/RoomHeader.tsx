"use client";

import SmartTooltip from "@/components/ui/SmartTooltip";
import { useRoom } from "@/lib/hooks/useRoom";
import { LinkIcon } from "lucide-react";

export default function RoomHeader() {
  const { copy } = useRoom();
  return (
    <header
      className="bg-white border-b border-slate-200"
      role="banner"
      aria-label="هدر جلسه"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <div
              className="rounded-full bg-indigo-600 text-white w-10 h-10 flex items-center justify-center font-semibold"
              aria-hidden="true"
            >
              م
            </div>
            <div>
              <h1 className="text-lg font-medium">جلسه برنامه‌ریزی اسپرینت</h1>
              <p className="text-sm text-slate-500">
                <span className="sr-only">شناسه جلسه:</span>
                شناسه جلسه :
                <span
                  className="font-medium text-slate-700"
                  aria-label="شناسه جلسه ۲۳۵"
                >
                  ۲۳۵
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <SmartTooltip
              title="کپی لینک جلسه"
              element={
                <button
                  title="اشتراک گذاری لینک جلسه "
                  onClick={() => copy("لینک جلسه")}
                  id="copyLinkBtn"
                  type="button"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  aria-label="کپی کردن لینک جلسه"
                >
                  <LinkIcon />
                </button>
              }
            />
          </div>
        </div>
      </div>
    </header>
  );
}
