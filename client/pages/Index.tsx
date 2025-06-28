import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { WarningBar } from "@/components/ui/warning-bar";
import { SuggestionCard } from "@/components/ui/suggestion-card";
import { QRScanner } from "@/components/ui/qr-scanner";
import { GPSNavigation } from "@/components/ui/gps-navigation";
import RoutePlanning from "./RoutePlanning";
import Redemption from "./Redemption";
import RouteComparison from "./RouteComparison";
import GreenMilesDashboard from "./GreenMilesDashboard";
import {
  Leaf,
  MapPin,
  RefreshCw,
  Route,
  Camera,
  Gift,
  Navigation,
  Sparkles,
} from "lucide-react";

type TabType = "route-planner" | "check-in" | "rewards" | "routes" | "miles";

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
  const [activeTab, setActiveTab] = useState<TabType>("route-planner");
  const navigate = useNavigate();

  const tabs = [
    {
      id: "route-planner" as TabType,
      label: "Smart Route Planner",
      icon: Route,
      emoji: "🚀",
      color: "from-blue-500 to-indigo-600",
    },
    {
      id: "check-in" as TabType,
      label: "Check-in",
      icon: MapPin,
      emoji: "📍",
      color: "from-emerald-500 to-green-600",
    },
    {
      id: "rewards" as TabType,
      label: "Rewards",
      icon: Gift,
      emoji: "🎁",
      color: "from-purple-500 to-pink-600",
    },
    {
      id: "routes" as TabType,
      label: "Routes",
      icon: Navigation,
      emoji: "🧭",
      color: "from-orange-500 to-red-600",
    },
    {
      id: "miles" as TabType,
      label: "Miles",
      icon: Sparkles,
      emoji: "🌿",
      color: "from-green-500 to-teal-600",
    },
  ];

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

  const renderContent = () => {
    switch (activeTab) {
      case "route-planner":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                🚀 Smart Route Planner
              </h2>
              <p className="text-gray-600">
                Plan eco-friendly routes to explore Chiang Mai sustainably
              </p>
            </div>

            {/* Warning Section */}
            <WarningBar
              co2Level={2.8}
              trafficDelay="+45 min"
              timeToOvercrowd="90 minutes"
            />

            {/* Suggestions Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">
                  Alternative Destinations
                </h3>
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
            </div>

            {/* GPS Navigation */}
            <GPSNavigation />
          </div>
        );

      case "check-in":
        return (
          <div className="h-full -m-6">
            <CheckIn />
          </div>
        );

      case "rewards":
        return (
          <div className="h-full -m-6">
            <Redemption />
          </div>
        );

      case "routes":
        return (
          <div className="h-full -m-6">
            <RouteComparison />
          </div>
        );

      case "miles":
        return (
          <div className="h-full -m-6">
            <GreenMilesDashboard />
          </div>
        );

      default:
        return null;
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
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">
                  EcoTravel Chiang Mai
                </h1>
                <p className="text-xs text-green-100">
                  Sustainable Tourism • Local Experiences
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowQRScanner(true)}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <Camera className="h-4 w-4 mr-1" />
                AR
              </Button>
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
        </div>
      </header>

      {/* Desktop Layout - Side Tabs */}
      <div className="relative z-10 container mx-auto h-[calc(100vh-80px)] hidden lg:flex">
        {/* Left Sidebar - Tabs */}
        <div className="w-64 bg-white/90 backdrop-blur-sm border-r border-green-200 shadow-lg">
          <div className="p-4 border-b border-green-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              Smart Tourism
            </h2>
            <p className="text-xs text-gray-600">
              Explore Chiang Mai sustainably
            </p>
          </div>

          <nav className="p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left p-3 rounded-lg mb-2 transition-all duration-200 group ${
                    isActive
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg transform scale-105`
                      : "hover:bg-gray-100 text-gray-700 hover:scale-102"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isActive
                          ? "bg-white/20"
                          : "bg-gray-100 group-hover:bg-gray-200"
                      }`}
                    >
                      <span className="text-lg">{tab.emoji}</span>
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`font-medium text-sm ${
                          isActive ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {tab.label}
                      </h3>
                    </div>
                    {isActive && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Bottom Action */}
          <div className="absolute bottom-4 left-4 right-4">
            <Button
              onClick={handleMoreQuietSpots}
              variant="outline"
              className="w-full border-green-300 text-green-700 hover:bg-green-50"
              size="sm"
            >
              More Quiet Spots
            </Button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 bg-white/80 backdrop-blur-sm overflow-auto">
          <div className="p-6 h-full">{renderContent()}</div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="relative z-10 lg:hidden">
        <div className="pb-20">
          <div className="p-4">{renderContent()}</div>
        </div>

        {/* Mobile Tab Bar at Bottom */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-20">
          <div className="flex">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 p-3 text-center transition-colors ${
                    isActive
                      ? "text-green-600 bg-green-50"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <div className="text-lg mb-1">{tab.emoji}</div>
                  <div
                    className={`text-xs font-medium ${
                      isActive ? "text-green-700" : "text-gray-500"
                    }`}
                  >
                    {tab.label.split(" ")[0]}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <QRScanner
              onScanSuccess={handleQRScanSuccess}
              onClose={() => setShowQRScanner(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
