import { AlertTriangle, Bell, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  type: "congestion" | "pollution" | "combined";
  severity: "warning" | "danger";
  title: string;
  message: string;
  timestamp: string;
  metrics: {
    crowdLevel: number;
    pm25Level: number;
    trafficScore: number;
  };
}

interface AlertSystemProps {
  alerts: Alert[];
  onDismiss: (id: string) => void;
  onNotifyLine: () => void;
  className?: string;
}

const alertConfig = {
  congestion: {
    icon: AlertTriangle,
    color: "bg-orange-500 text-white",
    bgColor: "bg-orange-50 border-orange-200",
  },
  pollution: {
    icon: AlertTriangle,
    color: "bg-red-500 text-white",
    bgColor: "bg-red-50 border-red-200",
  },
  combined: {
    icon: AlertTriangle,
    color: "bg-red-600 text-white",
    bgColor: "bg-red-50 border-red-200",
  },
};

export function AlertSystem({
  alerts,
  onDismiss,
  onNotifyLine,
  className,
}: AlertSystemProps) {
  if (alerts.length === 0) {
    return (
      <div
        className={cn("bg-card rounded-xl border border-border p-4", className)}
      >
        <div className="flex items-center gap-2 text-green-600">
          <Bell className="h-5 w-5" />
          <span className="font-medium">All Clear</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          No alerts active. Conditions are within safe thresholds.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-card-foreground flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          Active Alerts ({alerts.length})
        </h3>
        <Button
          onClick={onNotifyLine}
          size="sm"
          variant="outline"
          className="flex items-center gap-2"
        >
          <MessageSquare className="h-4 w-4" />
          Send LINE Alert
        </Button>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => {
          const config = alertConfig[alert.type];
          const Icon = config.icon;

          return (
            <div
              key={alert.id}
              className={cn("rounded-xl border-2 p-4 relative", config.bgColor)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className={cn("p-2 rounded-lg", config.color)}>
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-card-foreground">
                        {alert.title}
                      </h4>
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full font-medium",
                          alert.severity === "danger"
                            ? "bg-red-100 text-red-700"
                            : "bg-orange-100 text-orange-700",
                        )}
                      >
                        {alert.severity.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-sm text-card-foreground/80 mb-3">
                      {alert.message}
                    </p>

                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="text-center">
                        <div className="font-bold text-card-foreground">
                          {alert.metrics.crowdLevel}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Crowd
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-card-foreground">
                          {alert.metrics.pm25Level}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          PM2.5
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-card-foreground">
                          {alert.metrics.trafficScore}x
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Traffic
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-muted-foreground">
                      Detected at {alert.timestamp}
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDismiss(alert.id)}
                  className="p-1 h-auto"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-card rounded-lg p-3 border border-border">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          <span className="font-medium text-sm text-card-foreground">
            Notification Settings
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          LINE notifications will be sent when traffic score &ge; 2.0 AND PM2.5
          &gt; 90 &mu;g/m&sup3;
        </p>
      </div>
    </div>
  );
}
