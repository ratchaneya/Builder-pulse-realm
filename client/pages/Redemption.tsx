import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Gift,
  Star,
  MapPin,
  Clock,
  ShoppingBag,
  Leaf,
  Award,
  ExternalLink,
  Info,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Reward {
  id: string;
  title: string;
  description: string;
  category: "discount" | "souvenir" | "experience" | "environmental";
  pointsRequired: number;
  icon: string;
  benefits: string[];
  limitations: string[];
  partnerLocations: PartnerLocation[];
  dailyLimit?: number;
  availabilityLimit?: number;
  isActive: boolean;
}

interface PartnerLocation {
  id: string;
  name: string;
  address: string;
  type: string;
  contactInfo: string;
  operatingHours: string;
}

interface RedemptionRecord {
  id: string;
  rewardId: string;
  pointsUsed: number;
  redemptionCode: string;
  qrCode: string;
  status: "pending" | "redeemed" | "expired";
  createdAt: string;
  expiresAt: string;
  instructions: string;
}

interface RewardsData {
  allRewards: Reward[];
  eligibleRewards: Reward[];
  userPoints: number;
}

const categoryConfig = {
  discount: {
    color: "bg-orange-100 text-orange-700 border-orange-300",
    icon: ShoppingBag,
  },
  souvenir: {
    color: "bg-purple-100 text-purple-700 border-purple-300",
    icon: Gift,
  },
  experience: {
    color: "bg-blue-100 text-blue-700 border-blue-300",
    icon: Star,
  },
  environmental: {
    color: "bg-green-100 text-green-700 border-green-300",
    icon: Leaf,
  },
};

export default function Redemption() {
  const navigate = useNavigate();
  const [rewardsData, setRewardsData] = useState<RewardsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [redeeming, setRedeeming] = useState(false);
  const [redemptionSuccess, setRedemptionSuccess] =
    useState<RedemptionRecord | null>(null);

  const userId = "demo_user_001"; // In real app, get from auth

  useEffect(() => {
    loadRewards();
  }, []);

  const loadRewards = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/rewards?userId=${userId}`);
      const data: RewardsData = await response.json();
      setRewardsData(data);
    } catch (error) {
      console.error("Error loading rewards:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemClick = (reward: Reward) => {
    setSelectedReward(reward);
    setConfirmDialogOpen(true);
  };

  const handleConfirmRedeem = async () => {
    if (!selectedReward) return;

    try {
      setRedeeming(true);
      const response = await fetch("/api/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          rewardId: selectedReward.id,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setRedemptionSuccess(result.redemption);
        setConfirmDialogOpen(false);
        // Reload rewards to update user points
        await loadRewards();
      } else {
        alert(`Redemption failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Error redeeming reward:", error);
      alert("An error occurred while redeeming the reward.");
    } finally {
      setRedeeming(false);
    }
  };

  const getCategoryInfo = (category: Reward["category"]) => {
    return categoryConfig[category] || categoryConfig.discount;
  };

  const isEligible = (reward: Reward) => {
    return rewardsData?.userPoints
      ? rewardsData.userPoints >= reward.pointsRequired
      : false;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 text-primary mx-auto mb-4">
            <Gift className="h-full w-full" />
          </div>
          <p className="text-muted-foreground">Loading rewards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-4 shadow-sm">
        <div className="container max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="font-semibold text-foreground">Rewards Shop</h1>
                <p className="text-xs text-muted-foreground">
                  Redeem your Green Miles
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-lg font-bold text-foreground">
                  {rewardsData?.userPoints || 0}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Available Miles</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Introduction */}
        <Card className="p-4 bg-primary/5 border-primary/20">
          <h2 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            Sustainable Rewards
          </h2>
          <p className="text-sm text-muted-foreground">
            Use your Green Miles to support local businesses, learn traditional
            skills, and contribute to environmental conservation in Chiang Mai.
          </p>
        </Card>

        {/* Rewards Grid */}
        {rewardsData && (
          <div className="space-y-4">
            {rewardsData.allRewards.map((reward) => {
              const categoryInfo = getCategoryInfo(reward.category);
              const CategoryIcon = categoryInfo.icon;
              const eligible = isEligible(reward);

              return (
                <Card
                  key={reward.id}
                  className={cn(
                    "p-4 transition-all duration-200",
                    eligible
                      ? "border-primary/50 hover:shadow-md"
                      : "opacity-60 border-muted",
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="text-3xl">{reward.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-card-foreground">
                            {reward.title}
                          </h3>
                          <Badge className={cn("text-xs", categoryInfo.color)}>
                            <CategoryIcon className="h-3 w-3 mr-1" />
                            {reward.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {reward.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">
                        {reward.pointsRequired}
                      </div>
                      <div className="text-xs text-muted-foreground">miles</div>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="mb-3">
                    <div className="text-sm font-medium text-card-foreground mb-2">
                      What you get:
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {reward.benefits.slice(0, 2).map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Partner Locations */}
                  {reward.partnerLocations.length > 0 && (
                    <div className="mb-3">
                      <div className="text-sm font-medium text-card-foreground mb-2">
                        Available at:
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>
                          {reward.partnerLocations.length} location
                          {reward.partnerLocations.length !== 1 ? "s" : ""}
                          around Chiang Mai
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Limitations */}
                  {reward.limitations.length > 0 && (
                    <div className="mb-4 p-2 bg-muted/30 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Info className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-muted-foreground">
                          {reward.limitations[0]}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <Button
                    onClick={() => handleRedeemClick(reward)}
                    disabled={!eligible}
                    className={cn(
                      "w-full",
                      eligible
                        ? "bg-primary hover:bg-primary/90"
                        : "bg-muted text-muted-foreground cursor-not-allowed",
                    )}
                  >
                    {eligible ? (
                      <>
                        <Gift className="h-4 w-4 mr-2" />
                        Redeem Now
                      </>
                    ) : (
                      <>
                        <Award className="h-4 w-4 mr-2" />
                        Need{" "}
                        {reward.pointsRequired -
                          (rewardsData?.userPoints || 0)}{" "}
                        more miles
                      </>
                    )}
                  </Button>
                </Card>
              );
            })}
          </div>
        )}

        {/* Quick Actions */}
        <div className="space-y-3 pt-4">
          <Button
            onClick={() => navigate("/route-planning")}
            variant="outline"
            className="w-full border-primary text-primary hover:bg-primary/5"
          >
            <Leaf className="h-4 w-4 mr-2" />
            Earn More Green Miles
          </Button>

          <Button
            onClick={() => navigate("/green-miles")}
            variant="outline"
            className="w-full"
          >
            <Star className="h-4 w-4 mr-2" />
            View Your Progress
          </Button>
        </div>
      </main>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              Confirm Redemption
            </DialogTitle>
          </DialogHeader>

          {selectedReward && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl mb-2">{selectedReward.icon}</div>
                <h3 className="font-semibold">{selectedReward.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Cost: {selectedReward.pointsRequired} Green Miles
                </p>
              </div>

              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-sm text-muted-foreground">
                  After redemption, you'll receive a unique QR code to use at
                  partner locations. This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setConfirmDialogOpen(false)}
                  className="flex-1"
                  disabled={redeeming}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmRedeem}
                  disabled={redeeming}
                  className="flex-1"
                >
                  {redeeming ? "Redeeming..." : "Confirm"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog
        open={!!redemptionSuccess}
        onOpenChange={() => setRedemptionSuccess(null)}
      >
        <DialogContent className="max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Redemption Successful!
            </DialogTitle>
          </DialogHeader>

          {redemptionSuccess && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-lg font-bold text-green-600 mb-2">
                  Code: {redemptionSuccess.redemptionCode}
                </div>
                <img
                  src={redemptionSuccess.qrCode}
                  alt="QR Code"
                  className="mx-auto mb-2 rounded-lg"
                />
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-700">
                  {redemptionSuccess.instructions}
                </p>
              </div>

              <Button
                onClick={() => setRedemptionSuccess(null)}
                className="w-full"
              >
                Got it!
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
