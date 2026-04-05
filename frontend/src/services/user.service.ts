import axiosInstance from '../apis/main.api';
import { USER_GET_PROFILE, USER_UPDATE_PROFILE, USER_DELETE } from '../apis/endpoint.api';
import type { UpdateUserProfileRequest } from '../types/requests';
import type { UserResponse } from '../types/responses';

export const userService = {
  async getProfile(): Promise<UserResponse> {
    try {
      const response = await axiosInstance.get<UserResponse>(USER_GET_PROFILE);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch profile';
      throw new Error(message);
    }
  },

  async updateProfile(data: UpdateUserProfileRequest): Promise<UserResponse> {
    try {
      const response = await axiosInstance.put<UserResponse>(USER_UPDATE_PROFILE, data);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update profile';
      throw new Error(message);
    }
  },

  async delete(): Promise<void> {
    try {
      await axiosInstance.delete(USER_DELETE);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete account';
      throw new Error(message);
    }
  },
};
