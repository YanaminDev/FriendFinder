import axiosInstance from '../apis/main.api';
import { USER_INFORMATION_GET } from '../apis/endpoint.api';

export interface UserInformation {
  user_id: string;
  user_height: number | null;
  user_bio: string | null;
  blood_group: string | null;
  language: { id: string; name: string } | null;
  education: { id: string; name: string } | null;
}

export const userInformationService = {
  async getUserInformation(userId: string): Promise<UserInformation> {
    try {
      const response = await axiosInstance.get(USER_INFORMATION_GET(userId));
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch user information';
      throw new Error(message);
    }
  },
};
