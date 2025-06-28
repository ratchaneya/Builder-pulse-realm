import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  MapPin,
  Clock,
  ExternalLink,
  Coffee,
  Utensils,
  Palette,
  Mountain,
  TreePine,
  Sparkles,
} from "lucide-react";

interface LocalDestination {
  id: string;
  name: string;
  description: string;
  type: "cafe" | "local_food" | "workshop" | "scenic" | "market" | "cultural";
  openingHours: string;
  location: {
    name: string;
    coordinates: { lat: number; lng: number };
    district: string;
  };
  highlights: string[];
  priceRange: "budget" | "moderate" | "premium";
  isOpen?: boolean;
}

interface LocalDestinationCardProps {
  destination: LocalDestination;
  onNavigate?: (destination: LocalDestination) => void;
  className?: string;
}

const typeIcons = {
  cafe: Coffee,
  local_food: Utensils,
  workshop: Palette,
  scenic: Mountain,
  market: Sparkles,
  cultural: TreePine,
};

const typeLabels = {
  cafe: "คาเฟ่",
  local_food: "อาหารท้องถิ่น",
  workshop: "เวิร์คช็อป",
  scenic: "จุดชมวิว",
  market: "ตลาดท้องถิ่น",
  cultural: "วัฒนธรรม",
};

const typeColors = {
  cafe: "bg-amber-100 text-amber-800 border-amber-200",
  local_food: "bg-red-100 text-red-800 border-red-200",
  workshop: "bg-purple-100 text-purple-800 border-purple-200",
  scenic: "bg-blue-100 text-blue-800 border-blue-200",
  market: "bg-green-100 text-green-800 border-green-200",
  cultural: "bg-indigo-100 text-indigo-800 border-indigo-200",
};

const priceRangeLabels = {
  budget: "฿",
  moderate: "฿฿",
  premium: "฿฿฿",
};

const priceRangeColors = {
  budget: "bg-green-100 text-green-700",
  moderate: "bg-yellow-100 text-yellow-700",
  premium: "bg-orange-100 text-orange-700",
};

export const LocalDestinationCard: React.FC<LocalDestinationCardProps> = ({
  destination,
  onNavigate,
  className,
}) => {
  const TypeIcon = typeIcons[destination.type];

  const openGoogleMaps = () => {
    const { lat, lng } = destination.location.coordinates;
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

    if (onNavigate) {
      onNavigate(destination);
    }
  };

  return (
    <Card
      className={cn(
        "w-full bg-white border-gray-200 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer",
        className,
      )}
      onClick={openGoogleMaps}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center",
                typeColors[destination.type]
                  .replace("text-", "bg-")
                  .replace("border-", ""),
              )}
            >
              <TypeIcon className="w-6 h-6 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                  {destination.name}
                </h3>
                <div className="flex items-center gap-1 ml-2">
                  <Badge
                    variant="outline"
                    className={cn("text-xs", typeColors[destination.type])}
                  >
                    {typeLabels[destination.type]}
                  </Badge>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {destination.description}
              </p>

              {/* Location */}
              <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                <MapPin className="w-4 h-4" />
                <span>
                  {destination.location.name}, {destination.location.district}
                </span>
              </div>
            </div>
          </div>

          {/* Tags/Highlights */}
          {destination.highlights.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {destination.highlights.slice(0, 3).map((highlight, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs bg-gray-50 text-gray-600 border-gray-200"
                >
                  {highlight}
                </Badge>
              ))}
              {destination.highlights.length > 3 && (
                <Badge
                  variant="outline"
                  className="text-xs bg-gray-50 text-gray-500 border-gray-200"
                >
                  +{destination.highlights.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Bottom Row */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-3">
              {/* Opening Hours */}
              <div className="flex items-center gap-1 text-sm">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">
                  {destination.openingHours}
                </span>
                {destination.isOpen !== undefined && (
                  <Badge
                    className={cn(
                      "text-xs ml-1",
                      destination.isOpen
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700",
                    )}
                  >
                    {destination.isOpen ? "เปิด" : "ปิด"}
                  </Badge>
                )}
              </div>

              {/* Price Range */}
              <Badge
                className={cn(
                  "text-xs font-bold",
                  priceRangeColors[destination.priceRange],
                )}
              >
                {priceRangeLabels[destination.priceRange]}
              </Badge>
            </div>

            {/* Navigate Button */}
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={(e) => {
                e.stopPropagation();
                openGoogleMaps();
              }}
            >
              <MapPin className="w-4 h-4 mr-1" />
              นำทาง
              <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
