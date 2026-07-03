import { apiClient } from './client';
import type { Plant } from '../types';

export interface FetchPlantsParams {
  category?: string;
  search?: string;
}

export async function fetchPlants(params: FetchPlantsParams = {}): Promise<Plant[]> {
  const { data } = await apiClient.get<Plant[]>('/plants', { params });
  return data;
}

export async function fetchPlantById(id: string): Promise<Plant> {
  const { data } = await apiClient.get<Plant>(`/plants/${id}`);
  return data;
}
