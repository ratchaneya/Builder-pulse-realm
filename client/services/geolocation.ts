export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface EcoDestination {
  id: string;
  name: string;
  nameEn: string;
  coordinates: LocationCoordinates;
  radius: number; // meters
  heroId?: string;
  greenMilesReward: number;
}

// Eco-destinations outside Nimman area with GPS coordinates
export const ecoCheckInDestinations: EcoDestination[] = [
  {
    id: "mae_hia_agricultural",
    name: "ศูนย์เกษตรกรรมแม่เหียะ",
    nameEn: "Mae Hia Agricultural Center",
    coordinates: { lat: 18.7261, lng: 98.9389 },
    radius: 100,
    heroId: "farmer_somjai",
    greenMilesReward: 15,
  },
  {
    id: "ban_pong_village",
    name: "หมู่บ้านบ้านโป่ง",
    nameEn: "Ban Pong Village",
    coordinates: { lat: 18.8147, lng: 99.0525 },
    radius: 120,
    heroId: "artisan_malee",
    greenMilesReward: 12,
  },
  {
    id: "mae_sa_valley",
    name: "หุบเขาแม่สา",
    nameEn: "Mae Sa Valley",
    coordinates: { lat: 18.9167, lng: 99.0833 },
    radius: 150,
    heroId: "ranger_niran",
    greenMilesReward: 18,
  },
  {
    id: "hang_dong_pottery",
    name: "หมู่บ้านเครื่องปั้นดินเผาหางดง",
    nameEn: "Hang Dong Pottery Village",
    coordinates: { lat: 18.6719, lng: 98.9342 },
    radius: 100,
    heroId: "potter_khun_chai",
    greenMilesReward: 14,
  },
  {
    id: "san_kamphaeng_springs",
    name: "บ่อน้ำพุร้อนสันกำแพง",
    nameEn: "San Kamphaeng Hot Springs",
    coordinates: { lat: 18.7606, lng: 99.1828 },
    radius: 80,
    heroId: "wellness_expert_pim",
    greenMilesReward: 16,
  },
  {
    id: "doi_saket_coffee",
    name: "ไร่กาแฟดอยสะเก็ด",
    nameEn: "Doi Saket Coffee Plantation",
    coordinates: { lat: 18.9167, lng: 99.2167 },
    radius: 200,
    heroId: "coffee_farmer_somsak",
    greenMilesReward: 20,
  },
];

export class GeolocationService {
  private watchId: number | null = null;
  private onLocationUpdateCallbacks: Array<
    (position: GeolocationPosition) => void
  > = [];
  private onDestinationReachedCallbacks: Array<
    (destination: EcoDestination) => void
  > = [];

  constructor() {
    this.startWatching();
  }

  // Calculate distance between two coordinates using Haversine formula
  calculateDistance(
    coord1: LocationCoordinates,
    coord2: LocationCoordinates,
  ): number {
    const R = 6371000; // Earth radius in meters (more precise)
    const lat1 = coord1.lat;
    const lon1 = coord1.lng;
    const lat2 = coord2.lat;
    const lon2 = coord2.lng;

    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }

  // Check if user is within range of any destination
  checkProximityToDestinations(
    userPosition: LocationCoordinates,
  ): EcoDestination | null {
    for (const destination of ecoCheckInDestinations) {
      const distance = this.calculateDistance(
        userPosition,
        destination.coordinates,
      );
      if (distance <= destination.radius) {
        return destination;
      }
    }
    return null;
  }

  // Get current position once
  async getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000, // 1 minute cache
        },
      );
    });
  }

  // Start watching user's location
  startWatching(): void {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported");
      return;
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.handleLocationUpdate(position);
      },
      (error) => {
        console.error("Geolocation error:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 30000, // 30 seconds cache
      },
    );
  }

  // Stop watching location
  stopWatching(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  // Handle location updates
  private handleLocationUpdate(position: GeolocationPosition): void {
    // Notify location update callbacks
    this.onLocationUpdateCallbacks.forEach((callback) => callback(position));

    // Check proximity to destinations
    const userCoords = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };

    const nearbyDestination = this.checkProximityToDestinations(userCoords);
    if (nearbyDestination) {
      // Notify destination reached callbacks
      this.onDestinationReachedCallbacks.forEach((callback) =>
        callback(nearbyDestination),
      );
    }
  }

  // Subscribe to location updates
  onLocationUpdate(
    callback: (position: GeolocationPosition) => void,
  ): () => void {
    this.onLocationUpdateCallbacks.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.onLocationUpdateCallbacks.indexOf(callback);
      if (index > -1) {
        this.onLocationUpdateCallbacks.splice(index, 1);
      }
    };
  }

  // Subscribe to destination reached events
  onDestinationReached(
    callback: (destination: EcoDestination) => void,
  ): () => void {
    this.onDestinationReachedCallbacks.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.onDestinationReachedCallbacks.indexOf(callback);
      if (index > -1) {
        this.onDestinationReachedCallbacks.splice(index, 1);
      }
    };
  }

  // Verify location for anti-spoofing (basic checks)
  async verifyLocation(destination: EcoDestination): Promise<boolean> {
    try {
      const position = await this.getCurrentPosition();
      const userCoords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      const distance = this.calculateDistance(
        userCoords,
        destination.coordinates,
      );
      const accuracy = position.coords.accuracy;

      // Basic anti-spoofing checks
      const isWithinRange = distance <= destination.radius;
      const hasReasonableAccuracy = accuracy <= 100; // Within 100m accuracy
      const isRecentTimestamp = Date.now() - position.timestamp < 60000; // Within 1 minute

      return isWithinRange && hasReasonableAccuracy && isRecentTimestamp;
    } catch (error) {
      console.error("Location verification failed:", error);
      return false;
    }
  }

  // Precise GPS check for check-in functionality
  async checkPreciseLocation(
    targetLat: number,
    targetLng: number,
    radiusMeters: number = 100,
  ): Promise<{
    success: boolean;
    distance: number;
    accuracy: number;
    message: string;
  }> {
    try {
      const position = await this.getCurrentPosition();
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;
      const accuracy = position.coords.accuracy;

      const distance = this.calculateDistance(
        { lat: userLat, lng: userLng },
        { lat: targetLat, lng: targetLng },
      );

      const isWithinRange = distance <= radiusMeters;
      const hasGoodAccuracy = accuracy <= 50; // Better accuracy requirement

      let message = "";
      if (!hasGoodAccuracy) {
        message = `GPS accuracy is too low (${Math.round(accuracy)}m). Please wait for better signal.`;
      } else if (!isWithinRange) {
        message = `You're still ${Math.round(distance)}m away from the check-in point.`;
      } else {
        message = `🎉 You've arrived! Ready to check in.`;
      }

      return {
        success: isWithinRange && hasGoodAccuracy,
        distance: Math.round(distance),
        accuracy: Math.round(accuracy),
        message,
      };
    } catch (error) {
      console.error("GPS check failed:", error);
      return {
        success: false,
        distance: -1,
        accuracy: -1,
        message: `❌ GPS error: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  }
}

// Singleton instance
export const geolocationService = new GeolocationService();
