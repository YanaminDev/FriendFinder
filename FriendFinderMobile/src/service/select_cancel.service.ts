import { GET_SELECT_CANCEL } from '../api/endpoint';
import mainApi from '../api/main.api';

export interface SelectCancel {
  id: string;
  name: string;
}

export const getSelectCancelOptions = async (): Promise<SelectCancel[]> => {
  try {
    return await mainApi.get<SelectCancel[]>(GET_SELECT_CANCEL);
  } catch (error) {
    console.error('Error fetching select cancel options:', error);
    throw error;
  }
};
