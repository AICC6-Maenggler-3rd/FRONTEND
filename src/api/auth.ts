import axios from "axios";

const API_BASE = import.meta.env.VITE_API_HOST ||"http://localhost:8000"; // FastAPI 주소

const loginRedirect = async (provider:string)=>{
  try {
    const res = await axios.get(`${API_BASE}/auth/${provider}/login`);
    window.location.href = res.data.auth_url;
  } catch (error) {
    console.log(`${provider} 로그인 요청 실패`)
  }
}

export const googleLoginUrl = async () => {
  await loginRedirect("google");
};

export const naverLoginUrl = async () => {
  await loginRedirect("naver");
};

export const kakaoLoginUrl = async () => {
  await loginRedirect("kakao");
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