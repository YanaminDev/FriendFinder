import axiosInstance from '../apis/main.api';
import { MATCH_ADMIN_ALL_REVIEWS } from '../apis/endpoint.api';
import type { MatchWithReviews } from '../types/responses';

export const feedbackService = {
  async getAllMatchReviews(): Promise<MatchWithReviews[]> {
    try {
      const response = await axiosInstance.get<MatchWithReviews[]>(MATCH_ADMIN_ALL_REVIEWS);
      return response.data || [];
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch reviews';
      throw new Error(message);
    }
  },
};
