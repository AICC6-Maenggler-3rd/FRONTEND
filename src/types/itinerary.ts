import type { Place } from './place';
import type { Accommodation } from './accommodation';

export interface Itinerary {
  user_id: number;
  relation: string;
  start_at: string | null;
  end_at: string | null;
  location: string;
  theme: string;
  items: ItineraryItem[];
  name: string | null;
}

export interface ItineraryItem {
  place_id: number | null;
  accommodation_id: number | null;
  start_time: string | null;
  end_time: string | null;
  is_required: boolean;
}

export interface ItineraryCreateRequest {
  user_id: number;
  relation: string;
  start_at: string;
  end_at: string;
  location: string;
  theme: string;
  items: ItineraryItem[];
  name: string;
}

export interface ItineraryResponse {
  user_id: number | null;
  relation: string | null;
  start_at: string;
  end_at: string;
  location: string;
  theme: string | null;
  items: ItineraryItemResponse[];
  name: string | null;
}

export interface ItineraryItemResponse {
  item_type: string;
  data: ItineraryItemDataResponse;
}

export interface ItineraryItemDataResponse extends ItineraryItem {
  info: Place | Accommodation;
}

export interface ItineraryCreateResponse {
  location: string;
  theme: string;
  start_at: string;
  end_at: string;
  relation: string;
  user_id: number;
  items: ItineraryItemResponse[];
  name: string;
}

export interface ItineraryGenerateResponse {
  base_itinerary: ItineraryCreateResponse;
  model_name: string;
}

export interface ItineraryListResponse {
  itineraries: ItinerarySchema[];
  total_count: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface ItinerarySchema {
  itinerary_id: number;
  user_id: number | null;
  relation: string | null;
  name?: string | null;
  start_at: string;
  end_at: string;
  location: string | null;
  theme: string | null;
  created_at: string;
  deleted_at: string | null;
  updated_at: string;
}
