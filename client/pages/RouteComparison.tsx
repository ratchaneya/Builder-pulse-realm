import { useState } from "react";
import {
  ArrowLeft,
  RotateCcw,
  Zap,
  Leaf,
  MapPin,
  Navigation,
} from "lucide-react";
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

// Calculate carbon emissions based on distance and transport type
const calculateEmissions = (
  transportType: keyof typeof emissionFactors,
  distanceKm: number,
) => {
  return (emissionFactors[transportType] * distanceKm) / 1000; // Convert to kg
};

// Calculate percentage reduction compared to car
const calculateReduction = (transportEmission: number, carEmission: number) => {
  return Math.round(((carEmission - transportEmission) / carEmission) * 100);
};

const carEmission = calculateEmissions("car", distance);

const routeData = [
  {
    id: "a",
    type: "car" as const,
    transportName: "Private Car",
    destination: destination,
    duration: "25 min",
    co2Emission: calculateEmissions("car", distance),
    pmLevel: 45,
    distance: `${distance} km`,
    reductionPercent: 0,
    emissionFactor: emissionFactors.car,
  },
  {
    id: "b",
    type: "bus" as const,
    transportName: "Songthaew (Red Truck)",
    destination: destination,
    duration: "35 min",
    co2Emission: calculateEmissions("songthaew", distance),
    pmLevel: 42,
    distance: `${distance} km`,
    reductionPercent: calculateReduction(
      calculateEmissions("songthaew", distance),
      carEmission,
    ),
    emissionFactor: emissionFactors.songthaew,
  },
  {
    id: "c",
    type: "bike" as const,
    transportName: "Bicycle",
    destination: destination,
    duration: "55 min",
    co2Emission: calculateEmissions("bike", distance),
    pmLevel: 28,
    distance: `${distance} km`,
    reductionPercent: calculateReduction(
      calculateEmissions("bike", distance),
      carEmission,
    ),
    emissionFactor: emissionFactors.bike,
  },
  {
    id: "d",
    type: "walk" as const,
    transportName: "Walking",
    destination: destination,
    duration: "2h 30min",
    co2Emission: calculateEmissions("walk", distance),
    pmLevel: 25,
    distance: `${distance} km`,
    reductionPercent: calculateReduction(
      calculateEmissions("walk", distance),
      carEmission,
    ),
    emissionFactor: emissionFactors.walk,
  },
];

export default function RouteComparison() {
  const [selectedRoute, setSelectedRoute] = useState<string>("a");
  const [optimizationMode, setOptimizationMode] =
    useState<OptimizationMode>("fastest");
  const [startLocation, setStartLocation] = useState("Nimman Road, Chiang Mai");
  const [destination, setDestination] = useState("Doi Suthep National Park");
  const [distance, setDistance] = useState(12); // km

  // IPCC emission factors (g CO₂/km)
  const emissionFactors = {
    car: 180, // Private car
    songthaew: 60, // Shared transportation (red truck)
    bike: 0, // Bicycle
    walk: 0, // Walking
  };

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
        {/* Location Input Section */}
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="font-semibold text-card-foreground mb-3 flex items-center gap-2">
            <Navigation className="h-5 w-5 text-primary" />
            Trip Planning
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-card-foreground block mb-1">
                From
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={startLocation}
                  onChange={(e) => setStartLocation(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter starting location"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-card-foreground block mb-1">
                To
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter destination"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-card-foreground block mb-1">
                Distance
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Distance in km"
                  min="1"
                  max="100"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                  km
                </span>
              </div>
            </div>
          </div>
        </div>

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

        {/* Carbon Emissions Overview */}
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="font-semibold text-card-foreground mb-3 flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-600" />
            Carbon Emissions Comparison
          </h3>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-muted/30 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-green-600">
                {routeData.find((r) => r.co2Emission === 0)?.reductionPercent ||
                  100}
                %
              </div>
              <div className="text-xs text-muted-foreground">
                Max CO₂ reduction
              </div>
            </div>
            <div className="bg-muted/30 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-primary">
                {distance} km
              </div>
              <div className="text-xs text-muted-foreground">Trip distance</div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <strong>Emission factors (IPCC standards):</strong>
            <ul className="mt-1 space-y-1 text-xs">
              <li>• Private car: 180g CO₂/km</li>
              <li>• Songthaew: 60g CO₂/km</li>
              <li>• Bicycle & Walking: 0g CO₂/km</li>
            </ul>
          </div>
        </div>

        {/* Route Cards */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Transportation Options
          </h2>

          <div className="space-y-4">
            {routeData.map((route) => (
              <div
                key={route.id}
                className="bg-card rounded-xl border border-border p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "p-2 rounded-lg",
                        route.type === "car"
                          ? "bg-red-50 text-red-600"
                          : route.type === "bus"
                            ? "bg-blue-50 text-blue-600"
                            : route.type === "bike"
                              ? "bg-green-50 text-green-600"
                              : "bg-purple-50 text-purple-600",
                      )}
                    >
                      {route.type === "car"
                        ? "🚗"
                        : route.type === "bus"
                          ? "🚌"
                          : route.type === "bike"
                            ? "🚲"
                            : "🚶"}
                    </div>
                    <div>
                      <h3 className="font-semibold text-card-foreground">
                        {route.transportName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {route.distance} • {route.duration}
                      </p>
                    </div>
                  </div>

                  {route.reductionPercent > 0 && (
                    <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                      -{route.reductionPercent}% CO₂
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="text-center bg-muted/30 rounded-lg p-2">
                    <div className="text-lg font-bold text-card-foreground">
                      {route.co2Emission.toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">kg CO₂</div>
                  </div>
                  <div className="text-center bg-muted/30 rounded-lg p-2">
                    <div className="text-lg font-bold text-card-foreground">
                      {route.emissionFactor}
                    </div>
                    <div className="text-xs text-muted-foreground">g/km</div>
                  </div>
                  <div className="text-center bg-muted/30 rounded-lg p-2">
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
                    <div className="text-xs text-muted-foreground">PM2.5</div>
                  </div>
                </div>

                {route.reductionPercent > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                    <p className="text-sm text-green-800">
                      <strong>Environmental benefit:</strong> Save{" "}
                      {(carEmission - route.co2Emission).toFixed(2)}kg CO₂ vs
                      private car ({route.reductionPercent}% reduction)
                    </p>
                  </div>
                )}

                <Button
                  onClick={() => setSelectedRoute(route.id)}
                  variant={selectedRoute === route.id ? "default" : "outline"}
                  className="w-full"
                >
                  {selectedRoute === route.id
                    ? "Selected"
                    : `Choose ${route.transportName}`}
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Smart Recommendation */}
        <section className="bg-card rounded-xl p-4 border border-border">
          <h3 className="font-semibold text-card-foreground mb-3 flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Smart Recommendation
          </h3>

          {(() => {
            // Find best option: lowest CO₂ unless unreasonably slower (>2x time)
            const carTime = 25; // minutes
            const bikeTime = 55; // minutes
            const walkTime = 150; // minutes (2h 30min)

            const recommendations = routeData
              .map((route) => {
                const timeMinutes =
                  route.type === "car"
                    ? carTime
                    : route.type === "bus"
                      ? 35
                      : route.type === "bike"
                        ? bikeTime
                        : walkTime;
                const timeRatio = timeMinutes / carTime;

                return {
                  ...route,
                  timeMinutes,
                  timeRatio,
                  score:
                    route.co2Emission === 0
                      ? timeRatio <= 2
                        ? 100
                        : 70
                      : route.type === "bus"
                        ? 85
                        : 50,
                };
              })
              .sort((a, b) => b.score - a.score);

            const bestOption = recommendations[0];

            return (
              <div className="space-y-3">
                <div className="bg-primary/10 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">
                      {bestOption.type === "car"
                        ? "🚗"
                        : bestOption.type === "bus"
                          ? "🚌"
                          : bestOption.type === "bike"
                            ? "🚲"
                            : "🚶"}
                    </span>
                    <div>
                      <h4 className="font-semibold text-primary">
                        Recommended: {bestOption.transportName}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Best balance of emissions and travel time
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="font-bold text-green-600">
                        {bestOption.co2Emission.toFixed(2)}kg
                      </div>
                      <div className="text-xs text-muted-foreground">
                        CO₂ emission
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-blue-600">
                        {bestOption.duration}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Travel time
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-purple-600">
                        {bestOption.reductionPercent > 0
                          ? `-${bestOption.reductionPercent}%`
                          : "Baseline"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        vs car
                      </div>
                    </div>
                  </div>
                </div>

                {bestOption.reductionPercent > 0 && (
                  <div className="text-sm text-muted-foreground bg-muted/30 rounded-lg p-3">
                    <strong>Why this is recommended:</strong> This option
                    reduces CO₂ emissions by {bestOption.reductionPercent}%
                    while keeping travel time reasonable (only{" "}
                    {(bestOption.timeRatio * 100 - 100).toFixed(0)}% longer than
                    driving).
                  </div>
                )}

                <Button
                  className="w-full"
                  onClick={() => setSelectedRoute(bestOption.id)}
                >
                  Choose Recommended Option
                </Button>
              </div>
            );
          })()}
        </section>
      </main>
    </div>
  );
}
