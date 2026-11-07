export type ItemType = 'LOST' | 'FOUND';
export type ItemStatus = 'OPEN' | 'RETURNED';

export interface Item {
  id: number;
  title: string;
  description: string;
  type: ItemType;
  category: string;
  location: string;
  item_date: string;
  image_url: string | null;
  image_key: string | null;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  status: ItemStatus;
  created_at: string;
}

export interface PaginatedItemsResponse {
  items: Item[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface StatsResponse {
  total_reports: number;
  lost_items: number;
  found_items: number;
  returned_items: number;
}

export interface ItemFilterParams {
  type?: ItemType | '';
  category?: string;
  location?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const CATEGORIES = [
  'Electronics',
  'Accessories',
  'Bags',
  'Books & Stationery',
  'Clothing',
  'Keys',
  'ID Cards',
  'Other',
] as const;

export const CAMPUS_LOCATIONS = [
  'Main Building',
  'Central Library',
  'Engineering Cafeteria',
  'Student Affairs Building',
  'Lecture Hall 101',
  'Lecture Hall 204',
  'Computer Science Labs',
  'Physics & Chemistry Lab',
  'Sports Complex & Gym',
  'Campus Parking Lot A',
  'Campus Parking Lot B',
  'Outdoor Courtyard',
] as const;
