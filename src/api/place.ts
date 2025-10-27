import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_HOST || 'http://localhost:8000'; // FastAPI 주소

export interface Place {
  place_id: number;
  name: string;
  address: string;
  address_la: string;
  address_lo: string;
  type: string;
  count: number;
  website?: string | null;
  image_url?: string | null;
  insta_nickname?: string | null;
  open_hour?: string | null;
  close_hour?: string | null;
  description?: string | null;
  created_at: string; // ISO 8601 문자열 (예: "2025-10-13T11:30:00Z")
  deleted_at?: string | null;
  updated_at: string;

  // 관계 필드들 (필요 시 타입 확장)
  // registrars?: AppUser[];
  // categories?: Category[];
  // itinerary_items?: ItineraryItem[];
}

export interface PlaceListResponse {
  places: Place[];
  total_pages: number;
  total_count: number;
}

export const getPlaceListByAddress = async (address: string, page: number, limit: number): Promise<PlaceListResponse> => {
  const res = await axios.get<PlaceListResponse>(`${API_BASE}/place/list/address?address=${address}&page=${page}&limit=${limit}`);
  return res.data;
};

export const searchPlace = async (query: string, page: number, limit: number): Promise<PlaceListResponse> => {
  const res = await axios.get<PlaceListResponse>(`${API_BASE}/place/search?query=${query}&page=${page}&limit=${limit}`);
  return res.data;
};

export const getPlaceList = async (page: number, limit: number): Promise<PlaceListResponse> => {
  const res = await axios.get<PlaceListResponse>(`${API_BASE}/place/list?page=${page}&limit=${limit}`);
  return res.data;
};

export const getPlaceListWithinRadius = async (page: number, limit: number, lat: number, lng: number, radius: number): Promise<PlaceListResponse> => {
  const res = await axios.get<PlaceListResponse>(`${API_BASE}/place/list/radius?page=${page}&limit=${limit}&lat=${lat}&lng=${lng}&radius=${radius}`);
  return res.data;
};


export const getPlace = async (place_id: number) => {
  const res = await axios.get(`${API_BASE}/place/${place_id}`);
  return res.data;
};

export const getPlacesByCategory = async (categoryId: number, page: number = 1, limit: number = 10): Promise<PlaceListResponse> => {
  const res = await axios.get<PlaceListResponse>(`${API_BASE}/place/list/category?category_id=${categoryId}&page=${page}&limit=${limit}`);
  return res.data;
};

export const getRecommendedPlaces = async (
  theme: string,
  relation: string,
  location: string,
  numRecommendations: number = 10
): Promise<Place[]> => {
  const res = await axios.get<Place[]>(
    `${API_BASE}/recommendation/places`,
    {
      params: { 
        theme, 
        relation, 
        location, 
        num_recommendations: numRecommendations 
      }
    }
  );
  return res.data;
};


