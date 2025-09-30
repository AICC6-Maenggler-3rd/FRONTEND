import React from 'react'
import axios from "axios";
import { naverLoginUrl } from '../../api/auth';
const NaverLogin = () => {
  return (
    <button
      onClick={naverLoginUrl}
      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
    >
      네이버 로그인
    </button>
  );
};

export default NaverLogin
