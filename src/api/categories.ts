import { apiClient } from './client';
import type { CategoryItem, CategoryOption } from '../types';

export async function fetchCategories(): Promise<CategoryOption[]> {
  const { data } = await apiClient.get<CategoryItem[]>('/categories');
  return data.map((item) =>
    typeof item === 'string' ? { value: item, label: item } : item,
  );
}
