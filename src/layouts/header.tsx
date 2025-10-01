import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const navigate = useNavigate();

  const handleAuthClick = () => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      setIsLoggedIn(false);
    }
  };

  const handleMyPageClick = () => {
    navigate('/mypage');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">I</span>
          </div>
          <span className="text-2xl font-bold text-foreground">InPik</span>
        </div>

        <div className="flex ml-auto mr-6 space-x-4">
          {isLoggedIn && (
            <button
              onClick={handleMyPageClick}
              className="text-black hover:text-blue-800 transition-all duration-300"
            >
              MyPage
            </button>
          )}
        </div>

        <button
          onClick={handleAuthClick}
          className="text-black hover:text-blue-800 transition-all duration-300"
        >
          {isLoggedIn ? 'Logout' : 'Login'}
        </button>
      </div>
    </header>
  );
}
