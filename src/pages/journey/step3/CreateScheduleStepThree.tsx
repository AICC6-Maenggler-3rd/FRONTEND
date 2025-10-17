import { useEffect, useState } from 'react';
import AccommodationList from './AccommodationList';
import KakaoMap from '@/components/KakaoMapAccomodation';
import type { Accommodation } from '@/api/accommodation';
import DayScheduleBar from './DayScheduleBar';
import AccommodationDetail from '@/pages/journey/step3/AccommodationDetail';
import type { Route } from '@/components/KakaoMap';
import { useLocation } from 'react-router-dom';
import type { TravelPlan } from '../step1/CreateScheduleStepOne';
import type { DaySchedule } from '../step2/CreateScheduleStepTwo';

const CreateScheduleStepThree = () => {
  const [focusAccommodation, setFocusAccommodation] =
    useState<Accommodation | null>(null);
  const [scheduleList, setScheduleList] = useState<DaySchedule[]>([]);
  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);
  const [detailAccommodation, setDetailAccommodation] =
    useState<Accommodation | null>(null);
  const [route, setRoute] = useState<Route | null>(null);
  const [accommodationList, setAccommodationList] = useState<Accommodation[]>(
    [],
  );

  const TestTravelPlan = {
    location: '테스트 데이터',
    startDate: '2025-10-15T15:00:00.000Z',
    endDate: '2025-10-24T15:00:00.000Z',
    startTime: '09:00',
    endTime: '18:00',
    companion: '부모님과',
    themes: ['쇼핑', '자연', '먹방'],
  };

  // {index: 0, date: Tue Oct 14 2025 00:00:00 GMT+0900 (한국 표준시), placeList: Array(3), accommodation: null}
  // {index: 1, date: Wed Oct 15 2025 00:00:00 GMT+0900 (한국 표준시), placeList: Array(0), accommodation: null}
  // {index: 2, date: Thu Oct 16 2025 00:00:00 GMT+0900 (한국 표준시), placeList: Array(0), accommodation: null}
  // {index: 3, date: Fri Oct 17 2025 00:00:00 GMT+0900 (한국 표준시), placeList: Array(0), accommodation: null}
  // {index: 4, date: Sat Oct 18 2025 00:00:00 GMT+0900 (한국 표준시), placeList: Array(0), accommodation: null}

  // 위치기반 검색용 나중에 수정 필요 - 부산광역시청
  const baseLat = 35.198362;
  const baseLng = 129.053922;
  const baseRadius = 3000;

  const location = useLocation();
  useEffect(() => {
    const state = location.state;

    // location.state에 값이 있다면 상태로 세팅
    if (state?.travelPlan) {
      setTravelPlan(state.travelPlan);
    }
    if (state?.scheduleList) {
      setScheduleList(state.scheduleList);
    }

    // console.log('이전 단계에서 받은 데이터:', {
    //   travelPlan: state?.travelPlan,
    //   scheduleList: state?.scheduleList,
    // });
  }, [location.state]);

  useEffect(() => {
    if (travelPlan && scheduleList) {
      console.log('travelPlan', travelPlan);
      console.log('scheduleList', scheduleList);
    }
  }, [travelPlan, scheduleList]);

  return (
    <div className="h-[calc(100vh)] bg-white flex">
      {detailAccommodation && (
        <AccommodationDetail
          accommodation={detailAccommodation}
          setCurrentAccommodation={setDetailAccommodation}
        />
      )}
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
          focusAccommodation={focusAccommodation || undefined}
          route={route || undefined}
          accommodationList={accommodationList || undefined}
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
