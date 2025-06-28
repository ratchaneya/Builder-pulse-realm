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
      onGoHere(); // Fallback to original handler
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
        "bg-card rounded-xl p-4 shadow-sm border border-border hover:shadow-md transition-all duration-200",
        className,
      )}
    >
      <div className="space-y-3">
        {/* Header with location name and status badges */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground text-lg">
                {locationName}
              </h3>
              {isCheckedIn && (
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Visited
                </Badge>
              )}
              {isNearby && !isCheckedIn && (
                <Badge className="bg-blue-100 text-blue-800 border-blue-300 animate-pulse">
                  📍 Nearby
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-3">{description}</p>
          </div>
          <div className="ml-4 flex flex-col items-center">
            <TravelIcon className="h-6 w-6 text-muted-foreground mb-1" />
            <span className="text-xs text-muted-foreground capitalize">
              {travelMethod}
            </span>
          </div>
        </div>

        {/* Distance and CO2 info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{distance}km</span>
            </div>
            <div className="flex items-center gap-1">
              <Leaf className={cn("h-4 w-4", co2LevelColor(co2Level))} />
              <span className={co2LevelColor(co2Level)}>
                {co2Level}kg • {co2LevelText(co2Level)}
              </span>
            </div>
          </div>
        </div>

        {/* Step 1: Navigation Buttons */}
        <div className="flex gap-2 mb-3">
          <Button
            onClick={openGoogleMaps}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            <Navigation className="w-4 h-4 mr-1" />
            📍 Go Here
            <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
          <Button
            onClick={onLowCarbonRoute}
            size="sm"
            variant="outline"
            className="flex-1"
          >
            Low-Carbon Route
          </Button>
        </div>

        {/* Step 2: Check-in Button (only when nearby) */}
        {isNearby && !isCheckedIn && (
          <div className="border-t border-gray-200 pt-3">
            <Button
              onClick={onCheckIn}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              size="sm"
            >
              <CheckCircle className="w-4 h-4 mr-2" />✅ Check-In Now
            </Button>
            <p className="text-xs text-green-600 text-center mt-1">
              You're within 100m • Tap to check-in and meet local heroes!
            </p>
          </div>
        )}

        {/* Checked-in Status */}
        {isCheckedIn && (
          <div className="border-t border-green-200 pt-3 bg-green-50 rounded-lg p-2">
            <div className="flex items-center justify-center gap-2 text-green-700">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Experience completed!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
