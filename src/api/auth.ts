import axios from 'axios';
import type { promises } from 'dns';

const API_BASE = import.meta.env.VITE_API_HOST || 'http://localhost:8000'; // FastAPI 주소

const loginRedirect = async (provider: string) => {
  try {
    const res = await axios.get(`${API_BASE}/auth/${provider}/login`, {
      withCredentials: true,
    });
    window.location.href = res.data.auth_url;
  } catch (error) {
    console.log(`${provider} 로그인 요청 실패`);
  }
};

export const googleLoginUrl = async () => {
  await loginRedirect('google');
};

export const naverLoginUrl = async () => {
  await loginRedirect('naver');
};

export const kakaoLoginUrl = async () => {
  await loginRedirect('kakao');
};

export const getUserInfo = async () => {
  const res = await axios.get(`${API_BASE}/auth/user`, {
    withCredentials: true,
  });
  console.log(res);
  return res.data;
};

export const deleteUser = async (reason: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE}/auth/user`, {
      data: { reason: reason },
      withCredentials: true,
    });
    return;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const detail = error.response.data.detail || '알 수 없는 서버 오류';
      throw new Error(`[${error.response.status}]${detail}`);
    }
    const errorMessage =
      (error as { message?: string })?.message || '네트워크 연결 오류';
    throw new Error(`네트워크 오류: ${errorMessage}`);
  }
};

export const logout = async () => {
  const res = await axios.post(
    `${API_BASE}/auth/logout`,
    {},
    { withCredentials: true },
  );
  return res.data;
};
