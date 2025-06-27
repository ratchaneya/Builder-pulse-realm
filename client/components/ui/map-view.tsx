import { MapPin, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

interface MapPin {
  id: string;
  name: string;
  x: number; // percentage position
  y: number; // percentage position
  type: "start" | "destination";
  pmLevel: number;
}

interface MapViewProps {
  pins: MapPin[];
  selectedRoute?: string;
  className?: string;
}

const routePaths = {
  car: "M15,25 Q40,15 65,20 Q80,25 85,35",
  bus: "M15,25 Q30,35 50,30 Q70,25 85,35",
  bike: "M15,25 Q35,45 60,40 Q75,35 85,35",
};

const routeColors = {
  car: "stroke-red-500",
  bus: "stroke-primary",
  bike: "stroke-green-600",
};

export function MapView({ pins, selectedRoute, className }: MapViewProps) {
  return (
    <div
      className={cn(
        "relative bg-card rounded-xl border border-border overflow-hidden",
        className,
      )}
    >
      {/* Map Background */}
      <div className="relative h-48 bg-gradient-to-br from-green-50 to-blue-50">
        {/* Grid overlay for map feel */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full">
            <defs>
              <pattern
                id="grid"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  stroke="#000"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Route Paths */}
        <svg className="absolute inset-0 w-full h-full">
          {Object.entries(routePaths).map(([route, path]) => (
            <path
              key={route}
              d={path}
              fill="none"
              strokeWidth="3"
              strokeDasharray={route === selectedRoute ? "0" : "5,5"}
              className={cn(
                routeColors[route as keyof typeof routeColors],
                route === selectedRoute ? "opacity-100" : "opacity-40",
              )}
            />
          ))}
        </svg>

        {/* Map Pins */}
        {pins.map((pin) => (
          <div
            key={pin.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
          >
            <div className="relative">
              <div
                className={cn(
                  "w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center",
                  pin.type === "start"
                    ? "bg-blue-500"
                    : pin.pmLevel <= 50
                      ? "bg-green-500"
                      : pin.pmLevel <= 100
                        ? "bg-yellow-500"
                        : "bg-red-500",
                )}
              >
                {pin.type === "start" ? (
                  <Navigation className="h-4 w-4 text-white" />
                ) : (
                  <MapPin className="h-4 w-4 text-white" />
                )}
              </div>

              {/* Pin Label */}
              <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <div className="bg-black/80 text-white text-xs px-2 py-1 rounded">
                  {pin.name}
                  {pin.type === "destination" && (
                    <div className="text-xs opacity-80">PM: {pin.pmLevel}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Legend */}
        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-xs">
          <div className="font-medium mb-1">Routes</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-red-500"></div>
              <span>Car</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-primary"></div>
              <span>Bus</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-green-600"></div>
              <span>Bike</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Info Bar */}
      <div className="p-3 bg-muted/50 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            From Nimman to alternative destinations
          </span>
          <span className="text-muted-foreground">Updated 2 min ago</span>
        </div>
      </div>
    </div>
  );
}
