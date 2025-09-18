import axios from "axios";

const API_BASE = "http://localhost:8000"; // FastAPI 주소

export const googleLoginUrl = async () => {
  const res = await axios.get(`${API_BASE}/auth/google/login`);
  return res.data; // 구글 OAuth redirect URL
};

export const getUserInfo = async () => {
  const res = await axios.get(`${API_BASE}/auth/user`, { withCredentials: true });
  console.log(res)
  return res.data;
};

export const logout = async () => {
  const res = await axios.post(`${API_BASE}/auth/logout`, {}, { withCredentials: true });
  return res.data;
};