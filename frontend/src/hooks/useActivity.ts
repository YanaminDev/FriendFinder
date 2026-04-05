import { useState, useEffect } from 'react';
import { activityService } from '../services';
import type { ActivityResponse } from '../types/responses';
import type { CreateActivityRequest, UpdateActivityRequest } from '../types/requests';

export const useActivity = () => {
  const [activities, setActivities] = useState<ActivityResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await activityService.getAll();
      setActivities(data);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch activities';
      setError(message);
      // Return default activities as fallback
      const defaultActivities: ActivityResponse[] = [
        { id: '1', name: 'Coffee' },
        { id: '2', name: 'Movie' },
        { id: '3', name: 'Hiking' },
      ];
      setActivities(defaultActivities);
      return defaultActivities;
    } finally {
      setLoading(false);
    }
  };

  const getById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      return await activityService.getById(id);
    } catch (err) {
      const message = err instanceof Error ? err.message : `Failed to fetch activity ${id}`;
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const create = async (data: CreateActivityRequest) => {
    setLoading(true);
    setError(null);
    try {
      const newActivity = await activityService.create(data);
      setActivities([...activities, newActivity]);
      return newActivity;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create activity';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, data: UpdateActivityRequest) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await activityService.update(id, data);
      setActivities(activities.map(act => (act.id === id ? updated : act)));
      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update activity';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteActivity = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await activityService.delete(id);
      setActivities(activities.filter(act => act.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete activity';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const findByName = (name: string) => {
    return activityService.findByName(activities, name);
  };

  const getSorted = () => {
    return activityService.sortAlphabetically(activities);
  };

  // Fetch all activities on hook mount
  useEffect(() => {
    getAll();
  }, []);

  return {
    // State
    activities,
    loading,
    error,

    // Methods
    getAll,
    getById,
    create,
    update,
    deleteActivity,
    findByName,
    getSorted,
  };
};
