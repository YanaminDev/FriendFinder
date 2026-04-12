import axiosInstance from '../apis/main.api';
import {
  ADMIN_GET_ALL_USERS,
  ADMIN_UPDATE_USER_ROLE,
  ADMIN_BAN_USER,
  ADMIN_UNBAN_USER,
} from '../apis/endpoint.api';

export const adminService = {
  async getAllUsers() {
    try {
      const response = await axiosInstance.get(ADMIN_GET_ALL_USERS);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch users';
      throw new Error(message);
    }
  },

  async updateUserRole(userId: string, role: string) {
    try {
      const response = await axiosInstance.patch(
        ADMIN_UPDATE_USER_ROLE(userId),
        { role }
      );
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update user role';
      throw new Error(message);
    }
  },

  async banUser(userId: string) {
    try {
      const response = await axiosInstance.patch(ADMIN_BAN_USER(userId));
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to ban user';
      throw new Error(message);
    }
  },

  async unbanUser(userId: string) {
    try {
      const response = await axiosInstance.patch(ADMIN_UNBAN_USER(userId));
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to unban user';
      throw new Error(message);
    }
  },
};
