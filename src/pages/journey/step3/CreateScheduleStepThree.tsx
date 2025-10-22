import { useEffect, useState, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import AccommodationList from './AccommodationList';
import KakaoMap from '@/components/KakaoMap';
import type { Accommodation } from '@/api/accommodation';
import DayScheduleBar from './DayScheduleBar';
import AccommodationDetail from '@/pages/journey/step3/AccommodationDetail';
import type { Route } from '@/components/KakaoMap';
import type { TravelPlan } from '../step1/CreateScheduleStepOne';
import type { DaySchedule } from '../step2/CreateScheduleStepTwo';

const CreateScheduleStepThree = () => {
  const [focusAccommodation, setFocusAccommodation] = useState<any | null>(
    null,
  );
  const [scheduleList, setScheduleList] = useState<DaySchedule[]>([]);
  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);
  const [detailAccommodation, setDetailAccommodation] =
    useState<Accommodation | null>(null);
  const [route, setRoute] = useState<Route | undefined>(undefined);
  const [accommodationList, setAccommodationList] = useState<Accommodation[]>(
    [],
  );
  const [placeList, setPlaceList] = useState<any[]>([]);

  const hasAccommodation = useMemo(() => {
    if (!scheduleList?.length) return false;
    return scheduleList.slice(0, -1).every((d) => !!d.accommodation);
  }, [scheduleList]);

  const handleApplyToAllDays = (accommodation: Accommodation) => {
    const newScheduleList = scheduleList.map((schedule, index) => {
      // 마지막 날에는 숙소를 추가하지 않음
      if (index === scheduleList.length - 1) {
        return schedule;
      }
      return {
        ...schedule,
        accommodation: accommodation as any,
      };
    });
    setScheduleList(newScheduleList);
  };

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
          onApplyToAllDays={handleApplyToAllDays}
        />
      )}
      <div className="h-full flex">
        <AccommodationList
          setFocusAccommodation={setFocusAccommodation}
          setDetailAccommodation={setDetailAccommodation}
          lat={travelPlan?.default_la}
          lng={travelPlan?.default_lo}
          radius={3000}
        />
        <div className="h-full flex flex-col justify-between items-baseline">
          <DayScheduleBar
            scheduleList={scheduleList}
            updateScheduleList={setScheduleList}
            setFocusAccommodation={setFocusAccommodation}
            setDetailAccommodation={setDetailAccommodation}
            setRoute={setRoute}
            setAccommodationList={setAccommodationList}
            setFocusPlace={setFocusAccommodation}
            setPlaceList={setPlaceList}
          />
        </div>
      </div>

      <div className="relative w-full h-full">
        <KakaoMap
          focusPlace={focusAccommodation || undefined}
          route={route || undefined}
          placeList={
            placeList.length > 0 ? placeList : accommodationList || undefined
          }
        />

        <div className="navigation-bar absolute top-5 right-2 z-50 flex h-[3rem] w-[15rem] items-center justify-center gap-2">
          <Link
            to="/journey/step2"
            state={{ travelPlan, scheduleList }}
            className="h-[3rem] shadow-md flex items-center justify-center text-lg font-bold bg-white border-2 border-blue-300 m-2 p-4 rounded-sm w-full"
          >
            이전
          </Link>
          <Link
            to="/journey/step4"
            state={{ travelPlan, scheduleList }}
            onClick={(e) => {
              if (!hasAccommodation) e.preventDefault();
            }}
            aria-disabled={!hasAccommodation}
            className={`h-[3rem] shadow-md flex items-center justify-center text-lg font-bold m-2 p-4 rounded-sm w-full
      ${
        hasAccommodation
          ? 'bg-white border-2 border-blue-300'
          : 'bg-gray-100 border-2 border-gray-200 text-gray-400 cursor-not-allowed pointer-events-auto'
      }`}
            title={hasAccommodation ? '' : '숙소를 먼저 선택하세요'}
          >
            다음
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreateScheduleStepThree;
