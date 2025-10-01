import React from 'react';
import axios from 'axios';
const KakaoLogin = () => {
  const handleKakaoLogin = async () => {
    try {
      // 1. 백엔드에서 auth_url 받아오기
      const res = await axios.get('http://localhost:8000/auth/kakao/login', {
        withCredentials: true,
      });

      const authUrl = res.data.auth_url;
      if (authUrl) {
        // 2. 네이버 로그인 페이지로 이동
        window.location.href = authUrl;
      }
    } catch (error) {
      console.error('네이버 로그인 요청 실패:', error);
    }
  };

  return (
    <button
      onClick={handleKakaoLogin}
      className="w-full py-3 text-base font-medium bg-transparent border border-input rounded-md hover:bg-accent hover:text-accent-foreground flex items-center justify-center"
    >
      <div className="w-5 h-5 mr-3 bg-yellow-400 rounded flex items-center justify-center">
        <span className="text-xs font-bold text-black">K</span>
      </div>
      카카오로 계속하기
    </button>
  );
};

export default KakaoLogin;
