import { Car, Bus, Bike, Clock, Leaf, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RouteCardProps {
  id: string;
  type: "car" | "bus" | "bike";
  destination: string;
  duration: string;
  co2Emission: number;
  pmLevel: number;
  distance: string;
  isSelected?: boolean;
  isFastest?: boolean;
  isGreenest?: boolean;
  onSelect: () => void;
  className?: string;
}

const routeIcons = {
  car: Car,
  bus: Bus,
  bike: Bike,
};

const routeColors = {
  car: "text-red-600 bg-red-50",
  bus: "text-primary bg-primary/10",
  bike: "text-green-600 bg-green-50",
};

const routeLabels = {
  car: "Private Car",
  bus: "Public Bus",
  bike: "Bicycle",
};

const getPmLevelColor = (level: number) => {
  if (level <= 50) return "text-green-600 bg-green-50";
  if (level <= 100) return "text-yellow-600 bg-yellow-50";
  return "text-red-600 bg-red-50";
};

const getPmLevelText = (level: number) => {
  if (level <= 50) return "Good";
  if (level <= 100) return "Moderate";
  return "Unhealthy";
};

export function RouteCard({
  id,
  type,
  destination,
  duration,
  co2Emission,
  pmLevel,
  distance,
  isSelected = false,
  isFastest = false,
  isGreenest = false,
  onSelect,
  className,
}: RouteCardProps) {
  const Icon = routeIcons[type];

  return (
    <div
      className={cn(
        "bg-card rounded-xl border border-border p-4 transition-all duration-200",
        isSelected
          ? "ring-2 ring-primary shadow-md"
          : "hover:shadow-sm hover:border-primary/50",
        className,
      )}
    >
      {/* Route Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg", routeColors[type])}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">
              Route {id.toUpperCase()}
            </h3>
            <p className="text-sm text-muted-foreground">{routeLabels[type]}</p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-col gap-1">
          {isFastest && (
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
              Fastest
            </span>
          )}
          {isGreenest && (
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
              Greenest
            </span>
          )}
        </div>
      </div>

      {/* Destination */}
      <div className="mb-3">
        <p className="text-sm font-medium text-card-foreground mb-1">
          To {destination}
        </p>
        <p className="text-xs text-muted-foreground">{distance}</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {/* Duration */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Clock className="h-3 w-3 text-muted-foreground" />
          </div>
          <div className="text-lg font-bold text-card-foreground">
            {duration}
          </div>
          <div className="text-xs text-muted-foreground">Travel time</div>
        </div>

        {/* CO2 Emission */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Leaf className="h-3 w-3 text-muted-foreground" />
          </div>
          <div className="text-lg font-bold text-card-foreground">
            {co2Emission}kg
          </div>
          <div className="text-xs text-muted-foreground">CO₂ emission</div>
        </div>

        {/* PM2.5 Level */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Wind className="h-3 w-3 text-muted-foreground" />
          </div>
          <div
            className={cn(
              "text-lg font-bold",
              pmLevel <= 50
                ? "text-green-600"
                : pmLevel <= 100
                  ? "text-yellow-600"
                  : "text-red-600",
            )}
          >
            {pmLevel}
          </div>
          <div className="text-xs text-muted-foreground">PM2.5 μg/m³</div>
        </div>
      </div>

      {/* Air Quality Indicator */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Air Quality</span>
          <span
            className={cn(
              "text-xs px-2 py-1 rounded-full font-medium",
              getPmLevelColor(pmLevel),
            )}
          >
            {getPmLevelText(pmLevel)}
          </span>
        </div>

        {/* Air Quality Bar */}
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              pmLevel <= 50
                ? "bg-green-500"
                : pmLevel <= 100
                  ? "bg-yellow-500"
                  : "bg-red-500",
            )}
            style={{ width: `${Math.min((pmLevel / 150) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Select Button */}
      <Button
        onClick={onSelect}
        variant={isSelected ? "default" : "outline"}
        className="w-full"
      >
        {isSelected ? "Selected Route" : "Select This Route"}
      </Button>
    </div>
  );
}
