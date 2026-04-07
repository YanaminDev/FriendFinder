import { useState } from 'react';
import { locationService } from '../services';
import type{ LocationResponse } from '../types/responses';
import type{ CreateLocationRequest, UpdateLocationRequest } from '../types/requests';

export const useLocation = () => {
  const [locations, setLocations] = useState<LocationResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await locationService.getAll();
      setLocations(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch locations';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      return await locationService.getById(id);
    } catch (err) {
      const message = err instanceof Error ? err.message : `Failed to fetch location ${id}`;
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const create = async (data: CreateLocationRequest) => {
    setLoading(true);
    setError(null);
    try {
      const newLocation = await locationService.create(data);
      setLocations([...locations, newLocation]);
      return newLocation;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create location';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, data: UpdateLocationRequest) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await locationService.update(id, data);
      setLocations(locations.map(loc => (loc.id === id ? updated : loc)));
      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update location';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteLocation = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await locationService.delete(id);
      setLocations(locations.filter(loc => loc.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete location';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    return locationService.calculateDistance(lat1, lon1, lat2, lon2);
  };

  const getLocationsByDistance = (userLat: number, userLon: number) => {
    return locationService.sortByDistance(locations, userLat, userLon);
  };

  return {
    // State
    locations,
    loading,
    error,

    // Methods
    getAll,
    getById,
    create,
    update,
    deleteLocation,
    calculateDistance,
    getLocationsByDistance,
  };
};
