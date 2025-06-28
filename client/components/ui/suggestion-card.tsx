import {
  Bike,
  Bus,
  MapPin,
  Leaf,
  Navigation,
  ExternalLink,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SuggestionCardProps {
  locationName: string;
  distance: number;
  co2Level: number;
  travelMethod: "bike" | "bus" | "walk";
  description: string;
  coordinates?: { lat: number; lng: number };
  className?: string;
  onGoHere: () => void;
  onLowCarbonRoute: () => void;
  onCheckIn?: () => void;
  isNearby?: boolean;
  isCheckedIn?: boolean;
}

const travelIcons = {
  bike: Bike,
  bus: Bus,
  walk: MapPin,
};

const co2LevelColor = (level: number) => {
  if (level <= 1.0) return "text-primary";
  if (level <= 2.0) return "text-yellow-600";
  return "text-destructive";
};

const co2LevelText = (level: number) => {
  if (level <= 1.0) return "Low";
  if (level <= 2.0) return "Moderate";
  return "High";
};

export function SuggestionCard({
  locationName,
  distance,
  co2Level,
  travelMethod,
  description,
  coordinates,
  className,
  onGoHere,
  onLowCarbonRoute,
  onCheckIn,
  isNearby = false,
  isCheckedIn = false,
}: SuggestionCardProps) {
  const TravelIcon = travelIcons[travelMethod];

  const openGoogleMaps = () => {
    if (!coordinates) {
      console.warn("No coordinates provided for", locationName);
      return;
    }

    const { lat, lng } = coordinates;
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;

    // Try to open in Google Maps app first (mobile), fallback to web
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|iphone|ipad|ipod|mobile/.test(userAgent);

    if (isMobile) {
      const mapsAppUrl = `comgooglemaps://?daddr=${lat},${lng}&directionsmode=driving`;
      window.location.href = mapsAppUrl;
      setTimeout(() => {
        window.open(googleMapsUrl, "_blank");
      }, 1000);
    } else {
      window.open(googleMapsUrl, "_blank");
    }
  };

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
            <span
              className={cn("font-medium text-sm", co2LevelColor(co2Level))}
            >
              {co2Level}kg
            </span>
          </div>
          <div className={cn("text-xs", co2LevelColor(co2Level))}>
            {co2LevelText(co2Level)}
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
