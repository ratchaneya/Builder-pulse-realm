import * as React from "react";
import { Button } from "@/components/ui/button";
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
  ChevronRight,
  Compass,
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
  imageUrl?: string;
}

interface WarningBarProps {
  co2Level?: number;
  trafficDelay?: string;
  timeToOvercrowd?: string;
  className?: string;
}

const featuredDestinations: LocalDestination[] = [
  {
    id: "aunt_pen_cafe",
    name: "Aunt Pen's Streamside Café",
    description:
      "Small riverside café serving aromatic coffee and homemade treats",
    type: "cafe",
    openingHours: "07:00-18:00",
    location: {
      name: "Mae Hia Village",
      coordinates: { lat: 18.7261, lng: 98.9389 },
      district: "Mae Hia",
    },
    highlights: ["Drip Coffee", "Homemade Pastries", "Riverside Setting"],
    priceRange: "budget",
    isOpen: true,
    imageUrl:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=250&fit=crop&crop=center",
  },
  {
    id: "grandma_mali_weaving",
    name: "Grandma Mali's Weaving Workshop",
    description:
      "Learn traditional weaving using natural dyes and ancient techniques",
    type: "workshop",
    openingHours: "09:00-17:00",
    location: {
      name: "Ban Pong Village",
      coordinates: { lat: 18.8147, lng: 99.0525 },
      district: "Ban Pong",
    },
    highlights: ["Hand Weaving", "Natural Dyes", "Local Wisdom"],
    priceRange: "moderate",
    isOpen: true,
    imageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop&crop=center",
  },
  {
    id: "doi_saket_coffee_farm",
    name: "Doi Saket Coffee Plantation",
    description:
      "Organic highland coffee farm with fresh beans straight from the tree",
    type: "scenic",
    openingHours: "06:00-18:00",
    location: {
      name: "Doi Saket",
      coordinates: { lat: 18.9167, lng: 99.2167 },
      district: "Doi Saket",
    },
    highlights: ["Organic Coffee", "Mountain Views", "Farm Tours"],
    priceRange: "moderate",
    isOpen: true,
    imageUrl:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=250&fit=crop&crop=center",
  },
];

const typeIcons = {
  cafe: Coffee,
  local_food: Utensils,
  workshop: Palette,
  scenic: Mountain,
  market: Sparkles,
  cultural: TreePine,
};

const typeColors = {
  cafe: "bg-amber-100 text-amber-800",
  local_food: "bg-red-100 text-red-800",
  workshop: "bg-purple-100 text-purple-800",
  scenic: "bg-blue-100 text-blue-800",
  market: "bg-green-100 text-green-800",
  cultural: "bg-indigo-100 text-indigo-800",
};

export function WarningBar({ className }: WarningBarProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  // Auto-rotate featured destinations
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredDestinations.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentDestination = featuredDestinations[currentIndex];
  const TypeIcon = typeIcons[currentDestination.type];

  const openGoogleMaps = (destination: LocalDestination) => {
    const { lat, lng } = destination.location.coordinates;
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;

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
        "bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-lg shadow-md",
        "border-l-4 border-green-400",
        className,
      )}
    >
      <div className="flex items-center gap-3 mb-3">
        <Compass className="h-5 w-5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold text-sm">Discover Local Chiang Mai</h3>
          <p className="text-xs text-green-100">
            Featured destination outside the city center
          </p>
        </div>
        <div className="flex gap-1">
          {featuredDestinations.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === currentIndex ? "bg-white" : "bg-white/40",
              )}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {/* Destination Card */}
        <div
          className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden cursor-pointer hover:bg-white/20 transition-all group"
          onClick={() => openGoogleMaps(currentDestination)}
        >
          {/* Image Header */}
          {currentDestination.imageUrl && (
            <div className="relative h-24 overflow-hidden">
              <img
                src={currentDestination.imageUrl}
                alt={currentDestination.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute top-2 left-2">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <TypeIcon className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="absolute top-2 right-2">
                <ChevronRight className="w-4 h-4 text-white/80" />
              </div>
            </div>
          )}

          <div className="p-3">
            <div className="flex items-start justify-between mb-1">
              <h4 className="font-medium text-white text-sm leading-tight">
                {currentDestination.name}
              </h4>
              {!currentDestination.imageUrl && (
                <ChevronRight className="w-4 h-4 text-white/80 flex-shrink-0 ml-2" />
              )}
            </div>
            <p className="text-xs text-green-100 mb-2 line-clamp-2">
              {currentDestination.description}
            </p>

            <div className="flex items-center gap-2 text-xs text-green-100 mb-2">
              <MapPin className="w-3 h-3" />
              <span>{currentDestination.location.district}</span>
              <Clock className="w-3 h-3 ml-1" />
              <span>{currentDestination.openingHours}</span>
            </div>

            <div className="flex flex-wrap gap-1">
              {currentDestination.highlights
                .slice(0, 2)
                .map((highlight, index) => (
                  <Badge
                    key={index}
                    className="text-xs bg-white/20 text-white border-white/30 hover:bg-white/30"
                  >
                    {highlight}
                  </Badge>
                ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={() => openGoogleMaps(currentDestination)}
          className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 transition-all"
          variant="outline"
          size="sm"
        >
          <MapPin className="w-4 h-4 mr-2" />
          Get Directions to {currentDestination.location.district}
          <ExternalLink className="w-3 h-3 ml-2" />
        </Button>
      </div>
    </div>
  );
}
