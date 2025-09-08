// src/api/upload.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // FastAPI 주소
});

export interface UploadResponse {
  file_id: string;
  filename: string;
  status: string;
}

export const uploadPDF = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post<UploadResponse>("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
