import { AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface WarningBarProps {
  pm25Level: number;
  trafficDelay: string;
  timeToOvercrowd: string;
  className?: string;
}

export function WarningBar({
  pm25Level,
  trafficDelay,
  timeToOvercrowd,
  className,
}: WarningBarProps) {
  return (
    <div
      className={cn(
        "bg-destructive text-destructive-foreground p-4 rounded-lg shadow-md",
        "border-l-4 border-destructive",
        className,
      )}
    >
      <div className="flex items-center gap-3 mb-2">
        <AlertTriangle className="h-5 w-5 flex-shrink-0" />
        <h3 className="font-semibold text-sm">
          Area Alert: Nimman, Chiang Mai
        </h3>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>Will be overcrowded in {timeToOvercrowd}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-3">
          <div className="bg-white/20 rounded px-3 py-2">
            <div className="text-xs opacity-90">PM2.5 Level</div>
            <div className="font-bold text-lg">{pm25Level} μg/m³</div>
            <div className="text-xs opacity-90">Unhealthy</div>
          </div>

          <div className="bg-white/20 rounded px-3 py-2">
            <div className="text-xs opacity-90">Traffic Delay</div>
            <div className="font-bold text-lg">{trafficDelay}</div>
            <div className="text-xs opacity-90">vs normal</div>
          </div>
        </div>
      </div>
    </div>
  );
}
