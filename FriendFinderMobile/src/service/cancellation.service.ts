import { CREATE_CANCELLATION } from '../api/endpoint';
import mainApi from '../api/main.api';

export interface CreateCancellationRequest {
  match_id: string;
  reviewer_id: string;
  reviewee_id: string;
  content?: string;
  quick_select_id?: string;
}

export const createCancellation = async (data: CreateCancellationRequest): Promise<void> => {
  try {
    await mainApi.post(CREATE_CANCELLATION, data);
  } catch (error) {
    console.error('Error creating cancellation:', error);
    throw error;
  }
};
