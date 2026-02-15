import UserIcon from "@/components/icons/UserIcon";
import { Mic } from "lucide-react";

export default function VideoTilesItem() {
  return (
    <li className="video-tile rounded-lg overflow-hidden shadow-sm bg-black text-white flex flex-col h-35">
      <div className="flex-1 placeholder-gradient flex items-center justify-center text-2xl font-semibold">
        ZZ
      </div>
      <div className="px-3 py-2 bg-slate-900/50 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserIcon />
          <span>مدیر</span>

          <span className="text-[10px] font-light">محمد امین جمشیدی</span>
        </div>
        <Mic size={18} className="text-slate-300" />
      </div>
    </li>
  );
}
