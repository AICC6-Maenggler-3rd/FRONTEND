import axios from 'axios';
import type { Itinerary, ItineraryCreateRequest, ItineraryResponse } from '../types/itinerary';

const API_BASE = import.meta.env.VITE_API_HOST || 'http://localhost:8000'; // FastAPI 주소



export const generateItinerary = async (base_itinerary: ItineraryCreateRequest, model_name: string) : Promise<ItineraryResponse> => {
    const res = await axios.post<ItineraryResponse>(`${API_BASE}/itinerary/generate`, {
        base_itinerary,
        model_name
    });
    return res.data;
}

export const getModelNames = async () => {
    const res = await axios.get(`${API_BASE}/itinerary/models`);
    return res.data;
}