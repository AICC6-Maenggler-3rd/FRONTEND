import React, { useState } from 'react'
import { googleLoginUrl } from '../../api/auth';

const GoogleLogin = () => {
  const [userInfo, setUserInfo] = useState<any>(null);

  return (
    <button
      onClick={googleLoginUrl}
      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
    >
      구글 로그인
    </button>
  );
}

export default GoogleLogin
