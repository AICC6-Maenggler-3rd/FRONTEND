import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Intro from './components/common/Intro';
import LoginPage from './pages/Login';
import MyPage from './pages/MyPage';
import './index.css';
import SchedulePage from './pages/Schedule';
import Test from './pages/test/Test';
import DeletePage from './pages/users/DeleteUserPage';
import CreateScheduleStepOne from './pages/journey/step1/CreateScheduleStepOne';
import DefaultLayout from './layouts/DefaultLayout';
import { Header } from './layouts/header';
import CreateScheduleStepTwo from './pages/journey/step2/CreateScheduleStepTwo';
import CreateScheduleStepThree from './pages/journey/step3/CreateScheduleStepThree';
import Index from './pages/manage/Index'
import MemberDetail from './pages/manage/memberdetail'

function App() {
  return (
    <Router>
      {/* Header를 Portal로 독립적으로 렌더링 */}
      <Header />

      <Routes>
        {/* 헤더와 푸터 필요 */}
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Intro />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/schedule/:id" element={<SchedulePage />} />
          <Route path="/users/delete" element={<DeletePage />} />
          <Route path="/userinfo" element={<MyPage />} />
          <Route path="/stepOne" element={<CreateScheduleStepOne />} />
          <Route path="/stepTwo" element={<CreateScheduleStepTwo />} />
          <Route path="/stepThree" element={<CreateScheduleStepThree />} />
          <Route path="/manageIndex" element={<Index />} />
          <Route path="/manage/memberdetail" element={<MemberDetail />} />
        
        </Route>

        {/* 헤더와 푸터 불필요 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </Router>
  );
}

export default App;
