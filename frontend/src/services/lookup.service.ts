import axiosInstance from '../apis/main.api';
import {
  LOOKING_FOR_GET_ALL, LOOKING_FOR_CREATE, LOOKING_FOR_UPDATE, LOOKING_FOR_DELETE,
  DRINKING_GET_ALL, DRINKING_CREATE, DRINKING_UPDATE, DRINKING_DELETE,
  SMOKE_GET_ALL, SMOKE_CREATE, SMOKE_UPDATE, SMOKE_DELETE,
  WORKOUT_GET_ALL, WORKOUT_CREATE, WORKOUT_UPDATE, WORKOUT_DELETE,
  PET_GET_ALL, PET_CREATE, PET_UPDATE, PET_DELETE,
  EDUCATION_GET_ALL, EDUCATION_CREATE, EDUCATION_UPDATE, EDUCATION_DELETE,
  LANGUAGE_GET_ALL, LANGUAGE_CREATE, LANGUAGE_UPDATE, LANGUAGE_DELETE,
} from '../apis/endpoint.api';

export interface LookupItem {
  id: string;
  name: string;
  icon: string;
}

interface EndpointSet {
  getAll: string;
  create: string;
  update: string;
  delete: string;
}

const ENDPOINTS: Record<string, EndpointSet> = {
  looking_for: { getAll: LOOKING_FOR_GET_ALL, create: LOOKING_FOR_CREATE, update: LOOKING_FOR_UPDATE, delete: LOOKING_FOR_DELETE },
  drinking: { getAll: DRINKING_GET_ALL, create: DRINKING_CREATE, update: DRINKING_UPDATE, delete: DRINKING_DELETE },
  smoke: { getAll: SMOKE_GET_ALL, create: SMOKE_CREATE, update: SMOKE_UPDATE, delete: SMOKE_DELETE },
  workout: { getAll: WORKOUT_GET_ALL, create: WORKOUT_CREATE, update: WORKOUT_UPDATE, delete: WORKOUT_DELETE },
  pet: { getAll: PET_GET_ALL, create: PET_CREATE, update: PET_UPDATE, delete: PET_DELETE },
  education: { getAll: EDUCATION_GET_ALL, create: EDUCATION_CREATE, update: EDUCATION_UPDATE, delete: EDUCATION_DELETE },
  language: { getAll: LANGUAGE_GET_ALL, create: LANGUAGE_CREATE, update: LANGUAGE_UPDATE, delete: LANGUAGE_DELETE },
};

function getEndpoints(category: string): EndpointSet {
  const ep = ENDPOINTS[category];
  if (!ep) throw new Error(`Unknown category: ${category}`);
  return ep;
}

export const lookupService = {
  async getAll(category: string): Promise<LookupItem[]> {
    const ep = getEndpoints(category);
    const response = await axiosInstance.get(ep.getAll);
    return response.data;
  },

  async create(category: string, data: { name: string; icon: string }): Promise<void> {
    const ep = getEndpoints(category);
    await axiosInstance.post(ep.create, { [category]: data.name, icon: data.icon });
  },

  async update(category: string, data: { id: string; name: string; icon: string }): Promise<void> {
    const ep = getEndpoints(category);
    await axiosInstance.put(ep.update, data);
  },

  async remove(category: string, id: string): Promise<void> {
    const ep = getEndpoints(category);
    await axiosInstance.delete(ep.delete, { data: { id } });
  },
};
