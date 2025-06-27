import { Trophy, Leaf, Zap, Star, Gift, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  progress: number;
  maxProgress: number;
  points: number;
  unlocked: boolean;
}

interface GamificationPanelProps {
  userPoints: number;
  level: number;
  nextLevelPoints: number;
  todaySavings: {
    co2: number;
    time: number;
    pm25Avoided: number;
  };
  className?: string;
}

const achievements: Achievement[] = [
  {
    id: "eco-warrior",
    title: "Eco Warrior",
    description: "Save 10kg CO₂ through smart routing",
    icon: Leaf,
    color: "text-green-600 bg-green-50",
    progress: 7.2,
    maxProgress: 10,
    points: 100,
    unlocked: false,
  },
  {
    id: "time-saver",
    title: "Time Saver",
    description: "Save 2 hours of travel time this week",
    icon: Zap,
    color: "text-blue-600 bg-blue-50",
    progress: 85,
    maxProgress: 120,
    points: 75,
    unlocked: false,
  },
  {
    id: "air-quality-hero",
    title: "Air Quality Hero",
    description: "Avoid 500 μg/m³ cumulative PM2.5 exposure",
    icon: Star,
    color: "text-purple-600 bg-purple-50",
    progress: 380,
    maxProgress: 500,
    points: 150,
    unlocked: false,
  },
];

const levelBadges = [
  { level: 1, title: "Tourist", color: "bg-gray-100 text-gray-600" },
  { level: 2, title: "Explorer", color: "bg-green-100 text-green-600" },
  { level: 3, title: "Eco Traveler", color: "bg-blue-100 text-blue-600" },
  {
    level: 4,
    title: "Smart Navigator",
    color: "bg-purple-100 text-purple-600",
  },
  {
    level: 5,
    title: "Sustainability Master",
    color: "bg-gold-100 text-gold-600",
  },
];

export function GamificationPanel({
  userPoints,
  level,
  nextLevelPoints,
  todaySavings,
  className,
}: GamificationPanelProps) {
  const currentBadge =
    levelBadges.find((b) => b.level === level) || levelBadges[0];
  const progressToNext = (userPoints / nextLevelPoints) * 100;

  return (
    <div className={cn("space-y-4", className)}>
      {/* User Stats */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center">
              <Trophy className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground">
                Your Progress
              </h3>
              <div
                className={cn(
                  "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                  currentBadge.color,
                )}
              >
                Level {level} • {currentBadge.title}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{userPoints}</div>
            <div className="text-xs text-muted-foreground">points</div>
          </div>
        </div>

        {/* Progress to next level */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Next level</span>
            <span className="text-muted-foreground">
              {userPoints}/{nextLevelPoints}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progressToNext, 100)}%` }}
            />
          </div>
        </div>

        {/* Today's Impact */}
        <div className="bg-muted/30 rounded-lg p-3">
          <h4 className="font-medium text-card-foreground mb-2 flex items-center gap-2">
            <Target className="h-4 w-4" />
            Today's Impact
          </h4>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-lg font-bold text-green-600">
                {todaySavings.co2}kg
              </div>
              <div className="text-xs text-muted-foreground">CO₂ saved</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">
                {todaySavings.time}min
              </div>
              <div className="text-xs text-muted-foreground">Time saved</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-600">
                {todaySavings.pm25Avoided}
              </div>
              <div className="text-xs text-muted-foreground">PM2.5 avoided</div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-card rounded-xl border border-border p-4">
        <h3 className="font-semibold text-card-foreground mb-3 flex items-center gap-2">
          <Star className="h-5 w-5 text-primary" />
          Achievements
        </h3>

        <div className="space-y-3">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            const progressPercent =
              (achievement.progress / achievement.maxProgress) * 100;

            return (
              <div
                key={achievement.id}
                className={cn(
                  "p-3 rounded-lg border transition-all duration-200",
                  achievement.unlocked
                    ? "bg-green-50 border-green-200"
                    : "bg-background border-border hover:border-primary/50",
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn("p-2 rounded-lg", achievement.color)}>
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm text-card-foreground">
                        {achievement.title}
                      </h4>
                      <div className="flex items-center gap-1">
                        <Gift className="h-3 w-3 text-primary" />
                        <span className="text-xs font-medium text-primary">
                          {achievement.points} pts
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground mb-2">
                      {achievement.description}
                    </p>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {achievement.progress} / {achievement.maxProgress}
                      </span>
                      <span className="text-muted-foreground">
                        {Math.round(progressPercent)}%
                      </span>
                    </div>

                    <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                      <div
                        className={cn(
                          "h-1.5 rounded-full transition-all duration-300",
                          achievement.unlocked ? "bg-green-500" : "bg-primary",
                        )}
                        style={{ width: `${Math.min(progressPercent, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-xl border border-border p-4">
        <h3 className="font-semibold text-card-foreground mb-3">
          Earn More Points
        </h3>
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start" size="sm">
            <Leaf className="h-4 w-4 mr-2" />
            Choose eco-friendly route (+10 pts)
          </Button>
          <Button variant="outline" className="w-full justify-start" size="sm">
            <Star className="h-4 w-4 mr-2" />
            Rate your destination (+5 pts)
          </Button>
          <Button variant="outline" className="w-full justify-start" size="sm">
            <Trophy className="h-4 w-4 mr-2" />
            Share your impact (+15 pts)
          </Button>
        </div>
      </div>
    </div>
  );
}
