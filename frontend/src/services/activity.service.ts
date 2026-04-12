import axiosInstance from '../apis/main.api';
import {
  ACTIVITY_GET_ALL,
  ACTIVITY_GET_BY_ID,
  ACTIVITY_CREATE,
  ACTIVITY_UPDATE,
  ACTIVITY_DELETE,
} from '../apis/endpoint.api';

export interface ActivityItem {
  id: string;
  name: string;
  icon: string;
}

export const activityService = {
  async getAll(): Promise<ActivityItem[]> {
    const response = await axiosInstance.get<ActivityItem[]>(ACTIVITY_GET_ALL);
    return response.data || [];
  },

  async getById(id: string): Promise<ActivityItem> {
    const response = await axiosInstance.get<ActivityItem>(ACTIVITY_GET_BY_ID(id));
    return response.data;
  },

  async create(data: { name: string; icon: string }): Promise<void> {
    await axiosInstance.post(ACTIVITY_CREATE, { activity: data.name, icon: data.icon });
  },

  async update(data: { id: string; name: string; icon: string }): Promise<void> {
    await axiosInstance.put(ACTIVITY_UPDATE, data);
  },

  async delete(id: string): Promise<void> {
    await axiosInstance.delete(ACTIVITY_DELETE, { data: { id } });
  },
};
