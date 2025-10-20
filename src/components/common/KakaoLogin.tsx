import { kakaoLoginUrl } from '@/api/auth';
const KakaoLogin = () => {

  return (
    <button
      onClick={kakaoLoginUrl}
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
