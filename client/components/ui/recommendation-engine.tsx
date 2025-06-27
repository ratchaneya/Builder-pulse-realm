import {
  MapPin,
  Leaf,
  Clock,
  Star,
  TrendingDown,
  Coffee,
  Camera,
  TreePine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Recommendation {
  id: string;
  name: string;
  category: "cafe" | "nature" | "cultural";
  distance: number;
  travelTime: string;
  crowdLevel: number;
  pm25Level: number;
  co2Savings: number;
  timeSavings: string;
  rating: number;
  description: string;
  benefits: string[];
  matchScore: number;
}

interface RecommendationEngineProps {
  userInterests: string[];
  recommendations: Recommendation[];
  onSelectDestination: (id: string) => void;
  className?: string;
}

const categoryIcons = {
  cafe: Coffee,
  nature: TreePine,
  cultural: Camera,
};

const categoryColors = {
  cafe: "bg-orange-50 text-orange-600 border-orange-200",
  nature: "bg-green-50 text-green-600 border-green-200",
  cultural: "bg-purple-50 text-purple-600 border-purple-200",
};

const mockRecommendations: Recommendation[] = [
  {
    id: "1",
    name: "Doi Suthep Viewpoint Café",
    category: "cafe",
    distance: 12,
    travelTime: "25 min",
    crowdLevel: 35,
    pm25Level: 28,
    co2Savings: 1.4,
    timeSavings: "20 min",
    rating: 4.8,
    description:
      "Mountain café with stunning city views and fresh mountain air",
    benefits: ["50% less PM2.5", "65% fewer crowds", "Nature therapy"],
    matchScore: 92,
  },
  {
    id: "2",
    name: "San Kamphaeng Cultural Village",
    category: "cultural",
    distance: 18,
    travelTime: "30 min",
    crowdLevel: 28,
    pm25Level: 35,
    co2Savings: 1.1,
    timeSavings: "15 min",
    rating: 4.6,
    description: "Traditional handicraft workshops and authentic local culture",
    benefits: ["55% less PM2.5", "72% fewer crowds", "Cultural immersion"],
    matchScore: 88,
  },
  {
    id: "3",
    name: "Mae Rim Organic Farm",
    category: "nature",
    distance: 25,
    travelTime: "40 min",
    crowdLevel: 15,
    pm25Level: 22,
    co2Savings: 1.8,
    timeSavings: "25 min",
    rating: 4.9,
    description: "Peaceful organic farm with hands-on activities and clean air",
    benefits: ["72% less PM2.5", "85% fewer crowds", "Organic experiences"],
    matchScore: 95,
  },
];

export function RecommendationEngine({
  userInterests,
  recommendations = mockRecommendations,
  onSelectDestination,
  className,
}: RecommendationEngineProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="bg-card rounded-xl border border-border p-4">
        <h3 className="font-semibold text-card-foreground mb-2 flex items-center gap-2">
          <Star className="h-5 w-5 text-primary" />
          Smart Recommendations
        </h3>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-sm text-muted-foreground">
            Matched to your interests:
          </span>
          {userInterests.map((interest, index) => (
            <span
              key={index}
              className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium"
            >
              {interest}
            </span>
          ))}
        </div>

        <div className="space-y-4">
          {recommendations.map((rec) => {
            const CategoryIcon = categoryIcons[rec.category];

            return (
              <div
                key={rec.id}
                className="bg-background rounded-lg border border-border p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className={cn(
                        "p-2 rounded-lg border",
                        categoryColors[rec.category],
                      )}
                    >
                      <CategoryIcon className="h-4 w-4" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-card-foreground">
                          {rec.name}
                        </h4>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-muted-foreground">
                            {rec.rating}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-2">
                        {rec.description}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{rec.distance}km away</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{rec.travelTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-bold">
                      {rec.matchScore}% match
                    </div>
                  </div>
                </div>

                {/* Environmental Benefits */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="text-center bg-green-50 rounded-lg p-2">
                    <div className="text-sm font-bold text-green-700">
                      {rec.pm25Level}
                    </div>
                    <div className="text-xs text-green-600">PM2.5 μg/m³</div>
                  </div>
                  <div className="text-center bg-blue-50 rounded-lg p-2">
                    <div className="text-sm font-bold text-blue-700">
                      {rec.crowdLevel}%
                    </div>
                    <div className="text-xs text-blue-600">Crowd level</div>
                  </div>
                  <div className="text-center bg-purple-50 rounded-lg p-2">
                    <div className="text-sm font-bold text-purple-700">
                      -{rec.co2Savings}kg
                    </div>
                    <div className="text-xs text-purple-600">CO₂ saved</div>
                  </div>
                </div>

                {/* Benefits List */}
                <div className="mb-3">
                  <div className="flex flex-wrap gap-2">
                    {rec.benefits.map((benefit, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-muted/50 rounded-full px-2 py-1 text-xs"
                      >
                        <TrendingDown className="h-3 w-3 text-green-600" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Time & Environmental Savings */}
                <div className="bg-muted/30 rounded-lg p-3 mb-3">
                  <div className="text-sm font-medium text-card-foreground mb-1">
                    You'll save by going here:
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-green-600 font-bold">
                        {rec.timeSavings}
                      </span>
                      <span className="text-muted-foreground">
                        {" "}
                        less travel time
                      </span>
                    </div>
                    <div>
                      <span className="text-green-600 font-bold">
                        {rec.co2Savings}kg
                      </span>
                      <span className="text-muted-foreground">
                        {" "}
                        CO₂ reduction
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => onSelectDestination(rec.id)}
                  className="w-full"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Go to {rec.name}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
