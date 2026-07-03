export type CareLevel = 'easy' | 'medium' | 'hard';

export type PlantCategory =
  | 'phong-ngu'
  | 'ban-lam-viec'
  | 'phong-bep'
  | 'rau-cu-chua-benh'
  | string;

export interface Plant {
  _id: string;
  name: string;
  scientificName: string;
  description: string;
  careLevel: CareLevel;
  light: string;
  water: string;
  category: PlantCategory;
  images: string[];
  isMedicinal: boolean;
  tags: string[];
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'user' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  gardenName?: string;
  isLocked: boolean;
  createdAt: string;
}

export interface Article {
  _id: string;
  title: string;
  content: string;
  coverImage?: string;
  tags: string[];
  createdAt: string;
}

export interface UserPlantReminder {
  enabled: boolean;
  wateringIntervalDays: number;
  fertilizingIntervalDays: number;
  notifyTime: string;
}

export interface UserPlant {
  _id: string;
  userId: string;
  plantId: string | null;
  customName: string;
  photoUrl?: string;
  reminder: UserPlantReminder;
  addedAt: string;
}

export interface CreateUserPlantPayload {
  plantId?: string | null;
  customName: string;
  photoUrl?: string;
  reminder?: Partial<UserPlantReminder>;
}

export interface UpdateUserPlantPayload {
  customName?: string;
  photoUrl?: string;
}

export interface ApiError {
  error: {
    message: string;
    code: string;
  };
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: User;
}

export interface CategoryOption {
  value: string;
  label: string;
}

export type CategoryItem = string | CategoryOption;

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}
