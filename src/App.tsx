import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import Intro from './components/common/Intro';
import LoginPage from './pages/Login';
import MyPage from './pages/MyPage';
import './index.css';
import SchedulePage from './pages/Schedule';
import Test from './pages/test/Test';
import DeletePage from './pages/users/DeleteUserPage';
import CreateScheduleStepOne from './pages/journey/step1/CreateScheduleStepOne';
import CreateScheduleStepTwo from './pages/journey/step2/CreateScheduleStepTwo';
import CreateScheduleStepThree from './pages/journey/step3/CreateScheduleStepThree';
import DefaultLayout from './layouts/DefaultLayout';
import { Header } from './layouts/header';
import { Footer } from './layouts/footer';
import Index from './pages/manage/Main';
import JourneyMain from './pages/journey/main';
import MemberDetail from './pages/manage/memberdetail';
import CategoryDetail from './pages/manage/Categorydetail';
import AccommodationDetail from './pages/manage/AccommodationDetail';
import Snsaccount from './pages/manage/Snsaccount';

function AppContent() {
  const location = useLocation();
  const hideHeaderAndFooter = ['/login', '/test'].includes(location.pathname);
  const hideFooterOnJourneySteps = [
    '/journey/step1',
    '/journey/step2',
    '/journey/step3',
  ].includes(location.pathname);

  return (
    <>
      {/* Header */}
      {!hideHeaderAndFooter && <Header />}

      <Routes>
        {/* 헤더와 푸터 필요 */}
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Intro />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/schedule/:id" element={<SchedulePage />} />
          <Route path="/users/delete" element={<DeletePage />} />
          <Route path="/userinfo" element={<MyPage />} />
          <Route path="/journey" element={<JourneyMain />}>
            <Route path="step1" element={<CreateScheduleStepOne />} />
            <Route path="step2" element={<CreateScheduleStepTwo />} />
            <Route path="step3" element={<CreateScheduleStepThree />} />
          </Route>
          <Route path="/manageIndex" element={<Index />} />
          <Route path="/manage/memberdetail" element={<MemberDetail />} />
          <Route path="/manage/categorydetail" element={<CategoryDetail />} />
          <Route path="/manage/accommodationdetail" element={<AccommodationDetail />} />
          <Route path="/manage/snsaccount" element={<Snsaccount />} />
          
         
        </Route>

        {/* 헤더와 푸터 불필요 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/test" element={<Test />} />
      </Routes>

      {/* Footer */}
      {!hideHeaderAndFooter && !hideFooterOnJourneySteps && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
