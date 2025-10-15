import { useEffect, useState } from 'react';
import AccommodationList from './AccommodationList';
import JourneySidebar from '@/components/journey/JourneySidebar';
import KakaoMap from '@/components/KakaoMapAccomodation';
import type { Accommodation } from '@/api/accommodation';
import DayScheduleBar from './DayScheduleBar';
import AccommodationDetail from '@/pages/journey/step3/AccommodationDetail';
import type { Route } from '@/components/KakaoMap';
import { useLocation } from 'react-router-dom';
export interface DaySchedule {
  day: number;
  accommodationList: Accommodation[];
}

const CreateScheduleStepThree = () => {
  // 현재 활성화된 단계 상태 (기본값: 1 - 정보 입력 단계)
  const [currentStep, setCurrentStep] = useState(3);
  const [focusAccommodation, setFocusAccommodation] =
    useState<Accommodation | null>(null);
  const [focused, setFocused] = useState<Accommodation | null>(null);
  const [scheduleList, setScheduleList] = useState<DaySchedule[]>([]);
  const [usedAccommodationList, setUsedAccommodationList] = useState<
    Accommodation[]
  >([]);
  const [detailAccommodation, setDetailAccommodation] =
    useState<Accommodation | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [route, setRoute] = useState<Route | null>(null);
  const [accommodationList, setAccommodationList] = useState<Accommodation[]>(
    [],
  );

  const location = useLocation();

  const TestTravelPlan = {
    location: '경상도',
    startDate: '2025-10-15T15:00:00.000Z',
    endDate: '2025-10-24T15:00:00.000Z',
    startTime: '09:00',
    endTime: '18:00',
    companion: '부모님과',
    themes: ['쇼핑', '자연', '먹방'],
  };

  const travelPlan = location.state?.travelPlan || TestTravelPlan;

  // 위치기반 검색용 나중에 수정 필요
  const baseLat = 37.5665;
  const baseLng = 126.978;
  const baseRadius = 3000;

  useEffect(() => {
    if (travelPlan) {
      console.log('이전 단계에서 받은 데이터:', travelPlan);
      const startDate = new Date(travelPlan.startDate);
      const endDate = new Date(travelPlan.endDate);
      const timeDifference = endDate.getTime() - startDate.getTime();

      const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;
      const duration = timeDifference / ONE_DAY_IN_MS;

      const scheduleList = Array.from({ length: duration }, (_, i) => ({
        day: i + 1,
        accommodationList: [],
      }));
      setScheduleList(scheduleList);
    }
  }, [travelPlan]);

  useEffect(() => {}, []);

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <div className="h-[calc(100vh)] bg-white flex">
      {detailAccommodation && (
        <AccommodationDetail
          accommodation={detailAccommodation}
          setCurrentAccommodation={setDetailAccommodation}
        />
      )}
      <JourneySidebar
        currentStep={currentStep}
        onStepChange={handleStepChange}
      />
      <div className="h-full flex">
        <AccommodationList
          setFocusAccommodation={setFocusAccommodation}
          setDetailAccommodation={setDetailAccommodation}
          lat={baseLat}
          lng={baseLng}
          radius={baseRadius}
        />
        <div className="h-full flex flex-col justify-between items-baseline">
          <DayScheduleBar
            scheduleList={scheduleList}
            updateScheduleList={setScheduleList}
            setFocusAccommodation={setFocusAccommodation}
            setDetailAccommodation={setDetailAccommodation}
            setRoute={setRoute}
            setAccommodationList={setAccommodationList}
          />
          <div className="px-5 w-full flex justify-center">
            <button className="text-center text-lg font-bold border-2 border-blue-300 m-2 p-4 rounded-sm w-full">
              다음
            </button>
          </div>
        </div>
      </div>

      <div className="w-full h-full">
        <KakaoMap
          accommodationList={accommodationList} // 조회 결과 배열
          focusAccommodation={focused} // 리스트 아이템 클릭 시 설정
        />
      </div>
      <div>
        <div>위치 : {TestTravelPlan.location}</div>
        <div>시작일 : {TestTravelPlan.startDate}</div>
        <div>시작날짜 : {TestTravelPlan.startTime}</div>
        <div>종료일 : {TestTravelPlan.endDate}</div>
        <div>종료날짜 : {TestTravelPlan.endTime}</div>
        <div>누구와 : {TestTravelPlan.companion}</div>
        <div>테마 : {TestTravelPlan.themes}</div>
      </div>
    </div>
  );
};

export default CreateScheduleStepThree;
