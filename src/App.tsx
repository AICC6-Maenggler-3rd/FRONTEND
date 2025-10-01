import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './page';
import LoginPage from './pages/Login';
import MyPage from './pages/MyPage';
import './index.css';
import SchedulePage from './pages/Schedule';
import DeletePage from './pages/users/DeleteUserPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/schedule/:id" element={<SchedulePage />} />
        <Route path="/users/delete" element={<DeletePage />} />
      </Routes>
    </Router>
  );
}

export default App;
