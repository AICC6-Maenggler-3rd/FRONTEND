import React from 'react'
import GoogleLogin from '../components/common/GoogleLogin'
import NaverLogin from '../components/common/NaverLogin'
import KakaoLogin from '../components/common/KakaoLogin'

const Login = () => {
  return (
    <div>
      <GoogleLogin/>
      <NaverLogin/>
      <KakaoLogin/>
    </div>
  )
}

export default Login
