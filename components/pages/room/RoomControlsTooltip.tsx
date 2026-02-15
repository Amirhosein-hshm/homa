import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type Props = {
  tooltipContent: string;
  icon: ReactNode;
  className?: string;
};

export function RoomControlsTooltip({
  tooltipContent,
  icon,
  className,
}: Props) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className={cn(
            "control-btn bg-slate-50 hover:bg-slate-100 text-slate-700 inline-flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer",
            className,
          )}
        >
          {icon}
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltipContent}</p>
      </TooltipContent>
    </Tooltip>
  );
}
