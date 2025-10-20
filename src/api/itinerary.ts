import axios from 'axios';
import type {
  ItineraryCreateRequest,
  ItineraryResponse,
  ItineraryListResponse,
} from '../types/itinerary';

const API_BASE = import.meta.env.VITE_API_HOST || 'http://localhost:8000'; // FastAPI 주소

export const generateItinerary = async (
  base_itinerary: ItineraryCreateRequest,
  model_name: string,
): Promise<ItineraryResponse> => {
  const res = await axios.post<ItineraryResponse>(
    `${API_BASE}/itinerary/generate`,
    {
      base_itinerary,
      model_name,
    },
  );
  return res.data;
};

export const getMyItineraries = async (
  page: number = 1,
  limit: number = 10,
): Promise<ItineraryListResponse> => {
  const res = await axios.get<ItineraryListResponse>(
    `${API_BASE}/itinerary/my/list`,
    {
      params: { page, limit },
      withCredentials: true, // 쿠키 인증 정보 포함
    },
  );
  return res.data;
};

export const getItineraryDetail = async (id: number) => {
  try {
    const res = await axios.get(`${API_BASE}/itinerary/${id}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error('❌ 일정 데이터를 불러오지 못했습니다:', error);
    throw error;
  }
};

export const getUserItineraries = async (
  user_id: number,
  page: number = 1,
  limit: number = 10,
): Promise<ItineraryListResponse> => {
  const res = await axios.get<ItineraryListResponse>(
    `${API_BASE}/itinerary/user/${user_id}`,
    {
      params: { page, limit },
      withCredentials: true,
    },
  );
  return res.data;
};

export const getItinerary = async (
  itinerary_id: number,
): Promise<ItineraryResponse> => {
  const res = await axios.get<ItineraryResponse>(
    `${API_BASE}/itinerary/${itinerary_id}`,
    {
      withCredentials: true,
    },
  );
  return res.data;
};

export const createItinerary = async (
  itinerary: ItineraryCreateRequest,
): Promise<ItineraryCreateRequest> => {
  console.log('[DEBUG] CREATE ITINERARY REQUEST IN API: ', itinerary);
  const res = await axios.post<ItineraryCreateRequest>(
    `${API_BASE}/itinerary/createItinerary`,
    itinerary,
    {
      withCredentials: true,
    },
  );
  return res.data;
};

export const getModelNames = async () => {
  const res = await axios.get(`${API_BASE}/itinerary/models`);
  return res.data;
};
