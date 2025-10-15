import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserInfo } from '@/api/auth';

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [userRole, setUserRole] = useState<string | null>(null); // user role 저장
  const navigate = useNavigate();

  // 로그인 상태 확인
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const userData = await getUserInfo();
        console.log('Header - API 응답:', userData);
        console.log('Header - userData.user:', userData?.user);
        console.log('Header - userData.user 존재 여부:', !!userData?.user);

        if (userData && userData.user) {
          console.log('Header - 로그인됨:', userData.user);
          setIsLoggedIn(true);
          setUserRole(userData.user.role); // user role 저장
        } else {
          console.log('Header - 로그인 안됨 - userData:', userData);
          setIsLoggedIn(false);
          setUserRole(null);  // user role 제거 
        }
      } catch (error) {
        console.log('Header - 로그인 상태 확인 실패:', error);
        // API 호출 실패 시 localStorage에서 사용자 정보 확인
        try {
          const savedUserInfo = localStorage.getItem('userInfo');
          if (savedUserInfo) {
            console.log('Header - localStorage에서 사용자 정보 발견');
            setIsLoggedIn(true);
          } else {
            console.log('Header - localStorage에도 사용자 정보 없음');
            setIsLoggedIn(false);
            setUserRole(null);
          }
        } catch (localError) {
          console.log('Header - localStorage 읽기 실패:', localError);
          setIsLoggedIn(false);
        }
      }
    };

    checkAuthStatus();

    // 로그인 상태 변경을 감지하기 위한 이벤트 리스너
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    // 로그아웃 이벤트 리스너
    const handleLogout = async () => {
      console.log('Header - 로그아웃 이벤트 감지');
      setIsLoggedIn(false);
      setUserRole(null);

      // 로그아웃 후 API 상태 재확인
      try {
        const userData = await getUserInfo();
        console.log('Header - 로그아웃 후 API 재확인:', userData);
        if (userData && userData.user) {
          console.log('Header - 여전히 로그인 상태, 강제 로그아웃');
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.log('Header - 로그아웃 후 API 확인 실패:', error);
        setIsLoggedIn(false);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // 커스텀 이벤트 리스너 (같은 탭에서 로그인 시)
    window.addEventListener('loginSuccess', handleStorageChange);

    // 로그아웃 이벤트 리스너
    window.addEventListener('logout', handleLogout);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('loginSuccess', handleStorageChange);
      window.removeEventListener('logout', handleLogout);
    };
  }, []);

  const handleAuthClick = async () => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      // 로그아웃 처리
      try {
        // 백엔드 로그아웃 API 호출
        const { logout } = await import('@/api/auth');
        await logout();
        console.log('백엔드 로그아웃 성공');
      } catch (error) {
        console.log('백엔드 로그아웃 실패:', error);
      }

      setIsLoggedIn(false);
      // localStorage에서 사용자 정보 제거
      setUserRole(null);
      // user role 제거
      localStorage.removeItem('userInfo');
      navigate('/');
    }
  };

  const handleMyPageClick = () => {
    navigate('/mypage');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleManageClick = () => {
    navigate('/manageIndex');
  };

  const headerContent = (
    <header className="fixed top-0 left-0 right-0 z-[100] h-16 bg-background/95 backdrop-blur-sm shadow-sm border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={handleLogoClick}
        >
          <div className="w-20 h-8 relative">
            <img
              src="/image/inpik.png"
              alt="Inpik 로고 아이콘"
              className="w-20 h-20 absolute"
              style={{
                top: '50%',
                left: '70%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          </div>
          <span className="text-2xl font-bold text-foreground">InPik</span>
        </div>

        <div className="flex ml-auto mr-13 space-x-10"> {/* 버튼 사이 간격 조절 */}  
          
          {isLoggedIn ? (
            <>
            {userRole !== 'user' && (
        <button
                onClick={handleManageClick}
                className="text-black hover:text-blue-800 transition-all duration-300"
              >
                ManagePage
              </button>
          )}
              <button
                onClick={handleMyPageClick}
                className="text-black hover:text-blue-800 transition-all duration-300"
              >
                MyPage
              </button>
              <button
                onClick={handleAuthClick}
                className="text-black hover:text-blue-800 transition-all duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={handleAuthClick}
              className="text-black hover:text-blue-800 transition-all duration-300"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );

  return headerContent;
}
