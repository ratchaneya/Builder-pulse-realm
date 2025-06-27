import { RouteData, GreenMilesReward, UserProfile } from "@shared/tourism";

// Mock user storage (in real app, use database)
const userProfiles: Map<string, UserProfile> = new Map();

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

export function getGreenMilesLeaderboard(limit: number = 10): UserProfile[] {
  return Array.from(userProfiles.values())
    .sort((a, b) => b.totalGreenMiles - a.totalGreenMiles)
    .slice(0, limit);
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
