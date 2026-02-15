import { LayoutDashboard } from "lucide-react";

import SmartTooltip from "@/components/ui/SmartTooltip";
import VideoTilesItem from "./VideoTitleItem";

export default function RoomMainSection() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid ">
        <section className="lg:col-span-2">
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            <div className="p-3 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-medium">نمای جلسه</h2>
                <span id="layoutLabel" className="text-xs text-slate-500">
                  شبکه ای
                </span>
              </div>

              <SmartTooltip
                title="تغیر نما"
                element={
                  <button
                    id="layoutBtn"
                    className="text-sm px-2 py-1 rounded-md bg-slate-50 border border-slate-200 hover:bg-slate-100 cursor-pointer"
                  >
                    <LayoutDashboard size={16} />
                  </button>
                }
              />
            </div>

            <ul
              id="videoGrid"
              className="p-4 h-full grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4"
            >
              {Array.from({ length: 10 }, (_, i) => (
                <VideoTilesItem key={i} />
              ))}
            </ul>
          </div>
        </section>

        {/* <aside className="space-y-6">
          <ParticipantsList />
          <Chat />
        </aside> */}
      </div>
    </main>
  );
}
