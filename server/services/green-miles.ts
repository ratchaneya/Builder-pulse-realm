import { RouteData, GreenMilesReward, UserProfile } from "@shared/tourism";

// Mock user storage (in real app, use database)
export const userProfiles: Map<string, UserProfile> = new Map();

export function awardGreenMiles(
  userId: string,
  route: RouteData,
  isOutsideCity: boolean,
  isRecommendedZone: boolean,
): GreenMilesReward {
  // Calculate CO2 saved vs car baseline
  const carEmissions = route.distance * 180; // 180g/km for car
  const co2Saved = Math.max(0, carEmissions - route.co2Emissions);

  // Points calculation
  const co2Points = Math.floor(co2Saved / 100); // 1 point per 100g CO2 saved
  const outsideCityBonus = isOutsideCity ? co2Points : 0; // 2x if outside city
  const recommendedZoneBonus = isRecommendedZone ? 5 : 0; // +5 for recommended zones

  const totalPoints = co2Points + outsideCityBonus + recommendedZoneBonus;

  const reward: GreenMilesReward = {
    userId,
    points: totalPoints,
    breakdown: {
      co2Saved: co2Points,
      outsideCity: outsideCityBonus,
      recommendedZone: recommendedZoneBonus,
    },
    totalSaved: co2Saved,
  };

  // Update user profile
  updateUserProfile(userId, reward, route);

  return reward;
}

function updateUserProfile(
  userId: string,
  reward: GreenMilesReward,
  route: RouteData,
): void {
  let profile = userProfiles.get(userId);

  if (!profile) {
    profile = {
      id: userId,
      totalGreenMiles: 0,
      co2SavedTotal: 0,
      tripsCount: 0,
      preferredModes: [],
    };
  }

  // Update totals
  profile.totalGreenMiles += reward.points;
  profile.co2SavedTotal += reward.totalSaved;
  profile.tripsCount += 1;

  // Update preferred modes (simple frequency tracking)
  const modeIndex = profile.preferredModes.indexOf(route.mode.mode);
  if (modeIndex === -1) {
    profile.preferredModes.push(route.mode.mode);
  }

  userProfiles.set(userId, profile);
}

export function getUserProfile(userId: string): UserProfile | null {
  return userProfiles.get(userId) || null;
}

export interface LeaderboardEntry extends UserProfile {
  rank: number;
  badge?: "gold" | "silver" | "bronze" | "newcomer" | "explorer";
  recentGrowth?: number; // Green Miles earned in last 7 days
  outsideCityTrips?: number; // Number of trips outside city
}

export function generateLeaderboard(
  timeRange: "all-time" | "weekly" | "monthly" = "all-time",
  limit: number = 50,
): LeaderboardEntry[] {
  // Get all user profiles
  let profiles = Array.from(userProfiles.values());

  // For demo purposes, let's add some mock users if none exist
  if (profiles.length === 0) {
    addMockUsers();
    profiles = Array.from(userProfiles.values());
  }

  // Sort by Green Miles (descending)
  profiles.sort((a, b) => b.totalGreenMiles - a.totalGreenMiles);

  // Convert to leaderboard entries with ranks and badges
  const leaderboard: LeaderboardEntry[] = profiles
    .slice(0, limit)
    .map((profile, index) => {
      const rank = index + 1;
      let badge: LeaderboardEntry["badge"];

      // Assign top 3 badges
      if (rank === 1) badge = "gold";
      else if (rank === 2) badge = "silver";
      else if (rank === 3) badge = "bronze";
      // Newcomer badge for users with high recent growth
      else if (profile.tripsCount <= 5 && profile.totalGreenMiles > 50)
        badge = "newcomer";
      // Explorer badge for users with many outside-city trips
      else if (profile.tripsCount >= 10 && profile.totalGreenMiles > 200)
        badge = "explorer";

      return {
        ...profile,
        rank,
        badge,
        recentGrowth: Math.floor(Math.random() * 100), // Mock recent growth
        outsideCityTrips: Math.floor(profile.tripsCount * 0.7), // Mock outside city trips
      };
    });

  return leaderboard;
}

export function getGreenMilesLeaderboard(limit: number = 10): UserProfile[] {
  return Array.from(userProfiles.values())
    .sort((a, b) => b.totalGreenMiles - a.totalGreenMiles)
    .slice(0, limit);
}

// Add mock users for demo purposes
function addMockUsers(): void {
  const mockUsers = [
    {
      id: "user_001",
      name: "Alex Chen",
      totalGreenMiles: 1247,
      co2SavedTotal: 15600,
      tripsCount: 23,
      preferredModes: ["bike", "bus"] as const,
    },
    {
      id: "user_002",
      name: "Sarah Miller",
      totalGreenMiles: 980,
      co2SavedTotal: 12300,
      tripsCount: 18,
      preferredModes: ["bike", "walk"] as const,
    },
    {
      id: "user_003",
      name: "David Park",
      totalGreenMiles: 856,
      co2SavedTotal: 10800,
      tripsCount: 15,
      preferredModes: ["songthaew", "bike"] as const,
    },
    {
      id: "user_004",
      name: "Emma Johnson",
      totalGreenMiles: 734,
      co2SavedTotal: 9200,
      tripsCount: 14,
      preferredModes: ["bus", "walk"] as const,
    },
    {
      id: "user_005",
      name: "Marco Rodriguez",
      totalGreenMiles: 623,
      co2SavedTotal: 7800,
      tripsCount: 12,
      preferredModes: ["bike"] as const,
    },
    {
      id: "user_006",
      name: "Lisa Wong",
      totalGreenMiles: 567,
      co2SavedTotal: 7100,
      tripsCount: 11,
      preferredModes: ["walk", "bus"] as const,
    },
    {
      id: "user_007",
      name: "James Taylor",
      totalGreenMiles: 445,
      co2SavedTotal: 5600,
      tripsCount: 9,
      preferredModes: ["songthaew"] as const,
    },
    {
      id: "user_008",
      name: "Nina Patel",
      totalGreenMiles: 389,
      co2SavedTotal: 4900,
      tripsCount: 8,
      preferredModes: ["bike", "walk"] as const,
    },
    {
      id: "user_009",
      name: "Tom Anderson",
      totalGreenMiles: 312,
      co2SavedTotal: 3900,
      tripsCount: 7,
      preferredModes: ["bus"] as const,
    },
    {
      id: "user_010",
      name: "Zoe Kim",
      totalGreenMiles: 245,
      co2SavedTotal: 3100,
      tripsCount: 5,
      preferredModes: ["bike", "walk"] as const,
    },
  ];

  mockUsers.forEach((user) => {
    userProfiles.set(user.id, user);
  });
}

export function calculateAchievements(profile: UserProfile): string[] {
  const achievements: string[] = [];

  if (profile.totalGreenMiles >= 100) {
    achievements.push("🌿 Eco Warrior - 100+ Green Miles");
  }

  if (profile.co2SavedTotal >= 10000) {
    achievements.push("🌍 Carbon Saver - 10kg+ CO2 prevented");
  }

  if (profile.tripsCount >= 50) {
    achievements.push("🚴 Frequent Traveler - 50+ sustainable trips");
  }

  if (
    profile.preferredModes.includes("bike") ||
    profile.preferredModes.includes("walk")
  ) {
    achievements.push("💪 Human Powered - Uses zero-emission transport");
  }

  if (
    profile.preferredModes.includes("songthaew") ||
    profile.preferredModes.includes("bus")
  ) {
    achievements.push("🚌 Community Commuter - Supports shared transport");
  }

  return achievements;
}

export function formatGreenMiles(points: number): string {
  if (points === 0) return "0 Green Miles";
  if (points === 1) return "1 Green Mile";
  return `${points} Green Miles`;
}

export function estimateGreenMiles(
  route: RouteData,
  isOutsideCity: boolean,
  isRecommendedZone: boolean,
): number {
  const carEmissions = route.distance * 180;
  const co2Saved = Math.max(0, carEmissions - route.co2Emissions);
  const co2Points = Math.floor(co2Saved / 100);
  const outsideCityBonus = isOutsideCity ? co2Points : 0;
  const recommendedZoneBonus = isRecommendedZone ? 5 : 0;

  return co2Points + outsideCityBonus + recommendedZoneBonus;
}
