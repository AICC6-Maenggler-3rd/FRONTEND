import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_HOST || 'http://localhost:8000';

export interface RegionItem {
  name: string;
  address_la: number;
  address_lo: number;
}

export const getAllRegion = async (): Promise<RegionItem[]> => {
  const res = await axios.get<RegionItem[]>(`${API_BASE}/region/list`);
  return res.data;
};
