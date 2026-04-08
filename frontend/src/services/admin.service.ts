import axiosInstance from '../apis/main.api';

// TODO: Add admin endpoints when backend is ready
const ADMIN_API = {
  GET_ALL_USERS: '/v1/api/admin/users',
  UPDATE_USER_ROLE: '/v1/api/admin/users/:id/role',
  DELETE_USER: '/v1/api/admin/users/:id',
};

export const adminService = {
  async getAllUsers() {
    try {
      const response = await axiosInstance.get(ADMIN_API.GET_ALL_USERS);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch users';
      throw new Error(message);
    }
  },

  async updateUserRole(userId: string, role: string) {
    try {
      const response = await axiosInstance.patch(
        ADMIN_API.UPDATE_USER_ROLE.replace(':id', userId),
        { role }
      );
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update user role';
      throw new Error(message);
    }
  },

  async deleteUser(userId: string) {
    try {
      const response = await axiosInstance.delete(
        ADMIN_API.DELETE_USER.replace(':id', userId)
      );
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete user';
      throw new Error(message);
    }
  },
};
