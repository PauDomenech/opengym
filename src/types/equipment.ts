import { EquipmentType } from './exercise';

export type { EquipmentType };

export interface EquipmentItem {
  id: EquipmentType;
  nameEs: string;
  nameEn: string;
  category: 'free_weights' | 'machines' | 'bodyweight' | 'accessories';
  description: string;
  iconName: string;
  imageUrl?: string;
  isAvailableDefault: boolean;
}

export type GymInventory = Record<EquipmentType, boolean>;

export interface GymPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  equipment: EquipmentType[];
}
