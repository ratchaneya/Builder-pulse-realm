import { UserProfile } from "@shared/tourism";
import { getUserProfile, userProfiles } from "./green-miles";

export interface Reward {
  id: string;
  title: string;
  description: string;
  category: "discount" | "souvenir" | "experience" | "environmental";
  pointsRequired: number;
  icon: string;
  benefits: string[];
  limitations: string[];
  partnerLocations: PartnerLocation[];
  availabilityLimit?: number; // per month
  dailyLimit?: number; // per day per user
  isActive: boolean;
}

export interface PartnerLocation {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: "cafe" | "shop" | "workshop" | "nature_center";
  contactInfo: string;
  operatingHours: string;
}

export interface RedemptionRecord {
  id: string;
  userId: string;
  rewardId: string;
  pointsUsed: number;
  redemptionCode: string;
  qrCode: string;
  status: "pending" | "redeemed" | "expired";
  createdAt: Date;
  expiresAt: Date;
  redeemedAt?: Date;
  partnerLocationId?: string;
  instructions: string;
}

// Partner locations around Chiang Mai
const partnerLocations: PartnerLocation[] = [
  {
    id: "cafe_doi_suthep",
    name: "Mountain View Café",
    address: "Doi Suthep National Park, Chiang Mai",
    lat: 18.8047,
    lng: 98.9284,
    type: "cafe",
    contactInfo: "+66 53 123 456",
    operatingHours: "7:00 AM - 6:00 PM",
  },
  {
    id: "cafe_san_kamphaeng",
    name: "Traditional Tea House",
    address: "San Kamphaeng District, Chiang Mai",
    lat: 18.745,
    lng: 99.1167,
    type: "cafe",
    contactInfo: "+66 53 234 567",
    operatingHours: "8:00 AM - 8:00 PM",
  },
  {
    id: "shop_mae_rim",
    name: "Mae Rim Handicrafts",
    address: "Mae Rim Valley, Chiang Mai",
    lat: 18.9167,
    lng: 98.8833,
    type: "shop",
    contactInfo: "+66 53 345 678",
    operatingHours: "9:00 AM - 7:00 PM",
  },
  {
    id: "workshop_organic_farm",
    name: "Organic Farm Experience Center",
    address: "Mae Rim Organic Farm, Chiang Mai",
    lat: 18.91,
    lng: 98.89,
    type: "workshop",
    contactInfo: "+66 53 456 789",
    operatingHours: "9:00 AM - 4:00 PM (by appointment)",
  },
  {
    id: "nature_center_doi_inthanon",
    name: "Doi Inthanon Nature Center",
    address: "Doi Inthanon National Park, Chiang Mai",
    lat: 18.5895,
    lng: 98.4867,
    type: "nature_center",
    contactInfo: "+66 53 567 890",
    operatingHours: "6:00 AM - 6:00 PM",
  },
];

// Available rewards
const availableRewards: Reward[] = [
  {
    id: "cafe_discount_10",
    title: "10% Café Discount",
    description:
      "Get 10% off your order at partner off-city cafés with stunning views and local specialties.",
    category: "discount",
    pointsRequired: 50,
    icon: "☕",
    benefits: [
      "Valid at 5+ partner cafés outside city center",
      "Includes local coffee, tea, and traditional snacks",
      "Support local mountain communities",
    ],
    limitations: [
      "1 redemption per day",
      "Valid only at off-city locations",
      "Cannot be combined with other offers",
    ],
    partnerLocations: partnerLocations.filter((p) => p.type === "cafe"),
    dailyLimit: 1,
    isActive: true,
  },
  {
    id: "local_souvenir",
    title: "Local Handmade Souvenir",
    description:
      "Choose from handwoven items, organic tea, bamboo crafts, or traditional textiles made by local artisans.",
    category: "souvenir",
    pointsRequired: 70,
    icon: "🎁",
    benefits: [
      "Authentic handmade products by local artisans",
      "Choose from tea, textiles, bamboo items, or pottery",
      "Support traditional craft communities",
      "Certificate of authenticity included",
    ],
    limitations: [
      "Collect at partner shops or pickup points",
      "Subject to availability",
      "Valid for 30 days after redemption",
    ],
    partnerLocations: partnerLocations.filter((p) => p.type === "shop"),
    isActive: true,
  },
  {
    id: "local_workshop",
    title: "Free Local Workshop",
    description:
      "Join hands-on workshops like tea-making, natural dyeing, organic farming, or traditional cooking.",
    category: "experience",
    pointsRequired: 100,
    icon: "🎟️",
    benefits: [
      "3-hour immersive cultural experience",
      "Learn traditional skills from local masters",
      "Take home your handmade creations",
      "Small group setting (max 8 people)",
    ],
    limitations: [
      "Pre-booking required (24 hours advance)",
      "Available on weekends only",
      "Valid for 60 days after redemption",
    ],
    partnerLocations: partnerLocations.filter((p) => p.type === "workshop"),
    isActive: true,
  },
  {
    id: "tree_planting",
    title: "Tree Planting Sponsorship",
    description:
      "Sponsor a tree planting in your name in deforested areas around Chiang Mai and receive a digital certificate.",
    category: "environmental",
    pointsRequired: 150,
    icon: "🌳",
    benefits: [
      "Native tree species planted in your name",
      "GPS coordinates and photos of your tree",
      "Digital certificate with environmental impact data",
      "Annual growth updates for 3 years",
    ],
    limitations: [
      "Limited to 50 trees per month",
      "Planting occurs during rainy season (June-October)",
      "Certificate delivered within 14 days",
    ],
    partnerLocations: partnerLocations.filter(
      (p) => p.type === "nature_center",
    ),
    availabilityLimit: 50,
    isActive: true,
  },
];

// In-memory storage for redemptions (in real app, use database)
const redemptionRecords: Map<string, RedemptionRecord> = new Map();

export function listAvailableRewards(userPoints: number): Reward[] {
  return availableRewards.filter((reward) => reward.isActive);
}

export function getEligibleRewards(userPoints: number): Reward[] {
  return availableRewards.filter(
    (reward) => reward.isActive && userPoints >= reward.pointsRequired,
  );
}

export function getRewardById(rewardId: string): Reward | null {
  return availableRewards.find((reward) => reward.id === rewardId) || null;
}

export function getPartnerLocations(rewardId: string): PartnerLocation[] {
  const reward = getRewardById(rewardId);
  return reward ? reward.partnerLocations : [];
}

export function generateRedemptionCode(): string {
  const prefix = "ECO";
  const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `${prefix}${randomCode}${timestamp}`;
}

export function generateQRCode(redemptionCode: string): string {
  // In real app, generate actual QR code
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${redemptionCode}`;
}

export async function redeemReward(
  userId: string,
  rewardId: string,
): Promise<{
  success: boolean;
  redemption?: RedemptionRecord;
  error?: string;
}> {
  try {
    // Get user profile
    const userProfile = getUserProfile(userId);
    if (!userProfile) {
      return { success: false, error: "User not found" };
    }

    // Get reward details
    const reward = getRewardById(rewardId);
    if (!reward) {
      return { success: false, error: "Reward not found" };
    }

    // Check if user has enough points
    if (userProfile.totalGreenMiles < reward.pointsRequired) {
      return {
        success: false,
        error: `Insufficient Green Miles. You need ${reward.pointsRequired} but have ${userProfile.totalGreenMiles}`,
      };
    }

    // Check daily limit
    if (reward.dailyLimit) {
      const today = new Date().toDateString();
      const todayRedemptions = Array.from(redemptionRecords.values()).filter(
        (r) =>
          r.userId === userId &&
          r.rewardId === rewardId &&
          r.createdAt.toDateString() === today,
      );

      if (todayRedemptions.length >= reward.dailyLimit) {
        return {
          success: false,
          error: `Daily limit reached. You can only redeem this reward ${reward.dailyLimit} time(s) per day.`,
        };
      }
    }

    // Check monthly availability limit
    if (reward.availabilityLimit) {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyRedemptions = Array.from(redemptionRecords.values()).filter(
        (r) =>
          r.rewardId === rewardId &&
          r.createdAt.getMonth() === currentMonth &&
          r.createdAt.getFullYear() === currentYear,
      );

      if (monthlyRedemptions.length >= reward.availabilityLimit) {
        return {
          success: false,
          error: `Monthly limit reached. This reward is limited to ${reward.availabilityLimit} redemptions per month.`,
        };
      }
    }

    // Generate redemption record
    const redemptionCode = generateRedemptionCode();
    const qrCode = generateQRCode(redemptionCode);
    const redemptionId = `redemption_${Date.now()}_${userId}`;

    const redemption: RedemptionRecord = {
      id: redemptionId,
      userId,
      rewardId,
      pointsUsed: reward.pointsRequired,
      redemptionCode,
      qrCode,
      status: "pending",
      createdAt: new Date(),
      expiresAt: new Date(
        Date.now() +
          (reward.category === "experience" ? 60 : 30) * 24 * 60 * 60 * 1000,
      ), // 30-60 days
      instructions: generateInstructions(reward),
    };

    // Deduct points from user
    userProfile.totalGreenMiles -= reward.pointsRequired;
    userProfiles.set(userId, userProfile);

    // Store redemption record
    redemptionRecords.set(redemptionId, redemption);

    return { success: true, redemption };
  } catch (error) {
    console.error("Error redeeming reward:", error);
    return { success: false, error: "Internal server error" };
  }
}

function generateInstructions(reward: Reward): string {
  switch (reward.category) {
    case "discount":
      return "Present this QR code at any partner café to receive your 10% discount. Valid for one use per day at off-city locations only.";
    case "souvenir":
      return "Visit any partner shop with this QR code to collect your handmade souvenir. Please bring a valid ID and allow 2-3 days for item preparation.";
    case "experience":
      return "Contact the workshop location at least 24 hours in advance to book your session. Present this QR code when you arrive. Available weekends only.";
    case "environmental":
      return "Your tree sponsorship has been registered! You'll receive a digital certificate with GPS coordinates within 14 days. Planting occurs during rainy season.";
    default:
      return "Present this QR code at the designated location to redeem your reward.";
  }
}

export function getUserRedemptions(userId: string): RedemptionRecord[] {
  return Array.from(redemptionRecords.values())
    .filter((r) => r.userId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function getRedemptionById(
  redemptionId: string,
): RedemptionRecord | null {
  return redemptionRecords.get(redemptionId) || null;
}
