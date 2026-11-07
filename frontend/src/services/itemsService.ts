import { apiClient } from './api';
import { Item, PaginatedItemsResponse, StatsResponse, ItemFilterParams } from '../types/item';

export const itemsService = {
  async getItems(params: ItemFilterParams = {}): Promise<PaginatedItemsResponse> {
    const cleanParams: Record<string, string | number> = {};

    if (params.type) cleanParams.type = params.type;
    if (params.category && params.category !== 'All') cleanParams.category = params.category;
    if (params.location && params.location !== 'All') cleanParams.location = params.location;
    if (params.search && params.search.trim()) cleanParams.search = params.search.trim();
    if (params.page) cleanParams.page = params.page;
    if (params.limit) cleanParams.limit = params.limit;

    const response = await apiClient.get<PaginatedItemsResponse>('/items', {
      params: cleanParams,
    });
    return response.data;
  },

  async getLatestItems(limit: number = 6): Promise<Item[]> {
    const response = await apiClient.get<Item[]>('/items/latest', {
      params: { limit },
    });
    return response.data;
  },

  async getItemById(id: number): Promise<Item> {
    const response = await apiClient.get<Item>(`/items/${id}`);
    return response.data;
  },

  async createItem(formData: FormData): Promise<Item> {
    const response = await apiClient.post<Item>('/items', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getStats(): Promise<StatsResponse> {
    const response = await apiClient.get<StatsResponse>('/items/stats');
    return response.data;
  },
};
