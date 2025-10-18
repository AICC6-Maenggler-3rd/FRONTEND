import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_HOST || 'http://localhost:8000'; // FastAPI 주소

export interface Accommodation {
  accommodation_id: number;
  name: string;
  address: string;
  address_la: number;
  address_lo: number;
  type: string;
  phone: string;
  website?: string | null;
  image_url?: string | null;
  created_at: string; // ISO 8601 문자열 (예: "2025-10-13T11:30:00Z")
  deleted_at?: string | null;
  updated_at: string;
}

export interface AccommodationListResponse {
  accommodation: Accommodation[];
  total_pages: number;
}

export const getAccommodationListWithinRadius = async (
  page: number,
  limit: number,
  lat: number,
  lng: number,
  radius: number,
  query: string,
): Promise<{
  data: Accommodation[];
  total_pages: number;
}> => {
  const res = await axios.get(
    `${API_BASE}/accommodation/list?page=${page}&limit=${limit}&lat=${lat}&lng=${lng}&radius=${radius}&query=${query}`,
  );
  return res.data;
};

export const getAccommodation = async (accommodation_id: number) => {
  const res = await axios.get(`${API_BASE}/accommodation/${accommodation_id}`);
  return res.data;
};
