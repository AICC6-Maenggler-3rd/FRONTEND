import React, { useState } from 'react'

const GoogleLogin = () => {
  const [userInfo, setUserInfo] = useState<any>(null);

  const handleGoogleLogin = async () => {
    // FastAPI에서 auth_url 받아오기
    const res = await fetch("http://localhost:8000/auth/google/login");
    const data = await res.json();

    // 구글 로그인 페이지로 이동
    window.location.href = data.auth_url;
  };
  return (
    <div className="App">
      <h1>Google OAuth Test</h1>
      {!userInfo ? (
        <button onClick={handleGoogleLogin}>Login with Google</button>
      ) : (
        <div>
          <p>Welcome, {userInfo.name}</p>
          <img src={userInfo.picture} alt="profile" />
        </div>
      )}
    </div>
  );
}

export default GoogleLogin
