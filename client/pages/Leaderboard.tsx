import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Trophy,
  Medal,
  Crown,
  Zap,
  Compass,
  TrendingUp,
  Calendar,
  Users,
  Leaf,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  id: string;
  name?: string;
  rank: number;
  totalGreenMiles: number;
  co2SavedTotal: number;
  tripsCount: number;
  badge?: "gold" | "silver" | "bronze" | "newcomer" | "explorer";
  recentGrowth?: number;
  outsideCityTrips?: number;
  preferredModes: string[];
}

interface LeaderboardData {
  leaderboard: LeaderboardEntry[];
  timeRange: string;
  lastUpdated: string;
  totalUsers: number;
}

const badgeConfig = {
  gold: {
    icon: Crown,
    label: "Champion",
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
    iconColor: "text-yellow-600",
  },
  silver: {
    icon: Medal,
    label: "Runner-up",
    color: "bg-gray-100 text-gray-800 border-gray-300",
    iconColor: "text-gray-600",
  },
  bronze: {
    icon: Medal,
    label: "Third Place",
    color: "bg-orange-100 text-orange-800 border-orange-300",
    iconColor: "text-orange-600",
  },
  newcomer: {
    icon: Zap,
    label: "Rising Star",
    color: "bg-blue-100 text-blue-800 border-blue-300",
    iconColor: "text-blue-600",
  },
  explorer: {
    icon: Compass,
    label: "Explorer",
    color: "bg-green-100 text-green-800 border-green-300",
    iconColor: "text-green-600",
  },
};

export default function Leaderboard() {
  const navigate = useNavigate();
  const [leaderboardData, setLeaderboardData] =
    useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"all-time" | "weekly" | "monthly">(
    "all-time",
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadLeaderboard();
  }, [timeRange]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/leaderboard?timeRange=${timeRange}&limit=50`,
      );
      const data: LeaderboardData = await response.json();
      setLeaderboardData(data);
    } catch (error) {
      console.error("Error loading leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadLeaderboard();
    setIsRefreshing(false);
  };

  const formatCO2 = (grams: number) => {
    if (grams < 1000) return `${grams}g`;
    return `${(grams / 1000).toFixed(1)}kg`;
  };

  const getUserInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getRankDisplay = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  if (loading && !leaderboardData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 text-primary mx-auto mb-4">
            <Trophy className="h-full w-full" />
          </div>
          <p className="text-muted-foreground">Loading leaderboard...</p>
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
                <h1 className="font-semibold text-foreground">Leaderboard</h1>
                <p className="text-xs text-muted-foreground">
                  Top sustainable travelers
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-semibold">
                    {leaderboardData?.totalUsers || 0}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Travelers</p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Time Range Tabs */}
        <Tabs
          value={timeRange}
          onValueChange={(value) => setTimeRange(value as typeof timeRange)}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all-time" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              All Time
            </TabsTrigger>
            <TabsTrigger value="monthly" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Monthly
            </TabsTrigger>
            <TabsTrigger value="weekly" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Weekly
            </TabsTrigger>
          </TabsList>

          <TabsContent value={timeRange} className="space-y-4">
            {/* Top 3 Podium */}
            {leaderboardData && leaderboardData.leaderboard.length >= 3 && (
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-green-50">
                <h3 className="font-semibold text-center mb-4 flex items-center justify-center gap-2">
                  <Crown className="h-5 w-5 text-primary" />
                  Top 3 Champions
                </h3>

                <div className="grid grid-cols-3 gap-2 items-end">
                  {/* Second Place */}
                  <div className="text-center">
                    <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 border-2 border-gray-300">
                      <span className="font-bold text-gray-700">
                        {getUserInitials(leaderboardData.leaderboard[1]?.name)}
                      </span>
                    </div>
                    <div className="text-2xl mb-1">🥈</div>
                    <div className="font-semibold text-sm">
                      {leaderboardData.leaderboard[1]?.name || "User"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {leaderboardData.leaderboard[1]?.totalGreenMiles} Miles
                    </div>
                  </div>

                  {/* First Place */}
                  <div className="text-center">
                    <div className="h-20 w-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2 border-2 border-yellow-400">
                      <span className="font-bold text-yellow-800">
                        {getUserInitials(leaderboardData.leaderboard[0]?.name)}
                      </span>
                    </div>
                    <div className="text-3xl mb-1">🥇</div>
                    <div className="font-semibold">
                      {leaderboardData.leaderboard[0]?.name || "User"}
                    </div>
                    <div className="text-sm text-primary font-bold">
                      {leaderboardData.leaderboard[0]?.totalGreenMiles} Miles
                    </div>
                  </div>

                  {/* Third Place */}
                  <div className="text-center">
                    <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2 border-2 border-orange-300">
                      <span className="font-bold text-orange-700">
                        {getUserInitials(leaderboardData.leaderboard[2]?.name)}
                      </span>
                    </div>
                    <div className="text-2xl mb-1">🥉</div>
                    <div className="font-semibold text-sm">
                      {leaderboardData.leaderboard[2]?.name || "User"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {leaderboardData.leaderboard[2]?.totalGreenMiles} Miles
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Full Leaderboard */}
            <Card className="p-4">
              <h3 className="font-semibold text-card-foreground mb-4">
                Rankings
              </h3>

              <div className="space-y-3">
                {leaderboardData?.leaderboard.map((entry, index) => {
                  const badgeInfo = entry.badge
                    ? badgeConfig[entry.badge]
                    : null;
                  const BadgeIcon = badgeInfo?.icon;

                  return (
                    <div
                      key={entry.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border transition-all duration-200",
                        entry.rank <= 3
                          ? "bg-primary/5 border-primary/20 shadow-sm"
                          : "bg-background border-border hover:border-primary/50",
                      )}
                    >
                      {/* Rank */}
                      <div className="text-center min-w-[2rem]">
                        <div
                          className={cn(
                            "font-bold text-lg",
                            entry.rank === 1
                              ? "text-yellow-600"
                              : entry.rank === 2
                                ? "text-gray-600"
                                : entry.rank === 3
                                  ? "text-orange-600"
                                  : "text-muted-foreground",
                          )}
                        >
                          {getRankDisplay(entry.rank)}
                        </div>
                      </div>

                      {/* Avatar */}
                      <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center border-2 border-border">
                        <span className="font-semibold text-sm">
                          {getUserInitials(entry.name)}
                        </span>
                      </div>

                      {/* User Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-card-foreground">
                            {entry.name || `User ${entry.id.slice(-3)}`}
                          </h4>
                          {badgeInfo && (
                            <Badge className={cn("text-xs", badgeInfo.color)}>
                              {BadgeIcon && (
                                <BadgeIcon className="h-3 w-3 mr-1" />
                              )}
                              {badgeInfo.label}
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                          <div>
                            <Leaf className="h-3 w-3 inline mr-1" />
                            {formatCO2(entry.co2SavedTotal)}
                          </div>
                          <div>
                            <Trophy className="h-3 w-3 inline mr-1" />
                            {entry.tripsCount} trips
                          </div>
                          <div>
                            <TrendingUp className="h-3 w-3 inline mr-1" />+
                            {entry.recentGrowth || 0}
                          </div>
                        </div>
                      </div>

                      {/* Points */}
                      <div className="text-right">
                        <div className="font-bold text-lg text-primary">
                          {entry.totalGreenMiles}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          miles
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Quick Actions */}
            <div className="space-y-3">
              <Button
                onClick={() => navigate("/route-planning")}
                className="w-full"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Earn More Miles
              </Button>

              <Button
                onClick={() => navigate("/green-miles")}
                variant="outline"
                className="w-full"
              >
                <Leaf className="h-4 w-4 mr-2" />
                View Your Progress
              </Button>
            </div>

            {/* Footer Info */}
            <Card className="p-3 bg-muted/30">
              <div className="text-center text-xs text-muted-foreground">
                <p>
                  Updated{" "}
                  {leaderboardData
                    ? new Date(leaderboardData.lastUpdated).toLocaleTimeString()
                    : "recently"}
                </p>
                <p className="mt-1">
                  Rankings based on sustainable travel choices and Green Miles
                  earned
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
