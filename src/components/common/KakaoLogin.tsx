import React from 'react'
import axios from "axios";
const KakaoLogin = () => {
  const handleKakaoLogin = async () => {
    try {
      // 1. 백엔드에서 auth_url 받아오기
      const res = await axios.get("http://localhost:8000/auth/kakao/login", {
        withCredentials: true,
      });

      const authUrl = res.data.auth_url;
      if (authUrl) {
        // 2. 네이버 로그인 페이지로 이동
        window.location.href = authUrl;
      }
    } catch (error) {
      console.error("네이버 로그인 요청 실패:", error);
    }
  };

  return (
    <button
      onClick={handleKakaoLogin}
      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
    >
      카카오 로그인
    </button>
  );
};

export default KakaoLogin
