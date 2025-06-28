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
import {
  listAvailableRewards,
  getEligibleRewards,
  redeemReward,
  getPartnerLocations,
  getUserRedemptions,
  getRedemptionById,
} from "../services/redemption";
import {
  checkARTrigger,
  verifyARQRCode,
  getARLocations,
  mockGPSArrival,
} from "../services/location-detection";

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

export const getRewardsHandler: RequestHandler = (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      const allRewards = listAvailableRewards(0);
      return res.json({ rewards: allRewards });
    }

    const userProfile = getUserProfile(userId as string);
    const userPoints = userProfile?.totalGreenMiles || 0;

    const allRewards = listAvailableRewards(userPoints);
    const eligibleRewards = getEligibleRewards(userPoints);

    res.json({
      allRewards,
      eligibleRewards,
      userPoints,
    });
  } catch (error) {
    console.error("Error in getRewards:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const redeemRewardHandler: RequestHandler = async (req, res) => {
  try {
    const { userId, rewardId } = req.body;

    if (!userId || !rewardId) {
      return res
        .status(400)
        .json({ error: "User ID and reward ID are required" });
    }

    const result = await redeemReward(userId, rewardId);

    if (result.success) {
      res.json({
        success: true,
        redemption: result.redemption,
        message: "Reward redeemed successfully!",
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error) {
    console.error("Error in redeemReward:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getPartnerLocationsHandler: RequestHandler = (req, res) => {
  try {
    const { rewardId } = req.params;

    const locations = getPartnerLocations(rewardId);
    res.json({ locations });
  } catch (error) {
    console.error("Error in getPartnerLocations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserRedemptionsHandler: RequestHandler = (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const redemptions = getUserRedemptions(userId);
    res.json({ redemptions });
  } catch (error) {
    console.error("Error in getUserRedemptions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const checkARLocationHandler: RequestHandler = (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res
        .status(400)
        .json({ error: "Latitude and longitude are required" });
    }

    const userLocation = {
      lat: parseFloat(lat as string),
      lng: parseFloat(lng as string),
    };

    const arTrigger = checkARTrigger(userLocation);

    res.json({
      canTriggerAR: !!arTrigger,
      location: arTrigger,
    });
  } catch (error) {
    console.error("Error in checkARLocation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const verifyARQRHandler: RequestHandler = (req, res) => {
  try {
    const { qrCode } = req.body;

    if (!qrCode) {
      return res.status(400).json({ error: "QR code is required" });
    }

    const location = verifyARQRCode(qrCode);

    res.json({
      valid: !!location,
      location,
    });
  } catch (error) {
    console.error("Error in verifyARQR:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getARLocationsHandler: RequestHandler = (req, res) => {
  try {
    const locations = getARLocations();
    res.json({ locations });
  } catch (error) {
    console.error("Error in getARLocations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const mockArrivalHandler: RequestHandler = (req, res) => {
  try {
    const { locationId } = req.params;

    if (!locationId) {
      return res.status(400).json({ error: "Location ID is required" });
    }

    const result = mockGPSArrival(locationId);
    res.json(result);
  } catch (error) {
    console.error("Error in mockArrival:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Check-in handlers
export const checkInHandler: RequestHandler = async (req, res) => {
  try {
    const { userId, locationId, coordinates, photoData, greenMiles } = req.body;

    if (!userId || !locationId || !coordinates) {
      return res.status(400).json({
        error: "User ID, location ID, and coordinates are required",
      });
    }

    // Store check-in data (in a real app, this would go to a database)
    const checkInData = {
      id: `checkin_${Date.now()}`,
      userId,
      locationId,
      coordinates,
      timestamp: new Date().toISOString(),
      photoData: photoData ? "stored" : undefined, // Don't store full photo data in memory
      verified: true,
    };

    // Award Green Miles for check-in
    if (greenMiles && greenMiles > 0) {
      awardGreenMiles(
        userId,
        {
          mode: { mode: "walk", co2Factor: 0 },
          duration: 0,
          distance: 0,
          co2Emissions: 0,
        },
        true,
        true,
      );
    }

    res.json({
      success: true,
      checkIn: checkInData,
      greenMilesAwarded: greenMiles || 0,
      message: "Check-in successful!",
    });
  } catch (error) {
    console.error("Error in checkIn:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCheckInLocationsHandler: RequestHandler = (req, res) => {
  try {
    // Return available check-in locations
    const locations = [
      {
        id: "mae_hia_agricultural",
        name: "ศูนย์เกษตรกรรมแม่เหียะ",
        nameEn: "Mae Hia Agricultural Center",
        coordinates: { lat: 18.7261, lng: 98.9389 },
        radius: 100,
        heroId: "farmer_somjai",
        greenMilesReward: 15,
      },
      {
        id: "ban_pong_village",
        name: "หมู่บ้านบ้านโป���ง",
        nameEn: "Ban Pong Village",
        coordinates: { lat: 18.8147, lng: 99.0525 },
        radius: 120,
        heroId: "artisan_malee",
        greenMilesReward: 12,
      },
      {
        id: "mae_sa_valley",
        name: "หุบเขาแม่สา",
        nameEn: "Mae Sa Valley",
        coordinates: { lat: 18.9167, lng: 99.0833 },
        radius: 150,
        heroId: "ranger_niran",
        greenMilesReward: 18,
      },
      {
        id: "hang_dong_pottery",
        name: "หมู่บ้านเครื่องปั้นดินเผาหางดง",
        nameEn: "Hang Dong Pottery Village",
        coordinates: { lat: 18.6719, lng: 98.9342 },
        radius: 100,
        heroId: "potter_khun_chai",
        greenMilesReward: 14,
      },
      {
        id: "san_kamphaeng_springs",
        name: "บ่อน้ำพุร้อนสันกำแพง",
        nameEn: "San Kamphaeng Hot Springs",
        coordinates: { lat: 18.7606, lng: 99.1828 },
        radius: 80,
        heroId: "wellness_expert_pim",
        greenMilesReward: 16,
      },
      {
        id: "doi_saket_coffee",
        name: "ไร่กาแฟดอยสะเก็ด",
        nameEn: "Doi Saket Coffee Plantation",
        coordinates: { lat: 18.9167, lng: 99.2167 },
        radius: 200,
        heroId: "coffee_farmer_somsak",
        greenMilesReward: 20,
      },
    ];

    res.json({ locations });
  } catch (error) {
    console.error("Error in getCheckInLocations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCheckInHistoryHandler: RequestHandler = (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // In a real app, this would fetch from database
    // For now, return empty history
    const history: any[] = [];

    res.json({
      history,
      totalCheckIns: history.length,
      totalGreenMiles: history.reduce(
        (sum, checkIn) => sum + (checkIn.greenMiles || 0),
        0,
      ),
    });
  } catch (error) {
    console.error("Error in getCheckInHistory:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const verifyCheckInHandler: RequestHandler = (req, res) => {
  try {
    const { locationId, userCoordinates } = req.body;

    if (!locationId || !userCoordinates) {
      return res.status(400).json({
        error: "Location ID and user coordinates are required",
      });
    }

    // Simple distance verification (in a real app, this would be more sophisticated)
    const locations = {
      mae_hia_agricultural: { lat: 18.7261, lng: 98.9389, radius: 100 },
      ban_pong_village: { lat: 18.8147, lng: 99.0525, radius: 120 },
      mae_sa_valley: { lat: 18.9167, lng: 99.0833, radius: 150 },
      hang_dong_pottery: { lat: 18.6719, lng: 98.9342, radius: 100 },
      san_kamphaeng_springs: { lat: 18.7606, lng: 99.1828, radius: 80 },
      doi_saket_coffee: { lat: 18.9167, lng: 99.2167, radius: 200 },
    };

    const location = locations[locationId as keyof typeof locations];
    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }

    // Calculate distance using Haversine formula
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (userCoordinates.lat * Math.PI) / 180;
    const φ2 = (location.lat * Math.PI) / 180;
    const Δφ = ((location.lat - userCoordinates.lat) * Math.PI) / 180;
    const Δλ = ((location.lng - userCoordinates.lng) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    const isWithinRange = distance <= location.radius;

    res.json({
      verified: isWithinRange,
      distance: Math.round(distance),
      maxDistance: location.radius,
      location: locationId,
    });
  } catch (error) {
    console.error("Error in verifyCheckIn:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
