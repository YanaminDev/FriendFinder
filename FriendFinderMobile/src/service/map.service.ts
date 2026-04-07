import mainApi from '../api/main.api';
import { GET_MAPBOX_TOKEN } from '../api/endpoint';

interface MapboxTokenResponse {
  token: string;
}

export const configService = {
  async getMapboxToken(): Promise<string> {
    try {
      const response = await mainApi.get<MapboxTokenResponse>(GET_MAPBOX_TOKEN);
      return response.token;
    } catch (error) {
      console.error('Failed to fetch Mapbox token:', error);
      throw error;
    }
  },
};
