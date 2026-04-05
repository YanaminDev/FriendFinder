import { useState } from 'react';
import { userService } from '../services';
import type{ UserResponse } from '../types/responses';
import type { UpdateUserProfileRequest } from '../types/requests';

export const useUser = () => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const userData = await userService.getProfile();
      setUser(userData);
      return userData;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch profile';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: UpdateUserProfileRequest) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await userService.updateProfile(data);
      setUser(updated);
      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update profile';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      await userService.delete();
      setUser(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete profile';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    user,
    loading,
    error,

    // Methods
    getProfile,
    updateProfile,
    deleteProfile,
  };
};
