import { useState } from "react";
import { ArrowLeft, RotateCcw, Zap, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MapView } from "@/components/ui/map-view";
import { RouteCard } from "@/components/ui/route-card";
import { cn } from "@/lib/utils";

type OptimizationMode = "fastest" | "greenest";

const mapPins = [
  {
    id: "start",
    name: "Your Location",
    x: 15,
    y: 25,
    type: "start" as const,
    pmLevel: 78,
  },
  {
    id: "dest1",
    name: "Doi Suthep",
    x: 85,
    y: 20,
    type: "destination" as const,
    pmLevel: 35,
  },
  {
    id: "dest2",
    name: "San Kamphaeng",
    x: 85,
    y: 35,
    type: "destination" as const,
    pmLevel: 42,
  },
  {
    id: "dest3",
    name: "Mae Rim",
    x: 85,
    y: 50,
    type: "destination" as const,
    pmLevel: 28,
  },
];

const routeData = [
  {
    id: "a",
    type: "car" as const,
    destination: "Doi Suthep National Park",
    duration: "25 min",
    co2Emission: 2.1,
    pmLevel: 45,
    distance: "12 km",
  },
  {
    id: "b",
    type: "bus" as const,
    destination: "San Kamphaeng District",
    duration: "35 min",
    co2Emission: 0.6,
    pmLevel: 42,
    distance: "18 km",
  },
  {
    id: "c",
    type: "bike" as const,
    destination: "Mae Rim Valley",
    duration: "55 min",
    co2Emission: 0,
    pmLevel: 28,
    distance: "25 km",
  },
];

export default function RouteComparison() {
  const [selectedRoute, setSelectedRoute] = useState<string>("a");
  const [optimizationMode, setOptimizationMode] =
    useState<OptimizationMode>("fastest");

  const handleBack = () => {
    window.history.back();
  };

  const getFastestRoute = () => {
    return routeData.reduce((fastest, current) => {
      const fastestTime = parseInt(fastest.duration);
      const currentTime = parseInt(current.duration);
      return currentTime < fastestTime ? current : fastest;
    });
  };

  const getGreenestRoute = () => {
    return routeData.reduce((greenest, current) => {
      return current.co2Emission < greenest.co2Emission ? current : greenest;
    });
  };

  const fastestRoute = getFastestRoute();
  const greenestRoute = getGreenestRoute();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4 shadow-sm">
        <div className="container max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="font-semibold text-foreground">
                  Route Comparison
                </h1>
                <p className="text-xs text-muted-foreground">
                  Choose your travel method
                </p>
              </div>
            </div>

            <Button variant="ghost" size="sm" className="p-2">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Map View */}
        <MapView pins={mapPins} selectedRoute={selectedRoute} />

        {/* Optimization Toggle */}
        <div className="bg-card rounded-xl p-4 border border-border">
          <h3 className="font-semibold text-card-foreground mb-3">
            Optimize Route For
          </h3>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={optimizationMode === "fastest" ? "default" : "outline"}
              onClick={() => setOptimizationMode("fastest")}
              className="flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              Fastest
            </Button>
            <Button
              variant={optimizationMode === "greenest" ? "default" : "outline"}
              onClick={() => setOptimizationMode("greenest")}
              className="flex items-center gap-2"
            >
              <Leaf className="h-4 w-4" />
              Greenest
            </Button>
          </div>

          <div className="mt-3 p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              {optimizationMode === "fastest"
                ? "Showing routes optimized for shortest travel time"
                : "Showing routes with lowest carbon footprint"}
            </p>
          </div>
        </div>

        {/* Route Cards */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Available Routes
          </h2>

          <div className="space-y-4">
            {routeData.map((route) => (
              <RouteCard
                key={route.id}
                {...route}
                isSelected={selectedRoute === route.id}
                isFastest={
                  optimizationMode === "fastest" && route.id === fastestRoute.id
                }
                isGreenest={
                  optimizationMode === "greenest" &&
                  route.id === greenestRoute.id
                }
                onSelect={() => setSelectedRoute(route.id)}
              />
            ))}
          </div>
        </section>

        {/* Summary */}
        <section className="bg-card rounded-xl p-4 border border-border">
          <h3 className="font-semibold text-card-foreground mb-3">
            Route Summary
          </h3>

          {selectedRoute && (
            <div className="space-y-3">
              {(() => {
                const route = routeData.find((r) => r.id === selectedRoute);
                if (!route) return null;

                return (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Selected Route
                      </span>
                      <span className="font-medium text-card-foreground">
                        Route {route.id.toUpperCase()} - {route.destination}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-2">
                      <div className="text-center">
                        <div className="text-lg font-bold text-card-foreground">
                          {route.duration}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Duration
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-card-foreground">
                          {route.co2Emission}kg
                        </div>
                        <div className="text-xs text-muted-foreground">CO₂</div>
                      </div>
                      <div className="text-center">
                        <div
                          className={cn(
                            "text-lg font-bold",
                            route.pmLevel <= 50
                              ? "text-green-600"
                              : route.pmLevel <= 100
                                ? "text-yellow-600"
                                : "text-red-600",
                          )}
                        >
                          {route.pmLevel}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          PM2.5
                        </div>
                      </div>
                    </div>

                    <Button className="w-full mt-4">Start Navigation</Button>
                  </>
                );
              })()}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
