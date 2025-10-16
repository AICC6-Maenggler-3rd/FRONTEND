import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import JourneySidebar from '@/components/journey/JourneySidebar';

const JourneyMain = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const location = useLocation();

  // 현재 경로에 따라 step 결정
  const getCurrentStepFromPath = () => {
    if (location.pathname.includes('/step1')) return 1;
    if (location.pathname.includes('/step2')) return 2;
    if (location.pathname.includes('/step3')) return 3;
    return 1;
  };

  // 경로가 변경될 때마다 currentStep 업데이트
  React.useEffect(() => {
    setCurrentStep(getCurrentStepFromPath());
  }, [location.pathname]);

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* 왼쪽 사이드바 - 여행 계획 단계 네비게이션 */}
      <JourneySidebar
        currentStep={currentStep}
        onStepChange={handleStepChange}
      />

      {/* 메인 컨텐츠 영역 - 각 step 컴포넌트가 렌더링됨 */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default JourneyMain;
