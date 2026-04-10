import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export interface UserLocation {
  latitude: number;
  longitude: number;
}

export const useUserLocation = () => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startLocationTracking = async () => {
      try {
        // Request location permission
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Location permission denied');
          setLoading(false);
          return;
        }

        // Watch user location in real-time with high accuracy
        const subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 1000, // Update every 1 second
            distanceInterval: 10, // Update if moved 10 meters
          },
          (location) => {
            setUserLocation({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            });
            setError(null);
          }
        );

        setLoading(false);

        // Cleanup subscription when component unmounts
        return () => {
          subscription.remove();
        };
      } catch (err) {
        console.error('Error tracking user location:', err);
        setError('Failed to track location');
        setLoading(false);
      }
    };

    startLocationTracking();
  }, []);

  return { userLocation, loading, error };
};
