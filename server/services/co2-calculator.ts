import { TravelMode } from "@shared/tourism";

// Emission factors in grams CO2 per kilometer
export const EMISSION_FACTORS: Record<TravelMode["mode"], number> = {
  car: 180, // Private car (average)
  songthaew: 60, // Shared ride (divided by avg passengers)
  bus: 60, // Public bus (divided by avg passengers)
  bike: 0, // Bicycle (human powered)
  walk: 0, // Walking (human powered)
};

export function calculateCO2Emissions(
  distanceKm: number,
  transportMode: TravelMode["mode"],
): number {
  const emissionFactor = EMISSION_FACTORS[transportMode];
  return Math.round(distanceKm * emissionFactor);
}

export function calculateCO2Savings(
  baselineEmissions: number,
  alternativeEmissions: number,
): { grams: number; percentage: number } {
  const grams = Math.max(0, baselineEmissions - alternativeEmissions);
  const percentage =
    baselineEmissions > 0 ? Math.round((grams / baselineEmissions) * 100) : 0;

  return { grams, percentage };
}

export function getEmissionLevel(co2Grams: number): {
  level: "low" | "medium" | "high";
  color: string;
  description: string;
} {
  if (co2Grams === 0) {
    return {
      level: "low",
      color: "green",
      description: "Zero emissions - excellent choice!",
    };
  } else if (co2Grams < 500) {
    return {
      level: "low",
      color: "green",
      description: "Low carbon footprint",
    };
  } else if (co2Grams < 1500) {
    return {
      level: "medium",
      color: "yellow",
      description: "Moderate carbon footprint",
    };
  } else {
    return {
      level: "high",
      color: "red",
      description: "High carbon footprint",
    };
  }
}

export function formatCO2Amount(grams: number): string {
  if (grams === 0) return "0g";
  if (grams < 1000) return `${grams}g`;
  return `${(grams / 1000).toFixed(1)}kg`;
}
