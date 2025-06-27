import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Car, Bike, Footprints, Truck, Leaf, MapPin } from "lucide-react";

interface TransportMethod {
  type: "car" | "walk" | "bike" | "red-truck";
  co2Emissions: number; // kg CO₂
  duration?: string;
}

interface DestinationCardProps {
  destinationName: string;
  description: string;
  location?: string;
  transportMethods: TransportMethod[];
  onGoHere?: (destination: string) => void;
  className?: string;
  imageUrl?: string;
}

const transportIcons = {
  car: Car,
  walk: Footprints,
  bike: Bike,
  "red-truck": Truck,
};

const transportLabels = {
  car: "Car",
  walk: "Walk",
  bike: "Bike",
  "red-truck": "Red Truck",
};

const getEmissionColor = (emissions: number) => {
  if (emissions === 0) return "bg-green-100 text-green-800 border-green-200";
  if (emissions < 1) return "bg-yellow-100 text-yellow-800 border-yellow-200";
  if (emissions < 3) return "bg-orange-100 text-orange-800 border-orange-200";
  return "bg-red-100 text-red-800 border-red-200";
};

const getBestTransport = (methods: TransportMethod[]) => {
  return methods.reduce((best, current) =>
    current.co2Emissions < best.co2Emissions ? current : best,
  );
};

export const DestinationCard = React.forwardRef<
  HTMLDivElement,
  DestinationCardProps
>(
  (
    {
      destinationName,
      description,
      location,
      transportMethods,
      onGoHere,
      className,
      imageUrl,
      ...props
    },
    ref,
  ) => {
    const bestTransport = getBestTransport(transportMethods);
    const [showMap, setShowMap] = React.useState(false);

    const handleGoHere = () => {
      setShowMap(true);
      if (onGoHere) {
        onGoHere(destinationName);
      }
      // Trigger the map display
      if (typeof window !== "undefined" && (window as any).showLowCarbonRoute) {
        (window as any).showLowCarbonRoute(destinationName);
      }
    };

    return (
      <Card
        ref={ref}
        className={cn(
          "w-full max-w-md mx-auto transition-all duration-300 hover:shadow-lg hover:scale-[1.02] bg-gradient-to-br from-green-50 to-emerald-50 border-green-200",
          className,
        )}
        {...props}
      >
        {imageUrl && (
          <div className="relative h-48 overflow-hidden rounded-t-lg">
            <img
              src={imageUrl}
              alt={destinationName}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3">
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <Leaf className="w-3 h-3 mr-1" />
                Eco-Friendly
              </Badge>
            </div>
          </div>
        )}

        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl font-bold text-green-900 mb-2 leading-tight">
                {destinationName}
              </CardTitle>
              {location && (
                <div className="flex items-center text-sm text-green-700 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  {location}
                </div>
              )}
            </div>
          </div>
          <CardDescription className="text-green-700 leading-relaxed">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Transport Methods & CO₂ Emissions */}
          <div className="space-y-3">
            <h4 className="font-semibold text-green-900 text-sm flex items-center">
              <Leaf className="w-4 h-4 mr-1" />
              CO₂ Emissions by Transport
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {transportMethods.map((method) => {
                const Icon = transportIcons[method.type];
                return (
                  <div
                    key={method.type}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border text-xs transition-colors",
                      method.type === bestTransport.type
                        ? "bg-green-100 border-green-300 ring-2 ring-green-200"
                        : "bg-white border-gray-200 hover:bg-gray-50",
                    )}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="w-4 h-4 text-green-700" />
                      <span className="font-medium text-green-900">
                        {transportLabels[method.type]}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs px-2 py-1",
                        getEmissionColor(method.co2Emissions),
                      )}
                    >
                      {method.co2Emissions === 0
                        ? "0 CO₂"
                        : `${method.co2Emissions}kg CO₂`}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Best Transport Recommendation */}
          <div className="bg-green-100 border border-green-200 rounded-lg p-3">
            <div className="flex items-center space-x-2 text-sm">
              <Leaf className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-800">
                Recommended: {transportLabels[bestTransport.type]}
                {bestTransport.duration && ` (${bestTransport.duration})`}
              </span>
            </div>
            <p className="text-xs text-green-700 mt-1">
              Lowest carbon footprint option
            </p>
          </div>

          {/* Action Button */}
          <Button
            onClick={handleGoHere}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 transition-all duration-200 active:scale-95"
            size="lg"
          >
            <MapPin className="w-5 h-5 mr-2" />
            Go Here (Low-Carbon)
          </Button>

          {/* Map Container */}
          {showMap && (
            <div className="mt-4 space-y-3">
              <div className="h-px bg-green-200"></div>
              <div className="space-y-2">
                <h5 className="font-medium text-green-900 text-sm">
                  Low-Carbon Route
                </h5>
                <div className="bg-white rounded-lg border border-green-200 overflow-hidden">
                  <iframe
                    id="mapFrame"
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    className="rounded-lg"
                    title={`Route to ${destinationName}`}
                  />
                </div>
                <p className="text-xs text-green-600 text-center">
                  Route optimized for public transport and walking
                </p>
              </div>
            </div>
          )}
        </CardContent>

        {/* Embedded Script for Google Maps Integration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.showLowCarbonRoute = function(destination) {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    const origin = position.coords.latitude + ',' + position.coords.longitude;
                    const mapURL = 'https://www.google.com/maps/embed/v1/directions?key=YOUR_GOOGLE_MAPS_API_KEY&origin=' + origin + '&destination=' + encodeURIComponent(destination) + '&mode=transit';
                    const mapFrame = document.getElementById("mapFrame");
                    if (mapFrame) {
                      mapFrame.src = mapURL;
                    }
                  },
                  () => alert("Unable to access your location.")
                );
              } else {
                alert("Geolocation not supported");
              }
            };
          `,
          }}
        />
      </Card>
    );
  },
);

DestinationCard.displayName = "DestinationCard";
