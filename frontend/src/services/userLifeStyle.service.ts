import axiosInstance from '../apis/main.api';
import { USER_LIFE_STYLE_GET } from '../apis/endpoint.api';

export interface UserLifeStyle {
  user_id: string;
  looking_for: { id: string; name: string } | null;
  drinking: { id: string; name: string } | null;
  pet: { id: string; name: string } | null;
  smoke: { id: string; name: string } | null;
  workout: { id: string; name: string } | null;
}

export const userLifeStyleService = {
  async getUserLifeStyle(userId: string): Promise<UserLifeStyle> {
    try {
      const response = await axiosInstance.get(USER_LIFE_STYLE_GET(userId));
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch user life style';
      throw new Error(message);
    }
  },
};
