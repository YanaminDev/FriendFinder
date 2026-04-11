import axiosInstance from '../apis/main.api';
import {
  POSITION_GET_ALL,
  POSITION_GET_BY_ID,
  POSITION_CREATE,
  POSITION_UPDATE,
  POSITION_DELETE,
  POSITION_SEARCH_NEARBY,
  POSITION_UPLOAD_IMAGES,
} from '../apis/endpoint.api';
import type {
  CreatePositionRequest,
  UpdatePositionRequest,
  SearchNearbyRequest,
} from '../types/requests';
import type { PositionResponse } from '../types/responses';

export const positionService = {
  async getAll(): Promise<PositionResponse[]> {
    try {
      const response = await axiosInstance.get<PositionResponse[]>(POSITION_GET_ALL);
      return response.data || [];
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch positions';
      throw new Error(message);
    }
  },

  async getById(id: string): Promise<PositionResponse> {
    try {
      const response = await axiosInstance.get<PositionResponse>(POSITION_GET_BY_ID(id));
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to fetch position';
      throw new Error(message);
    }
  },

  async create(data: CreatePositionRequest): Promise<PositionResponse> {
    try {
      const trimmedData = {
        ...data,
        name: data.name.trim(),
        information: data.information?.trim(),
        phone: data.phone?.trim(),
      };
      const response = await axiosInstance.post<PositionResponse>(POSITION_CREATE, trimmedData);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create position';
      throw new Error(message);
    }
  },

  async update(id: string, data: UpdatePositionRequest): Promise<PositionResponse> {
    try {
      const response = await axiosInstance.put<PositionResponse>(POSITION_UPDATE(id), data);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update position';
      throw new Error(message);
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await axiosInstance.delete(POSITION_DELETE(id));
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete position';
      throw new Error(message);
    }
  },

  async searchNearby(data: SearchNearbyRequest): Promise<PositionResponse[]> {
    try {
      const response = await axiosInstance.post<PositionResponse[]>(POSITION_SEARCH_NEARBY, data);
      return response.data || [];
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to search positions';
      throw new Error(message);
    }
  },

  async uploadImages(positionId: string, files: File[]): Promise<PositionResponse> {
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));
      const response = await axiosInstance.post<PositionResponse>(
        POSITION_UPLOAD_IMAGES(positionId),
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to upload images';
      throw new Error(message);
    }
  },
};
