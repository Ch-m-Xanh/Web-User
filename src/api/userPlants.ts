import { apiClient } from './client';
import type {
  CreateUserPlantPayload,
  UpdateUserPlantPayload,
  UserPlant,
  UserPlantReminder,
} from '../types';

export async function fetchUserPlants(): Promise<UserPlant[]> {
  const { data } = await apiClient.get<UserPlant[]>('/user-plants');
  return data;
}

export async function createUserPlant(
  payload: CreateUserPlantPayload,
): Promise<UserPlant> {
  const { data } = await apiClient.post<UserPlant>('/user-plants', payload);
  return data;
}

export async function updateUserPlant(
  id: string,
  payload: UpdateUserPlantPayload,
): Promise<UserPlant> {
  const { data } = await apiClient.put<UserPlant>(`/user-plants/${id}`, payload);
  return data;
}

export async function updateUserPlantReminder(
  id: string,
  reminder: UserPlantReminder,
): Promise<UserPlant> {
  const { data } = await apiClient.put<UserPlant>(
    `/user-plants/${id}/reminder`,
    reminder,
  );
  return data;
}

export async function deleteUserPlant(id: string): Promise<void> {
  await apiClient.delete(`/user-plants/${id}`);
}
