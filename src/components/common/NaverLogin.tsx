import { naverLoginUrl } from '@/api/auth';
const NaverLogin = () => {
  return (
    <button
      onClick={naverLoginUrl}
      className="w-full py-3 text-base font-medium bg-transparent border border-input rounded-md hover:bg-accent hover:text-accent-foreground flex items-center justify-center"
    >
      <div className="w-5 h-5 mr-3 bg-green-600 rounded flex items-center justify-center">
        <span className="text-xs font-bold text-white">N</span>
      </div>
      네이버로 계속하기
    </button>
  );
};

export default NaverLogin;
