import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Navigation, MapPin, Leaf, ExternalLink } from "lucide-react";

interface EcoDestination {
  id: string;
  name: string;
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  estimatedCO2: number; // kg CO₂ from city center
  estimatedTime: string;
  highlights: string[];
}

const ecoDestinations: EcoDestination[] = [
  {
    id: "mae-hia",
    name: "Mae Hia Agricultural Center",
    description: "Organic farms and local markets away from city pollution",
    coordinates: { lat: 18.7261, lng: 98.9389 },
    estimatedCO2: 1.2,
    estimatedTime: "25 mins",
    highlights: ["Organic produce", "Fresh air", "Local community"],
  },
  {
    id: "ban-pong",
    name: "Ban Pong Village",
    description: "Traditional village with handicraft workshops",
    coordinates: { lat: 18.8147, lng: 99.0525 },
    estimatedCO2: 1.8,
    estimatedTime: "35 mins",
    highlights: ["Handicrafts", "Rural culture", "Quiet atmosphere"],
  },
  {
    id: "mae-sa",
    name: "Mae Sa Valley",
    description: "Riverside cafes and elephant sanctuaries",
    coordinates: { lat: 18.9167, lng: 99.0833 },
    estimatedCO2: 2.1,
    estimatedTime: "40 mins",
    highlights: ["Nature sanctuary", "River views", "Eco-tourism"],
  },
  {
    id: "hang-dong",
    name: "Hang Dong District",
    description: "Pottery villages and traditional crafts",
    coordinates: { lat: 18.6719, lng: 98.9342 },
    estimatedCO2: 1.5,
    estimatedTime: "30 mins",
    highlights: ["Pottery workshops", "Cultural heritage", "Less crowded"],
  },
  {
    id: "san-kamphaeng",
    name: "San Kamphaeng Hot Springs",
    description: "Natural hot springs and therapeutic gardens",
    coordinates: { lat: 18.7606, lng: 99.1828 },
    estimatedCO2: 2.4,
    estimatedTime: "45 mins",
    highlights: ["Natural healing", "Gardens", "Wellness tourism"],
  },
  {
    id: "doi-saket",
    name: "Doi Saket District",
    description: "Mountain views and coffee plantations",
    coordinates: { lat: 18.9167, lng: 99.2167 },
    estimatedCO2: 2.8,
    estimatedTime: "50 mins",
    highlights: ["Coffee farms", "Mountain air", "Scenic routes"],
  },
];

interface GPSNavigationProps {
  className?: string;
  variant?: "dropdown" | "buttons";
}

const getEmissionColor = (co2: number) => {
  if (co2 < 1.5) return "bg-green-100 text-green-800 border-green-200";
  if (co2 < 2.5) return "bg-yellow-100 text-yellow-800 border-yellow-200";
  return "bg-orange-100 text-orange-800 border-orange-200";
};

export const GPSNavigation: React.FC<GPSNavigationProps> = ({
  className,
  variant = "dropdown",
}) => {
  const [selectedDestination, setSelectedDestination] =
    React.useState<EcoDestination | null>(null);

  const openGoogleMapsNavigation = (destination: EcoDestination) => {
    const { lat, lng } = destination.coordinates;
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;

    // Try to open in Google Maps app first (mobile), fallback to web
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|iphone|ipad|ipod|mobile/.test(userAgent);

    if (isMobile) {
      // For mobile, try Google Maps app first
      const mapsAppUrl = `comgooglemaps://?daddr=${lat},${lng}&directionsmode=driving`;
      window.location.href = mapsAppUrl;

      // Fallback to web version after a short delay
      setTimeout(() => {
        window.open(googleMapsUrl, "_blank");
      }, 1000);
    } else {
      // For desktop, open in new tab
      window.open(googleMapsUrl, "_blank");
    }
  };

  if (variant === "buttons") {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="flex items-center gap-2 mb-4">
          <Navigation className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold text-green-900">
            Navigate to Eco-Destinations
          </h3>
        </div>
        <p className="text-sm text-green-700 mb-4">
          Discover rural areas outside Nimman with lower emissions and peaceful
          environments.
        </p>

        <div className="grid gap-3">
          {ecoDestinations.map((destination) => (
            <div
              key={destination.id}
              className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-green-900 mb-1">
                    {destination.name}
                  </h4>
                  <p className="text-sm text-green-700 mb-2">
                    {destination.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {destination.highlights.map((highlight, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs bg-green-100 text-green-700 border-green-300"
                      >
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      getEmissionColor(destination.estimatedCO2),
                    )}
                  >
                    <Leaf className="w-3 h-3 mr-1" />
                    {destination.estimatedCO2}kg CO₂
                  </Badge>
                  <span className="text-green-600">
                    ~{destination.estimatedTime}
                  </span>
                </div>

                <Button
                  onClick={() => openGoogleMapsNavigation(destination)}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Navigation className="w-4 h-4 mr-1" />
                  Navigate
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "space-y-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6",
        className,
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <Navigation className="h-5 w-5 text-green-600" />
        <h3 className="text-lg font-semibold text-green-900">
          GPS Navigation to Eco-Destinations
        </h3>
      </div>

      <p className="text-sm text-green-700 mb-4">
        Choose a rural destination outside Nimman for cleaner air and peaceful
        travel.
      </p>

      <div className="space-y-4">
        <Select
          onValueChange={(value) => {
            const destination = ecoDestinations.find((d) => d.id === value);
            setSelectedDestination(destination || null);
          }}
        >
          <SelectTrigger className="w-full bg-white border-green-300 focus:border-green-500">
            <SelectValue placeholder="Select an eco-destination..." />
          </SelectTrigger>
          <SelectContent>
            {ecoDestinations.map((destination) => (
              <SelectItem key={destination.id} value={destination.id}>
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium">{destination.name}</span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "ml-2 text-xs",
                      getEmissionColor(destination.estimatedCO2),
                    )}
                  >
                    {destination.estimatedCO2}kg CO₂
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedDestination && (
          <div className="bg-white border border-green-200 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-semibold text-green-900 mb-1">
                  {selectedDestination.name}
                </h4>
                <p className="text-sm text-green-700 mb-3">
                  {selectedDestination.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {selectedDestination.highlights.map((highlight, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs bg-green-100 text-green-700 border-green-300"
                    >
                      {highlight}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-sm mb-4">
                  <div className="flex items-center gap-1">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        getEmissionColor(selectedDestination.estimatedCO2),
                      )}
                    >
                      <Leaf className="w-3 h-3 mr-1" />
                      {selectedDestination.estimatedCO2}kg CO₂
                    </Badge>
                  </div>
                  <span className="text-green-600">
                    ~{selectedDestination.estimatedTime} from city center
                  </span>
                </div>
              </div>
            </div>

            <Button
              onClick={() => openGoogleMapsNavigation(selectedDestination)}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 transition-all duration-200"
              size="lg"
            >
              <Navigation className="w-5 h-5 mr-2" />
              Navigate to {selectedDestination.name}
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>

            <p className="text-xs text-green-600 text-center">
              Opens Google Maps for turn-by-turn navigation
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
