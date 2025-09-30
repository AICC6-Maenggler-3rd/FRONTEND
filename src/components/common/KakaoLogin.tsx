import React from 'react'
import { kakaoLoginUrl } from '../../api/auth';
const KakaoLogin = () => {
  return (
    <button
      onClick={kakaoLoginUrl}
      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
    >
      카카오 로그인
    </button>
  );
};

export default KakaoLogin
