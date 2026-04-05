import axiosInstance from '../apis/main.api';
import {
  ACTIVITY_GET_ALL,
  ACTIVITY_GET_BY_ID,
  ACTIVITY_CREATE,
  ACTIVITY_UPDATE,
  ACTIVITY_DELETE,
} from '../apis/endpoint.api';
import type {
  CreateActivityRequest,
  UpdateActivityRequest,
} from '../types/requests';
import type { ActivityResponse } from '../types/responses';

export const activityService = {
  async getAll(): Promise<ActivityResponse[]> {
    try {
      const response = await axiosInstance.get<ActivityResponse[]>(ACTIVITY_GET_ALL);
      return response.data || [];
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch activities';
      throw new Error(message);
    }
  },

  async getById(id: string): Promise<ActivityResponse> {
    try {
      const response = await axiosInstance.get<ActivityResponse>(
        ACTIVITY_GET_BY_ID(id)
      );
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch activity';
      throw new Error(message);
    }
  },

  async create(data: CreateActivityRequest): Promise<ActivityResponse> {
    try {
      const response = await axiosInstance.post<ActivityResponse>(ACTIVITY_CREATE, {
        name: data.name.trim(),
      });
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create activity';
      throw new Error(message);
    }
  },

  async update(id: string, data: UpdateActivityRequest): Promise<ActivityResponse> {
    try {
      const response = await axiosInstance.put<ActivityResponse>(
        ACTIVITY_UPDATE(id),
        { name: data.name.trim() }
      );
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update activity';
      throw new Error(message);
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await axiosInstance.delete(ACTIVITY_DELETE, {
        data: { id },
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete activity';
      throw new Error(message);
    }
  },

  // Helper: Find activity by name
  findByName(activities: ActivityResponse[], name: string): ActivityResponse | undefined {
    return activities.find((a) => a.name.toLowerCase() === name.toLowerCase());
  },

  // Helper: Sort activities alphabetically
  sortAlphabetically(activities: ActivityResponse[]): ActivityResponse[] {
    return [...activities].sort((a, b) => a.name.localeCompare(b.name));
  },
};
