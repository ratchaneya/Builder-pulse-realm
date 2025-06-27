import { Location, TravelMode, RouteData } from "@shared/tourism";

// Mock travel modes with emission factors
export const TRAVEL_MODES: Record<string, TravelMode> = {
  car: {
    mode: "car",
    name: "Private Car",
    icon: "car",
    emissionFactor: 180, // g CO2/km
  },
  songthaew: {
    mode: "songthaew",
    name: "Songthaew (Shared)",
    icon: "bus",
    emissionFactor: 60, // g CO2/km
  },
  bus: {
    mode: "bus",
    name: "Public Bus",
    icon: "bus",
    emissionFactor: 60, // g CO2/km
  },
  bike: {
    mode: "bike",
    name: "Bicycle",
    icon: "bike",
    emissionFactor: 0, // g CO2/km
  },
  walk: {
    mode: "walk",
    name: "Walking",
    icon: "walk",
    emissionFactor: 0, // g CO2/km
  },
};

// Mock distance/duration data for Chiang Mai routes
const MOCK_ROUTE_DATA: Record<
  string,
  Record<string, { distance: number; baseDuration: number }>
> = {
  nimman: {
    doi_suthep: { distance: 12, baseDuration: 25 },
    san_kamphaeng: { distance: 18, baseDuration: 30 },
    mae_rim: { distance: 25, baseDuration: 40 },
    old_city: { distance: 3, baseDuration: 8 },
    night_bazaar: { distance: 4, baseDuration: 12 },
  },
  old_city: {
    doi_suthep: { distance: 15, baseDuration: 30 },
    san_kamphaeng: { distance: 20, baseDuration: 35 },
    mae_rim: { distance: 28, baseDuration: 45 },
    nimman: { distance: 3, baseDuration: 8 },
  },
};

// Duration multipliers by transport mode
const DURATION_MULTIPLIERS: Record<string, number> = {
  car: 1,
  songthaew: 1.3,
  bus: 1.5,
  bike: 2.5,
  walk: 8,
};

function getLocationKey(location: Location): string {
  const name = location.name.toLowerCase();
  if (name.includes("nimman")) return "nimman";
  if (name.includes("doi suthep")) return "doi_suthep";
  if (name.includes("san kamphaeng")) return "san_kamphaeng";
  if (name.includes("mae rim")) return "mae_rim";
  if (name.includes("old city") || name.includes("old town")) return "old_city";
  if (name.includes("night bazaar")) return "night_bazaar";
  return "unknown";
}

function calculateDistance(origin: Location, destination: Location): number {
  // Simple haversine formula for demo (in real app, use Google Maps)
  const R = 6371; // Earth's radius in km
  const dLat = ((destination.lat - origin.lat) * Math.PI) / 180;
  const dLon = ((destination.lng - origin.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((origin.lat * Math.PI) / 180) *
      Math.cos((destination.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function getTravelData(
  origin: Location,
  destination: Location,
  modes: TravelMode["mode"][] = ["car", "songthaew", "bike"],
): RouteData[] {
  const originKey = getLocationKey(origin);
  const destKey = getLocationKey(destination);

  // Get mock data or calculate distance
  let distance: number;
  let baseDuration: number;

  if (MOCK_ROUTE_DATA[originKey]?.[destKey]) {
    const mockData = MOCK_ROUTE_DATA[originKey][destKey];
    distance = mockData.distance;
    baseDuration = mockData.baseDuration;
  } else {
    // Fallback to calculated distance
    distance = calculateDistance(origin, destination);
    baseDuration = distance * 2; // Rough estimate: 2 min per km by car
  }

  const routes: RouteData[] = modes.map((modeKey) => {
    const mode = TRAVEL_MODES[modeKey];
    const duration = Math.round(baseDuration * DURATION_MULTIPLIERS[modeKey]);
    const co2Emissions = Math.round(distance * mode.emissionFactor);

    return {
      origin,
      destination,
      mode,
      distance: Math.round(distance * 10) / 10, // Round to 1 decimal
      duration,
      co2Emissions,
    };
  });

  return routes;
}

export function getAllTravelModes(): TravelMode[] {
  return Object.values(TRAVEL_MODES);
}
