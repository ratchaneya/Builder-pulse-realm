import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Navigation,
  Zap,
  Leaf,
  Star,
  Trophy,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  TravelDataResponse,
  Location,
  RouteData,
  UserProfile,
} from "@shared/tourism";

interface RoutePlanningState {
  origin: string;
  selectedDestination: string;
  travelData: TravelDataResponse | null;
  userProfile: UserProfile | null;
  loading: boolean;
  selectedMode: string;
}

const SAMPLE_LOCATIONS: Location[] = [
  { name: "Nimman Road", lat: 18.7984, lng: 98.9681 },
  { name: "Chiang Mai Old City", lat: 18.7877, lng: 98.9931 },
  { name: "Night Bazaar", lat: 18.7884, lng: 98.9917 },
];

const DESTINATION_OPTIONS = [
  "Doi Suthep National Park",
  "San Kamphaeng Hot Springs",
  "Mae Rim Elephant Sanctuary",
];

export default function RoutePlanning() {
  const navigate = useNavigate();
  const [state, setState] = useState<RoutePlanningState>({
    origin: "Nimman Road",
    selectedDestination: "",
    travelData: null,
    userProfile: null,
    loading: false,
    selectedMode: "fastest",
  });

  const userId = "demo_user_001"; // In real app, get from auth

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await fetch(`/api/user/${userId}`);
      const profile = await response.json();
      setState((prev) => ({ ...prev, userProfile: profile }));
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  };

  const handlePlanRoute = async () => {
    if (!state.selectedDestination) return;

    setState((prev) => ({ ...prev, loading: true }));

    try {
      const originLocation =
        SAMPLE_LOCATIONS.find((loc) => loc.name.includes(state.origin)) ||
        SAMPLE_LOCATIONS[0];

      const destinationLocation: Location = {
        name: state.selectedDestination,
        lat: 18.8 + Math.random() * 0.2,
        lng: 98.9 + Math.random() * 0.2,
      };

      const requestData = {
        origin: originLocation,
        destinations: [destinationLocation],
        modes: ["car", "songthaew", "bike", "walk"],
      };

      const response = await fetch("/api/travel-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const travelData: TravelDataResponse = await response.json();
      setState((prev) => ({ ...prev, travelData, loading: false }));
    } catch (error) {
      console.error("Error planning route:", error);
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleSelectRoute = async (route: RouteData) => {
    try {
      const awardData = {
        userId,
        route,
        isOutsideCity: true,
        isRecommendedZone: true,
      };

      const response = await fetch("/api/green-miles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(awardData),
      });

      const result = await response.json();

      // Update user profile
      await loadUserProfile();

      // Show success message (in real app, use toast)
      alert(
        `Route selected! You earned ${result.reward.points} Green Miles 🌿`,
      );
    } catch (error) {
      console.error("Error awarding green miles:", error);
    }
  };

  const getRoutesByMode = () => {
    if (!state.travelData?.comparisons[0]) return [];

    const routes = state.travelData.comparisons[0].routes;
    const fastest = routes.reduce((prev, current) =>
      current.duration < prev.duration ? current : prev,
    );
    const greenest = routes.reduce((prev, current) =>
      current.co2Emissions < prev.co2Emissions ? current : prev,
    );

    return state.selectedMode === "fastest"
      ? [fastest, ...routes.filter((r) => r !== fastest)]
      : [greenest, ...routes.filter((r) => r !== greenest)];
  };

  const formatCO2 = (grams: number) => {
    if (grams === 0) return "0g";
    if (grams < 1000) return `${grams}g`;
    return `${(grams / 1000).toFixed(1)}kg`;
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "car":
        return "🚗";
      case "songthaew":
        return "🚌";
      case "bus":
        return "🚌";
      case "bike":
        return "🚴";
      case "walk":
        return "🚶";
      default:
        return "🚌";
    }
  };

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
                onClick={() => navigate(-1)}
                className="p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="font-semibold text-foreground">Smart Planner</h1>
                <p className="text-xs text-muted-foreground">
                  AI-powered sustainable routes
                </p>
              </div>
            </div>

            {state.userProfile && (
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-semibold">
                    {state.userProfile.totalGreenMiles}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Green Miles</p>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-md mx-auto px-4 py-6 space-y-6">
        {/* User Input Section */}
        <Card className="p-4">
          <h2 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Plan Your Journey
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                From
              </label>
              <select
                value={state.origin}
                onChange={(e) =>
                  setState((prev) => ({ ...prev, origin: e.target.value }))
                }
                className="w-full p-3 border border-border rounded-lg bg-card"
              >
                {SAMPLE_LOCATIONS.map((loc) => (
                  <option key={loc.name} value={loc.name}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                To
              </label>
              <select
                value={state.selectedDestination}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    selectedDestination: e.target.value,
                  }))
                }
                className="w-full p-3 border border-border rounded-lg bg-card"
              >
                <option value="">Select destination...</option>
                {DESTINATION_OPTIONS.map((dest) => (
                  <option key={dest} value={dest}>
                    {dest}
                  </option>
                ))}
              </select>
            </div>

            <Button
              onClick={handlePlanRoute}
              disabled={!state.selectedDestination || state.loading}
              className="w-full"
            >
              {state.loading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Planning Routes...
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4 mr-2" />
                  Find Best Routes
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Optimization Toggle */}
        {state.travelData && (
          <Card className="p-4">
            <h3 className="font-semibold text-card-foreground mb-3">
              Route Optimization
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={
                  state.selectedMode === "fastest" ? "default" : "outline"
                }
                onClick={() =>
                  setState((prev) => ({ ...prev, selectedMode: "fastest" }))
                }
                className="flex items-center gap-2"
              >
                <Zap className="h-4 w-4" />
                Fastest
              </Button>
              <Button
                variant={
                  state.selectedMode === "greenest" ? "default" : "outline"
                }
                onClick={() =>
                  setState((prev) => ({ ...prev, selectedMode: "greenest" }))
                }
                className="flex items-center gap-2"
              >
                <Leaf className="h-4 w-4" />
                Greenest
              </Button>
            </div>
          </Card>
        )}

        {/* Route Results */}
        {state.travelData && (
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Recommended Routes
            </h3>

            {getRoutesByMode().map((route, index) => (
              <Card
                key={`${route.mode.mode}-${index}`}
                className={cn(
                  "p-4 transition-all duration-200",
                  index === 0 ? "ring-2 ring-primary shadow-md" : "",
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {getModeIcon(route.mode.mode)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-card-foreground">
                        {route.mode.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {route.distance} km • {route.duration} min
                      </p>
                    </div>
                  </div>

                  {index === 0 && (
                    <Badge className="bg-primary/20 text-primary">
                      {state.selectedMode === "fastest"
                        ? "Fastest"
                        : "Greenest"}
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-lg font-bold text-card-foreground">
                      {formatCO2(route.co2Emissions)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      CO₂ emissions
                    </div>
                  </div>

                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-lg font-bold text-primary">
                      +{Math.floor((route.distance * 18) / 10)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Green Miles
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => handleSelectRoute(route)}
                  className="w-full"
                  variant={index === 0 ? "default" : "outline"}
                >
                  {index === 0 ? "Select Recommended" : "Choose This Route"}
                </Button>
              </Card>
            ))}
          </div>
        )}

        {/* Congestion Alert */}
        {state.travelData?.forecast.shouldRedirect && (
          <Card className="p-4 bg-destructive/10 border-destructive/20">
            <h3 className="font-semibold text-destructive mb-2">
              ⚠️ Congestion Alert
            </h3>
            <p className="text-sm text-destructive/80 mb-3">
              {state.travelData.forecast.location} will be overcrowded in{" "}
              {state.travelData.forecast.timeToOvercrowd} minutes. Consider
              alternative destinations!
            </p>
            <Button
              variant="outline"
              size="sm"
              className="border-destructive text-destructive hover:bg-destructive/5"
            >
              View Alternatives
            </Button>
          </Card>
        )}
      </main>
    </div>
  );
}
