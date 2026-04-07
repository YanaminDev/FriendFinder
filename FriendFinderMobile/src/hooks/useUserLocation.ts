import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export const useUserLocation = () => {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const requestLocation = async () => {
      try {
        // Request permission
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permission to access location was denied');
          setLoading(false);
          return;
        }

        // Get current location
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          accuracy: currentLocation.coords.accuracy,
        });
      } catch (err) {
        console.error('Failed to get location:', err);
        setError('Failed to get location');
      } finally {
        setLoading(false);
      }
    };

    requestLocation();
  }, []);

  return { location, error, loading };
};
