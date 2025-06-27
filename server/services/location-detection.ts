export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface ARTriggerLocation {
  id: string;
  name: string;
  coordinates: LocationCoordinates;
  radius: number; // meters
  qrCode?: string;
}

// Sustainable tourism AR locations around Chiang Mai
export const arTriggerLocations: ARTriggerLocation[] = [
  {
    id: "doi_suthep",
    name: "Doi Suthep National Park",
    coordinates: { lat: 18.8047, lng: 98.9284 },
    radius: 100,
    qrCode: "AR_DOI_SUTHEP_ECO",
  },
  {
    id: "mae_rim",
    name: "Mae Rim Organic Farm",
    coordinates: { lat: 18.9167, lng: 98.8833 },
    radius: 150,
    qrCode: "AR_MAE_RIM_ORGANIC",
  },
  {
    id: "san_kamphaeng",
    name: "San Kamphaeng Handicrafts Village",
    coordinates: { lat: 18.745, lng: 99.1167 },
    radius: 200,
    qrCode: "AR_SAN_KAMPHAENG_CRAFT",
  },
];

/**
 * Calculate distance between two coordinates using Haversine formula
 */
export function calculateDistance(
  coord1: LocationCoordinates,
  coord2: LocationCoordinates,
): number {
  const R = 6371000; // Earth's radius in meters
  const φ1 = (coord1.lat * Math.PI) / 180;
  const φ2 = (coord2.lat * Math.PI) / 180;
  const Δφ = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const Δλ = ((coord2.lng - coord1.lng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

/**
 * Check if user is within AR trigger zone
 */
export function checkARTrigger(
  userLocation: LocationCoordinates,
): ARTriggerLocation | null {
  for (const location of arTriggerLocations) {
    const distance = calculateDistance(userLocation, location.coordinates);
    if (distance <= location.radius) {
      return location;
    }
  }
  return null;
}

/**
 * Verify QR code for AR experience
 */
export function verifyARQRCode(qrCode: string): ARTriggerLocation | null {
  return (
    arTriggerLocations.find((location) => location.qrCode === qrCode) || null
  );
}

/**
 * Get all available AR locations
 */
export function getARLocations(): ARTriggerLocation[] {
  return arTriggerLocations;
}

/**
 * Mock GPS check (in real app, use actual geolocation)
 */
export function mockGPSArrival(locationId: string): {
  arrived: boolean;
  location?: ARTriggerLocation;
  distance?: number;
} {
  const location = arTriggerLocations.find((loc) => loc.id === locationId);
  if (!location) {
    return { arrived: false };
  }

  // Simulate user being within range
  const mockDistance = Math.random() * 50; // 0-50 meters
  return {
    arrived: mockDistance <= location.radius,
    location,
    distance: mockDistance,
  };
}
