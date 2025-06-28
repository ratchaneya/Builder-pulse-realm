import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { WarningBar } from "@/components/ui/warning-bar";
import { SuggestionCard } from "@/components/ui/suggestion-card";
import { QRScanner } from "@/components/ui/qr-scanner";
import { GPSNavigation } from "@/components/ui/gps-navigation";
import { Leaf, MapPin, RefreshCw, Route, Camera } from "lucide-react";

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
  const [showQRScanner, setShowQRScanner] = useState(false);
  const navigate = useNavigate();

  const handleGoHere = (locationName: string) => {
    console.log(`Navigating to ${locationName}`);
    // Simulate arrival at destination and trigger AR experience
    const locationMap: Record<string, string> = {
      "Doi Suthep National Park": "doi_suthep",
      "San Kamphaeng District": "san_kamphaeng",
      "Mae Rim Valley": "mae_rim",
    };

    const locationId = locationMap[locationName] || "doi_suthep";
    navigate(`/ar-experience?location=${locationId}`);
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

  const handleQRScanSuccess = async (qrCode: string) => {
    setShowQRScanner(false);

    try {
      // Verify QR code with backend
      const response = await fetch("/api/ar/verify-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrCode }),
      });

      const result = await response.json();

      if (result.valid && result.location) {
        navigate(`/ar-experience?location=${result.location.id}`);
      } else {
        alert("Invalid QR code. Please scan a valid destination QR code.");
      }
    } catch (error) {
      console.error("Error verifying QR code:", error);
      alert("Error verifying QR code. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50 relative">
      {/* Background Images */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop&crop=center"
          alt="Chiang Mai landscape"
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/90 via-emerald-50/95 to-blue-50/90"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 text-white shadow-lg">
        <div className="container max-w-md mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                <Leaf className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  EcoTravel Chiang Mai
                </h1>
                <p className="text-sm text-green-100">
                  Sustainable Tourism • Local Experiences
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 text-white hover:bg-white/20"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container max-w-md mx-auto px-4 py-6 space-y-6">
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

        {/* GPS Navigation to Rural Destinations */}
        <section>
          <GPSNavigation />
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

          <Button
            onClick={() => navigate("/local-explorer")}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Local Explorer
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => setShowQRScanner(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Camera className="h-4 w-4 mr-2" />
              AR Experience
            </Button>

            <Button
              onClick={() => navigate("/check-in")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              📍 Check-in
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Button
              onClick={() => navigate("/redemption")}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              🎁 Rewards
            </Button>
            <Button
              onClick={handleCompareRoutes}
              variant="outline"
              className="border-primary text-primary hover:bg-primary/5"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Routes
            </Button>

            <Button
              onClick={() => navigate("/green-miles")}
              variant="outline"
              className="border-primary text-primary hover:bg-primary/5"
            >
              <Leaf className="h-4 w-4 mr-2" />
              Miles
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

        {/* QR Scanner */}
        <QRScanner
          isOpen={showQRScanner}
          onScanSuccess={handleQRScanSuccess}
          onClose={() => setShowQRScanner(false)}
        />

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
