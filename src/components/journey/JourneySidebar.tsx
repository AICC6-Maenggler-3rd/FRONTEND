// React import는 JSX를 사용하기 위해 필요하지만 명시적으로 import하지 않아도 됨

/**
 * 여행 계획 단계를 나타내는 인터페이스
 */
interface Step {
  number: number; // 단계 번호 (1, 2, 3, 4)
  title: string; // 단계 제목 (예: "정보 입력", "여행지 선택")
  isActive: boolean; // 현재 활성화된 단계인지 여부
}

/**
 * JourneySidebar 컴포넌트의 Props 인터페이스
 */
interface JourneySidebarProps {
  currentStep: number; // 현재 활성화된 단계 번호
  onStepChange?: (step: number) => void; // 단계 변경 시 호출되는 콜백 함수 (선택적)
}

/**
 * 여행 계획 과정의 네비게이션 사이드바 컴포넌트
 * 4단계의 여행 계획 과정을 시각적으로 표시하고 단계 간 이동을 가능하게 함
 *
 * @param currentStep - 현재 활성화된 단계 번호
 * @param onStepChange - 단계 변경 시 호출되는 콜백 함수
 */
const JourneySidebar = ({ currentStep, onStepChange }: JourneySidebarProps) => {
  // 여행 계획의 4단계 정의
  const steps: Step[] = [
    { number: 1, title: '정보 입력', isActive: currentStep === 1 },
    { number: 2, title: '여행지 선택', isActive: currentStep === 2 },
    { number: 3, title: '숙소 선택', isActive: currentStep === 3 },
    { number: 4, title: '일정 수정', isActive: currentStep === 4 },
  ];

  /**
   * 단계 클릭 시 호출되는 핸들러 함수
   * 부모 컴포넌트에 단계 변경을 알림
   *
   * @param stepNumber - 클릭된 단계 번호
   */
  const handleStepClick = (stepNumber: number) => {
    if (onStepChange) {
      onStepChange(stepNumber);
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col min-h-screen">
      {/* 단계별 네비게이션 목록 */}
      <div className="space-y-8">
        {steps.map((step) => (
          <div
            key={step.number}
            className="flex items-center space-x-4 cursor-pointer"
            onClick={() => handleStepClick(step.number)}
          >
            {/* 단계 번호 원형 아이콘 */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-semibold ${
                step.isActive
                  ? 'bg-blue-600 text-white' // 활성화된 단계: 파란 배경, 흰 텍스트
                  : 'bg-gray-200 text-gray-600' // 비활성화된 단계: 회색 배경, 회색 텍스트
              }`}
            >
              {step.number}
            </div>
            {/* 단계 정보 텍스트 */}
            <div className="flex flex-col">
              <span
                className={`text-base font-medium ${
                  step.isActive ? 'text-blue-600' : 'text-blue-400'
                }`}
              >
                Step {step.number}
              </span>
              <span
                className={`text-lg font-semibold ${
                  step.isActive ? 'text-blue-600' : 'text-blue-400'
                }`}
              >
                {step.title}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JourneySidebar;
