import axiosInstance from '../apis/main.api';
import {
  LOCATION_GET_ALL,
  LOCATION_GET_BY_ID,
  LOCATION_CREATE,
  LOCATION_UPDATE,
  LOCATION_DELETE,
} from '../apis/endpoint.api';
import type {
  CreateLocationRequest,
  UpdateLocationRequest,
} from '../types/requests';
import type { LocationResponse } from '../types/responses';

export const locationService = {
  async getAll(): Promise<LocationResponse[]> {
    try {
      const response = await axiosInstance.get<LocationResponse[]>(LOCATION_GET_ALL);
      return response.data || [];
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch locations';
      throw new Error(message);
    }
  },

  async getById(id: string): Promise<LocationResponse> {
    try {
      const response = await axiosInstance.get<LocationResponse>(
        LOCATION_GET_BY_ID(id)
      );
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch location';
      throw new Error(message);
    }
  },

  async create(data: CreateLocationRequest): Promise<LocationResponse> {
    try {
      // Trim string fields
      const trimmedData = {
        ...data,
        name: data.name.trim(),
        description: data.description?.trim(),
        phone: data.phone?.trim(),
      };

      const response = await axiosInstance.post<LocationResponse>(
        LOCATION_CREATE,
        trimmedData
      );
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create location';
      throw new Error(message);
    }
  },

  async update(id: string, data: UpdateLocationRequest): Promise<LocationResponse> {
    try {
      // Trim string fields
      const trimmedData = {
        ...data,
        description: data.description?.trim(),
        phone: data.phone?.trim(),
      };

      const response = await axiosInstance.put<LocationResponse>(
        LOCATION_UPDATE(id),
        trimmedData
      );
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update location';
      throw new Error(message);
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await axiosInstance.delete(LOCATION_DELETE, {
        data: { id },
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete location';
      throw new Error(message);
    }
  },

  // Helper: Calculate distance between two points (in km)
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  // Helper: Sort locations by distance
  sortByDistance(
    locations: LocationResponse[],
    userLat: number,
    userLon: number
  ): LocationResponse[] {
    return [...locations].sort((a, b) => {
      const distA = this.calculateDistance(userLat, userLon, a.latitude, a.longitude);
      const distB = this.calculateDistance(userLat, userLon, b.latitude, b.longitude);
      return distA - distB;
    });
  },
};
