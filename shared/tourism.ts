// Shared interfaces for the sustainable tourism system

export interface Location {
  name: string;
  lat: number;
  lng: number;
  address?: string;
}

export interface TravelMode {
  mode: "car" | "bike" | "walk" | "songthaew" | "bus";
  name: string;
  icon: string;
  emissionFactor: number; // g CO2/km
}

export interface RouteData {
  origin: Location;
  destination: Location;
  mode: TravelMode;
  distance: number; // km
  duration: number; // minutes
  co2Emissions: number; // grams
}

export interface TravelComparison {
  routes: RouteData[];
  bestOption: RouteData;
  co2Savings: {
    vs_car: number;
    percentage: number;
  };
}

export interface CongestionForecast {
  location: string;
  currentLevel: number; // 0-100
  forecastLevel: number; // 0-100
  timeToOvercrowd: number; // minutes
  shouldRedirect: boolean;
}

export interface AlternativeDestination {
  id: string;
  name: string;
  location: Location;
  description: string;
  pmLevel: number;
  similarTo: string;
  accessibilityScore: number;
  crowdLevel: number; // 0-100
}

export interface GreenMilesReward {
  userId: string;
  points: number;
  breakdown: {
    co2Saved: number; // points from CO2 savings
    outsideCity: number; // bonus for destinations outside city
    recommendedZone: number; // bonus for recommended zones
  };
  totalSaved: number; // total CO2 saved in grams
}

export interface UserProfile {
  id: string;
  name?: string;
  totalGreenMiles: number;
  co2SavedTotal: number; // grams
  tripsCount: number;
  preferredModes: TravelMode["mode"][];
}

export interface SmartSuggestion {
  route: RouteData;
  score: number;
  reasoning: string;
  benefits: string[];
  greenMiles: number;
}

// API Request/Response types
export interface TravelDataRequest {
  origin: Location;
  destinations: Location[];
  modes?: TravelMode["mode"][];
}

export interface TravelDataResponse {
  comparisons: TravelComparison[];
  suggestions: SmartSuggestion[];
  forecast: CongestionForecast;
  alternatives: AlternativeDestination[];
}

export interface GreenMilesRequest {
  userId: string;
  route: RouteData;
  isOutsideCity: boolean;
  isRecommendedZone: boolean;
}

export interface GreenMilesResponse {
  reward: GreenMilesReward;
  newTotal: number;
  achievement?: string;
}
