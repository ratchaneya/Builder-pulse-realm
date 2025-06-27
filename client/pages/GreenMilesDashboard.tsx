import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Trophy,
  Leaf,
  TrendingUp,
  Star,
  Award,
  Target,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { UserProfile } from "@shared/tourism";

export default function GreenMilesDashboard() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const userId = "demo_user_001"; // In real app, get from auth

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await fetch(`/api/user/${userId}`);
      const profile = await response.json();
      setUserProfile(profile);
    } catch (error) {
      console.error("Error loading user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCO2Saved = (grams: number) => {
    if (grams < 1000) return `${grams}g`;
    return `${(grams / 1000).toFixed(1)}kg`;
  };

  const getNextMilestone = (currentMiles: number) => {
    const milestones = [50, 100, 250, 500, 1000];
    return milestones.find((m) => m > currentMiles) || currentMiles + 500;
  };

  const getMilestoneProgress = (current: number) => {
    const next = getNextMilestone(current);
    const previous = next === 50 ? 0 : getNextMilestone(current - 1) || 0;
    return ((current - previous) / (next - previous)) * 100;
  };

  const achievements = [
    {
      id: "first_trip",
      title: "First Journey",
      description: "Completed your first sustainable trip",
      icon: "🌱",
      unlocked: userProfile && userProfile.tripsCount > 0,
    },
    {
      id: "eco_warrior",
      title: "Eco Warrior",
      description: "Earned 100+ Green Miles",
      icon: "🌿",
      unlocked: userProfile && userProfile.totalGreenMiles >= 100,
    },
    {
      id: "carbon_saver",
      title: "Carbon Saver",
      description: "Prevented 10kg+ CO₂ emissions",
      icon: "🌍",
      unlocked: userProfile && userProfile.co2SavedTotal >= 10000,
    },
    {
      id: "bike_enthusiast",
      title: "Bike Enthusiast",
      description: "Used bicycle transportation",
      icon: "🚴",
      unlocked: userProfile && userProfile.preferredModes.includes("bike"),
    },
    {
      id: "public_transport",
      title: "Community Commuter",
      description: "Supported shared transportation",
      icon: "🚌",
      unlocked:
        userProfile &&
        (userProfile.preferredModes.includes("bus") ||
          userProfile.preferredModes.includes("songthaew")),
    },
    {
      id: "frequent_traveler",
      title: "Frequent Traveler",
      description: "Completed 50+ sustainable trips",
      icon: "✈️",
      unlocked: userProfile && userProfile.tripsCount >= 50,
    },
  ];

  const weeklyGoal = 25; // Weekly Green Miles goal
  const weeklyProgress = userProfile ? userProfile.totalGreenMiles % 25 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 text-primary mx-auto mb-4">
            <Leaf className="h-full w-full" />
          </div>
          <p className="text-muted-foreground">Loading your Green Miles...</p>
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
                <h1 className="font-semibold text-foreground">Green Miles</h1>
                <p className="text-xs text-muted-foreground">
                  Your sustainability rewards
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-1">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span className="text-lg font-bold text-foreground">
                  {userProfile?.totalGreenMiles || 0}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Total Miles</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {formatCO2Saved(userProfile?.co2SavedTotal || 0)}
            </div>
            <div className="text-sm text-muted-foreground">CO₂ Prevented</div>
            <div className="mt-2">
              <Leaf className="h-4 w-4 text-green-500 mx-auto" />
            </div>
          </Card>

          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {userProfile?.tripsCount || 0}
            </div>
            <div className="text-sm text-muted-foreground">Trips Completed</div>
            <div className="mt-2">
              <Calendar className="h-4 w-4 text-blue-500 mx-auto" />
            </div>
          </Card>
        </div>

        {/* Weekly Goal Progress */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-card-foreground flex items-center gap-2">
              <Target className="h-5 w-5" />
              Weekly Goal
            </h3>
            <span className="text-sm text-muted-foreground">
              {weeklyProgress}/{weeklyGoal}
            </span>
          </div>

          <Progress
            value={(weeklyProgress / weeklyGoal) * 100}
            className="mb-3"
          />

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {weeklyGoal - weeklyProgress} miles to goal
            </span>
            <Badge variant="outline" className="text-primary border-primary">
              {Math.round((weeklyProgress / weeklyGoal) * 100)}%
            </Badge>
          </div>
        </Card>

        {/* Next Milestone */}
        {userProfile && (
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-card-foreground flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Next Milestone
              </h3>
              <span className="text-sm text-muted-foreground">
                {userProfile.totalGreenMiles}/
                {getNextMilestone(userProfile.totalGreenMiles)}
              </span>
            </div>

            <Progress
              value={getMilestoneProgress(userProfile.totalGreenMiles)}
              className="mb-3"
            />

            <div className="text-center">
              <div className="text-lg font-semibold text-primary mb-1">
                {getNextMilestone(userProfile.totalGreenMiles) -
                  userProfile.totalGreenMiles}{" "}
                miles to go
              </div>
              <div className="text-sm text-muted-foreground">
                Unlock exclusive rewards at{" "}
                {getNextMilestone(userProfile.totalGreenMiles)} miles!
              </div>
            </div>
          </Card>
        )}

        {/* Achievements */}
        <Card className="p-4">
          <h3 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
            <Award className="h-5 w-5" />
            Achievements
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={cn(
                  "p-3 rounded-lg border transition-all duration-200",
                  achievement.unlocked
                    ? "bg-primary/10 border-primary/30"
                    : "bg-muted/50 border-border opacity-60",
                )}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{achievement.icon}</div>
                  <div
                    className={cn(
                      "font-medium text-sm mb-1",
                      achievement.unlocked
                        ? "text-card-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {achievement.title}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {achievement.description}
                  </div>
                  {achievement.unlocked && (
                    <Badge className="mt-2 bg-primary/20 text-primary">
                      <Star className="h-3 w-3 mr-1" />
                      Unlocked
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => navigate("/route-planning")}
            className="w-full"
          >
            <Trophy className="h-4 w-4 mr-2" />
            Earn More Miles
          </Button>

          <Button
            onClick={() => navigate("/leaderboard")}
            variant="outline"
            className="w-full"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            View Leaderboard
          </Button>
        </div>

        {/* Tips */}
        <Card className="p-4 bg-primary/5 border-primary/20">
          <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
            💡 Pro Tips
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Choose bike or walking for zero-emission trips</li>
            <li>• Visit destinations outside the city for bonus points</li>
            <li>• Use shared transport to reduce your carbon footprint</li>
            <li>• Check congestion forecasts to avoid crowded areas</li>
          </ul>
        </Card>
      </main>
    </div>
  );
}
