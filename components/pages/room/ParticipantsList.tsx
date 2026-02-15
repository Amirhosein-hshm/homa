import { MicOff } from "lucide-react";

export default function ParticipantsList() {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
      <h3 className="text-sm font-medium mb-2">شرکت کنندگان</h3>
      <ul id="participantsList" className="space-y-2 text-sm text-slate-700">
        {Array.from({ length: 6 }, (_, i) => (
          <li key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-400 text-white flex items-center justify-center text-xs font-semibold">
                ج
              </div>
              <div>
                <div className="font-medium">جمشید</div>
                <div className="text-xs text-slate-400">عضو</div>
              </div>
            </div>

            <MicOff size={18} className="text-xs text-slate-400" />
          </li>
        ))}
      </ul>
    </div>
  );
}
