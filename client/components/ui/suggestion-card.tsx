import { Bike, Bus, MapPin, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SuggestionCardProps {
  locationName: string;
  distance: number;
  pmLevel: number;
  travelMethod: "bike" | "bus" | "walk";
  description: string;
  className?: string;
  onGoHere: () => void;
  onLowCarbonRoute: () => void;
}

const travelIcons = {
  bike: Bike,
  bus: Bus,
  walk: MapPin,
};

const pmLevelColor = (level: number) => {
  if (level <= 50) return "text-primary";
  if (level <= 100) return "text-yellow-600";
  return "text-destructive";
};

const pmLevelText = (level: number) => {
  if (level <= 50) return "Good";
  if (level <= 100) return "Moderate";
  return "Unhealthy";
};

export function SuggestionCard({
  locationName,
  distance,
  pmLevel,
  travelMethod,
  description,
  className,
  onGoHere,
  onLowCarbonRoute,
}: SuggestionCardProps) {
  const TravelIcon = travelIcons[travelMethod];

  return (
    <div
      className={cn(
        "bg-card rounded-xl p-4 shadow-sm border border-border",
        "hover:shadow-md transition-shadow duration-200",
        className,
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-card-foreground mb-1">
            {locationName}
          </h3>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{distance} km away</span>
            </div>
            <div className="flex items-center gap-1">
              <TravelIcon className="h-4 w-4" />
              <span className="capitalize">{travelMethod}</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1 mb-1">
            <Leaf className="h-4 w-4 text-primary" />
            <span className={cn("font-medium text-sm", pmLevelColor(pmLevel))}>
              {pmLevel}
            </span>
          </div>
          <div className={cn("text-xs", pmLevelColor(pmLevel))}>
            {pmLevelText(pmLevel)}
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        {description}
      </p>

      <div className="flex gap-2">
        <Button
          onClick={onGoHere}
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Go here
        </Button>
        <Button
          onClick={onLowCarbonRoute}
          variant="outline"
          className="flex-1 border-primary text-primary hover:bg-primary/5"
        >
          Low-carbon route
        </Button>
      </div>
    </div>
  );
}
