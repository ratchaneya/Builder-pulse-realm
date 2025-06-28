import * as React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LocationCheckIn } from "@/components/ui/location-check-in";
import {
  geolocationService,
  ecoCheckInDestinations,
  type EcoDestination,
} from "@/services/geolocation";
import { cn } from "@/lib/utils";
import {
  MapPin,
  Loader2,
  AlertTriangle,
  Target,
  Trophy,
  Navigation,
  RefreshCw,
} from "lucide-react";

interface CheckInState {
  userLocation: GeolocationPosition | null;
  nearbyDestinations: (EcoDestination & { distance: number })[];
  selectedDestination: (EcoDestination & { distance: number }) | null;
  isLoading: boolean;
  error: string | null;
  visitedLocations: string[];
  gpsCheckResult: {
    success: boolean;
    distance: number;
    accuracy: number;
    message: string;
  } | null;
  isCheckingGPS: boolean;
}

export default function CheckIn() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetLocationId = searchParams.get("location");

  const [state, setState] = React.useState<CheckInState>({
    userLocation: null,
    nearbyDestinations: [],
    selectedDestination: null,
    isLoading: true,
    error: null,
    visitedLocations: [],
    gpsCheckResult: null,
    isCheckingGPS: false,
  });

  // Load visited locations from localStorage
  React.useEffect(() => {
    const visited = JSON.parse(
      localStorage.getItem("visitedEcoLocations") || "[]",
    );
    setState((prev) => ({ ...prev, visitedLocations: visited }));
  }, []);

  // Get user location and calculate distances to all destinations
  const updateLocation = React.useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const position = await geolocationService.getCurrentPosition();
      const userCoords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      // Calculate distances to all destinations (show all, not just nearby)
      const destinationsWithDistance = ecoCheckInDestinations.map((dest) => ({
        ...dest,
        distance: geolocationService.calculateDistance(
          userCoords,
          dest.coordinates,
        ),
        isVisited: state.visitedLocations.includes(dest.id),
      }));

      // Sort by distance (closest first)
      destinationsWithDistance.sort((a, b) => a.distance - b.distance);

      setState((prev) => ({
        ...prev,
        userLocation: position,
        nearbyDestinations: destinationsWithDistance, // Show all destinations
        isLoading: false,
      }));

      // Auto-select target location if specified and user is at the location
      if (targetLocationId) {
        const targetDestination = destinationsWithDistance.find(
          (dest) => dest.id === targetLocationId,
        );
        if (
          targetDestination &&
          targetDestination.distance <= targetDestination.radius
        ) {
          setState((prev) => ({
            ...prev,
            selectedDestination: targetDestination,
          }));
        }
      }
    } catch (error) {
      console.error("Location error:", error);
      setState((prev) => ({
        ...prev,
        error:
          "ไม่สามารถเข้าถึงตำแหน่งของคุณได้ กรุณาเปิด GPS และอนุญาตการใช้ตำแหน่ง",
        isLoading: false,
      }));
    }
  }, [targetLocationId, state.visitedLocations]);

  // Initialize location tracking
  React.useEffect(() => {
    updateLocation();

    // Set up location watching for real-time updates
    const unsubscribe = geolocationService.onLocationUpdate(() => {
      updateLocation();
    });

    return unsubscribe;
  }, [updateLocation]);

  // Handle check-in completion
  const handleCheckInComplete = async (
    locationId: string,
    photoDataUrl: string,
    greenMiles: number,
  ) => {
    try {
      // Save to visited locations
      const updatedVisited = [...state.visitedLocations, locationId];
      localStorage.setItem(
        "visitedEcoLocations",
        JSON.stringify(updatedVisited),
      );

      // Save check-in data
      const checkInData = {
        locationId,
        timestamp: Date.now(),
        photoDataUrl,
        greenMiles,
        coordinates: state.selectedDestination?.coordinates,
      };

      const existingCheckIns = JSON.parse(
        localStorage.getItem("ecoCheckIns") || "[]",
      );
      existingCheckIns.push(checkInData);
      localStorage.setItem("ecoCheckIns", JSON.stringify(existingCheckIns));

      setState((prev) => ({
        ...prev,
        selectedDestination: null,
        visitedLocations: updatedVisited,
      }));

      // Navigate back to main page
      navigate("/");
    } catch (error) {
      console.error("Error saving check-in:", error);
    }
  };

  // Handle destination selection with GPS verification
  const handleDestinationSelect = async (
    destination: EcoDestination & { distance: number },
  ) => {
    setState((prev) => ({
      ...prev,
      isCheckingGPS: true,
      gpsCheckResult: null,
    }));

    // Perform precise GPS check
    const gpsResult = await geolocationService.checkPreciseLocation(
      destination.coordinates.lat,
      destination.coordinates.lng,
      destination.radius,
    );

    setState((prev) => ({
      ...prev,
      isCheckingGPS: false,
      gpsCheckResult: gpsResult,
      selectedDestination: gpsResult.success ? destination : null,
    }));

    // Show result message
    if (gpsResult.success) {
      // Auto-proceed to check-in if GPS verification passed
      console.log("GPS verification passed, proceeding to check-in");
    } else {
      // Show error message
      alert(gpsResult.message);
    }
  };

  // Handle check-in cancellation
  const handleCheckInCancel = () => {
    setState((prev) => ({ ...prev, selectedDestination: null }));
  };

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              กำลังค้นหาตำแหน่ง...
            </h2>
            <p className="text-gray-600">
              กรุณารอสักครู่ เราจะหาสถานที่เช็คอินใกล้คุณ
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              ไม่สามารถเข้าถึงตำแหน่งได้
            </h2>
            <p className="text-gray-600 mb-6">{state.error}</p>
            <div className="space-y-3">
              <Button
                onClick={updateLocation}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                ลองใหม่
              </Button>
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="w-full"
              >
                กลับหน้าหลัก
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Show check-in dialog if destination selected */}
      {state.selectedDestination && (
        <LocationCheckIn
          location={state.selectedDestination}
          onCheckInComplete={handleCheckInComplete}
          onCancel={handleCheckInCancel}
        />
      )}

      {/* Header */}
      <header className="bg-white border-b border-green-200 shadow-sm">
        <div className="container max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate("/")}
              variant="ghost"
              size="sm"
              className="text-green-700"
            >
              ← กลับ
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-green-900">
                เช็คอินสถานที่ท่องเที่ยว
              </h1>
              <p className="text-sm text-green-600">
                ค้นหาและเช็คอินที่สถานที่ใกล้คุณ
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-md mx-auto px-4 py-6 space-y-6">
        {/* User Location Status */}
        {state.userLocation && (
          <Card className="bg-white border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Navigation className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-green-900">
                    ตำแหน่งปัจจุบัน
                  </h3>
                  <p className="text-sm text-green-600">
                    ละติจูด: {state.userLocation.coords.latitude.toFixed(6)}
                    <br />
                    ลองจิจูด: {state.userLocation.coords.longitude.toFixed(6)}
                  </p>
                </div>
                <Button
                  onClick={updateLocation}
                  variant="outline"
                  size="sm"
                  className="border-green-300"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Photo Drop Destinations */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-semibold text-green-900">จุดดรอปรูป</h2>
          </div>

          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 mb-4">
            <CardContent className="p-4">
              <p className="text-sm text-blue-700">
                📍 <strong>วิธีใช้:</strong>{" "}
                เดินทางไปยังจุดหมายแล้วดรอปรูปเพื่อรับ Green Miles
                <br />
                🚫 ต้องอยู่ในระยะที่กำหนดถึงจะดรอปรูปได้
              </p>
            </CardContent>
          </Card>

          {state.nearbyDestinations.length === 0 ? (
            <Card className="bg-white border-gray-200">
              <CardContent className="p-6 text-center">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  กำลังโหลดจุดดรอปรูป...
                </h3>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {state.nearbyDestinations.map((destination) => (
                <Card
                  key={destination.id}
                  className={cn(
                    "bg-white border-green-200 transition-all duration-200",
                    destination.distance <= destination.radius
                      ? "ring-2 ring-green-300 bg-green-50 cursor-pointer hover:shadow-md hover:scale-[1.02]"
                      : "cursor-not-allowed opacity-75",
                  )}
                  onClick={() =>
                    destination.distance <= destination.radius &&
                    handleDestinationSelect(destination)
                  }
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center",
                          destination.distance <= destination.radius
                            ? "bg-green-100"
                            : "bg-gray-100",
                        )}
                      >
                        <MapPin
                          className={cn(
                            "w-6 h-6",
                            destination.distance <= destination.radius
                              ? "text-green-600"
                              : "text-gray-500",
                          )}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-medium text-gray-900">
                            {destination.nameEn}
                          </h3>
                          {destination.isVisited && (
                            <Badge className="bg-orange-100 text-orange-800 text-xs">
                              เคยมาแล้ว
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {destination.name}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-sm">
                            <span
                              className={cn(
                                "font-medium",
                                destination.distance <= destination.radius
                                  ? "text-green-600"
                                  : "text-gray-500",
                              )}
                            >
                              {Math.round(destination.distance)}m
                            </span>
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                              <Trophy className="w-3 h-3 mr-1" />+
                              {destination.greenMilesReward}
                            </Badge>
                          </div>

                          {destination.distance <= destination.radius ? (
                            <Badge className="bg-green-100 text-green-800 border-green-300">
                              📸 ดรอปรูปได้
                            </Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-600 border-gray-300">
                              ไกลเกินไป ({destination.radius}m)
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Instructions */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="font-medium text-blue-900 mb-2">วิธีดรอปรูป</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• เดินทางไปยังจุดหมายที่ต้องการ</li>
              <li>• เมื่อถึงแล้ว จะขึ้น "📸 ดรอปรูปได้"</li>
              <li>• กดที่การ์ดเพื่อเริ่มดรอปรูป</li>
              <li>• ถ่ายรูปยืนยันการมาเยือน</li>
              <li>• รับ Green Miles และฟังเรื่องเล่าจากฮีโร่ท้องถิ่น</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
