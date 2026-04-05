import axiosInstance from '../apis/main.api';
import { MAP_GET_TOKEN } from '../apis/endpoint.api';
import type { MapTokenResponse } from '../types/responses';

export const mapService = {
  async getToken(): Promise<string> {
    try {
      const response = await axiosInstance.get<MapTokenResponse>(MAP_GET_TOKEN);
      return response.data.token;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to get map token';
      throw new Error(message);
    }
  },
};
