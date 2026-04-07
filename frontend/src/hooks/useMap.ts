import { useState } from 'react';
import { mapService } from '../services';

export const useMap = () => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getToken = async () => {
    setLoading(true);
    setError(null);
    try {
      const mapToken = await mapService.getToken();
      setToken(mapToken);
      return mapToken;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch map token';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    token,
    loading,
    error,

    // Methods
    getToken,
  };
};
