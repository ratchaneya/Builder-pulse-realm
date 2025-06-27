import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { WarningBar } from "@/components/ui/warning-bar";
import { SuggestionCard } from "@/components/ui/suggestion-card";
import { Leaf, MapPin, RefreshCw, Route } from "lucide-react";

const suggestionData = [
  {
    locationName: "Doi Suthep National Park",
    distance: 12,
    co2Level: 0.8,
    travelMethod: "bike" as const,
    description:
      "Escape to fresh mountain air with stunning temple views and peaceful hiking trails with low carbon footprint.",
  },
  {
    locationName: "San Kamphaeng District",
    distance: 18,
    co2Level: 1.1,
    travelMethod: "bus" as const,
    description:
      "Explore traditional handicraft villages and hot springs with eco-friendly transport options.",
  },
  {
    locationName: "Mae Rim Valley",
    distance: 25,
    co2Level: 0.0,
    travelMethod: "bike" as const,
    description:
      "Discover organic farms, elephant sanctuaries, and riverside cafes with zero emissions cycling.",
  },
];

export default function Index() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  const handleGoHere = (locationName: string) => {
    console.log(`Navigating to ${locationName}`);
    navigate("/routes");
  };

  const handleLowCarbonRoute = (locationName: string) => {
    console.log(`Finding low-carbon route to ${locationName}`);
    navigate("/routes");
  };

  const handleMoreQuietSpots = () => {
    console.log("Finding more quiet spots");
    // In a real app, this would show additional destinations
  };

  const handleCompareRoutes = () => {
    navigate("/routes");
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4 shadow-sm">
        <div className="container max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <Leaf className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-semibold text-foreground">EcoTravel</h1>
                <p className="text-xs text-muted-foreground">
                  Sustainable Tourism
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Warning Section */}
        <WarningBar
          co2Level={2.8}
          trafficDelay="+45 min"
          timeToOvercrowd="90 minutes"
        />

        {/* Suggestions Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              Alternative Destinations
            </h2>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Discover cleaner, less crowded spots with better air quality and
            peaceful environments.
          </p>

          <div className="space-y-4">
            {suggestionData.map((suggestion, index) => (
              <SuggestionCard
                key={index}
                {...suggestion}
                onGoHere={() => handleGoHere(suggestion.locationName)}
                onLowCarbonRoute={() =>
                  handleLowCarbonRoute(suggestion.locationName)
                }
              />
            ))}
          </div>
        </section>

        {/* Action Buttons */}
        <section className="space-y-3 pt-4">
          <Button
            onClick={() => navigate("/route-planning")}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Route className="h-4 w-4 mr-2" />
            Smart Route Planner
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleCompareRoutes}
              variant="outline"
              className="border-primary text-primary hover:bg-primary/5"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Compare Routes
            </Button>

            <Button
              onClick={() => navigate("/green-miles")}
              variant="outline"
              className="border-primary text-primary hover:bg-primary/5"
            >
              <Leaf className="h-4 w-4 mr-2" />
              Green Miles
            </Button>
          </div>

          <Button
            onClick={handleMoreQuietSpots}
            variant="outline"
            className="w-full border-2 border-dashed border-muted-foreground/30 hover:border-primary hover:bg-primary/5"
          >
            <MapPin className="h-4 w-4 mr-2" />
            More quiet spots
          </Button>
        </section>

        {/* Footer Info */}
        <footer className="pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Data updated 5 minutes ago • Air quality from PCD Thailand
          </p>
        </footer>
      </main>
    </div>
  );
}
