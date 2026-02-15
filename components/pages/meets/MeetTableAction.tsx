"use client";

import SmartTooltip from "@/components/ui/SmartTooltip";
import { useClipboard } from "@/lib/hooks/useClipboard";
import { Copy, Merge } from "lucide-react";
import Link from "next/link";

export default function MeetingTableActions() {
  const { copy } = useClipboard();

  const handleCopyClick = async () => {
    await copy("https://example.com/meeting/123");
  };

  return (
    <div className="flex items-stretch justify-center gap-2 ">
      <SmartTooltip
        title=" کپی لینک جلسه "
        element={
          <button
            onClick={handleCopyClick}
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-md text-sm font-medium flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2  focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Copy size={16} />
          </button>
        }
      />
      <SmartTooltip
        title="ورود به جلسه "
        element={
          <Link
            href="/room/123"
            className="
    inline-flex items-center
    rounded-md
    border border-slate-200
    px-3
    text-sm font-medium
    text-slate-700
    transition-colors
    hover:bg-slate-100
    hover:text-slate-900
    focus:outline-none
    focus:ring-2
    focus:ring-indigo-500
    focus:ring-offset-2
  "
          >
            <Merge size={16} className="text stroke-indigo-600" />
          </Link>
        }
      />
    </div>
  );
}
