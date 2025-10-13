import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Intro from './components/common/Intro';
import LoginPage from './pages/Login';
import MyPage from './pages/MyPage';
import './index.css';
import SchedulePage from './pages/Schedule';
import Test from './pages/test/Test';
import DeletePage from './pages/users/DeleteUserPage';
import { Header } from '@/layouts/header';
import { Footer } from '@/layouts/footer';
import InstaViewer from './components/common/InataViewer';
import PlaceList from './pages/placelist/PlaceList';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Header />
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/schedule/:id" element={<SchedulePage />} />
          <Route path="/users/delete" element={<DeletePage />} />
          <Route path="/test" element={<Test />} />
          <Route path="/placelist" element={<PlaceList />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
