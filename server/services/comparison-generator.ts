import { RouteData, TravelComparison } from "@shared/tourism";
import { calculateCO2Savings } from "./co2-calculator";

export function compareTravelOptions(routes: RouteData[]): TravelComparison {
  if (routes.length === 0) {
    throw new Error("No routes provided for comparison");
  }

  // Find the car route as baseline for CO2 comparison
  const carRoute = routes.find((route) => route.mode.mode === "car");
  const baselineCO2 = carRoute
    ? carRoute.co2Emissions
    : Math.max(...routes.map((r) => r.co2Emissions));

  // Find the best option based on smart criteria
  const bestOption = findBestOption(routes);

  // Calculate CO2 savings vs car
  const bestCO2Savings = calculateCO2Savings(
    baselineCO2,
    bestOption.co2Emissions,
  );

  return {
    routes,
    bestOption,
    co2Savings: {
      vs_car: bestCO2Savings.grams,
      percentage: bestCO2Savings.percentage,
    },
  };
}

function findBestOption(routes: RouteData[]): RouteData {
  // Scoring algorithm:
  // - Prioritize low CO2 emissions
  // - Penalize routes that are >2x slower than fastest
  // - Give bonus points for zero-emission transport

  const fastestTime = Math.min(...routes.map((r) => r.duration));
  const maxAcceptableTime = fastestTime * 2; // Don't suggest routes >2x slower

  let bestRoute = routes[0];
  let bestScore = -Infinity;

  for (const route of routes) {
    let score = 0;

    // CO2 score (lower is better)
    const maxCO2 = Math.max(...routes.map((r) => r.co2Emissions));
    const co2Score =
      maxCO2 > 0 ? ((maxCO2 - route.co2Emissions) / maxCO2) * 100 : 100;
    score += co2Score;

    // Time penalty (if >2x slower than fastest, major penalty)
    if (route.duration > maxAcceptableTime) {
      score -= 50; // Major penalty for being too slow
    } else {
      // Minor penalty for being slower than fastest
      const timePenalty = ((route.duration - fastestTime) / fastestTime) * 20;
      score -= timePenalty;
    }

    // Zero emission bonus
    if (route.co2Emissions === 0) {
      score += 25;
    }

    // Shared transport bonus (encourage public/shared transport)
    if (route.mode.mode === "songthaew" || route.mode.mode === "bus") {
      score += 15;
    }

    if (score > bestScore) {
      bestScore = score;
      bestRoute = route;
    }
  }

  return bestRoute;
}

export function generateComparisonSummary(comparison: TravelComparison): {
  fastest: RouteData;
  greenest: RouteData;
  balanced: RouteData;
  stats: {
    averageCO2: number;
    timeRange: { min: number; max: number };
    totalOptions: number;
  };
} {
  const { routes } = comparison;

  // Find fastest route
  const fastest = routes.reduce((prev, current) =>
    current.duration < prev.duration ? current : prev,
  );

  // Find greenest route (lowest CO2)
  const greenest = routes.reduce((prev, current) =>
    current.co2Emissions < prev.co2Emissions ? current : prev,
  );

  // Balanced option (best from our algorithm)
  const balanced = comparison.bestOption;

  // Calculate stats
  const averageCO2 = Math.round(
    routes.reduce((sum, route) => sum + route.co2Emissions, 0) / routes.length,
  );

  const timeRange = {
    min: Math.min(...routes.map((r) => r.duration)),
    max: Math.max(...routes.map((r) => r.duration)),
  };

  return {
    fastest,
    greenest,
    balanced,
    stats: {
      averageCO2,
      timeRange,
      totalOptions: routes.length,
    },
  };
}
