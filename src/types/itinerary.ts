import type { Place } from "./place";
import type { Accommodation } from "./accommodation";

export interface Itinerary {
  user_id: number;
  relation: string;
  start_at: string|null;
  end_at: string|null;
  start_location: string;
  theme: string;
  items: ItineraryItem[];
}

export interface ItineraryItem {
  place_id: number;
  accommodation_id: number;
  start_time: string|null;
  end_time: string|null;
  is_required: boolean;
}

export interface ItineraryCreateRequest {
  start_location: string;
  theme: string;
  start_at: string;
  end_at: string;
  relation: string;
  user_id: number;
  items: ItineraryItem[];
}

export interface ItineraryResponse {
  start_location: string;
  theme: string | null;
  start_at: string;
  end_at: string;
  relation: string | null;
  user_id: number | null;
  items: ItineraryItemResponse[];
}

export interface ItineraryItemResponse {
  item_type: string;
  data: ItineraryItemDataResponse;
}

export interface ItineraryItemDataResponse extends ItineraryItem {
  info: Place | Accommodation;
}

export interface ItineraryCreateResponse {
  start_location: string;
  theme: string;
  start_at: string;
  end_at: string;
  relation: string;
  user_id: number;
  items: ItineraryItemResponse[];
}

export interface ItineraryGenerateResponse {
  base_itinerary: ItineraryCreateResponse;
  model_name: string;
}

