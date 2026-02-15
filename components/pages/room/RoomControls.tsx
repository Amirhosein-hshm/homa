import { Mic, MonitorUp, Phone, VideoIcon } from "lucide-react";
import { RoomControlsOptions } from "./RoomControlsOptions";
import { RoomControlsTooltip } from "./RoomControlsTooltip";

export default function RoomControls() {
  return (
    <div className="fixed bottom-4 left-0 right-0 flex justify-center pointer-events-none">
      <div className="w-full max-w-lg px-4 pointer-events-auto">
        <div className="bg-white border border-slate-200 rounded-full px-4 py-3 flex items-center justify-between shadow-lg">
          <RoomControlsOptions />
          <div className="flex items-center gap-2">
            <RoomControlsTooltip
              icon={<Mic />}
              tooltipContent="روشن کردن میکروفن"
            />
            <RoomControlsTooltip
              icon={<VideoIcon />}
              tooltipContent="روشن کردن میکروفن"
            />
            <RoomControlsTooltip
              icon={<MonitorUp />}
              tooltipContent="به اشتراک گذاری صفحه"
            />
          </div>

          <div className="flex items-center gap-3">
            <RoomControlsTooltip
              icon={<Phone className="rotate-135" size={17} />}
              tooltipContent="ترک جلسه"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
