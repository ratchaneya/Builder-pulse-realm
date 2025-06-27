import { RequestHandler } from "express";
import {
  TravelDataRequest,
  TravelDataResponse,
  GreenMilesRequest,
  GreenMilesResponse,
  Location,
  CongestionForecast,
  AlternativeDestination,
} from "@shared/tourism";
import { getTravelData } from "../services/travel-data";
import { compareTravelOptions } from "../services/comparison-generator";
import {
  awardGreenMiles,
  getUserProfile,
  estimateGreenMiles,
  generateLeaderboard,
} from "../services/green-miles";

// Mock destinations in Chiang Mai area
const MOCK_DESTINATIONS: AlternativeDestination[] = [
  {
    id: "doi_suthep",
    name: "Doi Suthep National Park",
    location: { name: "Doi Suthep", lat: 18.8047, lng: 98.9284 },
    description:
      "Sacred mountain temple with stunning city views and fresh mountain air",
    pmLevel: 35,
    similarTo: "Mountain temple experience",
    accessibilityScore: 85,
    crowdLevel: 30,
  },
  {
    id: "san_kamphaeng",
    name: "San Kamphaeng Hot Springs",
    location: { name: "San Kamphaeng", lat: 18.745, lng: 99.1167 },
    description:
      "Natural hot springs surrounded by lush gardens and local crafts",
    pmLevel: 42,
    similarTo: "Relaxation and wellness",
    accessibilityScore: 75,
    crowdLevel: 20,
  },
  {
    id: "mae_rim",
    name: "Mae Rim Elephant Sanctuary",
    location: { name: "Mae Rim", lat: 18.9167, lng: 98.8833 },
    description: "Ethical elephant encounters in pristine natural environment",
    pmLevel: 28,
    similarTo: "Wildlife and nature experience",
    accessibilityScore: 70,
    crowdLevel: 25,
  },
];

// Mock congestion forecast
function getMockCongestionForecast(): CongestionForecast {
  const currentHour = new Date().getHours();
  const isWeekend = [0, 6].includes(new Date().getDay());

  let currentLevel = 45;
  let forecastLevel = 65;

  // Higher congestion during peak hours and weekends
  if (
    (currentHour >= 9 && currentHour <= 11) ||
    (currentHour >= 14 && currentHour <= 17)
  ) {
    currentLevel += 20;
    forecastLevel += 25;
  }

  if (isWeekend) {
    currentLevel += 15;
    forecastLevel += 20;
  }

  return {
    location: "Nimman Road Area",
    currentLevel: Math.min(currentLevel, 100),
    forecastLevel: Math.min(forecastLevel, 100),
    timeToOvercrowd: 90,
    shouldRedirect: forecastLevel > 75,
  };
}

export const getTravelDataHandler: RequestHandler = (req, res) => {
  try {
    const {
      origin,
      destinations,
      modes = ["car", "songthaew", "bike"],
    } = req.body as TravelDataRequest;

    if (!origin || !destinations || destinations.length === 0) {
      return res
        .status(400)
        .json({ error: "Origin and destinations are required" });
    }

    const comparisons = destinations.map((destination) => {
      const routes = getTravelData(origin, destination, modes);
      return compareTravelOptions(routes);
    });

    const forecast = getMockCongestionForecast();
    const alternatives = MOCK_DESTINATIONS;

    // Generate smart suggestions
    const allRoutes = comparisons.flatMap((c) => c.routes);
    const suggestions = allRoutes.map((route) => ({
      route,
      score: 85,
      reasoning:
        route.co2Emissions === 0 ? "Zero emissions!" : "Low carbon footprint",
      benefits: [
        route.co2Emissions === 0
          ? "Zero CO2 emissions"
          : `${route.co2Emissions}g CO2`,
        `${route.duration} min journey`,
        route.mode.mode === "bike" ? "Great exercise" : "Sustainable transport",
      ],
      greenMiles: estimateGreenMiles(route, true, true),
    }));

    const response: TravelDataResponse = {
      comparisons,
      suggestions: suggestions.slice(0, 3),
      forecast,
      alternatives,
    };

    res.json(response);
  } catch (error) {
    console.error("Error in getTravelData:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const awardGreenMilesHandler: RequestHandler = (req, res) => {
  try {
    const { userId, route, isOutsideCity, isRecommendedZone } =
      req.body as GreenMilesRequest;

    if (!userId || !route) {
      return res.status(400).json({ error: "User ID and route are required" });
    }

    const reward = awardGreenMiles(
      userId,
      route,
      isOutsideCity,
      isRecommendedZone,
    );
    const profile = getUserProfile(userId);

    const response: GreenMilesResponse = {
      reward,
      newTotal: profile?.totalGreenMiles || 0,
      achievement:
        profile && profile.totalGreenMiles >= 100
          ? "Eco Warrior unlocked!"
          : undefined,
    };

    res.json(response);
  } catch (error) {
    console.error("Error in awardGreenMiles:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserProfileHandler: RequestHandler = (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const profile = getUserProfile(userId);

    if (!profile) {
      // Return default profile for new users
      const defaultProfile = {
        id: userId,
        totalGreenMiles: 0,
        co2SavedTotal: 0,
        tripsCount: 0,
        preferredModes: [],
      };
      return res.json(defaultProfile);
    }

    res.json(profile);
  } catch (error) {
    console.error("Error in getUserProfile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getForecastHandler: RequestHandler = (req, res) => {
  try {
    const forecast = getMockCongestionForecast();
    res.json(forecast);
  } catch (error) {
    console.error("Error in getForecast:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getLeaderboardHandler: RequestHandler = (req, res) => {
  try {
    const { timeRange = "all-time", limit = 50 } = req.query;

    const leaderboard = generateLeaderboard(
      timeRange as "all-time" | "weekly" | "monthly",
      parseInt(limit as string) || 50,
    );

    res.json({
      leaderboard,
      timeRange,
      lastUpdated: new Date().toISOString(),
      totalUsers: leaderboard.length,
    });
  } catch (error) {
    console.error("Error in getLeaderboard:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
