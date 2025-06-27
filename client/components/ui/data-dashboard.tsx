import { TrendingUp, TrendingDown, Minus, Wifi, Wind, Car } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataPoint {
  label: string;
  current: number;
  predicted: number;
  unit: string;
  threshold: number;
  trend: "up" | "down" | "stable";
  icon: React.ComponentType<any>;
  color: "green" | "yellow" | "red";
}

interface DataDashboardProps {
  location: string;
  lastUpdated: string;
  className?: string;
}

const mockData: DataPoint[] = [
  {
    label: "Crowd Density",
    current: 85,
    predicted: 92,
    unit: "%",
    threshold: 80,
    trend: "up",
    icon: Wifi,
    color: "red",
  },
  {
    label: "PM2.5 Level",
    current: 78,
    predicted: 85,
    unit: "μg/m³",
    threshold: 90,
    trend: "up",
    icon: Wind,
    color: "yellow",
  },
  {
    label: "Traffic Score",
    current: 2.3,
    predicted: 2.8,
    unit: "x normal",
    threshold: 2.0,
    trend: "up",
    icon: Car,
    color: "red",
  },
];

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "up":
      return TrendingUp;
    case "down":
      return TrendingDown;
    default:
      return Minus;
  }
};

const getColorClasses = (color: string) => {
  switch (color) {
    case "green":
      return "bg-green-50 border-green-200 text-green-800";
    case "yellow":
      return "bg-yellow-50 border-yellow-200 text-yellow-800";
    case "red":
      return "bg-red-50 border-red-200 text-red-800";
    default:
      return "bg-gray-50 border-gray-200 text-gray-800";
  }
};

export function DataDashboard({
  location,
  lastUpdated,
  className,
}: DataDashboardProps) {
  return (
    <div
      className={cn("bg-card rounded-xl border border-border p-4", className)}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-card-foreground">
            Real-time Monitoring
          </h3>
          <p className="text-sm text-muted-foreground">{location}</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground">Last updated</div>
          <div className="text-sm font-medium text-card-foreground">
            {lastUpdated}
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {mockData.map((data, index) => {
          const TrendIcon = getTrendIcon(data.trend);
          const IconComponent = data.icon;
          const isOverThreshold = data.current >= data.threshold;

          return (
            <div
              key={index}
              className={cn(
                "p-3 rounded-lg border-2 transition-all duration-200",
                getColorClasses(data.color),
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <IconComponent className="h-4 w-4" />
                  <span className="font-medium text-sm">{data.label}</span>
                  {isOverThreshold && (
                    <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                      ALERT
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <TrendIcon className="h-3 w-3" />
                  <span className="text-xs">
                    {data.trend === "up"
                      ? "Rising"
                      : data.trend === "down"
                        ? "Falling"
                        : "Stable"}
                  </span>
                </div>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    {data.current}
                    <span className="text-sm font-normal ml-1">
                      {data.unit}
                    </span>
                  </div>
                  <div className="text-xs opacity-75">
                    Predicted: {data.predicted}
                    {data.unit} in 1h
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs opacity-75">Threshold</div>
                  <div className="text-sm font-medium">
                    {data.threshold}
                    {data.unit}
                  </div>
                </div>
              </div>

              {/* Progress bar showing current vs threshold */}
              <div className="mt-3">
                <div className="w-full bg-white/50 rounded-full h-2">
                  <div
                    className={cn(
                      "h-2 rounded-full transition-all duration-300",
                      data.color === "green"
                        ? "bg-green-600"
                        : data.color === "yellow"
                          ? "bg-yellow-600"
                          : "bg-red-600",
                    )}
                    style={{
                      width: `${Math.min((data.current / (data.threshold * 1.5)) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>System Status:</strong> 2 of 3 metrics exceed safe thresholds.
          Redirection engine is active and monitoring alternatives.
        </p>
      </div>
    </div>
  );
}
