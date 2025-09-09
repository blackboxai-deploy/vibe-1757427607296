export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number;
  altitudeAccuracy?: number;
  heading?: number;
  speed?: number;
  timestamp: number;
}

export interface GeolocationPosition {
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number;
    altitude: number | null;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
  };
  timestamp: number;
}

export interface LocationPermissionState {
  granted: boolean;
  denied: boolean;
  prompt: boolean;
  loading: boolean;
  error?: string;
}

export interface LocationTrackingState {
  isTracking: boolean;
  currentLocation: LocationData | null;
  locationHistory: LocationData[];
  error?: string;
}